'use strict';

// vendor dependencies
const chance = require('chance').Chance();
const chai = require('chai');

const expect = chai.expect; // use bdd chai

const request = require('supertest-as-promised');
const util = require('util');

// runtime variables
const rootPath =
    process.env.ROOT_PATH;
const targetEndpoint =
    require(rootPath + '/config/merlin/endpoints');
const targetEnvironment =
    require(rootPath + '/config/merlin/' + process.env.NODE_ENV);
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetServer =
    targetEnvironment.server;
const targetUser =
    usersTargetEnvironment.admin;
const merlinAuthHeaders =
    require(rootPath + '/helpers/merlin-auth-headers');
const requestTimeOut = 10000;
const characterPool =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// shared test variable(s)
let authHeaders;
let res001;

describe('{{MERLIN}} /lau/status @ADMIN >>> ' +
    '(-) url - string end - random characters >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('generate auth headers', function(done) {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('get lau credentials - ' +
        'string end - random characters', function(done) {

        request(targetServer)
            .get(util.format(
                targetEndpoint.lauCredentials +
                    chance.string({length: 5, pool: characterPool})
            )
            )
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(404);

                // assign shared test variable(s)
                res001 = res;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 404', function() {
        expect(res001.status).to.equal(404);
    });
});
