import { Choices, Cynaps, Tooltip } from "@cynaps/frontend-test/helpers/CF";
import {
  choicesConfig,
  choicesMultipleSelectionConfig,
  choicesSelectLayoutConfig,
  simpleData,
} from "../../data/control_tags/choice";
import { FF_DEV_2007 } from "@cynaps/frontend-test/feature-flags";

describe("Control Tags - Choice", () => {
  describe("Old version", () => {
    beforeEach(() => {
      Cynaps.addFeatureFlagsOnPageLoad({
        [FF_DEV_2007]: false,
      });
    });

    it('should show hint for <Choice /> when choice="single"', () => {
      Cynaps.params().config(choicesConfig).data(simpleData).withResult([]).init();

      Choices.findChoice("Choice 2").trigger("mouseover");
      Tooltip.hasText("A hint for Choice 2");
    });
    it('should show hint for <Choice /> when choice="multiple"', () => {
      Cynaps.params().config(choicesMultipleSelectionConfig).data(simpleData).withResult([]).init();

      Choices.findChoice("Choice 2").trigger("mouseover");
      Tooltip.hasText("A hint for Choice 2");
    });
    it('should show hint for <Choice /> when layout="select"', () => {
      Cynaps.params().config(choicesSelectLayoutConfig).data(simpleData).withResult([]).init();

      Choices.toggleSelect();
      Choices.findOption("Choice 2").trigger("mouseover", { force: true });
      Tooltip.hasText("A hint for Choice 2");
    });
  });

  describe("New version", () => {
    beforeEach(() => {
      Cynaps.addFeatureFlagsOnPageLoad({
        [FF_DEV_2007]: true,
      });
    });

    it("should show hint for <Choise />", () => {
      Cynaps.params().config(choicesConfig).data(simpleData).withResult([]).init();

      Choices.findChoice("Choice 2").trigger("mouseover");
      Tooltip.hasText("A hint for Choice 2");
    });

    it("should show hint for <Choise />", () => {
      Cynaps.params().config(choicesMultipleSelectionConfig).data(simpleData).withResult([]).init();

      Choices.findChoice("Choice 2").trigger("mouseover");
      Tooltip.hasText("A hint for Choice 2");
    });
  });
});

