import { Cynaps } from "@cynaps/frontend-test/helpers/CF";

describe("Feature Flags", () => {
  it("can set feature flags on the global object", () => {
    const flagName = "customFeatureFlag";
    const anotherFlag = "anotherFlag";

    cy.visit("/");

    Cynaps.setFeatureFlags({
      [flagName]: true,
    });

    Cynaps.featureFlag(flagName).should("be.true");
    Cynaps.featureFlag(anotherFlag).should("be.false");
  });

  it("can set feature flags before navigation", () => {
    // setting only this flag
    const flagName = "customFeatureFlag";
    const anotherFlag = "anotherFlag";

    Cynaps.setFeatureFlagsOnPageLoad({
      [flagName]: true,
    });

    cy.visit("/");

    Cynaps.featureFlag(flagName).should("be.true");
    Cynaps.featureFlag(anotherFlag).should("be.false");
  });

  // helpers' self-testing to keep it clear
  it("can extend previously set flag list and set them all before navigation", () => {
    // setting only this flag
    const setFlagName = "setFlag";
    const setButCanceledFlag = "setButCanceledFlag";
    const addedFlagName = "addedFlag";

    Cynaps.setFeatureFlagsOnPageLoad({
      [setFlagName]: true,
      [setButCanceledFlag]: true,
    });

    Cynaps.addFeatureFlagsOnPageLoad({
      [setButCanceledFlag]: false,
      [addedFlagName]: true,
    });

    cy.visit("/");

    Cynaps.featureFlag(setFlagName).should("be.true");
    Cynaps.featureFlag(setButCanceledFlag).should("be.false");
    Cynaps.featureFlag(addedFlagName).should("be.true");
  });
});

