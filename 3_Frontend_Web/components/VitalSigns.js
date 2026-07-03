class VitalSignsSection extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <section>
        <h3 class="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-3">
            <span class="material-symbols-outlined text-primary p-2 bg-primary/5 rounded-lg" style="font-variation-settings: 'FILL' 1;">water_drop</span>
            Chỉ số Sinh tồn &amp; Máu
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
                <label class="block mb-2 font-label-md text-label-md text-on-surface-variant">Huyết áp (Trestbps)</label>
                <div class="relative">
                    <input id="trestbps" name="trestbps"
                        class="bg-surface-container-low border border-transparent rounded-lg pl-5 pr-12 py-4 text-body-lg font-body-lg text-on-surface focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none w-full transition-all"
                        placeholder="Nhập huyết áp" type="number" required min="50" max="250">
                    <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <span class="font-label-sm text-label-sm text-outline">mmHg</span>
                    </div>
                </div>
            </div> 
            <div>
                <label class="block mb-2 font-label-md text-label-md text-on-surface-variant">Cholesterol (Chol)</label>
                <div class="relative">
                    <input id="chol" name="chol"
                        class="bg-surface-container-low border border-transparent rounded-lg pl-5 pr-12 py-4 text-body-lg font-body-lg text-on-surface focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none w-full transition-all"
                        placeholder="Nhập cholesterol" type="number" required min="100" max="600">
                    <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <span class="font-label-sm text-label-sm text-outline">mg/dl</span>
                    </div>
                </div>
            </div>
            <div>
                <label class="block mb-2 font-label-md text-label-md text-on-surface-variant" title="Đường huyết đói > 120 mg/dl">Đường huyết lúc đói</label>
                <div class="relative">
                    <select id="fbs" name="fbs"
                        class="appearance-none bg-none bg-surface-container-low border border-transparent rounded-lg pl-5 pr-12 py-4 text-body-lg font-body-lg text-on-surface focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none w-full transition-all cursor-pointer">
                        <option selected value="0">&lt; 120 mg/dl</option>
                        <option value="1">&gt; 120 mg/dl</option>
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
customElements.define('vital-signs-section', VitalSignsSection);
