# GIAI ĐOẠN 2: QUY TRÌNH LÀM VIỆC NHÓM VÀ KIẾN TRÚC WEB APP

Tài liệu này mô tả kiến trúc Microservices cho hệ thống Dự báo Bệnh tim và quy trình làm việc nhóm (Git workflow) dành cho Tí, Khang và Su trong Tuần 2.

**Lưu ý quan trọng:** 
1. Hệ thống **KHÔNG SỬ DỤNG DATABASE**. Chỉ xử lý luồng dữ liệu thời gian thực.
2. **Bắt buộc Deploy trên Docker** và có Public URL để nộp bài.

---

## 1. KIẾN TRÚC HỆ THỐNG (AI MICROSERVICES)

Mô hình sẽ hoạt động theo luồng: **Frontend (Su) -> NodeJS (Khang) -> Flask (Tí)**.

### Nhiệm vụ của TÍ: Phân hệ AI Backend (`2_Backend_Flask_API`)
- **Vai trò:** Trái tim của hệ thống dự đoán.
- **Công việc:**
  - Viết API bằng Python/Flask.
  - Load file `heart_disease_logistic_regression_model.pkl` đã train ở Tuần 1.
  - Tạo cổng `POST /predict`. Nhận dữ liệu json từ NodeJS, đưa vào model dự đoán và trả về kết quả (0 hoặc 1) kèm tỷ lệ phần trăm nguy cơ.
  - Viết `Dockerfile` đóng gói Flask.

### Nhiệm vụ của KHANG: Phân hệ Web Backend (`3_Backend_NodeJS`)
- **Vai trò:** Trạm trung chuyển dữ liệu (BFF - Backend for Frontend).
- **Công việc:**
  - Viết server bằng NodeJS/Express.
  - Tạo cổng `POST /api/check-heart`. 
  - Hứng dữ liệu từ Frontend của Su, ngay lập tức dùng `axios` đẩy sang cổng `/predict` của Tí. Khi Tí trả kết quả về, Khang đẩy ngược lại cho Su.
  - *Tuyệt đối không kết nối hay thiết lập Database ở bước này.*
  - Viết `Dockerfile` đóng gói NodeJS.

### Nhiệm vụ của SU: Phân hệ Frontend (`4_Frontend_Web`)
- **Vai trò:** Bộ mặt của hệ thống.
- **Công việc:**
  - Thiết kế 1 form nhập liệu duy nhất với giao diện đẹp, trực quan (HTML/CSS/JS).
  - Lấy dữ liệu người dùng nhập, gọi API `POST /api/check-heart` của Khang.
  - Xử lý kết quả trả về và hiển thị cảnh báo đẹp mắt (Khỏe mạnh: Xanh, Nguy cơ: Đỏ/Nhấp nháy).
  - Viết `Dockerfile` (sử dụng Nginx) để phục vụ file HTML tĩnh.

---

## 2. QUY TRÌNH CHIA NHÁNH (GIT WORKFLOW)

Sau khi đã chốt được file mô hình AI (`.pkl`) vào nhánh `main`, cả nhóm sẽ tiến hành làm Web. Vui lòng tuân thủ nghiêm ngặt các lệnh dưới đây để không bị mất code.

### Bước 1: Cập nhật code mới nhất về máy (Dành cho tất cả)
Trước khi bắt đầu task mới của Tuần 2, tất cả bắt buộc phải chuyển về nhánh `main` để lấy kết quả AI cuối cùng.
```bash
git checkout main
git pull origin main
```

### Bước 2: Phân chia nhánh (Branching)
Từ nhánh `main` mới nhất, mỗi người tạo nhánh riêng để bắt đầu code:

**Tí (Flask API):**
```bash
git checkout -b feature/flask-api
# Sau đó Tí mở thư mục 2_Backend_Flask_API để code
```

**Khang (NodeJS Server):**
```bash
git checkout -b feature/nodejs-server
# Sau đó Khang mở thư mục 3_Backend_NodeJS để code
```

**Su (Frontend Web):**
```bash
git checkout -b feature/frontend-web
# Sau đó Su mở thư mục 4_Frontend_Web để code
```

### Bước 3: Lưu và Đẩy code lên GitHub (Push)
Sau khi hoàn thành phần việc của mình, mỗi người đẩy code lên nhánh tương ứng:

**Tí:**
```bash
git add .
git commit -m "feat: hoàn thành Flask API dự đoán bệnh tim"
git push origin feature/flask-api
```

**Khang:**
```bash
git add .
git commit -m "feat: hoàn thành NodeJS server trung chuyển"
git push origin feature/nodejs-server
```

**Su:**
```bash
git add .
git commit -m "feat: hoàn thành giao diện Frontend form nhập liệu"
git push origin feature/frontend-web
```

### Bước 4: Tích hợp (Integration)
1. **Su** lên GitHub tạo **Pull Request (PR)**.
2. Gộp (Merge) lần lượt 3 nhánh `feature/flask-api`, `feature/nodejs-server`, và `feature/frontend-web` vào nhánh `main`.
3. Cả nhóm cùng review và chạy thử hệ thống tích hợp hoàn chỉnh.

### Bước 5: Triển khai lên Docker và Lấy URL Nộp bài (Deployment)
Sau khi code trên nhánh `main` đã chạy trơn tru:
1. Cả nhóm cùng nhau viết file `docker-compose.yml` ở thư mục gốc để liên kết 3 container (Flask, Node, Nginx) lại với nhau.
2. Deploy hệ thống Docker này lên Cloud (Ví dụ: Render.com, Railway, hoặc AWS EC2 miễn phí).
3. Lấy Public URL (ví dụ: `https://cardio-ai.onrender.com`) để gắn vào Slide và nộp cho giảng viên bấm vào trải nghiệm thực tế.
