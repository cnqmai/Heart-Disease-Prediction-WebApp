class ResultCard extends HTMLElement {
    constructor() {
        super();
        this.data = null;
    }

    connectedCallback() {
        this.render();
    }

    showResult(resultData) {
        // resultData expected: { risk: 0 | 1, probability: number, message?: string }
        this.data = resultData;
        this.render();
        this.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    hide() {
        this.data = null;
        this.render();
    }

    render() {
        if (!this.data) {
            this.innerHTML = '';
            return;
        }

        const isHighRisk = this.data.risk === 1;
        const probability = typeof this.data.probability === 'number'
            ? Math.round(this.data.probability)
            : (isHighRisk ? 78 : 12);

        const cardBg = isHighRisk
            ? 'bg-error-container/20 border-error/30 text-on-error-container shadow-[0_20px_50px_rgba(186,26,26,0.08)] animate-[pulse_3s_infinite_ease-in-out]'
            : 'bg-tertiary-container/10 border-tertiary/20 text-tertiary shadow-[0_20px_50px_rgba(0,105,71,0.04)]';

        const badgeBg = isHighRisk ? 'bg-error text-on-error animate-pulse' : 'bg-tertiary text-on-tertiary';
        const titleText = isHighRisk ? 'Cảnh Báo: Nguy Cơ Bệnh Tim Cao' : 'Kết Quả: Hệ Tim Mạch Khỏe Mạnh';
        const icon = isHighRisk ? 'warning' : 'verified_user';

        this.innerHTML = `
            <div class="mt-10 p-8 rounded-2xl border-2 transition-all duration-500 transform scale-100 ${cardBg}">
                <div class="flex flex-col md:flex-row items-center gap-6">
                    <div class="w-16 h-16 rounded-full flex items-center justify-center ${badgeBg} shrink-0">
                        <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">${icon}</span>
                    </div>
                    <div class="flex-1 text-center md:text-left space-y-2">
                        <h3 class="font-headline-lg text-2xl font-bold tracking-tight">${titleText}</h3>
                        <p class="font-body-md text-base leading-relaxed opacity-90">
                            ${this.data.message || (isHighRisk
                ? 'Hệ thống AI phát hiện các dấu hiệu nguy cơ cao mắc bệnh tim mạch. Hãy đăng ký kiểm tra chuyên khoa Tim mạch tại cơ sở y tế gần nhất sớm nhất có thể.'
                : 'Chúc mừng! Chỉ số tim mạch hiện tại của bạn nằm trong phạm vi an toàn. Hãy tiếp tục duy trì chế độ ăn lành mạnh và tập luyện đều đặn!')}
                        </p>
                    </div>
                    <div class="flex flex-col items-center justify-center px-6 py-4 rounded-xl bg-white/80 backdrop-blur border border-white/40 shadow-sm shrink-0">
                        <span class="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-1">Mức Độ Nguy Cơ</span>
                        <span class="font-display-lg text-4xl font-extrabold ${isHighRisk ? 'text-error' : 'text-tertiary'}">${probability}%</span>
                    </div>
                </div>
                <div class="mt-6 flex justify-end gap-4 border-t border-outline-variant/20 pt-4">
                    <button id="closeResultBtn" class="px-6 py-2.5 rounded-full text-sm font-semibold border border-outline hover:bg-black/5 transition-all text-on-surface">
                        Đóng kết quả
                    </button>
                    ${isHighRisk ? `
                    
                    ` : ''}
                </div>
            </div>
        `;

        // Bind click events
        this.querySelector('#closeResultBtn')?.addEventListener('click', () => this.hide());
        this.querySelector('#findDoctorBtn')?.addEventListener('click', () => {
            alert('Đang kết nối cuộc gọi tư vấn sức khỏe tim mạch...');
        });
    }
}
customElements.define('result-card', ResultCard);
