import { api, LightningElement, wire } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import previewedMovie from "@salesforce/messageChannel/PreviewedMovie__c";
import MOVIE_NAME from "@salesforce/schema/Movie__c.Name";
import MOVIE_BODY from "@salesforce/schema/Movie__c.Description__c";
import MOVIE_IMAGE from "@salesforce/schema/Movie__c.PosterImage__c";
import MOVIE_RATING from "@salesforce/schema/Movie__c.Rating__c";
import MOVIE_CATEGORY from "@salesforce/schema/Movie__c.Category__c";
import MOVIE_RELEASE_DATE from "@salesforce/schema/Movie__c.ReleaseDate__c";

export default class MovieCard extends LightningElement {
  @api id;
  @api image;
  @api title;
  @api body;
  @api category;
  @api releaseDate;
  @api rating = 5;
  @api isPreviewed;
  _isEditMode;
  @api get isEditMode() {
    return this._isEditMode;
  }
  set isEditMode(value) {
    this._isEditMode = value;
  }
  recordEditFormId;
  movieName = MOVIE_NAME;
  movieBody = MOVIE_BODY;
  movieImage = MOVIE_IMAGE;
  movieRating = MOVIE_RATING;
  movieCategory = MOVIE_CATEGORY;
  movieReleaseDate = MOVIE_RELEASE_DATE;
  imageSizeClass;

  get oneStar() {
    return this.rating >= 1 && this.rating <= 5
      ? "star-checked"
      : "star-unchecked";
  }
  get twoStar() {
    return this.rating >= 2 && this.rating <= 5
      ? "star-checked"
      : "star-unchecked";
  }
  get threeStar() {
    return this.rating >= 3 && this.rating <= 5
      ? "star-checked"
      : "star-unchecked";
  }
  get forStar() {
    return this.rating === 4 || this.rating === 5
      ? "star-checked"
      : "star-unchecked";
  }
  get fiveStar() {
    return this.rating === 5 ? "star-checked" : "star-unchecked";
  }
  get whichStarIsChecked() {
    return {
      oneStar: this.oneStar,
      twoStar: this.twoStar,
      threeStar: this.threeStar,
      forStar: this.forStar,
      fiveStar: this.fiveStar
    };
  }

  @wire(MessageContext)
  messageContext;

  get isNotEditMode() {
    return !this.isEditMode;
  }

  connectedCallback() {
    /* resize previewed image */
    this.imageSizeClass = this.isPreviewed ? "previewed-image" : "";
  }

  handleload() {
    this.recordEditFormId = this.id.split("-")[0];
  }

  /* to be deleted */
  refreshValues() {
    const inputFields = this.template.querySelectorAll("lightning-input-field");
    if (inputFields) {
      inputFields.forEach((field) => {
        field.reset();
      });
    }
  }

  handleSuccess() {
    this.dispatchToast("Success", "movie updated", "success");
    // Display fresh data in the form
    this.updateMoviesResult();
  }

  handleError() {
    this.dispatchToast(
      "Something is wrong",
      "Check your input and try again.",
      "error"
    );
  }

  updateMoviesResult() {
    /*     this.previewMovie();
     */
    refreshApex(this.movieResult);
    const payload = {
      movieId: this.recordEditFormId
    };
    try {
      publish(this.messageContext, previewedMovie, payload);
    } catch (error) {
      this.dispatchToast("error", error, "error");
    }
  }

  // Helper
  dispatchToast(title, message, variant) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
      })
    );
  }

  previewMovie() {
    /*     this.recordEditFormId = this.id.split("-")[0];
     */ this.refreshValues();
    if (!this.isPreviewed) {
      const payload = {
        movieId: this.id ? this.id.split("-")[0] : ""
      };
      // Dispatches the preview event to be handled at the previewed movie level.
      publish(this.messageContext, previewedMovie, payload);
    }
  }
}
