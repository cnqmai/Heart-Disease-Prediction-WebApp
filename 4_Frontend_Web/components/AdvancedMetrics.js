class AdvancedMetricsSection extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <section>
        <h3 class="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-3">
            <span class="material-symbols-outlined text-primary p-2 bg-primary/5 rounded-lg" style="font-variation-settings: 'FILL' 1;">biotech</span>
            Chỉ số Chuyên Sâu Khác
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <label class="block mb-2 font-label-md text-label-md text-on-surface-variant">Độ chênh ST (Oldpeak)</label>
                <div class="relative">
                    <input id="oldpeak" name="oldpeak"
                        class="bg-surface-container-low border border-transparent rounded-lg pl-5 pr-12 py-4 text-body-lg font-body-lg text-on-surface focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none w-full transition-all"
                        placeholder="Oldpeak" step="0.1" type="number" required min="0" max="10">
                    <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <span class="font-label-sm text-label-sm text-outline">mm</span>
                    </div>
                </div>
            </div>
            <div>
                <label class="block mb-2 font-label-md text-label-md text-on-surface-variant">Độ dốc đoạn ST (Slope)</label>
                <div class="relative">
                    <select id="slope" name="slope"
                        class="appearance-none bg-none bg-surface-container-low border border-transparent rounded-lg pl-5 pr-12 py-4 text-body-lg font-body-lg text-on-surface focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none w-full transition-all cursor-pointer">
                        <option value="0">0 - Đi lên</option>
                        <option value="1">1 - Đi ngang</option>
                        <option value="2">2 - Đi xuống</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <span class="material-symbols-outlined text-outline">expand_more</span>
                    </div>
                </div>
            </div>
            <div>
                <label class="block mb-2 font-label-md text-label-md text-on-surface-variant">Số mạch máu chính (CA)</label>
                <div class="relative">
                    <select id="ca" name="ca"
                        class="appearance-none bg-none bg-surface-container-low border border-transparent rounded-lg pl-5 pr-12 py-4 text-body-lg font-body-lg text-on-surface focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none w-full transition-all cursor-pointer">
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <span class="material-symbols-outlined text-outline">expand_more</span>
                    </div>
                </div>
            </div>
            <div>
                <label class="block mb-2 font-label-md text-label-md text-on-surface-variant">Thalassemia (Thal)</label>
                <div class="relative">
                    <select id="thal" name="thal"
                        class="appearance-none bg-none bg-surface-container-low border border-transparent rounded-lg pl-5 pr-12 py-4 text-body-lg font-body-lg text-on-surface focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none w-full transition-all cursor-pointer">
                        <option value="0">0 - Không xác định</option>
                        <option value="1">1 - Bình thường</option>
                        <option value="2">2 - Khiếm khuyết cố định</option>
                        <option value="3">3 - Khiếm khuyết có thể phục hồi</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <span class="material-symbols-outlined text-outline">expand_more</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
        `;
    }
}
customElements.define('advanced-metrics-section', AdvancedMetricsSection);
