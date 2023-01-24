import { api, LightningElement } from "lwc";

export default class TextFieldComponent extends LightningElement {
  @api text;
  @api isEditMode;
  @api label;
  isValid;

  @api
  checkInputValidity() {
    console.log("checkInputValidity:", this.isValid);
    return this.isValid;
  }

  handleTextChange(event) {
    event.target.reportValidity();
    console.log(
      "new text:",
      event.target.value,
      "Validity:",
      (this.isValid = event.target.checkValidity())
    );
    this.isValid = event.target.checkValidity();
    const textChangeEvent = new CustomEvent("textchange", {
      detail: {
        value: event.target.value,
        label: this.label,
        isValid: event.target.checkValidity()
      },
      bubbles: true,
      composed: true
    });
    // Dispatches the text change event to movies app management layout.

    this.dispatchEvent(textChangeEvent);
  }
}
