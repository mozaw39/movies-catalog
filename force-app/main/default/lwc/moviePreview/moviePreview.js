import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import updateMovie from '@salesforce/label/c.label_UpdateMovie';
import deleteMovie from '@salesforce/label/c.label_DeleteMovie';
import MOVIE_ID from "@salesforce/schema/Movie__c.Id";
import MOVIE_NAME from "@salesforce/schema/Movie__c.Name";
import MOVIE_BODY from "@salesforce/schema/Movie__c.Description__c";
import MOVIE_IMAGE from "@salesforce/schema/Movie__c.PosterImage__c";
import MOVIE_RATING from "@salesforce/schema/Movie__c.Rating__c";
import MOVIE_CATEGORY from "@salesforce/schema/Movie__c.Category__c";
import MOVIE_RELEASE_DATE from "@salesforce/schema/Movie__c.ReleaseDate__c";
import { LightningElement, wire } from "lwc";
import { getFieldValue, getRecord, deleteRecord } from "lightning/uiRecordApi";
import {
  APPLICATION_SCOPE,
  MessageContext,
  subscribe,
  unsubscribe
} from "lightning/messageService";
import previewedMovie from "@salesforce/messageChannel/PreviewedMovie__c";
import getAllMovies from "@salesforce/apex/MovieController.getAllMovies";

const fields = [
  MOVIE_ID,
  MOVIE_NAME,
  MOVIE_BODY,
  MOVIE_IMAGE,
  MOVIE_RATING,
  MOVIE_CATEGORY,
  MOVIE_RELEASE_DATE
];

export default class MoviePreview extends LightningElement {
  label = {updateMovie, deleteMovie};
  subscription = null;
  recordId;
  movieResult;
  defaultPreviewedResult;
  //previewed movie placeholder
  previewedMovie = {
    id: null,
    title: { value: null, isValid: null },
    image: null,
    body: { value: null, isValid: null },
    category: null,
    releaseDate: null,
    isPreviewed: true,
    isEditMode: false
  };
  isEditMode = false;
  isUpdateDisabled = false;

  /* get the default previewed movie before selection from movies results */
  @wire(getAllMovies)
  getFirsPreviewedtMovie(result) {
    if (result.data) {
      this.defaultPreviewedResult = result;
      this.previewedMovie = result.data[0];
    } else {
      this.dispatchToast(
        "Error loading default previewed movie",
        result.error,
        "error"
      );
    }
  }

  // Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  /* get the previewed movie */
  @wire(MessageContext)
  messageContext;
  @wire(getRecord, { recordId: "$recordId", fields })
  wiredRecord(result) {
    if (result.data) {
      this.movieResult = result;
      this.previewedMovie = this.movieWrapper(result.data);
    } else {
      this.dispatchToast(
        "Error loading previewed movie",
        result.error,
        "error"
      );
    }
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }
  // Handler for message received from the movies results component
  handleMessage(message) {
    this.recordId = message.movieId;
    this.isEditMode = false;
  }

  // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        previewedMovie,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }
  /* wrapper of the previewed movie */
  movieWrapper(data) {
    return {
      id: getFieldValue(data, MOVIE_ID),
      title: getFieldValue(data, MOVIE_NAME),
      body: getFieldValue(data, MOVIE_BODY),
      image: getFieldValue(data, MOVIE_IMAGE),
      rating: getFieldValue(data, MOVIE_RATING),
      category: getFieldValue(data, MOVIE_CATEGORY),
      releaseDate: getFieldValue(data, MOVIE_RELEASE_DATE)
    };
  }

  handleUpdate() {
    this.isEditMode = !this.isEditMode;
  }

  handleDelete() {
    deleteRecord(this.previewedMovie.id)
      .then(() => {
        this.dispatchToast("Success", "Record deleted", "success");
        refreshApex(this.defaultPreviewedResult);
      })
      .catch((error) => {
        this.dispatchToast(
          "Error deleting record",
          error.body.message,
          "error"
        );
      });
  }

  handleCancel() {
    this.isEditMode = false;
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
}
