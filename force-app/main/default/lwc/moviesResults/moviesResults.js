import getMovies from "@salesforce/apex/MovieUtility.getMovies";
import { api, LightningElement, wire } from "lwc";

export default class MoviesResults extends LightningElement {
  moviesResult;
  movies;
  filteredMovies;
  error;

  renderedCallback() {
    //send event to init preview message
    if (this.movies && this.movies.length > 0) {
      const initPreviewMovieEvent = new CustomEvent("initpreviewmoviechange", {
        detail: {
          title: this.movies[0].title,
          body: this.movies[0].body,
          image: this.movies[0].image,
          isPreviewed: true,
          isEditMode: false
        }
      });
      // Dispatches the init preview movie event to be handled at the moviesAppManagementLayout level.
      this.dispatchEvent(initPreviewMovieEvent);
    }
  }

  @wire(getMovies)
  getMovies(result) {
    if (result.data) {
      this.moviesResult = result;
      this.movies = result.data.map((movie) => ({
        title: movie.Name,
        body: movie.Name,
        image: movie.PosterImage__c
      }));
      //filter movies with no poster image
      this.movies = this.movies.filter(
        (movie) => movie.image && movie.image !== ""
      );
      this.filteredMovies = this.movies;
    } else {
      console.log(result.error);
      this.error = result.error;
    }
  }

  @api
  handleSearchResults(searchText) {
    this.filteredMovies = this.movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchText.toLowerCase())
    );
    console.log("search:", this.movies);
  }
}
