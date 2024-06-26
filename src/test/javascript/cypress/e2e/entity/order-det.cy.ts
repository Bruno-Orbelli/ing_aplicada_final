import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('OrderDet e2e test', () => {
  const orderDetPageUrl = '/order-det';
  const orderDetPageUrlPattern = new RegExp('/order-det(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const orderDetSample = {};

  let orderDet;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/order-dets+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/order-dets').as('postEntityRequest');
    cy.intercept('DELETE', '/api/order-dets/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (orderDet) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/order-dets/${orderDet.id}`,
      }).then(() => {
        orderDet = undefined;
      });
    }
  });

  it('OrderDets menu should load OrderDets page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('order-det');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('OrderDet').should('exist');
    cy.url().should('match', orderDetPageUrlPattern);
  });

  describe('OrderDet page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(orderDetPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create OrderDet page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/order-det/new$'));
        cy.getEntityCreateUpdateHeading('OrderDet');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', orderDetPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/order-dets',
          body: orderDetSample,
        }).then(({ body }) => {
          orderDet = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/order-dets+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [orderDet],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(orderDetPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details OrderDet page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('orderDet');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', orderDetPageUrlPattern);
      });

      it('edit button click should load edit OrderDet page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('OrderDet');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', orderDetPageUrlPattern);
      });

      it('edit button click should load edit OrderDet page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('OrderDet');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', orderDetPageUrlPattern);
      });

      it('last delete button click should delete instance of OrderDet', () => {
        cy.intercept('GET', '/api/order-dets/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('orderDet').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', orderDetPageUrlPattern);

        orderDet = undefined;
      });
    });
  });

  describe('new OrderDet page', () => {
    beforeEach(() => {
      cy.visit(`${orderDetPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('OrderDet');
    });

    it('should create an instance of OrderDet', () => {
      cy.get(`[data-cy="quantity"]`).type('53872').should('have.value', '53872');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        orderDet = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', orderDetPageUrlPattern);
    });
  });
});
