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
const requestTimeOut = 15000;

// shared test variable(s)
let authHeaders;
let res001;
let resText001;
let resOutput001;

describe('{{MERLIN}} /search/advertiser {advanced} @ADMIN >>> ' +
    '(-) body - missing >>>', function() {

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

    before('search advertiser - body - missing', function(done) {

        // missing request send body

        request(targetServer)
            .post(util.format(targetEndpoint.searchAdSlotAdvanced))
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
        expect(resOutput001[0].status).to.be.oneOf([
            'pending', 'inactive', 'active'
        ]);
        if (resOutput001[0].ownerName !== null &&
            resOutput001[0].ownerName !== undefined) {

            expect(resOutput001[0].ownerName).to.have.length.of.at.most(255);
        }
        if (resOutput001[0].agency !== null &&
            resOutput001[0].agency !== undefined) {

            expect(/^[a-f0-9]{32}$/.test(resOutput001[0].agency)).to.be.true;
        }
        if (resOutput001[0].mediaGroup !== null &&
            resOutput001[0].mediaGroup !== undefined) {

            expect(/^[a-f0-9]{32}$/.test(resOutput001[0].mediaGroup))
                .to.be.true;
        }
        expect(/^[a-f0-9]{32}$/.test(resOutput001[0].publisher)).to.be.true;
        if (resOutput001[0].category !== null &&
            resOutput001[0].category !== undefined) {

            expect(validator.isInt(resOutput001[0].category + '')).to.be.true;
        }
        if (resOutput001[0].admin !== null &&
            resOutput001[0].admin !== undefined) {

            expect(/^[a-f0-9]{32}$/.test(resOutput001[0].admin)).to.be.true;
        }
        if (resOutput001[0].executive !== null &&
            resOutput001[0].executive !== undefined) {

            expect(/^[a-f0-9]{32}$/.test(resOutput001[0].executive))
                .to.be.true;
        }
        expect(resOutput001[0].name).to.have.length.of.at.most(255);
        if (resOutput001[0].externalId !== null) {
            expect(resOutput001[0].externalId).to.have.length.of.at.most(128);
        }
        if (resOutput001[0].liverampId !== null &&
            resOutput001[0].liverampId !== undefined) {

            expect(/^[a-f0-9]{32}$/.test(resOutput001[0].liverampId))
                .to.be.true;
        }
        if (resOutput001[0].domain !== null &&
            resOutput001[0].domain !== undefined) {

            expect(resOutput001[0].domain).to.have.length.of.at.most(128);
        }
        if (resOutput001[0].hasExchange !== null &&
            resOutput001[0].hasExchange !== undefined) {

            expect(resOutput001[0].hasExchange).to.be.a('boolean');
        }
        // created and modified
        expect(validator.isISO8601(resOutput001[0].created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001[0].createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput001[0].modified)).to.be.true;
        expect(/^[a-f0-9]{1,32}$/.test(resOutput001[0].modifiedBy)).to.be.true;
    });
});
