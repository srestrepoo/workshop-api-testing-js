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
  it('Verify', () => followUser.then((response) => {
    expect(response.status).to.equal(statusCode.NO_CONTENT);
    expect(response.body).to.eql({});
  }));
  describe('Comprove following list', () => {
    let userFollowingQuery;
    before(() => {
      userFollowingQuery = agent.get(`${urlBase}/user/following`)
        .auth('token', process.env.ACCESS_TOKEN);
    });
    it('Verify', () => userFollowingQuery.then((response) => {
      userFollowing = response.body.find(users => users.login === githubUserName);
      expect(userFollowing.login).to.be.equal(githubUserName);
    }));
    describe('Follow again to verify idempotent', () => {
      let userFollowingAgain;
      let followUserAgain;
      before(() => {
        followUserAgain = agent.put(`${urlBase}/user/following/${githubUserName}`)
          .auth('token', process.env.ACCESS_TOKEN);
      });
      it('Verify', () => followUserAgain.then((response) => {
        expect(response.status).to.equal(statusCode.NO_CONTENT);
        expect(response.body).to.eql({});
      }));
      describe('Comprove following list', () => {
        before(() => {
          userFollowingAgain = agent.get(`${urlBase}/user/following`)
            .auth('token', process.env.ACCESS_TOKEN);
        });
        it('Verify', () => userFollowingAgain.then((response) => {
          userFollowingAgain = response.body.find(user => user.login === githubUserName);
          expect(userFollowingAgain.login).to.be.equal(githubUserName);
        }));
      });
    });
  });
});
