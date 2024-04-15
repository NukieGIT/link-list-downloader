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

    /**
     * @type {(value: number, max: number) => {value: number, max: number, unit: string}}
     */
    #unitConverter

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
    }

    static get observedAttributes() {
        return ["value", "max"]
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

    set unitConverter(converter) {
        this.#unitConverter = converter
    }

    get unitConverter() {
        return this.#unitConverter
    }

    /**
     * @param {string} name
     * @param {string} oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        switch (name) {
            case "value":
            case "max":
                this.#updateProgress();
                break;
        }
    }

    #updateProgress() {
        this.#progressElement.value = this.value;
        this.#progressElement.max = this.max;

        const converted = this.#unitConverter(this.value, this.max)
        
        this.#textProgressElement.text = `${this.value / this.max*100}%`
        this.#textProgressElement.altText = `${converted.value} / ${converted.max}${converted.unit !== "" ? ` ${converted.unit}` : ""}`
    }
}

customElements.define('progress-bar', ProgressBarComponent);