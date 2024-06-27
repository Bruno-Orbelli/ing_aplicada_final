/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */

import { logoSelector, goBackSelector, newItemTabButtonSelector, activeOrdersTabButtonSelector, stockTabButtonSelector } from './commands';

Cypress.Commands.add('clickOnLogo', () => {
  return cy.get(logoSelector).click();
});

Cypress.Commands.add('clickOnGoBack', () => {
  return cy.get(goBackSelector).click();
});

Cypress.Commands.add('clickOnNewItemTabButton', () => {
  return cy.get(newItemTabButtonSelector).click();
});

Cypress.Commands.add('clickOnActiveOrdersTabButton', () => {
  return cy.get(activeOrdersTabButtonSelector).click();
});

Cypress.Commands.add('clickOnStockTabButton', () => {
  return cy.get(stockTabButtonSelector).click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      clickOnLogo(): Cypress.Chainable;
      clickOnGoBack(): Cypress.Chainable;
      clickOnNewItemTabButton(): Cypress.Chainable;
      clickOnActiveOrdersTabButton(): Cypress.Chainable;
      clickOnStockTabButton(): Cypress.Chainable;
      clickOnOrderItemCard(item: string): Cypress.Chainable;
      clickOnActiveOrder(orderId: number): Cypress.Chainable;
      clickOnStockItemCard(item: string): Cypress.Chainable;
    }
  }
}
