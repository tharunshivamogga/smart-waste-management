import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

def predict_waste(df):

    df = df.copy()
    df["index"] = range(len(df))

    X = df[["index"]]
    y = df["Waste_Level"]

    model = LinearRegression()
    model.fit(X, y)

    future_index = np.array([[len(df)+i] for i in range(5)])
    predictions = model.predict(future_index)

    return [round(p,2) for p in predictions]