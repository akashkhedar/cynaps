import { FF_DEV_3391 } from "@cynaps/frontend-test/feature-flags";
import { Cynaps } from "@cynaps/frontend-test/helpers/CF";
import { FF_LSDV_4583 } from "../../../../src/utils/feature-flags";
import { allTagsSampleData, configAllTags } from "../../data/view_all/smoke";

beforeEach(() => {
  Cynaps.addFeatureFlagsOnPageLoad({
    [FF_DEV_3391]: true,
    [FF_LSDV_4583]: true,
  });
});

describe("View All Interactive - Smoke test", () => {
  it("Should render", () => {
    Cynaps.params().config(configAllTags).data(allTagsSampleData).withResult([]).init();

    // @TODO: Check more things
  });
});

