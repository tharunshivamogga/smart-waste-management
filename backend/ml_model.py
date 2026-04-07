import numpy as np
from sklearn.cluster import KMeans

# 🔥 ML PREDICTION FUNCTION (REQUIRED)
def predict_waste(df):

    waste = df["Waste_Level"].values

    # normalize
    norm = waste / 100

    # growth logic
    growth = 0.1 + (norm * 0.5)

    predicted = waste + (waste * growth)

    # add variation
    noise = np.random.uniform(-5, 10, size=len(predicted))
    predicted = predicted + noise

    # clamp
    predicted = np.clip(predicted, 0, 100)

    return predicted.tolist()


# 🔥 CLUSTERING FUNCTION (FOR ANALYSIS)
def analyze_bins(df):

    waste = df["Waste_Level"].values.reshape(-1, 1)

    kmeans = KMeans(n_clusters=3, random_state=0)
    labels = kmeans.fit_predict(waste)

    result = []

    for i, row in df.iterrows():

        level = row["Waste_Level"]

        # usage pattern
        if level > 80:
            usage = "High Usage"
        elif level > 50:
            usage = "Medium Usage"
        else:
            usage = "Low Usage"

        # cluster meaning
        if labels[i] == 0:
            group = "Low Priority"
        elif labels[i] == 1:
            group = "Medium Priority"
        else:
            group = "High Priority"

        result.append({
            "Bin_ID": row["Bin_ID"],
            "Area": row["Area"],
            "Waste_Level": level,
            "usage_pattern": usage,
            "cluster": group
        })

    return result