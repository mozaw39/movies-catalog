import { LightningElement } from "lwc";
import newMovie from '@salesforce/label/c.label_NewMovie';

export default class MoviesAppManagementLayout extends LightningElement {
  label = {newMovie};
  searchInput;
  layoutClass = "slds-grid slds-wrap";
  showModal = false;
  modalStyleClass;
  handleSearchInputChange(event) {
    this.searchInput = event.detail;
    this.template
      .querySelector("c-movies-results")
      .handleSearchResults(this.searchInput);
  }
  showMovieCreationPopup() {
    console.log("showMovieCreationPopup");
    this.template.querySelector("c-new-movie-modal-lwc").setShowModal(true);
  }
  handleMovieCreation(){
    this.template
      .querySelector("c-movies-results")
      .refreshMovies();
  }
}
