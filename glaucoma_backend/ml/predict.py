import os
# ---- Runtime safety ----
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import sys
import numpy as np
import cv2
from PIL import Image

import keras
from keras.models import load_model
import tensorflow as tf

# ---------------- CONFIG ----------------
CLASS_NAMES = ["advanced", "early", "normal"]
TARGET_SIZE = (320, 320)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "glaucoma_best_model_ft2.keras")

# Save Grad-CAM where frontend can see it
UPLOADS_DIR = os.path.join(
    BASE_DIR, "..", "..", "frontend", "public", "uploads"
)
os.makedirs(UPLOADS_DIR, exist_ok=True)

# ---------------- LOAD MODEL ----------------
model = load_model(MODEL_PATH, compile=False)

# 🔥 FORCE SINGLE OUTPUT TENSOR (KERAS 3 SAFE)
pred_layer = model.layers[-1].output  # Dense layer output

# ---------------- IMAGE PREP ----------------
def prepare_image(path):
    img = Image.open(path).convert("RGB").resize(TARGET_SIZE)
    arr = np.asarray(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0), np.asarray(img)

# ---------------- GRAD-CAM (ULTRA SAFE) ----------------
def generate_gradcam(img_tensor, raw_img, pred_index):
    # find last Conv2D layer
    last_conv = None
    for layer in reversed(model.layers):
        if isinstance(layer, keras.layers.Conv2D):
            last_conv = layer
            break

    if last_conv is None:
        raise RuntimeError("No Conv2D layer found")

    # ✅ Keras 3 SAFE model
    grad_model = tf.keras.models.Model(
        inputs=model.input,
        outputs=[last_conv.output, pred_layer],
    )

    with tf.GradientTape() as tape:
        conv_out, preds = grad_model(img_tensor)
        loss = preds[:, pred_index]

    grads = tape.gradient(loss, conv_out)

    # 🔥 Convert to float32 (CRITICAL)
    conv_out = tf.cast(conv_out, tf.float32)
    grads = tf.cast(grads, tf.float32)

    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    conv_out = conv_out[0]

    heatmap = tf.reduce_sum(conv_out * pooled_grads, axis=-1)

    # Normalize safely
    heatmap = tf.maximum(heatmap, 0)
    max_val = tf.reduce_max(heatmap)
    if max_val == 0:
        heatmap = tf.zeros_like(heatmap)
    else:
        heatmap /= max_val

    heatmap = heatmap.numpy().astype(np.float32)

    # 🔥 OpenCV SAFE resize
    heatmap = cv2.resize(heatmap, TARGET_SIZE, interpolation=cv2.INTER_LINEAR)
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    overlay = cv2.addWeighted(raw_img, 0.6, heatmap, 0.4, 0)

    filename = f"gradcam_{os.path.basename(sys.argv[1])}"
    out_path = os.path.join(UPLOADS_DIR, filename)
    cv2.imwrite(out_path, cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR))

    return filename

# ---------------- MAIN ----------------
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("ERROR|NO_IMAGE", flush=True)
        sys.exit(1)

    image_path = sys.argv[1]
    if not os.path.exists(image_path):
        print("ERROR|IMAGE_NOT_FOUND", flush=True)
        sys.exit(1)

    x, raw_img = prepare_image(image_path)
    preds = model.predict(x, verbose=0)[0]

    idx = int(np.argmax(preds))
    label = CLASS_NAMES[idx]
    confidence = float(preds[idx])

    gradcam_file = generate_gradcam(x, raw_img, idx)

    # ✅ FINAL OUTPUT (DO NOT CHANGE)
    print(f"{label}|{confidence:.2f}|/uploads/{gradcam_file}", flush=True)
