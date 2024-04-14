export class ToggleableTextComponent extends HTMLElement {
    #textElement;
    #toggleBound;

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/new/style.css">
            <span id="text" class="toggleable-text"></span>
        `;
        
        this.#textElement = shadowRoot.querySelector('#text');

        this.#toggleBound = this.#toggle.bind(this);
    }

    static get observedAttributes() {
        return ['text', 'alt-text', 'toggled'];
    }

    connectedCallback() {
        this.#textElement.addEventListener('click', this.#toggleBound);
    }

    disconnectedCallback() {
        this.#textElement.removeEventListener('click', this.#toggleBound);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        switch (name) {
            case 'text':
            case 'alt-text':
            case 'toggled':
                this.#updateText();
                break;
        }
    }

    set text(value) {
        this.setAttribute('text', value);
    }

    get text() {
        return this.getAttribute('text');
    }

    set altText(value) {
        this.setAttribute('alt-text', value);
    }

    get altText() {
        return this.getAttribute('alt-text');
    }

    get toggled() {
        return this.hasAttribute('toggled');
    }

    #updateText() {
        this.#textElement.textContent = this.toggled ? this.getAttribute('alt-text') : this.getAttribute('text');
    }

    #toggle() {
        if (this.toggled) {
            this.removeAttribute('toggled');
        } else {
            this.setAttribute('toggled', '');
        }

        this.#textElement.classList.toggle('toggled', this.toggled);
        this.dispatchEvent(new CustomEvent('toggled', { detail: this.toggled }));
    }
}

customElements.define('toggleable-text', ToggleableTextComponent);