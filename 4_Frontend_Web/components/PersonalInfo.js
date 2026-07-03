class PersonalInfoSection extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <section>
        <h3 class="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-3">
            <span class="material-symbols-outlined text-primary p-2 bg-primary/5 rounded-lg" style="font-variation-settings: 'FILL' 1;">badge</span>
            Thông tin cá nhân
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <label class="block mb-2 font-label-md text-label-md text-on-surface-variant">Tuổi (Age)</label>
                <div class="relative">
                    <input id="age" name="age"
                        class="bg-surface-container-low border border-transparent rounded-lg pl-5 pr-12 py-4 text-body-lg font-body-lg text-on-surface focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none w-full transition-all"
                        placeholder="Nhập tuổi" type="number" required min="1" max="120">
                    <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <span class="font-label-sm text-label-sm text-outline">năm</span>
                    </div>
                </div>
            </div>
            <div>
                <label class="block mb-2 font-label-md text-label-md text-on-surface-variant">Giới tính (Sex)</label>
                <div class="relative">
                    <select id="sex" name="sex"
                        class="appearance-none bg-none bg-surface-container-low border border-transparent rounded-lg pl-5 pr-12 py-4 text-body-lg font-body-lg text-on-surface focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none w-full transition-all cursor-pointer">
                        <option selected value="1">Nam</option>
                        <option value="0">Nữ</option>
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
customElements.define('personal-info-section', PersonalInfoSection);
