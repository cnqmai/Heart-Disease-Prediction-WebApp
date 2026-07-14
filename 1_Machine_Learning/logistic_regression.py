import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import json
import joblib
import os
import warnings
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import cross_val_score, train_test_split, GridSearchCV
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import auc, classification_report, confusion_matrix, roc_curve, fbeta_score, make_scorer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler, PolynomialFeatures

warnings.filterwarnings('ignore')

# 1. Đọc dữ liệu sạch
file_path = 'heart.csv'
if not os.path.exists(file_path):
    print(f"LỖI: Không tìm thấy '{file_path}'.")
    exit()

df = pd.read_csv(file_path)

# 2. KIỂM TRA ĐA CỘNG TUYẾN
plt.figure(figsize=(12, 10))
sns.heatmap(df.corr(), annot=True, cmap='coolwarm', fmt=".2f")
plt.title("Ma trận tương quan - Phát hiện đa cộng tuyến")
plt.savefig('Correlation_Matrix.png')
print("-> Đã lưu biểu đồ 'Correlation_Matrix.png' để kiểm tra tương quan giữa các biến.")

# 3. Tách đặc trưng (X) và nhãn (y)
X = df.drop('target', axis=1)
y = df['target']

# Tách cột số và phân loại
categorical_cols = ['cp', 'restecg', 'slope', 'ca', 'thal']
numeric_cols = [col for col in X.columns if col not in categorical_cols]

# 4. Bổ sung StandardScaler cho dữ liệu số
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_cols),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols),
    ]
)

# 5. Chia tập dữ liệu
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)

# 6. Pipeline với PolynomialFeatures và Logistic Regression
print("\nĐang thiết lập Pipeline và GridSearchCV...")
pipeline = Pipeline(
    steps=[
        ('preprocessor', preprocessor),
        ('poly', PolynomialFeatures(include_bias=False)),
        ('model', LogisticRegression(max_iter=2000, random_state=42))
    ]
)

# 7. Tối ưu hóa siêu tham số bằng GridSearchCV
param_grid = {
    'poly__degree': [1, 2],
    'model__C': [0.01, 0.1, 1, 10, 100],
    'model__solver': ['liblinear', 'lbfgs'],
    'model__class_weight': [None, 'balanced', {0: 1, 1: 1.5}]
}

f2_scorer = make_scorer(fbeta_score, beta=2)

grid_search = GridSearchCV(
    pipeline, param_grid, cv=5, scoring=f2_scorer, n_jobs=-1, verbose=1
)

print("Bắt đầu tìm kiếm tham số tối ưu (Hyperparameter Tuning)...")
grid_search.fit(X_train, y_train)

best_model = grid_search.best_estimator_
print(f"\nTham số tốt nhất tìm được: {grid_search.best_params_}")

# 8. Tìm Threshold Tối Ưu
print("\nĐang tìm kiếm Threshold tối ưu...")
X_fit, X_val, y_fit, y_val = train_test_split(X_train, y_train, test_size=0.2, random_state=42, stratify=y_train)

best_model.fit(X_fit, y_fit)
val_prob = best_model.predict_proba(X_val)[:, 1]

threshold_grid = np.linspace(0.10, 0.90, 161)
best_threshold = 0.5
best_f2 = -1.0
best_val_accuracy = -1.0

for threshold in threshold_grid:
    val_pred = (val_prob >= threshold).astype(int)
    current_f2 = fbeta_score(y_val, val_pred, beta=2)
    current_accuracy = (val_pred == y_val).mean()
    if current_accuracy > best_val_accuracy or (
        current_accuracy == best_val_accuracy and current_f2 > best_f2
    ):
        best_val_accuracy = current_accuracy
        best_f2 = current_f2
        best_threshold = threshold

print(f"-> Ngưỡng dự đoán tối ưu: {best_threshold:.2f} (Val Acc = {best_val_accuracy * 100:.2f}%, F2 = {best_f2:.3f})")

