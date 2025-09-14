describe('Loan Application Flow', () => {
  beforeEach(() => {
    // Mock API responses
    cy.intercept('POST', '**/api/users/login', {
      statusCode: 200,
      body: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      },
    }).as('login');

    cy.intercept('GET', '**/backoffice/profile', {
      statusCode: 200,
      body: {
        id: '1',
        email: 'demo@myprime.com',
        firstName: 'Demo',
        lastName: 'User',
        walletBalance: 50000,
      },
    }).as('getProfile');

    cy.intercept('GET', '**/backoffice/loans', {
      statusCode: 200,
      body: [],
    }).as('getLoans');
  });

  it('should complete the login flow', () => {
    cy.visit('/login');
    
    // Fill login form
    cy.get('input[type="email"]').type('demo@myprime.com');
    cy.get('input[type="password"]').type('demo123');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Verify API calls
    cy.wait('@login');
    cy.wait('@getProfile');
    
    // Should redirect to dashboard
    cy.url().should('include', '/dashboard');
  });

  it('should display dashboard with user data', () => {
    // Set auth token to simulate logged-in state
    cy.window().then((win) => {
      win.localStorage.setItem('auth.token', 'mock-token');
    });
    
    cy.visit('/dashboard');
    
    cy.wait('@getProfile');
    cy.wait('@getLoans');
    
    // Verify dashboard elements
    cy.contains('Welcome back, Demo!').should('be.visible');
    cy.contains('₦50,000').should('be.visible'); // Wallet balance
    cy.contains('Quick Actions').should('be.visible');
  });

  it('should open transfer modal and create transfer', () => {
    // Mock transfer creation
    cy.intercept('POST', '**/backoffice/transfers', {
      statusCode: 201,
      body: {
        id: 'transfer-123',
        amount: 10000,
        status: 'success',
      },
    }).as('createTransfer');

    cy.window().then((win) => {
      win.localStorage.setItem('auth.token', 'mock-token');
    });
    
    cy.visit('/dashboard');
    cy.wait('@getProfile');

    // Open transfer modal
    cy.contains('Transfer Money').click();
    
    // Fill transfer form
    cy.get('input[type="number"]').first().type('10000');
    cy.contains('Continue').click();
    
    // Confirm transfer
    cy.contains('Confirm Transfer').click();
    
    cy.wait('@createTransfer');
    
    // Verify success message
    cy.contains('Transfer Successful!').should('be.visible');
  });
});