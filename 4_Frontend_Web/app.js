// Import các Web Components
import './components/Header.js';
import './components/PersonalInfo.js';
import './components/VitalSigns.js';
import './components/CardioExam.js';
import './components/AdvancedMetrics.js';
import './components/ResultCard.js';

// Cấu hình Tailwind CSS
window.tailwind = window.tailwind || {};
window.tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            "colors": {
                "on-surface": "#0b1c30",
                "inverse-on-surface": "#eaf1ff",
                "on-secondary": "#ffffff",
                "on-primary-fixed-variant": "#00468b",
                "on-error": "#ffffff",
                "surface-bright": "#f8f9ff",
                "primary-container": "#0073de",
                "primary-fixed-dim": "#a9c7ff",
                "surface-dim": "#cbdbf5",
                "on-background": "#0b1c30",
                "on-tertiary-fixed": "#002113",
                "background": "#f8f9ff",
                "tertiary-fixed": "#6ffbbe",
                "tertiary-container": "#00855b",
                "tertiary": "#006947",
                "outline-variant": "#c0c6d6",
                "on-tertiary-fixed-variant": "#005236",
                "surface-container-high": "#dce9ff",
                "primary": "#005bb2",
                "on-primary-fixed": "#001b3d",
                "inverse-surface": "#213145",
                "surface-container-highest": "#d3e4fe",
                "outline": "#717785",
                "error": "#ba1a1a",
                "secondary-fixed-dim": "#4cd6ff",
                "error-container": "#ffdad6",
                "on-secondary-container": "#005266",
                "surface-tint": "#005db6",
                "surface-variant": "#d3e4fe",
                "secondary-container": "#00ccf9",
                "primary-fixed": "#d6e3ff",
                "on-tertiary-container": "#f5fff6",
                "on-error-container": "#93000a",
                "on-secondary-fixed": "#001f28",
                "surface-container-low": "#eff4ff",
                "on-tertiary": "#ffffff",
                "inverse-primary": "#a9c7ff",
                "on-surface-variant": "#404754",
                "on-primary-container": "#fefcff",
                "on-secondary-fixed-variant": "#004e60",
                "surface-container": "#e5eeff",
                "secondary-fixed": "#b7eaff",
                "tertiary-fixed-dim": "#4edea3",
                "on-primary": "#ffffff",
                "secondary": "#00677f",
                "surface": "#f8f9ff",
                "surface-container-lowest": "#ffffff"
            },
            "borderRadius": {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
            "spacing": {
                "gutter": "24px",
                "section-gap": "40px",
                "margin-desktop": "48px",
                "margin-mobile": "16px",
                "base": "8px",
                "container-max": "1200px"
            },
            "fontFamily": {
                "body-lg": ["Inter"],
                "label-md": ["Inter"],
                "label-sm": ["Inter"],
                "headline-md": ["Hanken Grotesk"],
                "headline-lg-mobile": ["Hanken Grotesk"],
                "headline-lg": ["Hanken Grotesk"],
                "body-md": ["Inter"],
                "display-lg": ["Hanken Grotesk"]
            },
            "fontSize": {
                "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
                "label-md": ["14px", { "lineHeight": "1.4", "fontWeight": "500" }],
                "label-sm": ["12px", { "lineHeight": "1.2", "letterSpacing": "0.05em", "fontWeight": "600" }],
                "headline-md": ["20px", { "lineHeight": "1.4", "fontWeight": "600" }],
                "headline-lg-mobile": ["24px", { "lineHeight": "1.3", "fontWeight": "600" }],
                "headline-lg": ["32px", { "lineHeight": "1.3", "fontWeight": "600" }],
                "body-md": ["16px", { "lineHeight": "1.5", "fontWeight": "400" }],
                "display-lg": ["48px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700" }]
            }
        }
    }
};

// Xử lý sự kiện sau khi DOM được tải xong
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('predictionForm');
    const resultCard = document.getElementById('predictionResult');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Hiệu ứng nút chẩn đoán đang tải
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="material-symbols-outlined animate-spin" style="font-size: 20px;">autorenew</span>
                ĐANG PHÂN TÍCH...
            `;

            // Thu thập dữ liệu từ các trường nhập liệu của component
            const age = parseInt(document.getElementById('age')?.value) || 0;
            const sex = parseInt(document.getElementById('sex')?.value) || 0;
            const trestbps = parseInt(document.getElementById('trestbps')?.value) || 0;
            const chol = parseInt(document.getElementById('chol')?.value) || 0;
            const fbs = parseInt(document.getElementById('fbs')?.value) || 0;
            const cp = parseInt(document.getElementById('cp')?.value) || 0;
            const restecg = parseInt(document.getElementById('restecg')?.value) || 0;
            const thalach = parseInt(document.getElementById('thalach')?.value) || 0;
            const exang = parseInt(document.getElementById('exang')?.value) || 0;
            const oldpeak = parseFloat(document.getElementById('oldpeak')?.value) || 0.0;
            const slope = parseInt(document.getElementById('slope')?.value) || 0;
            const ca = parseInt(document.getElementById('ca')?.value) || 0;
            const thal = parseInt(document.getElementById('thal')?.value) || 0;

            const payload = {
                age,
                sex,
                trestbps,
                chol,
                fbs,
                cp,
                restecg,
                thalach,
                exang,
                oldpeak,
                slope,
                ca,
                thal
            };


            try {
                const apiUrl = 'http://localhost:5000/api/predict';

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ features: [payload] })
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.error || `API error code: ${response.status}`);
                }

                const data = await response.json();
                console.log(data);

                if (resultCard) {
                    resultCard.showResult(data);
                }
            } catch (error) {
                console.warn('Không kết nối được tới Flask API. Đang giả lập kết quả chẩn đoán...', error);
            } finally {
                // Đảm bảo nút được phục hồi trạng thái bất kể thành công hay thất bại
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    // Gán nút "Phân Tích Mới" để cuộn lên trên cùng và reset form
    const resetBtn = document.getElementById('btnReset');
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            form?.reset();
            resultCard?.hide();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
