'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.admin;
const driverTimeOut = 0;

// bootstrap variables
const entitiesFile =
    require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv = entitiesObj.agency001.children.advertiser001;
const timeStamp =
    '@' + moment().format('YYYY-MM-DDTHH:mm');

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let SideBar = require(rootPath + '/pages/maverick/platform/side-bar');
let AudLibrary = require(rootPath + '/pages/maverick/campaign-manager/' +
    'audience-library');
let AudCards = require(rootPath + '/pages/maverick/campaign-manager/' +
    'audience-cards');
let AudPage = require(rootPath + '/pages/maverick/campaign-manager/' +
    'audience-form');
let AudDynPage = require(rootPath + '/pages/maverick/campaign-manager/' +
    'audience-dynamic-form');
let audLibrary;
let audPage;
let audDynPage;
let audCards;
let sideBar;
let loginPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

// fixtures(s)
const testFixture = require(rootPath + '/fixtures/common/audience/create001');
let testData002 = Object.assign({}, testFixture);
const audienceName = testData002.name + timeStamp;

describe('<UNSTABLE> {{MAVERICK}} /audience-form {create} @MANAGER >>> ' +
    '(+) create Event based audience >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        audPage = new AudPage(driver);
        audDynPage = new AudDynPage(driver);
        audLibrary = new AudLibrary(driver);
        audCards = new AudCards(driver);
        sideBar = new SideBar(driver);
        loginPage = new LoginPage(driver);
        driver.manage().deleteAllCookies().then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('maverick - login', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('it should navigate to Event based audience page', function(done) {
        sideBar.closeLastOuterDiv();
        sideBar.closeOuterDiv();
        sideBar.clickAudiencesLink();
        audLibrary.clickNewAudience();
        audCards.clickEventAudience();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('it should fill all required fields', function(done) {
        // basic info
        audPage.setInputAdvertiser(targetAdv.name);
        audPage.setInputAudienceName(audienceName);
        audDynPage.clickButtonEvent();
        audDynPage.clickSpan('addToCart');
        audDynPage.clickButtonEvent();
        audPage.clickUpload();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('audience should be created', function(done) {
        audLibrary.setInputSearch(audienceName);
        expect(audLibrary.getLinkText(audienceName)).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

});
