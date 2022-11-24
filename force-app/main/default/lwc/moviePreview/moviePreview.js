import { api, LightningElement } from "lwc";

export default class MoviePreview extends LightningElement {
  //to be removed after getting the real data
  @api previewedMovie;
  isEditMode = false;

  handleUpdate(){
    console.log('update toggle');
    this.isEditMode = !this.isEditMode; 
  }

  handleDelete(){
    
  }

  handleCancel(){
    this.isEditMode = false;
  }

}
