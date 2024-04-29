/**
 * @import { ProgressBarComponent } from './progressBarComponent.mjs'
 */

export default class NamedProgressBarComponent extends HTMLElement {
    /**
     * @type {ProgressBarComponent}
     */
    #progressBarComponent

    /**
     * @type {HTMLSpanElement}
     */
    #nameElement

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/new/style.css">
            <span id="name" class="progress-bar-name"></span>
            <progress-bar id="progress-bar"></progress-bar>
        `;

        this.#progressBarComponent = shadowRoot.querySelector('#progress-bar');
        this.#nameElement = shadowRoot.querySelector('#name');
    }

    static get observedAttributes() {
        return ["name", "value", "max", "percentage-decimal-rounding"]
    }

    /**
     * @param {string} value
     */
    set name(value) {
        this.setAttribute("name", value);
    }

    get name() {
        return this.getAttribute("name");
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
        return parseFloat(this.getAttribute("max")) || 1;
    }
    
    set percentageRounding(value) {
        this.setAttribute("percentage-decimal-rounding", value.toString())
    }

    get percentageRounding() {
        return parseFloat(this.getAttribute("percentage-decimal-rounding")) || 0
    }

    set unitConverter(converter) {
        this.#progressBarComponent.unitConverter = converter
    }

    get unitConverter() {
        return this.#progressBarComponent.unitConverter
    }

    /**
     * @param {string} name
     * @param {string} oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "name":
                this.#nameElement.textContent = newValue;
                break;
            case "value":
                this.#progressBarComponent.value = parseFloat(newValue) || 0;
                break;
            case "max":
                this.#progressBarComponent.max = parseFloat(newValue) || 100;
                break;
            case "percentage-decimal-rounding":
                this.#progressBarComponent.percentageRounding = parseFloat(newValue) || 0;
                break;
        }
    }
}

customElements.define('named-progress-bar', NamedProgressBarComponent);