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

// shared test variables
let authHeaders;
let res001;
let resText001;
let resOutput001;

describe('{{MERLIN}} <SMOKE> /search/ssp-control/publisher @ADMIN >>> ' +
    '(+) url - order-by rtbFloor - sort desc >>>', function() {

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

    before('search ssp-control-publisher', function(done) {

        const urlParams = [
            'o', 'rtbFloor',
            's', 'desc'
        ].join('/');

        request(targetServer)
            .get(util.format(
                targetEndpoint.searchSspControlPublisherParams, urlParams
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

    it('response object property types should match spec', function() {
        if (resOutput001 && resOutput001.length > 0) {
            expect(resOutput001).to.be.an('array');
            expect(/^[a-f0-9]{32}$/.test(resOutput001[0].publisherId))
                .to.be.true;
            expect(resOutput001[0].targetingType).to.be.oneOf([
                'include', 'exclude'
            ]);
            expect(resOutput001[0].applyBlocklists).to.be.a('boolean');
            expect(resOutput001[0].rtbAllow).to.be.a('boolean');
            expect(/^(\d{1,10}\.?\d{0,2})$/.test(resOutput001[0].rtbFloor))
                .to.be.true;
            expect(resOutput001[0].uniqueAds).to.be.oneOf([
                'inherit', 'off', 'advertiser'
            ]);
            expect(resOutput001[0].userMatchAllow).to.be.a('boolean');
            expect(resOutput001[0].directoryExpose).to.be.a('boolean');
            expect(resOutput001[0].directoryExposePublic).to.be.a('boolean');
            if (resOutput001[0].demandAllocationHouse !== null) {
                expect(
                    validator.isInt(resOutput001[0].demandAllocationHouse + '')
                ).to.be.true;
            }
            if (resOutput001[0].demandAllocationHouse !== null) {
                expect(
                    validator.isInt(resOutput001[0].demandAllocationDirect + '')
                ).to.be.true;
            }
        }
    });

    it('response should be sorted by rbtFloor in desc order', function() {
        if (resOutput001 && resOutput001.length > 0) {
            let previous = 9999999999.99;
            resOutput001.forEach(function(value) {
                expect(value.rtbFloor).to.be.at.most(previous);
                previous = value.rtbFloor;
            });
        }
    });

});
