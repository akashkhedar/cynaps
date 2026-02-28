import { Cynaps } from "@cynaps/frontend-test/helpers/CF";
import {
  imageData,
  imageWithBothToolsConfig,
  imageWithBrushConfig,
  imageWithRectanglesConfig,
} from "../../data/image_segmentation/initial_tool";

describe("Image - Initial tool", () => {
  it("should be set from the first avaliable tool in the config - rectangle", () => {
    Cynaps.params().config(imageWithRectanglesConfig).data(imageData).withResult([]).init();
    Cynaps.waitForObjectsReady();

    cy.window().then((win) => {
      const selectedToolName = win.Htx.annotationStore.selected.names
        .get("image")
        .getToolsManager()
        .findSelectedTool().toolName;

      expect(selectedToolName).to.equal("RectangleTool");
    });
  });

  it("should be set from the first avaliable tool in the config - brush", () => {
    Cynaps.params().config(imageWithBrushConfig).data(imageData).withResult([]).init();
    Cynaps.waitForObjectsReady();

    cy.window().then((win) => {
      const selectedToolName = win.Htx.annotationStore.selected.names
        .get("image")
        .getToolsManager()
        .findSelectedTool().toolName;

      expect(selectedToolName).to.equal("BrushTool");
    });
  });

  it("should select first tool as default", () => {
    Cynaps.params().config(imageWithBothToolsConfig).data(imageData).withResult([]).init();
    Cynaps.waitForObjectsReady();

    cy.window().then((win) => {
      const selectedToolName = win.Htx.annotationStore.selected.names
        .get("image")
        .getToolsManager()
        .findSelectedTool().toolName;

      expect(selectedToolName).to.equal("RectangleTool");
    });
  });

  it("should be able to init tool from preserved state", () => {
    Cynaps.params()
      .config(imageWithBothToolsConfig)
      .data(imageData)
      .withResult([])
      .localStorageItems({
        "selected-tool:image": "BrushTool",
      })
      .init();
    Cynaps.waitForObjectsReady();

    cy.window().then((win) => {
      const selectedToolName = win.Htx.annotationStore.selected.names
        .get("image")
        .getToolsManager()
        .findSelectedTool().toolName;

      expect(selectedToolName).to.equal("BrushTool");
    });
  });

  it("should ignore preserved state in case if tool do not exist", () => {
    Cynaps.params()
      .config(imageWithRectanglesConfig)
      .data(imageData)
      .withResult([])
      .localStorageItems({
        "selected-tool:image": "BrushTool",
      })
      .init();
    Cynaps.waitForObjectsReady();

    cy.window().then((win) => {
      const selectedToolName = win.Htx.annotationStore.selected.names
        .get("image")
        .getToolsManager()
        .findSelectedTool().toolName;

      expect(selectedToolName).to.equal("RectangleTool");
    });
  });
});

