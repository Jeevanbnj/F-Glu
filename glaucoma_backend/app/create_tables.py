
import sqlite3

conn = sqlite3.connect("glaucoma.db")
cursor = conn.cursor()

# Add image_path column safely
try:
    cursor.execute("""
        ALTER TABLE patients
        ADD COLUMN image_path TEXT
    """)
    print("✅ image_path column added")
except Exception as e:
    print("ℹ️ image_path already exists or error:", e)

conn.commit()
conn.close()
