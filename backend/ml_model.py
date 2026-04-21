import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.cluster import KMeans

# 🔥 TRAIN + PREDICT WITH RMSE
def predict_waste(df):

    waste = df["Waste_Level"].values

    # TARGET GENERATION
    future = []
    for w in waste:
        if w > 80:
            future.append(min(100, w + np.random.randint(2, 8)))
        elif w > 50:
            future.append(min(100, w + np.random.randint(5, 15)))
        else:
            future.append(min(100, w + np.random.randint(10, 25)))

    X = waste.reshape(-1, 1)
    y = np.array(future)

    # MODEL
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    predictions = model.predict(X)
    predictions = np.clip(predictions, 0, 100)

    # 🔥 ERRORS
    errors = y - predictions

    mae = np.mean(np.abs(errors))
    rmse = np.sqrt(np.mean(errors ** 2))
    accuracy = 100 - mae

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