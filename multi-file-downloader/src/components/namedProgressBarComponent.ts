import stylecss from "@/mainPage/style.css?inline";
import { ProgressBarComponent } from "./progressBarComponent";

export default class NamedProgressBarComponent extends HTMLElement {
    #_progressBarComponent: ProgressBarComponent
    #_nameElement: HTMLSpanElement

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.innerHTML = `
            <span id="name" class="progress-bar-name"></span>
            <progress-bar id="progress-bar"></progress-bar>
        `;

        const sheet = new CSSStyleSheet();
        sheet.replaceSync(stylecss);
        shadowRoot.adoptedStyleSheets = [sheet];

        this.#_progressBarComponent = shadowRoot.querySelector<ProgressBarComponent>('#progress-bar')!;
        this.#_nameElement = shadowRoot.querySelector('#name')!;
    }

    static get observedAttributes() {
        return ["name", "value", "max", "percentage-decimal-rounding"]
    }

    set name(value: string) {
        this.setAttribute("name", value);
    }

    get name(): string | null {
        return this.getAttribute("name");
    }

    set value(value: number) {
        this.setAttribute("value", value.toString());
    }

    get value() {
        return parseFloat(this.getAttribute("value") ?? "0");
    }

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
        return parseFloat(this.getAttribute("percentage-decimal-rounding") ?? "0")
    }

    set unitConverter(converter) {
        this.#_progressBarComponent.unitConverter = converter
    }

    get unitConverter() {
        return this.#_progressBarComponent.unitConverter
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) return;

        switch (name) {
            case "name":
                this.#_nameElement.textContent = newValue;
                break;
            case "value":
                this.#_progressBarComponent.value = parseFloat(newValue) || 0;
                break;
            case "max":
                this.#_progressBarComponent.max = parseFloat(newValue) || 100;
                break;
            case "percentage-decimal-rounding":
                this.#_progressBarComponent.percentageRounding = parseFloat(newValue) || 0;
                break;
        }
    }
}

customElements.define('named-progress-bar', NamedProgressBarComponent);