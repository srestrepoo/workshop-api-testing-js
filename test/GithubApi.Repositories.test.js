const agent = require('superagent-promise')(require('superagent'), Promise);
const { expect } = require('chai');

const urlBase = 'https://api.github.com';
const githubUserName = 'srestrepoo';

describe('Comprove user', () => {
  let user;
  before(() => {
    const userQuery = agent.get(`${urlBase}/users/${githubUserName}`)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        user = response.body;
      });
    return userQuery;
  });
  it('name, company and location', () => {
    expect(user.name).to.equal('Santiago Restrepo');
    expect(user.company).to.equal('Universidad Nacional de Colombia');
    expect(user.location).to.equal('Colombia');
  });
  describe('repositories', () => {
    const expectedRepo = 'backend-homework';
    let repositories;
    let repository;
    before(() => {
      const reposQuery = agent.get(user.repos_url)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          repositories = response.body;
          repository = repositories.find(repos => repos.name === expectedRepo);
        });
      return reposQuery;
    });
    it('Comprove repo, privacity and description', () => {
      expect(repository.full_name).to.equal(`${githubUserName}/${expectedRepo}`);
      expect(repository.private).to.equal(false);
      expect(repository.description).to.equal('Tarea backend pae-psl');
    });
  });
});
