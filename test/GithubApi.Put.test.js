const agent = require('superagent-promise')(require('superagent'), Promise);
const { expect } = require('chai');

describe('Follow github user', () => {
  it('follow aperdomob', () => agent.put('https://api.github.com/user/following/aperdomob')
    .auth('token', process.env.ACCESS_TOKEN)
    .then((response) => {
      expect(response.status).to.equal(204);
    }));
});
