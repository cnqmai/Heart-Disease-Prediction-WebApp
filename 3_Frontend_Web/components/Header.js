class PatientHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <header class="w-full top-0 sticky bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 z-30 flex justify-between items-center px-gutter h-20 shrink-0">
        <!-- Brand Area -->
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">monitor_heart</span>
            </div>
            <h1 class="font-headline-md text-headline-md text-primary tracking-tight">Group 8</h1>
        </div>
        <!-- Navigation (Centered) -->

        <!-- Actions (Right Aligned) -->

    </header>
        `;
    }
}
customElements.define('patient-header', PatientHeader);
