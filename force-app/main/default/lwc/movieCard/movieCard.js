import { api, LightningElement } from "lwc";

export default class MovieCard extends LightningElement {
  @api image;
  @api title;
  @api body;
  @api isPreviewed;
  imageSizeClass;

  connectedCallback() {
    /* resize previewed image */
    this.imageSizeClass = this.isPreviewed ? "previewed-image" : "";
  }

  previewMovie(event) {
    if (!this.isPreviewed) {
      console.log("previewMovie child");
      const previewImageEvent = new CustomEvent("previewmoviechange", {
        detail: this.title,
        bubbles: true,
        composed: true
      });
      // Dispatches the search event.
      this.dispatchEvent(previewImageEvent);
    }
  }
}
