import stylecss from '@/mainPage/style.css?inline'

export class ToggleableTextComponent extends HTMLElement {
    #_textElement: HTMLSpanElement;
    #_toggleBound: () => void;

    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.innerHTML = `
            <span id="text" class="toggleable-text"></span>
        `;

        const sheet = new CSSStyleSheet();
        sheet.replaceSync(stylecss);
        shadowRoot.adoptedStyleSheets = [sheet];


        this.#_textElement = shadowRoot.querySelector<HTMLSpanElement>('#text')!;

        this.#_toggleBound = this.#_toggle.bind(this);
    }

    static get observedAttributes() {
        return ['text', 'alt-text', 'toggled'];
    }

    connectedCallback() {
        this.#_textElement.addEventListener('click', this.#_toggleBound);
    }

    disconnectedCallback() {
        this.#_textElement.removeEventListener('click', this.#_toggleBound);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;

        switch (name) {
            case 'text':
            case 'alt-text':
            case 'toggled':
                this.#_updateText();
                break;
        }
    }

    set text(value: string) {
        this.setAttribute('text', value);
    }

    get text(): string | null {
        return this.getAttribute('text');
    }

    set altText(value: string) {
        this.setAttribute('alt-text', value);
    }

    get altText(): string | null {
        return this.getAttribute('alt-text');
    }

    get toggled() {
        return this.hasAttribute('toggled');
    }

    #_updateText() {
        this.#_textElement.textContent = this.toggled ? this.getAttribute('alt-text') : this.getAttribute('text');
    }

    #_toggle() {
        if (this.toggled) {
            this.removeAttribute('toggled');
        } else {
            this.setAttribute('toggled', '');
        }

        this.#_textElement.classList.toggle('toggled', this.toggled);
        this.dispatchEvent(new CustomEvent('toggled', { detail: this.toggled }));
    }
}

customElements.define('toggleable-text', ToggleableTextComponent);