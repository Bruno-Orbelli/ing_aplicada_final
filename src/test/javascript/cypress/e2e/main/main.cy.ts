import {
  newItemTabButtonSelector,
  activeOrdersTabButtonSelector,
  stockTabButtonSelector,
  selectedCountSuffix,
  stockCountSuffix,
  productPlusButtonSuffix,
  productMinusButtonSuffix,
  stockPlusButtonSuffix,
  stockMinusButtonSuffix,
  confirmOrderButtonSelector,
  modalConfirmOrderButtonSelector,
  confirmStockButtonSelector,
  modalConfirmStockButtonSelector,
} from '../../support/commands';

describe('/main', () => {
  const username = Cypress.env('E2E_ADMIN_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_ADMIN_PASSWORD') ?? 'admin';

  beforeEach(() => {
    cy.visit('');
  });

  it('should not load the page when not logged', () => {
    cy.clickOnMainItem();
    cy.url().should('include', '/login');
  });

  it('should load the page when logged', () => {
    cy.login(username, password);
    cy.visit('');
    cy.clickOnMainItem();
    cy.url().should('include', '/main');
  });

  it('should allow to navigate to the different tabs', () => {
    cy.login(username, password);
    cy.visit('/main');
    cy.get(activeOrdersTabButtonSelector).click();
    cy.get(activeOrdersTabButtonSelector).should('have.class', 'active');
    cy.get(stockTabButtonSelector).click();
    cy.get(stockTabButtonSelector).should('have.class', 'active');
    cy.get(newItemTabButtonSelector).click();
    cy.get(newItemTabButtonSelector).should('have.class', 'active');
  });

  it("should allow to increment and decrement products' counter", () => {
    cy.login(username, password);
    cy.visit('/main');
    const selectors = ['burger', 'frenchfries', 'salad', 'soda', 'icecream'];
    selectors.forEach(selector => {
      cy.get(`[data-cy="${selector + selectedCountSuffix}"]`).should('have.text', '0');
      cy.get(`[data-cy="${selector + productPlusButtonSuffix}"]`).click();
      cy.get(`[data-cy="${selector + selectedCountSuffix}"]`).should('have.text', '1');
      cy.get(`[data-cy="${selector + productMinusButtonSuffix}"]`).click();
      cy.get(`[data-cy="${selector + selectedCountSuffix}"]`).should('have.text', '0');
    });
  });

  it('should allow to create an order', () => {
    cy.login(username, password);
    cy.visit('/main');
    cy.get(activeOrdersTabButtonSelector).click();
    cy.get('.active-order')
      .its('length')
      .then((initialOrderCount: number) => {
        cy.get(newItemTabButtonSelector).click();
        const selectors = ['burger', 'frenchfries', 'salad', 'soda', 'icecream'];
        selectors.forEach(selector => {
          cy.get(`[data-cy="${selector + productPlusButtonSuffix}"]`).click();
        });
        cy.get(confirmOrderButtonSelector).click();
        cy.get(modalConfirmOrderButtonSelector).click();
        cy.get(activeOrdersTabButtonSelector, { timeout: 20000 }).should('be.visible').click();
        cy.get('.active-order').should('have.length', initialOrderCount + 1);
        selectors.forEach(selector => {
          cy.get(`[data-cy="${selector + selectedCountSuffix}"]`).should('have.text', '0');
        });
      });
  });

  it("should allow to increment and decrement stock' counter", () => {
    cy.login(username, password);
    cy.visit('/main');
    cy.get(stockTabButtonSelector).click();
    const selectors = ['burger', 'frenchfries', 'salad', 'soda', 'icecream'];
    selectors.forEach(selector => {
      cy.get(`[data-cy="${selector + stockCountSuffix}"]`).should('have.text', '0');
      cy.get(`[data-cy="${selector + stockPlusButtonSuffix}"]`).click();
      cy.get(`[data-cy="${selector + stockCountSuffix}"]`).should('have.text', '1');
      cy.get(`[data-cy="${selector + stockMinusButtonSuffix}"]`).click();
      cy.get(`[data-cy="${selector + stockCountSuffix}"]`).should('have.text', '0');
    });
  });

  it('should allow to confirm stock', () => {
    cy.login(username, password);
    cy.visit('/main');
    cy.get(stockTabButtonSelector).click();
    const selectors = ['burger', 'frenchfries', 'salad', 'soda', 'icecream'];
    selectors.forEach(selector => {
      cy.get(`[data-cy="${selector + stockPlusButtonSuffix}"]`).click();
    });
    cy.get(confirmStockButtonSelector).click();
    cy.get(modalConfirmStockButtonSelector).click();
    selectors.forEach(selector => {
      cy.get(`[data-cy="${selector + stockCountSuffix}"]`).should('have.text', '0');
    });
  });

  it('should allow to go back to the home page', () => {
    cy.login(username, password);
    cy.visit('/main');
    cy.clickOnGoBack();
    cy.url().should('include', '/');
  });

  it('should remain on the main page when clicking on the logo', () => {
    cy.login(username, password);
    cy.visit('/main');
    cy.clickOnLogo();
    cy.url().should('include', '/main');
  });
});
