import { api, LightningElement } from "lwc";

const imageSrc =
  "https://resizing.flixster.com/IaXbRF4gIPh9jireK_4VCPNfdKc=/489x0/v2/https://resizing.flixster.com/VEqpmXsAtewTG2T4sLMh6G8K0YA=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzZlODAyN2E4LTFhODctNGU0Mi04Y2M4LTMwMDI4MjBhODRiYy5qcGc=";

export default class MoviePreview extends LightningElement {
  iurl = imageSrc;
  @api previewedMovie;
}
