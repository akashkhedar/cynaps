import { Cynaps, ImageView, Rating, ToolBar, Modals, Sidebar } from "@cynaps/frontend-test/helpers/CF";
import {
  simpleImageRatingConfig,
  simpleImageData,
  perTagRatingResult,
  perTagMIGRatingConfig,
  simpleMIGData,
  requiredPerTagMIGRatingConfig,
  RATING_REQUIRED_WARNING,
  perRegionMIGRatingConfig,
  perRegionRegionsResult,
  perRegionRatingResult,
  requiredPerRegionMIGRatingConfig,
  perItemMIGRatingConfig,
  perItemRatingResult,
  requiredPerItemMIGRatingConfig,
} from "../../../data/control_tags/per-item";
import { commonBeforeEach } from "./common";

beforeEach(commonBeforeEach);

/* <Rating /> */
describe("Classification - single image - Rating", () => {
  it("should create result without item_index", () => {
    Cynaps.params().config(simpleImageRatingConfig).data(simpleImageData).withResult([]).init();

    ImageView.waitForImage();

    Rating.setValue(4);

    Cynaps.serialize().then((result) => {
      expect(result[0]).not.to.haveOwnProperty("item_index");
    });
  });

  it("should load perTag result correctly", () => {
    Cynaps.params().config(simpleImageRatingConfig).data(simpleImageData).withResult(perTagRatingResult).init();

    ImageView.waitForImage();

    Rating.hasValue(4);

    Cynaps.serialize().then((result) => {
      expect(result[0]).to.deep.include(perTagRatingResult[0]);
      expect(result[0]).not.to.haveOwnProperty("item_index");
    });
  });
});
describe("Classification - MIG perTag - Rating", () => {
  it("should not have item_index in result", () => {
    Cynaps.params().config(perTagMIGRatingConfig).data(simpleMIGData).withResult([]).init();

    ImageView.waitForImage();

    Rating.setValue(4);

    Cynaps.serialize().then((result) => {
      expect(result[0]).not.to.haveOwnProperty("item_index");
    });
  });

  it("should load perTag result correctly", () => {
    Cynaps.params().config(perTagMIGRatingConfig).data(simpleMIGData).withResult(perTagRatingResult).init();

    ImageView.waitForImage();

    Rating.hasValue(4);

    Cynaps.serialize().then((result) => {
      expect(result[0]).to.deep.include(perTagRatingResult[0]);
      expect(result[0]).not.to.haveOwnProperty("item_index");
    });
  });

  it("should keep value between items", () => {
    Cynaps.params().config(perTagMIGRatingConfig).data(simpleMIGData).withResult([]).init();

    ImageView.waitForImage();

    Rating.setValue(4);
    Rating.hasValue(4);

    ImageView.paginationNextBtn.click();

    Rating.hasValue(4);
  });

  it("should require result", () => {
    Cynaps.params().config(requiredPerTagMIGRatingConfig).data(simpleMIGData).withResult([]).init();

    ImageView.waitForImage();

    ToolBar.updateBtn.click();
    Modals.hasWarning(RATING_REQUIRED_WARNING);
  });

  it("should not require result if there is one", () => {
    Cynaps.params().config(requiredPerTagMIGRatingConfig).data(simpleMIGData).withResult([]).init();

    ImageView.waitForImage();

    Rating.setValue(4);

    ToolBar.updateBtn.click();
    Modals.hasNoWarnings();
  });
});
describe("Control Tags - MIG perRegion - Rating", () => {
  it("should create result with item_index", () => {
    Cynaps.params().config(perRegionMIGRatingConfig).data(simpleMIGData).withResult(perRegionRegionsResult).init();

    ImageView.waitForImage();
    Sidebar.hasRegions(2);

    Sidebar.findRegionByIndex(0).click();

    Rating.setValue(4);

    Cynaps.serialize().then((result) => {
      expect(result.length).to.be.eq(3);
      expect(result[1]).to.include({
        type: "rating",
        item_index: 0,
      });
    });
  });

  it("should load result correctly", () => {
    Cynaps.params().config(perRegionMIGRatingConfig).data(simpleMIGData).withResult(perRegionRatingResult).init();

    ImageView.waitForImage();
    Sidebar.hasRegions(2);

    Sidebar.findRegionByIndex(0).click();

    Rating.hasValue(4);

    Cynaps.serialize().then((result) => {
      const { value, ...expectedResult } = perRegionRatingResult[1];

      expect(result.length).to.be.eq(3);
      expect(result[1]).to.deep.include(expectedResult);
      expect(result[1].value.rating).to.be.deep.eq(value.rating);
    });
  });

  it("should require result", () => {
    Cynaps.params()
      .config(requiredPerRegionMIGRatingConfig)
      .data(simpleMIGData)
      .withResult(perRegionRegionsResult)
      .init();

    ImageView.waitForImage();

    ToolBar.updateBtn.click();
    Modals.hasWarning(RATING_REQUIRED_WARNING);
  });

  it("should require result for other region too", () => {
    Cynaps.params()
      .config(requiredPerRegionMIGRatingConfig)
      .data(simpleMIGData)
      .withResult(perRegionRegionsResult)
      .init();

    ImageView.waitForImage();

    Sidebar.findRegionByIndex(0).click();
    Rating.setValue(4);

    ToolBar.updateBtn.click();
    Modals.hasWarning(RATING_REQUIRED_WARNING);
  });

  it("should not require result if there are all of them", () => {
    Cynaps.params()
      .config(requiredPerRegionMIGRatingConfig)
      .data(simpleMIGData)
      .withResult(perRegionRegionsResult)
      .init();

    ImageView.waitForImage();

    Sidebar.findRegionByIndex(0).click();
    Rating.setValue(3);

    Sidebar.findRegionByIndex(1).click();
    ImageView.waitForImage();
    Rating.setValue(4);

    ToolBar.updateBtn.click();
    Modals.hasNoWarnings();
  });
});
describe("Control Tags - MIG perItem - Rating", () => {
  it("should create result with item_index", () => {
    Cynaps.params().config(perItemMIGRatingConfig).data(simpleMIGData).withResult([]).init();

    ImageView.waitForImage();

    Rating.setValue(4);

    Cynaps.serialize().then((result) => {
      expect(result[0]).to.have.property("item_index", 0);
    });
  });

  it("should load perItem result correctly", () => {
    Cynaps.params().config(perItemMIGRatingConfig).data(simpleMIGData).withResult(perItemRatingResult).init();

    ImageView.waitForImage();

    Rating.hasValue(3);
    ImageView.paginationNextBtn.click();
    Rating.hasValue(4);
    ImageView.paginationNextBtn.click();
    Rating.hasValue(5);

    Cynaps.serialize().then((result) => {
      expect(result[0]).to.deep.include(perItemRatingResult[0]);
      expect(result[1]).to.deep.include(perItemRatingResult[1]);
      expect(result[2]).to.deep.include(perItemRatingResult[2]);
    });
  });

  it("should be able to create result for second item", () => {
    Cynaps.params().config(perItemMIGRatingConfig).data(simpleMIGData).withResult([]).init();

    ImageView.waitForImage();

    ImageView.paginationNextBtn.click();
    ImageView.waitForImage();

    Rating.setValue(4);

    Cynaps.serialize().then((result) => {
      expect(result[0]).to.have.property("item_index", 1);
    });
  });

  it("should be able to create more that one result", () => {
    Cynaps.params().config(perItemMIGRatingConfig).data(simpleMIGData).withResult([]).init();

    ImageView.waitForImage();

    Rating.setValue(3);

    ImageView.paginationNextBtn.click();
    ImageView.waitForImage();
    Rating.setValue(4);

    ImageView.paginationNextBtn.click();
    ImageView.waitForImage();
    Rating.setValue(5);

    Cynaps.serialize().then((result) => {
      expect(result[0]).to.include({ item_index: 0 });
      expect(result[0]).to.nested.include({ "value.rating": 3 });

      expect(result[1]).to.include({ item_index: 1 });
      expect(result[1]).to.nested.include({ "value.rating": 4 });

      expect(result[2]).to.include({ item_index: 2 });
      expect(result[2]).to.nested.include({ "value.rating": 5 });
    });
  });

  it("should require result", () => {
    Cynaps.params()
      .config(requiredPerItemMIGRatingConfig)
      .data(simpleMIGData)
      .withResult(perRegionRegionsResult)
      .init();

    ImageView.waitForImage();

    ToolBar.updateBtn.click();
    Modals.hasWarning(RATING_REQUIRED_WARNING);
  });

  it("should require result for other region too", () => {
    Cynaps.params()
      .config(requiredPerItemMIGRatingConfig)
      .data(simpleMIGData)
      .withResult(perRegionRegionsResult)
      .init();

    ImageView.waitForImage();

    Rating.setValue(4);

    ToolBar.updateBtn.click();
    Modals.hasWarning(RATING_REQUIRED_WARNING);
  });

  it("should not require result if there are all of them", () => {
    Cynaps.params()
      .config(requiredPerItemMIGRatingConfig)
      .data(simpleMIGData)
      .withResult(perRegionRegionsResult)
      .init();

    ImageView.waitForImage();

    Rating.setValue(3);
    ImageView.paginationNextBtn.click();
    ImageView.waitForImage();

    Rating.setValue(4);
    ImageView.paginationNextBtn.click();
    ImageView.waitForImage();

    Rating.setValue(5);
    ImageView.paginationNextBtn.click();
    ImageView.waitForImage();

    Rating.setValue(1);

    ToolBar.updateBtn.click();
    Modals.hasNoWarnings();
  });
});

