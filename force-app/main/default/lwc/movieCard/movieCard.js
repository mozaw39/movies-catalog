import { api, LightningElement } from 'lwc';

export default class MovieCard extends LightningElement {
    @api image;
    @api title;
    @api body;
    @api isPreviewed;
    imageSizeClass;

    connectedCallback(){
        this.imageSizeClass = (this.isPreviewed)?'previewed-image':'';
    }
}