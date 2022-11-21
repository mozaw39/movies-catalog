import { LightningElement } from "lwc";

export default class FilterMoviesLwc extends LightningElement {
  searchInput;

  handleSearch(event) {
    const searchEvent = new CustomEvent("searchinputchange", {
      detail: event.target.value
    });
    // Dispatches the search event to parent component.
    this.dispatchEvent(searchEvent);
  }
}
