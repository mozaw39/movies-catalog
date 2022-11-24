import { LightningElement } from "lwc";

export default class MoviesAppManagementLayout extends LightningElement {
  searchInput;
  previewedMovie = {
    title: null,
    image: null,
    body: null,
    isPreviewed: true,
    isEditMode: false
  };

  handlePreviewMovieInit(event) {
    this.previewedMovie = {
      ...this.previewedMovie,
      title: event.detail.title,
      image: event.detail.image,
      body: event.detail.body
    };
  }

  handleSearchInputChange(event) {
    this.searchInput = event.detail;
    this.template
      .querySelector("c-movies-results")
      .handleSearchResults(this.searchInput);
  }

  handlePreviewMovie(event) {
    console.log("handlePrieviewMovie parent:", event.detail);
    this.previewedMovie = event.detail;
  }

  handleTextChange(event) {
    var label = event.detail.label;
    this.previewedMovie[label] = event.detail.text;
  }
}
