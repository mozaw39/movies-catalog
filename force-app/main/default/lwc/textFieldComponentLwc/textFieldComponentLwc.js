import { api, LightningElement } from "lwc";

export default class TextFieldComponent extends LightningElement {
  @api text;
  @api isEditMode;
  @api label;

  handleTextChange(event) {
    console.log('new text:', event.target.value);
    const textChangeEvent = new CustomEvent("textchange", {
      detail: {
        text: event.target.value,
        label: this.label
      },
      bubbles: true,
      composed: true
    });
    // Dispatches the text change event to cardmovie.

    this.dispatchEvent(textChangeEvent);
  }
}
