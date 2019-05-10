'use strict';

// vendor dependencies
const chai = require('chai');

const expect = chai.expect; // use bdd chai
const moment = require('moment');

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

// fixture(s)
const testFixture =
    require(rootPath + '/fixtures/common/ad-slot/create002');

// shared test variable(s)
let authHeaders;
let res001;
let resText001;
let sendBody001;

describe('{{MERLIN}} /ad-slot {create} >>> ' +
    '(-) body - missing newsletter field >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('generate auth headers', function(done) {
        // generate auth headers
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('create ad-slot - missing newsletter field', function(done) {

        sendBody001 = Object.assign({}, testFixture);

        // assign name to ad-slot
        sendBody001.name = 'ads@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');

        delete sendBody001.newsletter;

        request(targetServer)
            .post(util.format(targetEndpoint.adSlotCreate))
            .set(authHeaders)
            .send(sendBody001)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(400);

                // assign shared test variable(s)
                res001 = res;
                resText001 = JSON.parse(res.text);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response have status of 400', function() {
        expect(res001.status).to.equal(400);
    });

    it('should return a newsletter required error', function() {
        expect(resText001.errors).to.deep.include.members([
            {'id': 'E1001', 'code': 'REQ', 'details': 'newsletter'}
        ]);
    });

});
