import { Labels, Cynaps, Relations, Sidebar } from "@cynaps/frontend-test/helpers/CF";
import { FF_DEV_3873 } from "../../../../src/utils/feature-flags";
import {
  Cynaps_settings,
  panelState,
  resultWithRelations,
  simpleConfig,
  simpleData,
} from "../../data/outliner/region-index";
import { RichText } from "@cynaps/frontend-test/helpers/CF/RichText";
import { Hotkeys } from "@cynaps/frontend-test/helpers/CF/Hotkeys";

describe("Region Index", () => {
  beforeEach(() => {
    Cynaps.addFeatureFlagsOnPageLoad({
      [FF_DEV_3873]: true,
    });
  });
  it("should be visible at the outliner", () => {
    Cynaps.params().config(simpleConfig).data(simpleData).withResult(resultWithRelations).init();
    Cynaps.waitForObjectsReady();

    Sidebar.findByRegionIndex(1).should("contain", "Label 1");
    Sidebar.findByRegionIndex(3).should("contain", "Label 3");
  });

  it("should depends on the order of the regions", () => {
    Cynaps.params().config(simpleConfig).data(simpleData).withResult(resultWithRelations).init();
    Cynaps.waitForObjectsReady();

    Sidebar.toggleOrderByTime();
    Sidebar.findByRegionIndex(1).should("contain", "Label 3");
    Sidebar.findByRegionIndex(3).should("contain", "Label 1");
  });

  it("should affect the labels on region on changing order", () => {
    Cynaps.params()
      .config(simpleConfig)
      .data(simpleData)
      .withResult(resultWithRelations)
      .withLocalStorageItem("Cynaps:settings", Cynaps_settings)
      .init();

    Cynaps.waitForObjectsReady();

    Sidebar.toggleOrderByTime();

    RichText.hasRegionWithLabel("1:Label 3");
    RichText.hasRegionWithLabel("2:Label 2");
    RichText.hasRegionWithLabel("3:Label 1");
  });

  it("should be displayed in region's label", () => {
    Cynaps.params()
      .config(simpleConfig)
      .data(simpleData)
      .withResult(resultWithRelations)
      .localStorageItems({
        "Cynaps:settings": Cynaps_settings,
      })
      .init();

    RichText.hasRegionWithLabel("1:Label 1");
    RichText.hasRegionWithLabel("2:Label 2");
    RichText.hasRegionWithLabel("3:Label 3");
  });

  it("should not depend on the visibility of the region panel", () => {
    Cynaps.params()
      .config(simpleConfig)
      .data(simpleData)
      .withResult(resultWithRelations)
      .localStorageItems({
        panelState,
        "Cynaps:settings": Cynaps_settings,
      })
      .init();
    Cynaps.waitForObjectsReady();

    RichText.hasRegionWithLabel("1:Label 1");
    RichText.hasRegionWithLabel("2:Label 2");
    RichText.hasRegionWithLabel("3:Label 3");
  });

  it("should be displayed on relations panel", () => {
    Cynaps.params()
      .config(simpleConfig)
      .data(simpleData)
      .withResult(resultWithRelations)
      .localStorageItems({
        panelState,
        "Cynaps:settings": Cynaps_settings,
      })
      .init();
    Cynaps.waitForObjectsReady();

    Relations.relationRegions.eq(0).contains(".CF-detailed-region__index", "1").should("exist");
    Relations.relationRegions.eq(1).contains(".CF-detailed-region__index", "3").should("exist");
  });

  it("should be consistent on region delete / create", () => {
    Cynaps.params()
      .config(simpleConfig)
      .data(simpleData)
      .withResult(resultWithRelations)
      .localStorageItems({
        panelState,
        "Cynaps:settings": Cynaps_settings,
      })
      .init();
    Cynaps.waitForObjectsReady();

    RichText.hasRegionWithLabel("1:Label 1");
    RichText.hasRegionWithLabel("2:Label 2");
    RichText.hasRegionWithLabel("3:Label 3");

    RichText.findRegionWithLabel("2:Label 2").trigger("click");
    Hotkeys.deleteRegion();
    RichText.hasRegionWithLabel("1:Label 1");
    RichText.hasRegionWithLabel("2:Label 3");

    Labels.select("Label 2");
    RichText.selectText("is");
    RichText.hasRegionWithLabel("3:Label 2");
  });

  it("should be consistent on region delete / create with full list affected by change", () => {
    Cynaps.params()
      .config(simpleConfig)
      .data(simpleData)
      .withResult(resultWithRelations)
      .localStorageItems({
        panelState,
        "Cynaps:settings": Cynaps_settings,
        "outliner:sort": "date",
        "outliner:sort-direction": "desc",
      })
      .init();
    Cynaps.waitForObjectsReady();

    RichText.hasRegionWithLabel("3:Label 1");
    RichText.hasRegionWithLabel("2:Label 2");
    RichText.hasRegionWithLabel("1:Label 3");

    RichText.findRegionWithLabel("2:Label 2").trigger("click");
    Hotkeys.deleteRegion();
    RichText.hasRegionWithLabel("2:Label 1");
    RichText.hasRegionWithLabel("1:Label 3");

    Labels.select("Label 2");
    RichText.selectText("is");

    RichText.hasRegionWithLabel("3:Label 1");
    RichText.hasRegionWithLabel("2:Label 3");
    RichText.hasRegionWithLabel("1:Label 2");
  });

  it("should work with history traveling", () => {
    Cynaps.params()
      .config(simpleConfig)
      .data(simpleData)
      .withResult(resultWithRelations)
      .localStorageItems({
        "Cynaps:settings": Cynaps_settings,
      })
      .init();
    Cynaps.waitForObjectsReady();

    RichText.findRegionWithLabel("2:Label 2").trigger("click");
    Hotkeys.deleteRegion();

    cy.wait(1);
    Hotkeys.undo();
    cy.wait(1);
    Hotkeys.redo();
  });
});

