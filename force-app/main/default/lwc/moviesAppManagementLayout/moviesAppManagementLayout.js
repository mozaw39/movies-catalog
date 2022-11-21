import { LightningElement } from "lwc";

export default class MoviesAppManagementLayout extends LightningElement {
  searchInput;
  previewedMovie;

  handleSearchInputChange(event) {
    this.searchInput = event.detail;
    this.template
      .querySelector("c-movies-results")
      .handleSearchResults(this.searchInput);
  }

  handlePreviewMovie(event) {
    console.log('handlePrieviewMovie parent:',event.detail);
    this.previewedMovie = event.detail;
  }
}
