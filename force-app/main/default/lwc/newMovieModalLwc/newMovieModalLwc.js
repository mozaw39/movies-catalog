import { api, LightningElement, track } from "lwc";
import MOVIE_NAME from "@salesforce/schema/Movie__c.Name";
import MOVIE_BODY from "@salesforce/schema/Movie__c.Description__c";
import MOVIE_IMAGE from "@salesforce/schema/Movie__c.PosterImage__c";
import MOVIE_RATING from "@salesforce/schema/Movie__c.Rating__c";
import MOVIE_CATEGORY from "@salesforce/schema/Movie__c.Category__c";
import MOVIE_RELEASE_DATE from "@salesforce/schema/Movie__c.ReleaseDate__c";
import createMovie from "@salesforce/apex/MovieController.createMovie";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import searchActors from '@salesforce/label/c.label_SearchActors';

export default class NewMovieModalLwc extends LightningElement {
  label={searchActors};
  movieName = MOVIE_NAME;
  movieBody = MOVIE_BODY;
  movieImage = MOVIE_IMAGE;
  movieRating = MOVIE_RATING;
  movieCategory = MOVIE_CATEGORY;
  movieReleaseDate = MOVIE_RELEASE_DATE;
  /* icons to be used on the lookup components */
  addIcon = "utility:add";
  removeIcon = "utility:dash";
  /* array to control keep track of custom lookups */
  actors = [{ index: 0, id: null, name: null, iconName: this.addIcon }];
  /* used to keep track of custom lookup iteration (number of custom lookups) */
  actorsIndex = 1;
  @track
  _showModal;
  get showModal() {
    console.log("geter show modal");
    return this._showModal;
  }
  @api setShowModal(value) {
    this._showModal = value;
  }
    /* add movie action */
  handleMovieCreation(event) {
    /* prevent default behaviour of record edit form submission action */
    event.preventDefault();
    let movie = {};
    let actorsToBeCreated = [];
    /* select movie input */
    this.template
      .querySelectorAll("[data-id=form-movie-input]")
      .forEach(function (element) {
        movie[element.dataset.field] = element.value;
      });
      /* iterate on actors tracker variable to get actors ids */
    this.actors.map((actor) => {
      if (actor.id) actorsToBeCreated.push({ id: actor.id });
    });
    /* create movie + junction object with its actors */
    createMovie({ movies: [movie], actors: actorsToBeCreated })
      .then((result) => {
        this._showModal = false;
        this.dispatchToast("Success", result, "success");
        this.refreshResultData();
      })
      .catch((error) => this.dispatchToast("Error", error, "error"));
    /* */
  }
  closeModal() {
    /* close modal */
    this._showModal = false;
  }
    /* handle the account selection event (coming from custom lookup component) */
  handleAccountSelection(event) {
    let index = event.detail.index;
    let id = event.detail.recordId;
    let name = event.detail.name;
    /* manage the actors array tracker */
    if (this.actors[index]) this.actors[index].id = id;
    if (this.actors[index]) this.actors[index].name = name;
  }
  /* handle the add/remove action on lookup components */
  handleLookupAction(event) {
    let ind = event.target.dataset.index;
    let action = event.target.dataset.action;
    /* add custom lookup input */
    if (action === this.addIcon) {
      this.handleAddAction();
    } else if (action === this.removeIcon) {
      /* remove custom lookup input */
      this.handleRemoveAction(ind);
    }
  }
  /* handle remove action on lookups */
  handleRemoveAction(ind) {
    console.log('this.actors before: ', JSON.stringify(this.actors));
    console.log('current ind:', ind);
    /* clear the selected value (actor) on the removed lookup */
    this.template.querySelectorAll("c-custom-lookup-lwc").forEach((element) => {
      if (element.index === ind){
        console.log('actor to be cleared:', element.selectedName);
        element.clearLookup();
      }
    });
    /* remove lookup */
    this.actors = this.actors.filter((element) => {
      if(element.index != ind) console.log('actor to be removed:', element.name);
      return (element.index != ind);
    } );
    console.log('after deletion:', this.actors);
    /* adjust the index of the actors array tracker */
    this.actors.map((key, element) => {
      if (element.index > ind){
        this.actors[key] = { ...element, index: element.index - 1 }
        console.log('actors names:', element.name);
      }
    });
    /* this.magic(this.actors, adjustedActors); */
    this.actorsIndex--;
    /* adjust the add button */
    this.actors[this.actorsIndex - 1] = {
      ...this.actors[this.actorsIndex - 1],
      action: this.addIcon,
      iconName: this.addIcon
    };
    console.log('this.actors after: ', JSON.stringify(this.actors), this.actorsIndex);
  }
  magic(reference, array) {
    Object.assign(reference, array, { length: array.length });
}
  /* handle add action on lookups */
  handleAddAction() {
    /* change the before button action of the last lookup to "remove" */
    this.actors[this.actorsIndex - 1].action = this.removeIcon;
    this.actors[this.actorsIndex - 1].iconName = this.removeIcon;
    /* add the new lookup with add button icon */
    this.actors = [
      ...this.actors,
      {
        index: this.actorsIndex++,
        id: null,
        name: null,
        iconName: this.addIcon,
        action: this.addIcon
      }
    ];
  }

  /* send creation event to parent component/refresh result data */
  refreshResultData(){
    const event = new CustomEvent("moviecreation", {
      detail: {
      }
    });
    this.dispatchEvent(event);
  }
  // Helper
  dispatchToast(title, message, variant) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
      })
    );
  }
}
