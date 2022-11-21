import { api, LightningElement } from "lwc";
const imageSrc =
  "https://resizing.flixster.com/IaXbRF4gIPh9jireK_4VCPNfdKc=/489x0/v2/https://resizing.flixster.com/VEqpmXsAtewTG2T4sLMh6G8K0YA=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzZlODAyN2E4LTFhODctNGU0Mi04Y2M4LTMwMDI4MjBhODRiYy5qcGc=";
const MOVIES = [
  { title: "title1", image: imageSrc, rating: 4, body: "body test1" },
  { title: "title2", image: imageSrc, rating: 4, body: "body test2" },
  { title: "title3", image: imageSrc, rating: 4, body: "body test3" },
  { title: "title4", image: imageSrc, rating: 4, body: "body test4" },
  { title: "title5", image: imageSrc, rating: 4, body: "body test5" },
  { title: "title6", image: imageSrc, rating: 4, body: "body test6" },
  { title: "title7", image: imageSrc, rating: 4, body: "body test7" },
  { title: "title8", image: imageSrc, rating: 4, body: "body test8" },
  { title: "title9", image: imageSrc, rating: 4, body: "body test9" },
  { title: "title9", image: imageSrc, rating: 4, body: "body test9" },
  { title: "title9", image: imageSrc, rating: 4, body: "body test9" }
];

export default class MoviesResults extends LightningElement {
  iurl = imageSrc;
  movies = MOVIES;

  @api
  handleSearchResults(searchText) {
    this.movies = MOVIES.filter((movie) => movie.title.toLowerCase().includes(searchText.toLowerCase()));
  }
}
