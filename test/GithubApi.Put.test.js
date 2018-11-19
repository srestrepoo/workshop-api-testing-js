const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';
const githubUserName = 'cmpinzonh';

describe('Follow github user', () => {
  let userFollowing;
  let followUser;
  before(() => {
    followUser = agent.put(`${urlBase}/user/following/${githubUserName}`)
      .auth('token', process.env.ACCESS_TOKEN);
  });
  it('Verify', () => {
    followUser.then((response) => {
      expect(response.status).to.equal(statusCode.NO_CONTENT);
      expect(response.body).to.eql({});
    });
  });
  describe('Comprove following list', () => {
    before(() => {
      const userFollowingQuery = agent.get(`${urlBase}/user/following`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          userFollowing = response.body.find(user => user.login === githubUserName);
        });
      return userFollowingQuery;
    });
    it('Verify', () => {
      expect(userFollowing.login).to.equal(githubUserName);
    });
    describe('Follow again to verify idempotent', () => {
      let userFollowingAgain;
      let followUserAgain;
      before(() => {
        followUserAgain = agent.put(`${urlBase}/user/following/${githubUserName}`)
          .auth('token', process.env.ACCESS_TOKEN);
      });
      it('Verify', () => {
        followUserAgain.then((response) => {
          expect(response.status).to.equal(statusCode.NO_CONTENT);
          expect(response.body).to.eql({});
        });
      });
      describe('Comprove following list', () => {
        before(() => {
          const userFollowingQuery = agent.get(`${urlBase}/user/following`)
            .auth('token', process.env.ACCESS_TOKEN)
            .then((response) => {
              userFollowingAgain = response.body.find(user => user.login === githubUserName);
            });
          return userFollowingQuery;
        });
        it('Verify', () => {
          expect(userFollowingAgain.login).to.equal(githubUserName);
        });
      });
    });
  });
});
