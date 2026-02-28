import { Cynaps } from "@cynaps/frontend-test/helpers/CF";
import { FF_LSDV_4583 } from "../../../../../src/utils/feature-flags";

export const commonBeforeEach = () => {
  Cynaps.addFeatureFlagsOnPageLoad({
    [FF_LSDV_4583]: true,
  });
};

