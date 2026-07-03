import os
import joblib
import json
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# CORS(app) - Kích hoạt CORS cho ứng dụng để trình duyệt không chặn request từ Frontend
CORS(app)

# Xác định đường dẫn tuyệt đối tới các tệp model và threshold
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, '..', '1_Machine_Learning', 'heart_disease_logistic_regression_model.pkl')
THRESHOLD_PATH = os.path.join(BASE_DIR, '..', '1_Machine_Learning', 'threshold.json')

# Tải model và threshold tối ưu khi khởi động server
model = None
best_threshold = 0.5

if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        print(f"-> Đã tải thành công model từ: {MODEL_PATH}")
    except Exception as e:
        print(f"-> Lỗi khi tải model: {e}")
else:
    print(f"-> CẢNH BÁO: Không tìm thấy file model tại {MODEL_PATH}")

if os.path.exists(THRESHOLD_PATH):
    try:
        with open(THRESHOLD_PATH, 'r', encoding='utf-8') as f:
            threshold_data = json.load(f)
            best_threshold = threshold_data.get('best_threshold', 0.5)
            print(f"-> Đã tải threshold tối ưu: {best_threshold}")
    except Exception as e:
        print(f"-> Lỗi khi tải threshold: {e}")


@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "message": "Flask Heart Disease Prediction API"
    })


@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({
            'error': 'Model chưa được tải thành công trên server.'
        }), 500

    payload = request.get_json(silent=True) or {}
    features_list = payload.get('features', [])

    if not features_list:
        return jsonify({
            'error': 'Không tìm thấy dữ liệu đặc trưng (features) trong payload.'
        }), 400

    try:
        # Khai báo các cột đặc trưng theo đúng thứ tự lúc train model
        feature_cols = [
            'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 
            'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
        ]
        
        # Chuẩn bị dữ liệu đầu vào cho DataFrame
        data_rows = []
        for feat in features_list:
            row = {col: feat.get(col, 0) for col in feature_cols}
            data_rows.append(row)
            
        df_input = pd.DataFrame(data_rows)
        
        # Ép kiểu dữ liệu để khớp với transformer của model
        df_input = df_input.astype({
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
        })

        # Dự báo xác suất (cột 1 đại diện cho xác suất mắc bệnh target=1)
        probabilities = model.predict_proba(df_input)[:, 1]
        
        # Chẩn đoán theo ngưỡng threshold tối ưu
        predictions = (probabilities >= best_threshold).astype(int)
        
        # Lấy kết quả cho bản ghi đầu tiên
        probability_pct = float(probabilities[0]) * 100
        risk = int(predictions[0])
        
        # Tạo thông điệp khuyến nghị chi tiết
        if risk == 1:
            message = f"AI phát hiện nguy cơ ({probability_pct:.1f}%). Trong y khoa, mức độ trên {best_threshold*100:.0f}% đã được coi là ngưỡng cần phải khám chuyên sâu khẩn cấp."
        else:
            message = f"AI đánh giá chỉ số tim mạch của bạn ở trạng thái an toàn ({probability_pct:.1f}%). Hãy duy trì lối sống lành mạnh và tập luyện đều đặn."

        return jsonify({
            'risk': risk,
            'probability': probability_pct,
            'message': message
        })
        
    except Exception as e:
        print("Lỗi xử lý predict:", e)
        return jsonify({
            'error': f'Lỗi hệ thống khi dự đoán: {str(e)}'
        }), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)