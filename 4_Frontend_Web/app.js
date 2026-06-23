document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');
    const modal = document.getElementById('result-modal');
    const closeModalBtn = document.getElementById('close-modal');
    
    // Modal Elements
    const modalIcon = document.getElementById('modal-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const probContainer = document.getElementById('probability-bar');
    const probFill = document.getElementById('progress-fill');
    const probText = document.getElementById('probability-text');

    // Mở Modal trạng thái Loading
    const showLoading = () => {
        modalIcon.className = 'status-icon loading';
        modalIcon.innerHTML = '<i class="fa-solid fa-spinner"></i>';
        modalTitle.textContent = 'Đang Phân Tích...';
        modalTitle.style.color = '#fff';
        modalDesc.textContent = 'CardioAI đang xử lý 13 chỉ số của bạn.';
        probContainer.classList.add('hidden');
        probText.classList.add('hidden');
        modal.classList.remove('hidden');
    };

    // Đóng Modal
    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Handle Form Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Thu thập dữ liệu từ Form
        const formData = new FormData(form);
        const data = {};
        
        // Chuyển đổi thành JSON (Ép kiểu về số vì AI model yêu cầu số)
        for (let [key, value] of formData.entries()) {
            data[key] = Number(value);
        }

        // Hiện màn hình chờ
        showLoading();

        try {
            // GỌI API ĐẾN NODEJS SERVER (Khang sẽ làm phần này)
            // Hiện tại chúng ta giả lập (mock) chờ 1.5s để xem UI
            const response = await fetch('http://localhost:3000/api/check-heart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Lỗi kết nối đến máy chủ.');
            }

            const result = await response.json();
            
            // Xử lý và Hiển thị kết quả
            displayResult(result);

        } catch (error) {
            console.error(error);
            // Kịch bản giả lập nếu Server chưa chạy (để Su quay video báo cáo UI trước)
            setTimeout(() => {
                // Mock result (Ngẫu nhiên 0 hoặc 1)
                const mockRisk = Math.random() > 0.5 ? 1 : 0;
                const mockProb = mockRisk === 1 ? (0.6 + Math.random()*0.3) : (0.1 + Math.random()*0.2);
                
                displayResult({
                    prediction: mockRisk,
                    probability: mockProb,
                    warning: "Lưu ý: Đây là dữ liệu giả lập vì Server NodeJS chưa bật."
                });
            }, 1500);
        }
    });

    // Hàm hiển thị kết quả ra UI
    function displayResult(result) {
        probContainer.classList.remove('hidden');
        probText.classList.remove('hidden');
        
        const probPercent = Math.round(result.probability * 100);
        probFill.style.width = `${probPercent}%`;
        probText.textContent = `Tỷ lệ phần trăm nguy cơ: ${probPercent}%`;

        if (result.prediction === 1) {
            // CÓ NGUY CƠ
            modalIcon.className = 'status-icon danger';
            modalIcon.innerHTML = '<i class="fa-solid fa-heart-crack"></i>';
            modalTitle.textContent = 'CẢNH BÁO NGUY CƠ CAO!';
            modalTitle.style.color = 'var(--danger-color)';
            modalDesc.textContent = 'Mô hình phát hiện các dấu hiệu bất thường. Bạn nên đến bệnh viện để bác sĩ chuyên khoa kiểm tra chi tiết.';
            probFill.style.background = 'var(--danger-color)';
        } else {
            // KHỎE MẠNH
            modalIcon.className = 'status-icon success';
            modalIcon.innerHTML = '<i class="fa-solid fa-heart-circle-check"></i>';
            modalTitle.textContent = 'TÍN HIỆU TỐT!';
            modalTitle.style.color = 'var(--success-color)';
            modalDesc.textContent = 'Các chỉ số hiện tại cho thấy tim bạn hoạt động bình thường. Hãy duy trì lối sống lành mạnh nhé.';
            probFill.style.background = 'var(--success-color)';
        }

        if(result.warning) {
            modalDesc.innerHTML += `<br><br><small style="color: #f59e0b;">${result.warning}</small>`;
        }
    }
});
