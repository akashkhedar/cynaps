export const Relations = {
  get relations() {
    return cy.get(".cf-relations");
  },
  get relationOrderList() {
    const relationList = [];

    cy.get(".cf-relations__item").each(($el) => {
      const from = $el.find(".cf-detailed-region .cf-labels-list span").first().text().trim();
      const to = $el.find(".cf-detailed-region .cf-labels-list span").last().text().trim();
      relationList.push({ from, to });
    });

    return cy.wrap(relationList);
  },
  get relationItems() {
    return this.relations.find(".cf-relations__item");
  },
  get relationRegions() {
    return this.relationItems.find(".cf-detailed-region");
  },
  get hideAllRelationsButton() {
    return cy.get('[aria-label="Hide all"]');
  },
  get showAllRelationsButton() {
    return cy.get('[aria-label="Show all"]');
  },
  get ascendingOrderRelationButton() {
    return cy.get('[aria-label="Order by oldest"]');
  },
  get descendingOrderRelationButton() {
    return cy.get('[aria-label="Order by newest"]');
  },
  get hiddenRelations() {
    return this.relations.should("be.visible").get(".cf-relations__item_hidden .cf-relations__content");
  },
  get overlay() {
    return cy.get(".relations-overlay");
  },
  get overlayItems() {
    return this.overlay.find("g");
  },
  hasRelations(count: number) {
    cy.get(".cf-details__section-head")
      .filter((index, element) => Cypress.$(element).next(".cf-relation-controls").length > 0)
      .should("have.text", `Relations (${count})`);
  },
  hasRelation(from: string, to: string) {
    cy.get(".cf-relations").contains(from).closest(".cf-relations").contains(to);
  },
  hasHiddenRelations(count: number) {
    this.hiddenRelations.should("have.length", count);
  },
  toggleCreation() {
    cy.get('button[aria-label="Create Relation"]').click();
  },
  toggleCreationWithHotkey() {
    // hotkey is alt + r
    cy.get("body").type("{alt}r");
  },
  toggleRelationVisibility(idx) {
    cy.get(".cf-relations__item")
      .eq(idx)
      .trigger("mouseover")
      .find(".cf-relations__actions")
      .find('button[aria-label="Hide Relation"]')
      .click({ force: true });
  },
};

