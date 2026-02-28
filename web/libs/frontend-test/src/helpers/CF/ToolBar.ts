import { Cynaps } from "@cynaps/frontend-test/helpers/CF/Cynaps";
import { FF_DEV_3873 } from "../../../../editor/src/utils/feature-flags";

export const ToolBar = {
  _controlsSelector: ".cf-controls",

  get sectionOne() {
    return cy.get(".cf-topbar").find(".cf-topbar__group").eq(0);
  },

  get sectionTwo() {
    return Cynaps.getFeatureFlag(FF_DEV_3873).then((isFFDEV3873) => {
      if (isFFDEV3873) {
        return cy.get(".cf-bottombar");
      }

      return cy.get(".cf-topbar");
    });
  },

  get controls() {
    return this.sectionTwo.find(this._controlsSelector);
  },

  get controlButtons() {
    return this.controls.find("button");
  },

  get viewAllBtn() {
    return this.sectionOne.find('[aria-label="Compare all annotations"]');
  },

  get submitBtn() {
    return this.sectionTwo.find('[aria-label="Submit current annotation"]');
  },

  get updateBtn() {
    return this.sectionTwo.find('[aria-label="Update current annotation"]');
  },

  get annotationDropdownTrigger() {
    return this.sectionOne.find(".cf-annotation-button__trigger");
  },

  get dropdownMenu() {
    return cy.get(".cf-dropdown");
  },

  clickCopyAnnotationBtn() {
    return Cynaps.getFeatureFlag(FF_DEV_3873).then((isFFDEV3873) => {
      if (isFFDEV3873) {
        this.annotationDropdownTrigger.click();
        this.dropdownMenu.find('[class*="option--"]').contains("Duplicate Annotation").click();
        return void 0;
      }

      this.sectionOne.find('[aria-label="Copy Annotation"]').click();
    });
  },
};

