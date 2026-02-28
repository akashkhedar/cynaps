import {
  AudioView,
  Choices,
  Cynaps,
  Textarea,
  Number,
  ImageView,
  Paragraphs,
  Labels,
  TimeSeries,
  DateTime,
  VideoView,
  Table,
  Taxonomy,
  Ranker,
  Collapse,
} from "@cynaps/frontend-test/helpers/CF";
import { RichText } from "@cynaps/frontend-test/helpers/CF/RichText";
import { FF_BULK_ANNOTATION, FF_DEV_3873, FF_LSDV_4583 } from "../../../../src/utils/feature-flags";
import {
  allTagsConfig,
  allTagsSampleData,
  dynamicConfig,
  dynamicData,
  perItemMIGConfig,
  perRegionConfig,
  simpleMIGData,
} from "../../data/bulk_mode/smoke";

beforeEach(() => {
  Cynaps.addFeatureFlagsOnPageLoad({
    [FF_BULK_ANNOTATION]: true,
  });
});

for (const isFFDev3873 of [true, false]) {
  const ffModePostfix = isFFDev3873 ? "(new ui)" : "(old ui)";
  describe(`Bulk mode ${ffModePostfix}`, () => {
    beforeEach(() => {
      Cynaps.addFeatureFlagsOnPageLoad({
        [FF_DEV_3873]: isFFDev3873,
      });
    });
    it("should show per object classifications", () => {
      Cynaps.params()
        .config(allTagsConfig)
        .withInterface("annotation:bulk")
        .data(allTagsSampleData)
        .withResult([])
        .init();

      cy.log("Check that all tags visibility states are correct");
      AudioView.root.should("not.exist");
      Textarea.root.should("be.visible");
      Choices.root.should("be.visible");
      Choices.findChoice("choices_1").should("be.visible");
      Choices.findChoice("choices_2").should("be.visible");
      Number.root.should("be.visible");
      Labels.root.should("not.exist");
      ImageView.image.should("not.exist");
      Paragraphs.root.should("not.exist");
      RichText.root.should("not.exist");
      TimeSeries.root.should("not.exist");
      DateTime.root.should("be.visible");
      VideoView.root.should("not.exist");
      Table.root.should("not.exist");
      Taxonomy.root.should("be.visible");
      Ranker.root.should("not.exist");

      Collapse.root.should("be.visible");
      Collapse.findPanel("First panel").should("be.visible");
      Collapse.findPanel("Another panel").should("be.visible");
      // for now, it looks like that it's better to display all panels that have visible children
      Collapse.getPanelByIdx(2).should("be.visible");
      Collapse.getPanelByIdx(3).should("not.exist");

      cy.log("fill everything we can");
      Textarea.type("some text");
      Choices.findChoice("choices_1").click();
      Number.type("42");
      DateTime.type("2021-01-01");
      Taxonomy.open();
      Taxonomy.findItem("taxonomy_1").click();
      Taxonomy.close();

      cy.log("get serialized data");
      Cynaps.serialize().then((results) => {
        expect(results[0]?.value.choices).to.be.deep.equal(["choices_1"]);
        expect(results[1]?.value.number).to.be.equal(42);
        expect(results[2]?.value.datetime).to.be.equal("2021-01-01T00:00");
        expect(results[3]?.value.taxonomy).to.be.deep.equal([["taxonomy_1"]]);
      });
    });

    it("should not show per-region classifications", () => {
      Cynaps.params()
        .config(perRegionConfig)
        .withInterface("annotation:bulk")
        .data(allTagsSampleData)
        .withResult([])
        .init();

      cy.log("Check that there is nothing to render");
      cy.get(".CF-main-view__annotation div:eq(0)").should("be.empty");
    });

    it("should not show per-item classifications", () => {
      Cynaps.addFeatureFlagsOnPageLoad({
        [FF_LSDV_4583]: true,
      });

      Cynaps.params()
        .config(perItemMIGConfig)
        .withInterface("annotation:bulk")
        .data(simpleMIGData)
        .withResult([])
        .init();

      cy.log("Check that there is nothing to render");
      cy.get(".CF-main-view__annotation div:eq(0)").should("be.empty");
    });

    it("should not display dynamic things", () => {
      Cynaps.params()
        .config(dynamicConfig)
        .withInterface("annotation:bulk")
        .data(dynamicData)
        .withResult([])
        .init();

      cy.log("Check that there is nothing to render");
      cy.get(".CF-main-view__annotation div:eq(0)").should("be.empty");
    });

    it("should hide panels and buttons not related to the bulk mode", () => {
      Cynaps.params().config("<View></View>").withInterface("annotation:bulk").data({}).withResult([]).init();

      cy.get(".CF-sidepanels").should("not.exist");
      cy.get(".CF-sidepanels__wrapper").should("not.exist");

      cy.get(".CF-current-task").should("not.exist");
      cy.get(`[aria-label="Compare all annotations"]`).should("not.exist");
      cy.get(`[aria-label="Create an annotation"]`).should("not.exist");
      cy.get(".CF-annotations-carousel").should("not.exist");
      cy.get(".CF-ground-truth").should("not.exist");
    });
  });
}

