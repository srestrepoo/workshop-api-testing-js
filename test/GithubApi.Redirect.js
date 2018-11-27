const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const redirectURL = 'https://github.com/aperdomob/redirect-test';
const newURL = 'https://github.com/aperdomob/new-redirect-test';
describe('Redirection Test', () => {
  let redirectQuery;
  before(() => {
    redirectQuery = agent.head(redirectURL)
      .auth('token', process.env.ACCESS_TOKEN);
  });
  it('verify new url', () => redirectQuery.catch((error) => {
    expect(error.status).to.be.equal(301);
    expect(error.response.headers.location).to.be.equal(newURL);
  }));
  describe('Comprove redirection', () => {
    let getRedirectQuery;
    before(() => {
      getRedirectQuery = agent.get(redirectURL)
        .auth('token', process.env.ACCESS_TOKEN);
    });
    it('Verify OK code', () => getRedirectQuery.then((response) => {
      expect(response.status).to.be.equal(statusCode.OK);
    }));
  });
});
