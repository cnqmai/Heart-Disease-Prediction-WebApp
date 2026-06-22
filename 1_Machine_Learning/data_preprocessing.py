import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib


def download_dataset(dest_path):
	"""Try a few public raw CSV URLs for the UCI Heart Disease dataset."""
	urls = [
		"https://raw.githubusercontent.com/amirziai/heart-disease-prediction/master/heart.csv",
		"https://raw.githubusercontent.com/ansh941/Machine-Learning-Projects/master/Heart%20Disease%20UCI/heart.csv",
	]
	for url in urls:
		try:
			df = pd.read_csv(url)
			df.to_csv(dest_path, index=False)
			print(f"Downloaded dataset from {url}")
			return df
		except Exception:
			continue
	raise RuntimeError("Unable to download dataset from known URLs; please provide a local CSV named 'raw_heart.csv'.")


def load_raw(path):
	if os.path.exists(path):
		return pd.read_csv(path)
	# try to download to that path
	return download_dataset(path)


def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
	# Basic canonicalization: drop duplicates
	df = df.copy()
	df.drop_duplicates(inplace=True)

	# Common target column names: 'target' or 'HeartDisease' or 'diagnosis'
	target_cols = [c for c in df.columns if c.lower() in ("target", "heartdisease", "diagnosis")]
	if not target_cols:
		# try to detect a column with values 0/1
		for c in df.columns:
			if set(df[c].dropna().unique()).issubset({0, 1}):
				target_cols = [c]
				break
	if not target_cols:
		raise RuntimeError("Could not identify target column (expected 0/1 labels).")
	target = target_cols[0]
	df.rename(columns={target: "target"}, inplace=True)

	# Fill missing numeric values with median
	num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
	df[num_cols] = df[num_cols].fillna(df[num_cols].median())

	# For categorical non-numeric columns, do one-hot encoding
	obj_cols = df.select_dtypes(include=[object]).columns.tolist()
	if obj_cols:
		df = pd.get_dummies(df, columns=obj_cols, drop_first=True)

	# Ensure target is integer 0/1
	df["target"] = df["target"].astype(int)

	return df


def scale_features(df: pd.DataFrame, scaler_path: str = "scaler.joblib") -> pd.DataFrame:
	df = df.copy()
	y = df.pop("target")
	scaler = StandardScaler()
	X_scaled = scaler.fit_transform(df)
	X = pd.DataFrame(X_scaled, columns=df.columns)
	X["target"] = y.values
	joblib.dump(scaler, scaler_path)
	print(f"Saved scaler to {scaler_path}")
	return X


def main():
	repo_dir = os.path.dirname(__file__)
	raw_path = os.path.join(repo_dir, "raw_heart.csv")
	cleaned_path = os.path.join(repo_dir, "cleaned_data.csv")
	scaler_path = os.path.join(repo_dir, "scaler.joblib")

	df = load_raw(raw_path)
	print("Loaded raw data with shape:", df.shape)
	df_clean = clean_dataframe(df)
	print("Cleaned data shape:", df_clean.shape)
	df_scaled = scale_features(df_clean, scaler_path=scaler_path)
	df_scaled.to_csv(cleaned_path, index=False)
	print(f"Wrote cleaned and scaled data to {cleaned_path}")


if __name__ == "__main__":
	main()

