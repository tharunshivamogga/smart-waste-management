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

# ✅ SAFE DATA PATH
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(BASE_DIR, "..", "dataset", "bins.csv")

print("DATA PATH:", DATA)

# ✅ SAFE LOAD (NO CRASH)
@app.route("/route")
def route():
    df = load()

    if df.empty or "Waste_Level" not in df.columns:
        return jsonify([])

    df = df.sort_values("Waste_Level", ascending=False).head(10)

    if df.empty:
        return jsonify([])

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

        if row.empty:
            continue

        result.append(row.iloc[0].to_dict())

    return jsonify(result)

def save(df):
    try:
        df.to_csv(DATA, index=False)
    except:
        pass

@app.route("/bins")
def bins():
    df = load()
    return jsonify(df.to_dict(orient="records"))

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

@app.route("/analytics")
def analytics():
    df = load()
    grouped = df.groupby("Area")["Waste_Level"].mean().reset_index()
    return jsonify(grouped.to_dict(orient="records"))

@app.route("/update_bin", methods=["POST"])
def update_bin():
    data = request.json
    df = load()
    df.loc[df["Bin_ID"] == data["Bin_ID"], "Waste_Level"] = data["Waste_Level"]
    save(df)
    return jsonify({"status": "updated"})

@app.route("/route")
def route():
    df = load().sort_values("Waste_Level", ascending=False).head(10)
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
        row = df[(df["Latitude"] == r[0]) & (df["Longitude"] == r[1])].iloc[0]
        result.append(row.to_dict())

    return jsonify(result)