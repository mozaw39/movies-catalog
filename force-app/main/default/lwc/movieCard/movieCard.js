import { api, LightningElement } from "lwc";

export default class MovieCard extends LightningElement {
  @api image;
  @api title;
  @api body;
  @api isPreviewed;
  @api isEditMode;
  imageSizeClass;

  get isNotEditMode(){
    return !this.isEditMode;
  }

  connectedCallback() {
    /* resize previewed image */
    this.imageSizeClass = this.isPreviewed ? "previewed-image" : "";
  }

  previewMovie(event) {
    if (!this.isPreviewed) {
      console.log("previewMovie child");
      const previewImageEvent = new CustomEvent("previewmoviechange", {
        detail: {
          title: this.title,
          body: this.body,
          image: this.image,
          isPreviewed: true,
          isEditMode: false
        },
        bubbles: true,
        composed: true
      });
      // Dispatches the search event to be handled at the moviesAppManagementLayout level.
      this.dispatchEvent(previewImageEvent);
    }
  }
}
