import lookUp from "@salesforce/apex/Lookup.search";
import { api, LightningElement, track, wire } from "lwc";

export default class customLookUp extends LightningElement {
  @api objName;
  @api iconName;
  @api filter = "";
  @api searchPlaceholder = "Search";
  @api index;
  @track selectedName;
  @track records;
  @track isValueSelected;
  @track blurTimeout;
  searchTerm;
  //css
  @track boxClass =
    "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus";
  @track inputClass = "";
  @wire(lookUp, {
    searchTerm: "$searchTerm",
    myObject: "$objName",
    filter: "$filter"
  })
  wiredRecords({ error, data }) {
    if (data) {
      this.error = undefined;
      this.records = data;
    } else if (error) {
      this.error = error;
      this.records = undefined;
    }
  }

  disconnectedCallback(){
    console.log('disconnectedCallback: ', this.selectedName);
    this.handleRemovePill();
    this.searchTerm = "";
    this.selectedName = "";
  }
  handleClick() {
    this.searchTerm = "";
    this.inputClass = "slds-has-focus";
    this.boxClass =
      "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open";
  }

  onBlur() {
    this.blurTimeout = setTimeout(() => {
      this.boxClass =
        "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus";
    }, 300);
  }

  onSelect(event) {
    let selectedId = event.currentTarget.dataset.id;
    let selectedName = event.currentTarget.dataset.name;
    console.log('name:', selectedName);
    const valueSelectedEvent = new CustomEvent("lookupselected", {
      detail: {
        recordId: selectedId,
        index: this.index,
        name: selectedName
      }
    });
    this.dispatchEvent(valueSelectedEvent);
    this.isValueSelected = true;
    this.selectedName = selectedName;
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout);
    }
    this.boxClass =
      "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus";
  }

  handleRemovePill() {
    this.isValueSelected = false;
  }

  @api
  clearLookup() {
    console.log('selectedName:', this.selectedName);
    console.log('searchTerm:', this.searchTerm);
    this.isValueSelected = false;
    this.searchTerm = '';
    this.selectedName = '';
  }

  onChange(event) {
    this.searchTerm = event.target.value;
  }
}
