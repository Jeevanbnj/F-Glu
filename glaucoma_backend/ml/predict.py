import sys
import os
import numpy as np
from PIL import Image

import keras  # ✅ Keras 3
from keras.models import load_model

# ---------- CONFIG ----------
CLASS_NAMES = ["advanced", "early", "normal"]
TARGET_SIZE = (320, 320)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "glaucoma_best_model_ft2.keras")

# ---------- LOAD MODEL ----------
model = load_model(MODEL_PATH, compile=False)

def prepare_image(image_path):
    img = Image.open(image_path).convert("RGB")
    img = img.resize(TARGET_SIZE)
    arr = np.asarray(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)

def predict_image(image_path):
    x = prepare_image(image_path)
    preds = model.predict(x, verbose=0)[0]
    idx = int(np.argmax(preds))
    return CLASS_NAMES[idx], float(preds[idx])

# ---------- CLI ----------
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("ERROR|NO_IMAGE", flush=True)
        sys.exit(1)

    image_path = sys.argv[1]

    if not os.path.exists(image_path):
        print("ERROR|IMAGE_NOT_FOUND", flush=True)
        sys.exit(1)

    label, confidence = predict_image(image_path)

    # ✅ SINGLE CLEAN OUTPUT
    print(f"{label}|{confidence:.2f}", flush=True)
