import { LightningElement, api } from "lwc";

export default class RatingComponent extends LightningElement {
  @api name;
  @api checkedStar = 5;

  get whichStarIsChecked() {
    switch (this.checkedStar) {
      case 1:
        return {
          oneStar: "star-checked",
          twoStar: "star-unchecked",
          threeStar: "star-unchecked",
          forStar: "star-unchecked",
          fiveStar: "star-unchecked"
        };
      case 2:
        return {
          oneStar: "star-checked",
          twoStar: "star-checked",
          threeStar: "star-unchecked",
          forStar: "star-unchecked",
          fiveStar: "star-unchecked"
        };
      case 3:
        return {
          oneStar: "star-checked",
          twoStar: "star-checked",
          threeStar: "star-checked",
          forStar: "star-unchecked",
          fiveStar: "star-unchecked"
        };
      case 4:
        return {
          oneStar: "star-checked",
          twoStar: "star-checked",
          threeStar: "star-checked",
          forStar: "star-checked",
          fiveStar: "star-unchecked"
        };
      case 5:
        return {
          oneStar: "star-checked",
          twoStar: "star-checked",
          threeStar: "star-checked",
          forStar: "star-checked",
          fiveStar: "star-checked"
        };
      default:
        return {
          oneStar: "star-unchecked",
          twoStar: "star-unchecked",
          threeStar: "star-unchecked",
          forStar: "star-unchecked",
          fiveStar: "star-unchecked"
        };
        break;
    }
  }

  get options() {
    return [
      { label: "★", value: 1 },

      { label: "★", value: 2 },

      { label: "★", value: 3 },

      { label: "★", value: 4 },

      { label: "★", value: 5 }
    ];
  }
}
