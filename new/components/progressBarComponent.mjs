/**
 * @typedef {import('./toggleableTextComponent.mjs').ToggleableTextComponent} ToggleableTextComponent
 */
export class ProgressBarComponent extends HTMLElement {
    /**
     * @type {HTMLProgressElement}
     */
    #progressElement

    /**
     * @type {ToggleableTextComponent}
     */
    #textProgressElement
    #updateProgressBound

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/new/style.css">
            <progress id="progress" class="progress-bar"></progress>
            <toggleable-text id="text-progress" class="progress-bar-text"></toggleable-text>
        `;

        this.#progressElement = shadowRoot.querySelector('#progress');
        this.#textProgressElement = shadowRoot.querySelector('#text-progress');

        this.#updateProgressBound = this.#updateProgress.bind(this);
    }

    static get observedAttributes() {
        return ["value", "max", "unit"]
    }

    /**
     * @param {number} value
     */
    set value(value) {
        this.setAttribute("value", value.toString());
    }

    get value() {
        return parseFloat(this.getAttribute("value")) || 0;
    }

    /**
     * @param {number} value
     */
    set max(value) {
        this.setAttribute("max", value.toString());
    }

    get max() {
        return parseFloat(this.getAttribute("max")) || 100;
    }

    set unit(value) {
        this.setAttribute("unit", value);
    }

    get unit() {
        return this.getAttribute("unit") ?? "";
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        switch (name) {
            case "value":
            case "max":
            case "unit":
                this.#updateProgressBound();
                break;
        }
    }

    #updateProgress() {
        this.#progressElement.value = this.value;
        this.#progressElement.max = this.max;
        
        this.#textProgressElement.text = `${this.value / this.max*100}%`
        this.#textProgressElement.altText = `${this.value} / ${this.max}${this.unit !== "" ? ` ${this.unit}` : ""}`
    }
}

customElements.define('progress-bar', ProgressBarComponent);