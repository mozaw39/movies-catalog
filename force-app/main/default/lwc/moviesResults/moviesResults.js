import getAllMovies from "@salesforce/apex/MovieController.getAllMovies";
import {
  publish,
  MessageContext,
  APPLICATION_SCOPE,
  subscribe,
  unsubscribe
} from "lightning/messageService";
import { api, LightningElement, wire } from "lwc";
import previewedMovie from "@salesforce/messageChannel/PreviewedMovie__c";
import { refreshApex } from "@salesforce/apex";

export default class MoviesResults extends LightningElement {
  subscription = null;
  moviesResult;
  movies;
  filteredMovies;
  error;

  @wire(MessageContext)
  messageContext;

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  connectedCallback(){
    if (this.movies && this.movies.length > 0) {
      const payload = {
        movieId: (this.movies[0].id)?this.movies[0].id.split("-")[0]:''
      };
      // Dispatches the preview event to be handled at the previewed movie level.
      publish(this.messageContext, previewedMovie, payload);
    }
  }

  renderedCallback() {
    this.subscribeToMessageChannel();
  }

  @wire(getAllMovies)
  getMovies(result) {
    if (result.data) {
      this.moviesResult = result;
      this.movies = result.data;
      //filter movies with no poster image
      /* this.movies = this.movies.filter(
        (movie) => movie.image && movie.image !== ""
      ); */
      this.filteredMovies = this.movies;
    } else {
      console.log(result.error);
      this.error = result.error;
    }
  }
  @api
  refreshMovies() {
    console.log('refreshMovies');
    refreshApex(this.moviesResult);
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        previewedMovie,
        (message) => this.refreshMovies(),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  @api
  handleSearchResults(searchText) {
    this.filteredMovies = this.movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}
