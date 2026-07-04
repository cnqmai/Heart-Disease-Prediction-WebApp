import json
import os
import sys

import joblib
import pandas as pd


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, '..', '1_Machine_Learning', 'heart_disease_logistic_regression_model.pkl')
THRESHOLD_PATH = os.path.join(BASE_DIR, '..', '1_Machine_Learning', 'threshold.json')

FEATURE_COLUMNS = [
    'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
    'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
]

FEATURE_TYPES = {
    'age': float,
    'sex': int,
    'cp': int,
    'trestbps': float,
    'chol': float,
    'fbs': int,
    'restecg': int,
    'thalach': float,
    'exang': int,
    'oldpeak': float,
    'slope': int,
    'ca': int,
    'thal': int
}


def load_threshold():
    if not os.path.exists(THRESHOLD_PATH):
        return 0.5

    with open(THRESHOLD_PATH, 'r', encoding='utf-8') as file:
        threshold_data = json.load(file)
        return float(threshold_data.get('best_threshold', 0.5))


def predict(payload):
    if not os.path.exists(MODEL_PATH):
        raise RuntimeError(f'Không tìm thấy file model tại {MODEL_PATH}')

    features_list = payload.get('features', [])
    if not features_list:
        raise ValueError('Không tìm thấy dữ liệu đặc trưng (features) trong payload.')

    model = joblib.load(MODEL_PATH)
    best_threshold = load_threshold()

    data_rows = []
    for features in features_list:
        row = {column: features.get(column, 0) for column in FEATURE_COLUMNS}
        data_rows.append(row)

    df_input = pd.DataFrame(data_rows)
    df_input = df_input.astype(FEATURE_TYPES)

    probabilities = model.predict_proba(df_input)[:, 1]
    predictions = (probabilities >= best_threshold).astype(int)

    probability_pct = float(probabilities[0]) * 100
    risk = int(predictions[0])

    if risk == 1:
        message = (
            f'AI phát hiện nguy cơ ({probability_pct:.1f}%). '
            f'Trong y khoa, mức độ trên {best_threshold * 100:.0f}% đã được coi là ngưỡng cần phải khám chuyên sâu khẩn cấp.'
        )
    else:
        message = (
            f'AI đánh giá chỉ số tim mạch của bạn ở trạng thái an toàn ({probability_pct:.1f}%). '
            'Hãy duy trì lối sống lành mạnh và tập luyện đều đặn.'
        )

    return {
        'risk': risk,
        'probability': probability_pct,
        'message': message
    }


def main():
    try:
        raw_input = sys.stdin.buffer.read().decode('utf-8-sig')
        payload = json.loads(raw_input or '{}')
        print(json.dumps(predict(payload), ensure_ascii=False))
    except Exception as error:
        print(json.dumps({'error': f'Lỗi hệ thống khi dự đoán: {error}'}, ensure_ascii=False))
        sys.exit(1)


if __name__ == '__main__':
    main()
