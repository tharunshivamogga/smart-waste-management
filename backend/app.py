from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import math
import os

app = Flask(__name__)
CORS(app)

# ✅ ROOT CHECK
@app.route("/")
def home():
    return "Backend is LIVE 🚀"

# ✅ FILE PATH (SAFE)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(BASE_DIR, "..", "dataset", "bins.csv")

print("DATA PATH:", DATA)

# ✅ LOAD FUNCTION (IMPORTANT)
def load():
    try:
        return pd.read_csv(DATA)
    except Exception as e:
        print("ERROR LOADING DATA:", e)
        return pd.DataFrame([
            {"Bin_ID": "B1", "Area": "Test", "Latitude": 12.97, "Longitude": 77.59, "Waste_Level": 50}
        ])

# ✅ SAVE FUNCTION
def save(df):
    try:
        df.to_csv(DATA, index=False)
    except:
        pass

# ✅ BINS API
@app.route("/bins")
def bins():
    df = load()
    return jsonify(df.to_dict(orient="records"))

# ✅ STATS API
@app.route("/stats")
def stats():
    df = load()

    if df.empty or "Waste_Level" not in df.columns:
        return jsonify({
            "total_bins": 0,
            "overflow_bins": 0,
            "avg_waste": 0
        })

    return jsonify({
        "total_bins": len(df),
        "overflow_bins": int((df["Waste_Level"] > 80).sum()),
        "avg_waste": float(df["Waste_Level"].mean())
    })

# ✅ ANALYTICS API
@app.route("/analytics")
def analytics():
    df = load()

    if df.empty:
        return jsonify([])

    grouped = df.groupby("Area")["Waste_Level"].mean().reset_index()
    return jsonify(grouped.to_dict(orient="records"))

# ✅ UPDATE BIN
@app.route("/update_bin", methods=["POST"])
def update_bin():
    data = request.json
    df = load()

    if df.empty:
        return jsonify({"error": "No data"})

    df.loc[df["Bin_ID"] == data["Bin_ID"], "Waste_Level"] = data["Waste_Level"]
    save(df)

    return jsonify({"status": "updated"})

# ✅ ROUTE OPTIMIZATION
@app.route("/route")
def route():
    df = load()

    if df.empty or "Waste_Level" not in df.columns:
        return jsonify([])

    df = df.sort_values("Waste_Level", ascending=False).head(10)

    points = df[["Latitude", "Longitude"]].values.tolist()

    if not points:
        return jsonify([])

    route = [points.pop(0)]

    while points:
        last = route[-1]
        nearest = min(points, key=lambda p: math.dist(last, p))
        route.append(nearest)
        points.remove(nearest)

    result = []
    for r in route:
        row = df[(df["Latitude"] == r[0]) & (df["Longitude"] == r[1])]

        if not row.empty:
            result.append(row.iloc[0].to_dict())

    return jsonify(result)