import stylecss from '@/mainPage/style.css?inline'
import { ToggleableTextComponent } from "./toggleableTextComponent";

export class ProgressBarComponent extends HTMLElement {
    #_progressElement: HTMLProgressElement
    #_textProgressElement: ToggleableTextComponent

    #_unitConverter: (value: number, max: number) => { 
        value: number; 
        max: number; 
        unit: string; 
    } = (value, max): { 
        value: number; 
        max: number; 
        unit: string; 
    } => ({ 
        value, 
        max, 
        unit: "" 
    })

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.innerHTML = `
            <progress id="progress" class="progress-bar"></progress>
            <toggleable-text id="text-progress" class="progress-bar-text"></toggleable-text>
        `;

        const sheet = new CSSStyleSheet();
        sheet.replaceSync(stylecss);
        shadowRoot.adoptedStyleSheets = [sheet];

        this.#_progressElement = shadowRoot.querySelector<HTMLProgressElement>('#progress')!;
        this.#_textProgressElement = shadowRoot.querySelector<ToggleableTextComponent>('#text-progress')!;
    }

    static get observedAttributes() {
        return ["value", "max", "percentage-decimal-rounding"]
    }

    /**
     * @param {number} value
     */
    set value(value: number) {
        this.setAttribute("value", value.toString());
    }

    get value() {
        return parseFloat(this.getAttribute("value") ?? "0");
    }

    /**
     * @param {number} value
     */
    set max(value: number) {
        this.setAttribute("max", value.toString());
    }

    get max() {
        return parseFloat(this.getAttribute("max") ?? "1");
    }

    set percentageRounding(value) {
        this.setAttribute("percentage-decimal-rounding", value.toString())
    }

    get percentageRounding() {
        return parseFloat(this.getAttribute("percentage-decimal-rounding") ?? "0");
    }

    set unitConverter(converter) {
        this.#_unitConverter = converter
    }

    get unitConverter() {
        return this.#_unitConverter
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;

        switch (name) {
            case "value":
            case "max":
            case "percentage-decimal-rounding":
                this.#_updateProgress();
                break;
        }
    }

    #_updateProgress() {
        this.#_progressElement.value = this.value;
        this.#_progressElement.max = this.max;

        const converted = this.#_unitConverter(this.value, this.max)

        const percentage = this.value / this.max * 100
        const roundedPercentage = parseFloat(percentage.toFixed(this.percentageRounding))

        this.#_textProgressElement.text = `${roundedPercentage}%`
        this.#_textProgressElement.altText = `${converted.value} / ${converted.max}${converted.unit !== "" ? ` ${converted.unit}` : ""}`
    }
}

customElements.define('progress-bar', ProgressBarComponent);