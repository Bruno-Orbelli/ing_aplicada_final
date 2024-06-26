/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />

// ***********************************************
// This commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// ***********************************************
// Begin Specific Selector Attributes for Cypress
// ***********************************************

// Navbar
export const navbarSelector = '[data-cy="navbar"]';
export const adminMenuSelector = '[data-cy="adminMenu"]';
export const accountMenuSelector = '[data-cy="accountMenu"]';
export const registerItemSelector = '[data-cy="register"]';
export const settingsItemSelector = '[data-cy="settings"]';
export const passwordItemSelector = '[data-cy="passwordItem"]';
export const loginItemSelector = '[data-cy="login"]';
export const logoutItemSelector = '[data-cy="logout"]';
export const entityItemSelector = '[data-cy="entity"]';
export const mainItemSelector = '[data-cy="mainItem"]';

// Login
export const titleLoginSelector = '[data-cy="loginTitle"]';
export const errorLoginSelector = '[data-cy="loginError"]';
export const usernameLoginSelector = '[data-cy="username"]';
export const passwordLoginSelector = '[data-cy="password"]';
export const forgetYourPasswordSelector = '[data-cy="forgetYourPasswordSelector"]';
export const submitLoginSelector = '[data-cy="submit"]';

// Register
export const titleRegisterSelector = '[data-cy="registerTitle"]';
export const usernameRegisterSelector = '[data-cy="username"]';
export const emailRegisterSelector = '[data-cy="email"]';
export const firstPasswordRegisterSelector = '[data-cy="firstPassword"]';
export const secondPasswordRegisterSelector = '[data-cy="secondPassword"]';
export const submitRegisterSelector = '[data-cy="submit"]';

// Settings
export const firstNameSettingsSelector = '[data-cy="firstname"]';
export const lastNameSettingsSelector = '[data-cy="lastname"]';
export const emailSettingsSelector = '[data-cy="email"]';
export const languageSettingsSelector = '[data-cy="langKey"]';
export const submitSettingsSelector = '[data-cy="submit"]';

// Password
export const currentPasswordSelector = '[data-cy="currentPassword"]';
export const newPasswordSelector = '[data-cy="newPassword"]';
export const confirmPasswordSelector = '[data-cy="confirmPassword"]';
export const submitPasswordSelector = '[data-cy="submit"]';

// Reset Password
export const emailResetPasswordSelector = '[data-cy="emailResetPassword"]';
export const submitInitResetPasswordSelector = '[data-cy="submit"]';

// Administration
export const userManagementPageHeadingSelector = '[data-cy="userManagementPageHeading"]';
export const swaggerFrameSelector = 'iframe[data-cy="swagger-frame"]';
export const swaggerPageSelector = '[id="swagger-ui"]';
export const metricsPageHeadingSelector = '[data-cy="metricsPageHeading"]';
export const healthPageHeadingSelector = '[data-cy="healthPageHeading"]';
export const logsPageHeadingSelector = '[data-cy="logsPageHeading"]';
export const configurationPageHeadingSelector = '[data-cy="configurationPageHeading"]';

// Main
export const logoSelector = '[data-cy="logo"]';
export const goBackSelector = '[data-cy="goBackButton"]';
export const newItemTabButtonSelector = '[id="navTabs-tab-new-order"]';
export const activeOrdersTabButtonSelector = '[id="navTabs-tab-current-orders"]';
export const stockTabButtonSelector = '[id="navTabs-tab-stock"]';
export const activeOrderSuffix = 'ActiveOrder';
export const selectedCountSuffix = 'SelectedCount';
export const stockCountSuffix = 'StockCount';
export const productPlusButtonSuffix = 'ProductPlusButton';
export const productMinusButtonSuffix = 'ProductMinusButton';
export const stockPlusButtonSuffix = 'StockPlusButton';
export const stockMinusButtonSuffix = 'StockMinusButton';
export const confirmOrderButtonSelector = '[data-cy="confirmOrderButton"]';
export const modalConfirmOrderButtonSelector = '[data-cy="modalConfirmOrderButton"]';
export const confirmStockButtonSelector = '[data-cy="confirmStockButton"]';
export const modalConfirmStockButtonSelector = '[data-cy="modalConfirmStockButton"]';

// ***********************************************
// End Specific Selector Attributes for Cypress
// ***********************************************

export const classInvalid = 'is-invalid';

export const classValid = 'is-valid';

Cypress.Commands.add('authenticatedRequest', data => {
  const bearerToken = JSON.parse(sessionStorage.getItem(Cypress.env('jwtStorageName')));
  return cy.request({
    ...data,
    auth: {
      bearer: bearerToken,
    },
  });
});

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.session(
    [username, password],
    () => {
      cy.request({
        method: 'GET',
        url: '/api/account',
        failOnStatusCode: false,
      });
      cy.authenticatedRequest({
        method: 'POST',
        body: { username, password },
        url: Cypress.env('authenticationUrl'),
      }).then(({ body: { id_token } }) => {
        sessionStorage.setItem(Cypress.env('jwtStorageName'), JSON.stringify(id_token));
      });
    },
    {
      validate() {
        cy.authenticatedRequest({ url: '/api/account' }).its('status').should('eq', 200);
      },
    }
  );
});

declare global {
  namespace Cypress {
    interface Chainable {
      authenticatedRequest(data): Cypress.Chainable;
      login(username: string, password: string): Cypress.Chainable;
    }
  }
}

// Convert this to a module instead of script (allows import/export)
export {};
