class CardioExamSection extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <section>
        <h3 class="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-3">
            <span class="material-symbols-outlined text-primary p-2 bg-primary/5 rounded-lg" style="font-variation-settings: 'FILL' 1;">ecg</span>
            Khám Tim Mạch &amp; Điện Tâm Đồ
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <label class="block mb-2 font-label-md text-label-md text-on-surface-variant">Loại Đau Ngực (CP)</label>
                <div class="relative">
                    <select id="cp" name="cp"
                        class="appearance-none bg-none bg-surface-container-low border border-transparent rounded-lg pl-5 pr-12 py-4 text-body-lg font-body-lg text-on-surface focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none w-full transition-all cursor-pointer">
                        <option value="0">0 - Điển hình</option>
                        <option value="1">1 - Không điển hình</option>
                        <option value="2">2 - Không do tim</option>
                        <option value="3">3 - Không triệu chứng</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <span class="material-symbols-outlined text-outline">expand_more</span>
                    </div>
                </div>
            </div>
            <div>
                <label class="block mb-2 font-label-md text-label-md text-on-surface-variant">Điện Tâm Đồ (RestECG)</label>
                <div class="relative">
                    <select id="restecg" name="restecg"
                        class="appearance-none bg-none bg-surface-container-low border border-transparent rounded-lg pl-5 pr-12 py-4 text-body-lg font-body-lg text-on-surface focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none w-full transition-all cursor-pointer">
                        <option value="0">0 - Bình thường</option>
                        <option value="1">1 - Bất thường sóng ST-T</option>
                        <option value="2">2 - Phì đại thất trái</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <span class="material-symbols-outlined text-outline">expand_more</span>
                    </div>
                </div>
            </div>
            <div>
                <label class="block mb-2 font-label-md text-label-md text-on-surface-variant">Nhịp Tim Tối Đa (Thalach)</label>
                <div class="relative">
                    <input id="thalach" name="thalach"
                        class="bg-surface-container-low border border-transparent rounded-lg pl-5 pr-12 py-4 text-body-lg font-body-lg text-on-surface focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none w-full transition-all"
                        placeholder="Thalach" type="number" required min="50" max="250">
                    <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <span class="font-label-sm text-label-sm text-outline">bpm</span>
                    </div>
                </div>
            </div>
            <div>
                <label class="block mb-2 font-label-md text-label-md text-on-surface-variant">Đau Ngực khi vận động (Exang)</label>
                <div class="relative">
                    <select id="exang" name="exang"
                        class="appearance-none bg-none bg-surface-container-low border border-transparent rounded-lg pl-5 pr-12 py-4 text-body-lg font-body-lg text-on-surface focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none w-full transition-all cursor-pointer">
                        <option value="0">0 - Không</option>
                        <option value="1">1 - Có</option>
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
customElements.define('cardio-exam-section', CardioExamSection);
