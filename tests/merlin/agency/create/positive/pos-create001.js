'use strict';

// vendor dependencies
const chance = require('chance').Chance();
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
const testFixture =
    require(rootPath + '/fixtures/common/agency/create001');
const verifyFixture =
    require(rootPath + '/fixtures/common/agency/create001-verify');

// shared test variable(s)
let authHeaders;
let res001;
let resOutput001;
let resText001;
let sendBody001;

describe('{{MERLIN}} <SMOKE> /agency {create} @ADMIN >>> ' +
    '(+) body - all valid fields >>>', function() {

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

    before('create agency - all valid fields', function(done) {
        sendBody001 = {};
        Object.assign(
            sendBody001,
            testFixture
        );

        // assign name to agency
        sendBody001.name += timeStamp;

        // assign random string to salesforce id
        sendBody001.salesforceId = chance.string({length: 18});

        request(targetServer)
            .post(util.format(targetEndpoint.agencyCreate))
            .set(authHeaders)
            .send(sendBody001)
            .then( function(res) {
                // basic response verification
                expect(res.body).to.exist;
                expect(res.status).to.equal(201);

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

    it('response should have status of 201', function() {
        expect(res001.status).to.equal(201);
    });

    it('notices and errors should not exist', function() {
        expect(resText001.notices).to.not.exist;
        expect(resText001.errors).to.not.exist;
    });

    it('response object property types should match spec', function() {
        expect(validator.isInt(resOutput001.version + '')).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.id)).to.be.true;
        expect(validator.isInt(resOutput001.refId + '')).to.be.true;
        expect(resOutput001.status).to.be.oneOf([
            'active', 'inactive', 'pending', 'deleted'
        ]);
        if (resOutput001.salesforceId !== null) {
            expect(resOutput001.salesforceId).to.have.length.of.at.most(32);
        }
        expect(resOutput001.name).to.have.length.of.at.most(32);
        if (resOutput001.description !== null) {
            expect(resOutput001.description).to.have.length.of.at.most(255);
        }
        if (resOutput001.advertisers !== null) {
            expect(resOutput001.advertisers).to.be.instanceof(Array);
        }
        expect(resOutput001.manager).to.be.null;
        expect(resOutput001.managerName).to.be.null;
        expect(resOutput001.managerEmail).to.be.null;
        if (resOutput001.isApiPartner !== null) {
            expect(resOutput001.isApiPartner).to.be.a('boolean');
        }
        // contact object
        expect(resOutput001.contact).to.be.an('object');
        if (resOutput001.contact.company !== null) {
            expect(resOutput001.contact.company)
                .to.have.length.of.at.most(128);
        }
        if (resOutput001.contact.emailAddress !== null) {
            expect(validator
                .isEmail(resOutput001.contact.emailAddress)).to.be.true;
        }
        if (resOutput001.contact.firstName !== null) {
            expect(resOutput001.contact.firstName)
                .to.have.length.of.at.most(32);
        }
        if (resOutput001.contact.lastName !== null) {
            expect(resOutput001.contact.lastName)
                .to.have.length.of.at.most(32);
        }
        if (resOutput001.contact.phone !== null) {
            expect(resOutput001.contact.phone)
                .to.have.length.of.at.most(32);
        }
        if (resOutput001.contact.address1 !== null) {
            expect(resOutput001.contact.address1)
                .to.have.length.of.at.most(128);
        }
        if (resOutput001.contact.address2 !== null) {
            expect(resOutput001.contact.address2)
                .to.have.length.of.at.most(128);
        }
        if (resOutput001.contact.city !== null) {
            expect(resOutput001.contact.city)
                .to.have.length.of.at.most(64);
        }
        if (resOutput001.contact.state !== null) {
            expect(resOutput001.contact.state)
                .to.have.length.of.at.most(32);
        }
        if (resOutput001.contact.postalCode !== null) {
            expect(resOutput001.contact.postalCode)
                .to.have.length.of.at.most(32);
        }
        if (resOutput001.contact.country !== null) {
            expect(resOutput001.contact.country)
                .to.have.length.of.at.most(32);
        }
        // contract object
        expect(resOutput001.contractType).to.be.null;

        // created and modified
        expect(validator.isISO8601(resOutput001.created)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.createdBy)).to.be.true;
        expect(validator.isISO8601(resOutput001.modified)).to.be.true;
        expect(/^[a-f0-9]{32}$/.test(resOutput001.modifiedBy)).to.be.true;
    });

    it('response object key values should match test object', function() {
        expect(resOutput001.version)
            .to.equal(verifyFixture.version);
        expect(resOutput001.status)
            .to.equal(verifyFixture.status);
        expect(resOutput001.salesforceId)
            .to.equal(sendBody001.salesforceId);
        expect(resOutput001.name)
            .to.equal(sendBody001.name);
        expect(resOutput001.description)
            .to.equal(verifyFixture.description);
        expect(resOutput001.advertisers)
            .to.eql(verifyFixture.advertisers);
        expect(resOutput001.manager)
            .to.equal(verifyFixture.manager);
        expect(resOutput001.managerName)
            .to.equal(verifyFixture.managerName);
        expect(resOutput001.managerEmail)
            .to.equal(verifyFixture.managerEmail);
        expect(resOutput001.isApiPartner)
            .to.equal(verifyFixture.isApiPartner);
        // contact object
        expect(resOutput001.contact.company)
            .to.equal(verifyFixture.contact.company);
        expect(resOutput001.contact.emailAddress)
            .to.equal(verifyFixture.contact.emailAddress);
        expect(resOutput001.contact.firstName)
            .to.equal(verifyFixture.contact.firstName);
        expect(resOutput001.contact.lastName)
            .to.equal(verifyFixture.contact.lastName);
        expect(resOutput001.contact.phone)
            .to.equal(verifyFixture.contact.phone);
        expect(resOutput001.contact.phone)
            .to.equal(verifyFixture.contact.phone);
        expect(resOutput001.contact.address1)
            .to.equal(verifyFixture.contact.address1);
        expect(resOutput001.contact.address2)
            .to.equal(verifyFixture.contact.address2);
        expect(resOutput001.contact.city)
            .to.equal(verifyFixture.contact.city);
        expect(resOutput001.contact.state)
            .to.equal(verifyFixture.contact.state);
        expect(resOutput001.contact.postalCode)
            .to.equal(verifyFixture.contact.postalCode);
        expect(resOutput001.contact.country)
            .to.equal(verifyFixture.contact.country);
        // contract object
        expect(resOutput001.selfServe)
            .to.equal(verifyFixture.selfServe);
        expect(resOutput001.dspFee)
            .to.equal(verifyFixture.dspFee);
    });

    after('delete agency', function(done) {
        request(targetServer)
            .del(util.format(targetEndpoint.agencyDelete, resOutput001.id))
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
