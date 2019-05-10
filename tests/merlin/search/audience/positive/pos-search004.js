'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const request = require('supertest-as-promised');
const util = require('util');
const validator = require('validator');

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

// shared test variable(s)
let authHeaders;
let res001;
let resText001;
let resOutput001;
let key001;
let value001;
let pageCount001;
let page001;

describe('{{MERLIN}} /search/audience @ADMIN >>> ' +
    '(+) url - search by - status page and number >>>', function() {

    // set time out for requests
    this.timeout(requestTimeOut);

    before('generate auth login headers', function(done) {
        const genAuthHeaders =
            merlinAuthHeaders(targetUser);
        genAuthHeaders.then( function(headers) {
            authHeaders = headers;
            done();
        });
    });

    before('search agency', function(done) {

        key001 = 'status';
        value001 = 'active';
        pageCount001 = 40;
        page001 = 2;

        // create url request parameters
        const urlParameters001 = encodeURIComponent(
            key001 + '/' + value001 +
            '/n/' + pageCount001 +
            /p/ + page001
        );

        request(targetServer)
            .get(util.format(
                targetEndpoint.searchAudienceParameters,
                urlParameters001
            )
            )
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res001 = res;
                resText001 = JSON.parse(res.text);
                resOutput001 = resText001.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 200', function() {
        expect(res001.status).to.equal(200);
    });

    it('notices and errors should not exist', function() {
        expect(resText001.notices).to.not.exist;
        expect(resText001.errors).to.not.exist;
    });

    it('array objects status should match search status', function() {
        resOutput001.forEach(function(val) {
            expect(val.status).to.be.equal(value001);
        });
    });

    it('array objects count should match search count', function() {
        expect(resOutput001.length).to.be.at.most(pageCount001);
    });

    it('response object property types should match spec', function() {
        if (resOutput001 !== null && resOutput001 !== undefined) {
            expect(resOutput001).to.be.an('array');
            resOutput001.forEach(function(val) {
                expect(val).to.be.an('object');
            });
        }
        expect(/^[a-f0-9]{32}$/.test(resOutput001[0].id)).to.be.true;
        expect(validator.isInt(resOutput001[0].refId + '')).to.be.true;
        expect(validator.isInt(resOutput001[0].version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001[0].advertiser)).to.be.true;
        expect(resOutput001[0].status).to.be.oneOf([
            'active', 'inactive', 'pending', 'deleted'
        ]);
        expect(resOutput001[0].name).to.have.length.of.at.most(128);
        expect(resOutput001[0].isShared).to.be.a('boolean');
        // created and modified
        expect(validator.isISO8601(resOutput001[0].created)).to.be.true;
        expect(/^([a-f0-9]{32})|1+$/.test(resOutput001[0].createdBy))
            .to.be.true;
        expect(validator.isISO8601(resOutput001[0].modified)).to.be.true;
        expect(/^([a-f0-9]{32})|1+$/.test(resOutput001[0].modifiedBy))
            .to.be.true;
    });
});

