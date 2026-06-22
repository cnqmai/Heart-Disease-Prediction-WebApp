import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix


def load_data(path):
	return pd.read_csv(path)


def train_and_save(cleaned_path, model_out_path):
	df = load_data(cleaned_path)
	if "target" not in df.columns:
		raise RuntimeError("cleaned data must contain a 'target' column")
	X = df.drop(columns=["target"]).values
	y = df["target"].values

	X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

	param_grid = {
		"C": [0.01, 0.1, 1.0, 10.0],
		"penalty": ["l2"],
	}
	lr = LogisticRegression(solver="liblinear", max_iter=1000)
	clf = GridSearchCV(lr, param_grid, cv=5, scoring="accuracy", n_jobs=1)
	clf.fit(X_train, y_train)

	print("Best params:", clf.best_params_)
	best = clf.best_estimator_

	y_pred = best.predict(X_test)
	print("Classification report:\n", classification_report(y_test, y_pred))
	print("Confusion matrix:\n", confusion_matrix(y_test, y_pred))

	joblib.dump(best, model_out_path)
	print(f"Saved best model to {model_out_path}")


def main():
	repo_dir = os.path.dirname(__file__)
	cleaned_path = os.path.join(repo_dir, "cleaned_data.csv")
	model_out_path = os.path.join(repo_dir, "best_model.pkl")

	if not os.path.exists(cleaned_path):
		raise RuntimeError(f"Cleaned data not found at {cleaned_path}. Run data_preprocessing.py first.")

	train_and_save(cleaned_path, model_out_path)


if __name__ == "__main__":
	main()

