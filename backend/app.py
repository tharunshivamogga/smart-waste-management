
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import math
import os

app = Flask(__name__)
CORS(app)
@app.route("/")
def home():
    return "Backend is running 🚀"

DATA = "../dataset/bins.csv"

def load():
    return pd.read_csv(DATA)

def save(df):
    df.to_csv(DATA, index=False)

@app.route("/bins")
def bins():
    return jsonify(load().to_dict(orient="records"))

@app.route("/stats")
def stats():
    df = load()
    return jsonify({
        "total_bins": len(df),
        "overflow_bins": int((df["Waste_Level"]>80).sum()),
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
    df.loc[df["Bin_ID"]==data["Bin_ID"],"Waste_Level"]=data["Waste_Level"]
    save(df)
    return jsonify({"status":"updated"})

@app.route("/route")
def route():
    df = load().sort_values("Waste_Level",ascending=False).head(10)
    points = df[["Latitude","Longitude"]].values.tolist()
    route=[points.pop(0)]
    while points:
        last=route[-1]
        nearest=min(points,key=lambda p:math.dist(last,p))
        route.append(nearest)
        points.remove(nearest)
    result=[]
    for r in route:
        row=df[(df["Latitude"]==r[0])&(df["Longitude"]==r[1])].iloc[0]
        result.append(row.to_dict())
    return jsonify(result)

if __name__ == "__main__":
     app.run(host="0.0.0.0", port=5000, debug=True)