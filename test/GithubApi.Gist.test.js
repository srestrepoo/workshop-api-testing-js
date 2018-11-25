const agent = require('superagent-promise')(require('superagent'), Promise);
const { expect } = require('chai');
const statusCode = require('http-status-codes');

const urlBase = 'https://api.github.com';

describe('Create and delete gist', () => {
  let createGistQuery;
  let gist;
  const promCode = `function wait(method, time) {
    return new Promise((resolve) => {
      setTimeout(resolve(method()), time);
    });
  }
  `;
  const createGist = {
    description: 'example promise',
    public: true,
    files: {
      'promise.js': {
        content: promCode
      }
    }
  };
  before(() => {
    createGistQuery = agent.post(`${urlBase}/gists`, createGist)
      .auth('token', process.env.ACCESS_TOKEN);
  });
  it('Verify created gist', () => createGistQuery.then(async (response) => {
    gist = await response.body;
    expect(response.status).to.be.equal(statusCode.CREATED);
    expect(gist.public).to.be.equal(true);
    expect(gist.description).to.be.equal('example promise');
  }));
  describe('get the new gist', () => {
    let newGistQuery;
    before(() => {
      newGistQuery = agent.get(gist.url)
        .auth('token', process.env.ACCESS_TOKEN);
    });
    it('The gist actually exists', () => newGistQuery.then((response) => {
      expect(response.status).to.be.equal(statusCode.OK);
    }));
    describe('delete the gist', () => {
      let deleteQuery;
      before(() => {
        deleteQuery = agent.del(gist.url)
          .auth('token', process.env.ACCESS_TOKEN);
      });
      it('return no-content status', () => deleteQuery.then((response) => {
        expect(response.status).to.be.equal(statusCode.NO_CONTENT);
      }));
      describe('and try to get the delete gist', () => {
        let gistNotFoundQuery;

        before(() => {
          gistNotFoundQuery = agent
            .get(gist.url)
            .auth('token', process.env.ACCESS_TOKEN);
        });

        it('then the Gits should not be accessible', () => gistNotFoundQuery
          .catch(response => expect(response.status).to.equal(statusCode.NOT_FOUND)));
      });
    });
  });
});