threshold_data = {
    "best_threshold": float(best_threshold),
    "validation_accuracy": float(best_val_accuracy),
    "validation_f2": float(best_f2),
}
with open('threshold.json', 'w', encoding='utf-8') as f:
    json.dump(threshold_data, f, ensure_ascii=False, indent=2)

# 9. Train lại trên toàn bộ tập Train
best_model.fit(X_train, y_train)

# 10. Đánh giá
train_accuracy = best_model.score(X_train, y_train)
y_prob = best_model.predict_proba(X_test)[:, 1]
y_pred_default = (y_prob >= 0.5).astype(int)
y_pred_optimized = (y_prob >= best_threshold).astype(int)

test_accuracy_default = (y_pred_default == y_test).mean()
test_accuracy_optimized = (y_pred_optimized == y_test).mean()

cv_scores = cross_val_score(best_model, X_train, y_train, cv=5, scoring='accuracy', n_jobs=-1)

print(f"\n--- KẾT QUẢ ĐÁNH GIÁ MÔ HÌNH ---")
print(f"ĐỘ CHÍNH XÁC TRAIN: {train_accuracy * 100:.2f}%")
print(f"ĐỘ CHÍNH XÁC TEST (Ngưỡng 0.50): {test_accuracy_default * 100:.2f}%")
print(f"ĐỘ CHÍNH XÁC TEST (Ngưỡng {best_threshold:.2f}): {test_accuracy_optimized * 100:.2f}%")
print(f"ĐỘ CHÍNH XÁC CV (5-Fold): {cv_scores.mean() * 100:.2f}% (+/- {cv_scores.std() * 100:.2f}%)")

print("\n--- BÁO CÁO CHI TIẾT (THRESHOLD TỐI ƯU) ---")
cm_optimized = confusion_matrix(y_test, y_pred_optimized)
fn_optimized = cm_optimized[1, 0]
print(f"Số ca BỎ LỌT BỆNH (False Negative): {fn_optimized}")
print(classification_report(y_test, y_pred_optimized))

# 11. Vẽ biểu đồ Confusion Matrix
plt.figure(figsize=(6, 4))
sns.heatmap(cm_optimized, annot=True, fmt='d', cmap='Greens',
            xticklabels=['Khỏe mạnh (0)', 'Có nguy cơ (1)'], 
            yticklabels=['Khỏe mạnh (0)', 'Có nguy cơ (1)'])
plt.title(f'Confusion Matrix\nThreshold: {best_threshold:.2f} | Accuracy: {test_accuracy_optimized * 100:.2f}%')
plt.xlabel('AI Dự đoán')
plt.ylabel('Thực tế')
plt.tight_layout()
plt.savefig('Logistic_Confusion_Matrix.png')
print("-> Đã lưu biểu đồ thành 'Logistic_Confusion_Matrix.png'.")

# 12. Vẽ biểu đồ ROC
fpr, tpr, _ = roc_curve(y_test, y_prob)
roc_auc = auc(fpr, tpr)
plt.figure(figsize=(7, 5))
plt.plot(fpr, tpr, color='darkgreen', lw=2, label=f'ROC (AUC = {roc_auc:.3f})')
plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('Tỷ lệ Dương tính Giả (FPR)')
plt.ylabel('Tỷ lệ Dương tính Thật (TPR)')
plt.title('Đường cong ROC - Đánh giá mô hình Bệnh Tim')
plt.legend(loc="lower right")
plt.tight_layout()
plt.savefig('Logistic_ROC_Curve.png')
print("-> Đã lưu biểu đồ ROC thành 'Logistic_ROC_Curve.png'.")

# 13. Xuất mô hình
joblib.dump(best_model, 'heart_disease_logistic_regression_model.pkl')
print("\nĐã xuất mô hình AI ra file 'heart_disease_logistic_regression_model.pkl'.")