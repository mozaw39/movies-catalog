import { LightningElement } from "lwc";

export default class MoviesAppManagementLayout extends LightningElement {
  searchInput;
  previewedMovie = { title: null, image: null, body: null };

  handleSearchInputChange(event) {
    this.searchInput = event.detail;
    this.template
      .querySelector("c-movies-results")
      .handleSearchResults(this.searchInput);
  }

  handlePreviewMovie(event) {
    console.log("handlePrieviewMovie parent:", event.detail);
    this.previewedMovie = event.detail;
    console.log("previewedMovie:", this.previewedMovie.title);
  }
}
