from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import math
import os
from ml_model import predict_waste
app = Flask(__name__)
CORS(app)

# ✅ ROOT CHECK
@app.route("/")
def home():
    return "Backend is LIVE 🚀"

# ✅ FILE PATH (SAFE)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(BASE_DIR, "dataset", "bins.csv")

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
@app.route("/prediction")
def prediction():
    df = load()

    if df.empty:
        return jsonify([])

    ml_values = predict_waste(df)

    result = []

    for i, row in df.iterrows():
    
        # 🔥 AI prediction (simple logic)
        ai = min(100, row["Waste_Level"] + 15)

        # 🔥 ML prediction (model output)
        ml = float(ml_values[i])

        result.append({
            "Area": row["Area"],
            "actual": row["Waste_Level"],
            "ai_predicted": ai,
            "ml_predicted": ml
        })

    return jsonify(result)
from ml_model import analyze_bins

@app.route("/analysis")
def analysis():
    df = load()
    return jsonify(analyze_bins(df))
# ✅ ANALYTICS API
@app.route("/route")
def route():
    df = load().sort_values("Waste_Level", ascending=False).head(10)

    points = df[["Latitude", "Longitude"]].values.tolist()

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
@app.route("/update_bin", methods=["POST"])
def update_bin():
    data = request.json

    df = load()

    if df.empty:
        return jsonify({"error": "No data"}), 400

    # 🔥 ensure type match
    df["Bin_ID"] = df["Bin_ID"].astype(str)

    df.loc[df["Bin_ID"] == str(data["Bin_ID"]), "Waste_Level"] = int(data["Waste_Level"])

    save(df)

    return jsonify({"message": "Updated"})
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)