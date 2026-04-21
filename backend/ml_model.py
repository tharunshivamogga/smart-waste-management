import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.cluster import KMeans

# 🔥 TRAIN + PREDICT WITH RMSE
def predict_waste(df):
    
    waste = df["Waste_Level"].values

    # 🔥 TRAIN DATA (simulate real pattern)
    X = waste.reshape(-1, 1)

    # realistic future target
    y = waste + (waste * 0.2) + np.random.uniform(-10, 10, size=len(waste))
    y = np.clip(y, 0, 100)

    # MODEL
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    predictions = model.predict(X)
    predictions = np.clip(predictions, 0, 100)

    # 🔥 REAL ERROR (IMPORTANT CHANGE)
    errors = waste - predictions   # ✅ compare with ACTUAL

    mae = np.mean(np.abs(errors))
    rmse = np.sqrt(np.mean(errors ** 2))

    # 🔥 BETTER ACCURACY FORMULA
    accuracy = 100 - (mae / 100 * 100)

    return predictions.tolist(), float(mae), float(accuracy), float(rmse)
# 🔥 CLUSTERING
def analyze_bins(df):

    waste = df["Waste_Level"].values.reshape(-1, 1)

    kmeans = KMeans(n_clusters=3, random_state=0)
    labels = kmeans.fit_predict(waste)

    result = []

    for i, row in df.iterrows():

        level = row["Waste_Level"]

        usage = "Low Usage"
        if level > 80:
            usage = "High Usage"
        elif level > 50:
            usage = "Medium Usage"

        group = ["Low Priority", "Medium Priority", "High Priority"][labels[i]]

        result.append({
            "Bin_ID": row["Bin_ID"],
            "Area": row["Area"],
            "Waste_Level": level,
            "usage_pattern": usage,
            "cluster": group
        })

    return result