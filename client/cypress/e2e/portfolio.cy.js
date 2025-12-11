describe("Portfolio E2E Test", () => {
  it("loads home page and navigates through main sections", () => {
    // 1) Home page
    cy.visit("/");

    // Hero title
    cy.contains("Welcome to My Portfolio").should("be.visible");

    // Subtitle
    cy.contains("Hi, I'm Mehmet — a Software Engineering Technician Student")
      .should("be.visible");

    // 2) About page
    cy.contains("About").click();
    cy.url().should("include", "/about");

    // 3) Projects page
    cy.contains("Projects").click();
    cy.url().should("include", "/project");
    cy.contains("Projects").should("be.visible");

    // 4) Contact page
    cy.contains("Contact").click();
    cy.url().should("include", "/contact");
 
    cy.get("form").should("exist");
  });
});
