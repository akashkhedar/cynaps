import { Cynaps, ImageView, Choices, ToolBar, Modals, Sidebar } from "@cynaps/frontend-test/helpers/CF";
import {
  simpleImageChoicesConfig,
  simpleImageData,
  perTagChoicesResult,
  perTagMIGChoicesConfig,
  simpleMIGData,
  requiredPerTagMIGChoicesConfig,
  CHOICES_REQUIRED_WARNING,
  perRegionMIGChoicesConfig,
  perRegionRegionsResult,
  perRegionChoicesResult,
  requiredPerRegionMIGChoicesConfig,
  perItemMIGChoicesConfig,
  perItemChoicesResult,
  requiredPerItemMIGChoicesConfig,
} from "../../../data/control_tags/per-item";
import { commonBeforeEach } from "./common";

beforeEach(commonBeforeEach);

/* <Choices /> */
describe("Classification - single image - Choices", () => {
  it("should create result without item_index", () => {
    Cynaps.params().config(simpleImageChoicesConfig).data(simpleImageData).withResult([]).init();

    ImageView.waitForImage();

    Choices.findChoice("Choice 2").click();

    Cynaps.serialize().then((result) => {
      expect(result[0]).not.to.haveOwnProperty("item_index");
    });
  });

  it("should load perTag result correctly", () => {
    Cynaps.params().config(simpleImageChoicesConfig).data(simpleImageData).withResult(perTagChoicesResult).init();

    ImageView.waitForImage();

    Choices.hasCheckedChoice("Choice 1");

    Cynaps.serialize().then((result) => {
      expect(result[0]).to.deep.include(perTagChoicesResult[0]);
      expect(result[0]).not.to.haveOwnProperty("item_index");
    });
  });
});
describe("Classification - MIG perTag - Choices", () => {
  it("should not have item_index in result", () => {
    Cynaps.params().config(perTagMIGChoicesConfig).data(simpleMIGData).withResult([]).init();

    ImageView.waitForImage();

    Choices.findChoice("Choice 2").click();

    Cynaps.serialize().then((result) => {
      expect(result[0]).not.to.haveOwnProperty("item_index");
    });
  });

  it("should load perTag result correctly", () => {
    Cynaps.params().config(perTagMIGChoicesConfig).data(simpleMIGData).withResult(perTagChoicesResult).init();

    ImageView.waitForImage();

    Choices.hasCheckedChoice("Choice 1");

    Cynaps.serialize().then((result) => {
      expect(result[0]).to.deep.include(perTagChoicesResult[0]);
      expect(result[0]).not.to.haveOwnProperty("item_index");
    });
  });

  it("should keep value between items", () => {
    Cynaps.params().config(perTagMIGChoicesConfig).data(simpleMIGData).withResult([]).init();

    ImageView.waitForImage();

    Choices.findChoice("Choice 2").click();
    Choices.hasCheckedChoice("Choice 2");

    ImageView.paginationNextBtn.click();

    Choices.hasCheckedChoice("Choice 2");
  });

  it("should require result", () => {
    Cynaps.params().config(requiredPerTagMIGChoicesConfig).data(simpleMIGData).withResult([]).init();

    ImageView.waitForImage();

    ToolBar.updateBtn.click();
    Modals.hasWarning(CHOICES_REQUIRED_WARNING);
  });

  it("should not require result if there is one", () => {
    Cynaps.params().config(requiredPerTagMIGChoicesConfig).data(simpleMIGData).withResult([]).init();

    ImageView.waitForImage();

    Choices.findChoice("Choice 2").click();

    ToolBar.updateBtn.click();
    Modals.hasNoWarnings();
  });
});
describe("Control Tags - MIG perRegion - Choices", () => {
  it("should create result with item_index", () => {
    Cynaps.params()
      .config(perRegionMIGChoicesConfig)
      .data(simpleMIGData)
      .withResult(perRegionRegionsResult)
      .init();

    ImageView.waitForImage();
    Sidebar.hasRegions(2);

    Sidebar.findRegionByIndex(0).click();

    Choices.findChoice("Choice 2").click();

    Cynaps.serialize().then((result) => {
      expect(result.length).to.be.eq(3);
      expect(result[1]).to.include({
        type: "choices",
        item_index: 0,
      });
    });
  });

  it("should load result correctly", () => {
    Cynaps.params()
      .config(perRegionMIGChoicesConfig)
      .data(simpleMIGData)
      .withResult(perRegionChoicesResult)
      .init();

    ImageView.waitForImage();
    Sidebar.hasRegions(2);

    Sidebar.findRegionByIndex(0).click();

    Choices.hasCheckedChoice("Choice 2");

    Cynaps.serialize().then((result) => {
      const { value, ...expectedResult } = perRegionChoicesResult[1];

      expect(result.length).to.be.eq(3);
      expect(result[1]).to.deep.include(expectedResult);
      expect(result[1].value.choices).to.be.deep.eq(value.choices);
    });
  });

  it("should require result", () => {
    Cynaps.params()
      .config(requiredPerRegionMIGChoicesConfig)
      .data(simpleMIGData)
      .withResult(perRegionRegionsResult)
      .init();

    ImageView.waitForImage();

    ToolBar.updateBtn.click();
    Modals.hasWarning(CHOICES_REQUIRED_WARNING);
  });

  it("should require result for other region too", () => {
    Cynaps.params()
      .config(requiredPerRegionMIGChoicesConfig)
      .data(simpleMIGData)
      .withResult(perRegionRegionsResult)
      .init();

    ImageView.waitForImage();

    Sidebar.findRegionByIndex(0).click();
    Choices.findChoice("Choice 2").click();

    ToolBar.updateBtn.click();
    Modals.hasWarning(CHOICES_REQUIRED_WARNING);
  });

  it("should not require result if there are all of them", () => {
    Cynaps.params()
      .config(requiredPerRegionMIGChoicesConfig)
      .data(simpleMIGData)
      .withResult(perRegionRegionsResult)
      .init();

    ImageView.waitForImage();

    Sidebar.findRegionByIndex(0).click();
    Choices.findChoice("Choice 2").click();

    Sidebar.findRegionByIndex(1).click();
    ImageView.waitForImage();
    Choices.findChoice("Choice 3").click();

    ToolBar.updateBtn.click();
    Modals.hasNoWarnings();
  });
});
describe("Control Tags - MIG perItem - Choices", () => {
  it("should create result with item_index", () => {
    Cynaps.params().config(perItemMIGChoicesConfig).data(simpleMIGData).withResult([]).init();

    ImageView.waitForImage();

    Choices.findChoice("Choice 2").click();

    Cynaps.serialize().then((result) => {
      expect(result[0]).to.have.property("item_index", 0);
    });
  });

  it("should load perItem result correctly", () => {
    Cynaps.params().config(perItemMIGChoicesConfig).data(simpleMIGData).withResult(perItemChoicesResult).init();

    ImageView.waitForImage();

    Choices.hasCheckedChoice("Choice 1");
    ImageView.paginationNextBtn.click();
    Choices.hasCheckedChoice("Choice 2");
    ImageView.paginationNextBtn.click();
    Choices.hasCheckedChoice("Choice 3");

    Cynaps.serialize().then((result) => {
      expect(result[0]).to.deep.include(perItemChoicesResult[0]);
      expect(result[1]).to.deep.include(perItemChoicesResult[1]);
      expect(result[2]).to.deep.include(perItemChoicesResult[2]);
    });
  });

  it("should be able to create result for second item", () => {
    Cynaps.params().config(perItemMIGChoicesConfig).data(simpleMIGData).withResult([]).init();

    ImageView.waitForImage();

    ImageView.paginationNextBtn.click();
    ImageView.waitForImage();

    Choices.findChoice("Choice 2").click();

    Cynaps.serialize().then((result) => {
      expect(result[0]).to.have.property("item_index", 1);
    });
  });

  it("should be able to create more that one result", () => {
    Cynaps.params().config(perItemMIGChoicesConfig).data(simpleMIGData).withResult([]).init();

    ImageView.waitForImage();

    Choices.findChoice("Choice 1").click();

    ImageView.paginationNextBtn.click();
    ImageView.waitForImage();
    Choices.findChoice("Choice 2").click();

    ImageView.paginationNextBtn.click();
    ImageView.waitForImage();
    Choices.findChoice("Choice 3").click();

    Cynaps.serialize().then((result) => {
      expect(result[0]).to.include({ item_index: 0 });
      expect(result[0]).to.nested.include({ "value.choices[0]": "Choice 1" });

      expect(result[1]).to.include({ item_index: 1 });
      expect(result[1]).to.nested.include({ "value.choices[0]": "Choice 2" });

      expect(result[2]).to.include({ item_index: 2 });
      expect(result[2]).to.nested.include({ "value.choices[0]": "Choice 3" });
    });
  });

  it("should require result", () => {
    Cynaps.params()
      .config(requiredPerItemMIGChoicesConfig)
      .data(simpleMIGData)
      .withResult(perRegionRegionsResult)
      .init();

    ImageView.waitForImage();

    ToolBar.updateBtn.click();
    Modals.hasWarning(CHOICES_REQUIRED_WARNING);
  });

  it("should require result for other region too", () => {
    Cynaps.params()
      .config(requiredPerItemMIGChoicesConfig)
      .data(simpleMIGData)
      .withResult(perRegionRegionsResult)
      .init();

    ImageView.waitForImage();

    Choices.findChoice("Choice 2").click();

    ToolBar.updateBtn.click();
    Modals.hasWarning(CHOICES_REQUIRED_WARNING);
  });

  it("should not require result if there are all of them", () => {
    Cynaps.params()
      .config(requiredPerItemMIGChoicesConfig)
      .data(simpleMIGData)
      .withResult(perRegionRegionsResult)
      .init();

    ImageView.waitForImage();

    Choices.findChoice("Choice 2").click();
    ImageView.paginationNextBtn.click();
    ImageView.waitForImage();

    Choices.findChoice("Choice 2").click();
    ImageView.paginationNextBtn.click();
    ImageView.waitForImage();

    Choices.findChoice("Choice 2").click();
    ImageView.paginationNextBtn.click();
    ImageView.waitForImage();

    Choices.findChoice("Choice 2").click();

    ToolBar.updateBtn.click();
    Modals.hasNoWarnings();
  });
});

