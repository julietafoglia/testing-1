'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect; // use bdd chai
const moment = require('moment');
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
const timeStamp =
    '@' + moment().format('YYYY-MM-DDTHH:mm:ss.SS');

// fixture(s)
const setupFixture001 =
    require(rootPath + '/fixtures/common/media-group/create001');
const setupFixture002 =
    require(rootPath + '/fixtures/common/publisher/create001');
const setupFixture003 =
    require(rootPath + '/fixtures/common/newsletter/create002');
const testFixture =
    require(rootPath + '/fixtures/common/newsletter/save003');
const verifyFixture =
    require(rootPath + '/fixtures/common/newsletter/save003-verify');

// shared test variable(s)
let authHeaders;
let res004;
let resOutput001;
let resOutput002;
let resOutput003;
let resOutput004;
let resText001;
let resText002;
let resText003;
let resText004;
let sendBody001;
let sendBody002;
let sendBody003;
let sendBody004;

describe('{{MERLIN}} /newsletter {id save} >>> ' +
    '(+) body - null non-required fields >>>', function() {

    // set timeout for test suite
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

    before('create media group - minimum required fields', function(done) {

        sendBody001 = Object.assign({}, setupFixture001);

        // assign name
        sendBody001.name += timeStamp;

        request(targetServer)
            .post(util.format(targetEndpoint.mediaGroupCreate))
            .set(authHeaders)
            .send(sendBody001)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText001 = JSON.parse(res.text);
                resOutput001 = resText001.output;

                // spot check response
                expect(/^[a-f0-9]{32}$/.test(resOutput001.id)).to.be.true;
                expect(resOutput001.name).to.have.length.of.at.most(128);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create publisher - minimum required fields', function(done) {

        sendBody002 = Object.assign({}, setupFixture002);

        // assign name and media-group to publisher
        sendBody002.name += timeStamp;
        sendBody002.mediaGroup = resOutput001.id;

        request(targetServer)
            .post(util.format(targetEndpoint.publisherCreate))
            .set(authHeaders)
            .send(sendBody002)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText002 = JSON.parse(res.text);
                resOutput002 = resText002.output;

                // spot check response
                expect(/^[a-f0-9]{32}$/.test(resOutput002.id))
                    .to.be.true;
                expect(resOutput002.name)
                    .to.have.length.of.at.most(255);
                expect(/^[a-f0-9]{32}$/.test(resOutput002.mediaGroup))
                    .to.be.true;
                expect(resOutput002.mediaGroup)
                    .to.equal(sendBody002.mediaGroup);
                expect(resOutput002.name)
                    .to.equal(sendBody002.name);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('create newsletter - all valid fields', function(done) {

        sendBody003 = Object.assign({}, setupFixture003);

        // assign name and publisher to newsletter
        sendBody003.name += timeStamp;
        sendBody003.publisher = resOutput002.id;

        request(targetServer)
            .post(util.format(targetEndpoint.newsletterCreate))
            .set(authHeaders)
            .send(sendBody003)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

                // assign shared test variable(s)
                resText003 = JSON.parse(res.text);
                resOutput003 = resText003.output;

                // spot check response
                expect(/^[a-f0-9]{32}$/.test(resOutput003.id)).to.be.true;
                expect(resOutput003.name).to.have.length.of.at.most(48);
                expect(resOutput003.name).to.equal(sendBody003.name);
                expect(resOutput003.publisher).to.equal(sendBody003.publisher);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    before('save newsletter - null non-required fields', function(done) {

        sendBody004 = Object.assign({}, testFixture);

        // assign name and version to newsletter
        sendBody004.name = resOutput003.name + '@v2';
        sendBody004.version = resOutput003.version;
        sendBody004.description = sendBody004.name;

        request(targetServer)
            .post(util.format(targetEndpoint.newsletterSave, resOutput003.id))
            .set(authHeaders)
            .send(sendBody004)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);

                // assign shared test variable(s)
                res004 = res;
                resText004 = JSON.parse(res.text);
                resOutput004 = resText004.output;
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    it('response should have status of 200', function() {
        expect(res004.status).to.equal(200);
    });

    it('notices and errors should not exist', function() {
        expect(resText004.notices).to.not.exist;
        expect(resText004.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(/^[a-f0-9]{32}$/.test(resOutput004.id)).to.be.true;
        expect(validator.isInt(resOutput004.refId + '')).to.be.true;
        expect(validator.isInt(resOutput004.version + '')).to.be.true;
        expect(resOutput004.status).to.be.oneOf([
            'pending', 'inactive', 'active'
        ]);
        expect(/^[a-f0-9]{32}$/.test(resOutput004.publisher)).to.be.true;
        if (resOutput004.externalId != null) {
            expect(resOutput004.externalId).to.have.length.of.at.most(128);
        }
        expect(validator.isInt(resOutput004.category + '', {'min': 1}))
            .to.be.true;
        expect(resOutput004.secondaryCategories)
            .to.be.an('array');
        expect(resOutput004.name)
            .to.have.length.of.at.most(48);
        if (resOutput004.description != null) {
            expect(resOutput004.description).to.be.a('string');
        }
        if (resOutput004.tagsUrlPrefix != null) {
            expect(resOutput004.tagsUrlPrefix).to.have.length.of.at.most(128);
        }
        if (resOutput004.tagsUrlPrefixInvalid != null) {
            expect(resOutput004.tagsUrlPrefixInvalid).to.be.a('boolean');
        }
        expect(resOutput004.isSafeRtb)
            .to.be.a('boolean');
        expect(resOutput004.isSafeRtbV2)
            .to.be.a('boolean');
        expect(validator.isInt(resOutput004.estimatedInventory + ''))
            .to.be.true;
        // ssp control object
        expect(resOutput004.sspControl).to.be.an('object');
        if (resOutput004.sspControl.exchangeAllow !== null) {
            expect(resOutput004.sspControl.exchangeAllow)
                .to.be.a('boolean');
        }
        if (resOutput004.sspControl.rtbAllow !== null) {
            expect(resOutput004.sspControl.rtbAllow)
                .to.be.a('boolean');
        }
        if (resOutput004.sspControl.rtbTransparency !== null) {
            expect(resOutput004.sspControl.rtbTransparency)
                .to.be.a('boolean');
        }
        if (resOutput004.sspControl.rtbFloor !== null) {
            expect(/^(\d{1,10}\.?(\d{1,2})?)$/
                .test(resOutput004.sspControl.rtbFloor)).to.be.true;
        }
        if (resOutput004.sspControl.demandAllocationDirect !== null) {
            expect(validator.isInt(
                resOutput004.sspControl.demandAllocationDirect + ''
            )).to.be.true;
        }
        if (resOutput004.sspControl.demandAllocationHouse !== null) {
            expect(validator.isInt(
                resOutput004.sspControl.demandAllocationHouse + ''
            )).to.be.true;
        }
        // created and modified
        expect(validator.isISO8601(resOutput004.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput004.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput004.modifiedBy)).to.be.true;
    });

    it('response object key values should match test object', function() {
        expect(resOutput004.version)
            .to.equal(resOutput003.version + 1);
        expect(resOutput004.status)
            .to.equal(resOutput003.status);
        expect(resOutput004.publisher)
            .to.equal(resOutput003.publisher);
        expect(resOutput004.category)
            .to.equal(resOutput003.category);
        expect(resOutput004.secondaryCategories)
            .to.eql(resOutput003.secondaryCategories);
        expect(resOutput004.name)
            .to.equal(sendBody004.name);
        expect(resOutput004.externalId)
            .to.equal(sendBody004.externalId);
        expect(resOutput004.description)
            .to.equal(sendBody004.name);
        expect(resOutput004.tagsUrlPrefix)
            .to.equal(sendBody004.tagsUrlPrefix);
        // ssp-control object
        expect(resOutput004.sspControl.exchangeAllow)
            .to.equal(verifyFixture.sspControl.exchangeAllow);
        expect(resOutput004.sspControl.exchangeFloor)
            .to.equal(verifyFixture.sspControl.exchangeFloor);
        expect(resOutput004.sspControl.rtbAllow)
            .to.equal(verifyFixture.sspControl.rtbAllow);
        expect(resOutput004.sspControl.rtbTransparency)
            .to.equal(verifyFixture.sspControl.rtbTransparency);
        expect(resOutput004.sspControl.rtbFloor)
            .to.equal(verifyFixture.sspControl.rtbFloor);
        expect(resOutput004.sspControl.userMatchAllow)
            .to.equal(verifyFixture.sspControl.userMatchAllow);
        expect(resOutput004.sspControl.demandAllocationHouse)
            .to.equal(verifyFixture.sspControl.demandAllocationHouse);
        expect(resOutput004.sspControl.demandAllocationDirect)
            .to.equal(verifyFixture.sspControl.demandAllocationDirect);
        expect(resOutput004.sspControl.directoryExpose)
            .to.equal(verifyFixture.sspControl.directoryExpose);
        expect(resOutput004.sspControl.directoryExposePublic)
            .to.equal(verifyFixture.sspControl.directoryExposePublic);
    });

    after('delete newsletter', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.newsletterDelete, resOutput003.id))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    after('delete publisher', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.publisherDelete, resOutput002.id))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

    after('delete media group', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.mediaGroupDelete, resOutput001.id))
            .set(authHeaders)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(200);
                done();
            })
            .catch( function(err) {
                done(err);
            });
    });

});
