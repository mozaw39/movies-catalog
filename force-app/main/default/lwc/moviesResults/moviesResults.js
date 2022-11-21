import { api, LightningElement } from "lwc";
const imageSrc =
  "https://resizing.flixster.com/IaXbRF4gIPh9jireK_4VCPNfdKc=/489x0/v2/https://resizing.flixster.com/VEqpmXsAtewTG2T4sLMh6G8K0YA=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzZlODAyN2E4LTFhODctNGU0Mi04Y2M4LTMwMDI4MjBhODRiYy5qcGc=";
const MOVIES = [
  { title: "title2", image: imageSrc, rating: 4, body: "body test" },
  { title: "title2", image: imageSrc, rating: 4, body: "body test" },
  { title: "title1", image: imageSrc, rating: 4, body: "body test" },
  { title: "title2", image: imageSrc, rating: 4, body: "body test" },
  { title: "title1", image: imageSrc, rating: 4, body: "body test" },
  { title: "title1", image: imageSrc, rating: 4, body: "body test" },
  { title: "title1", image: imageSrc, rating: 4, body: "body test" },
  { title: "title1", image: imageSrc, rating: 4, body: "body test" },
  { title: "title1", image: imageSrc, rating: 4, body: "body test" },
  { title: "title1", image: imageSrc, rating: 4, body: "body test" },
  { title: "title3", image: imageSrc, rating: 4, body: "body test" }
];

export default class MoviesResults extends LightningElement {
  iurl = imageSrc;
  movies = MOVIES;

  @api
  handleSearchResults(searchText) {
    this.movies = MOVIES.filter((movie) => movie.title.includes(searchText));
  }
}
