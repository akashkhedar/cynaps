import { ImageView, Cynaps, Sidebar } from "@cynaps/frontend-test/helpers/CF";
import { simpleConfig, simpleImageData, simpleResult } from "../../data/image_segmentation/layers";

describe("Image Segmentation - Layers", () => {
  it("should keep selected region over unselected one", () => {
    Cynaps.params().config(simpleConfig).data(simpleImageData).withResult(simpleResult).init();

    ImageView.waitForImage();
    Sidebar.hasRegions(2);
    Sidebar.toggleRegionSelection(0);

    Sidebar.hasSelectedRegions(1);

    // A selected region should be over all unselected regions,
    // so the test should click in it and clear selection
    ImageView.clickAtRelative(0.5, 0.5);

    Sidebar.hasSelectedRegions(0);
  });
});

