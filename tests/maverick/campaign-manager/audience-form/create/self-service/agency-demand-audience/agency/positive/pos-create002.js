'use strict';

// vendor dependencies
const moment = require('moment');

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment = require(rootPath +
    '/bootstrap/entities-dsp.json');
const targetUser = usersTargetEnvironment.agency002.children.agencyUser001;
const driverTimeOut = 0;
const shortTimeStamp = '@' + moment().format('YYYY-MM-DDTHH:mm');

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv = entitiesObj.agency002.children.advertiser001;

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let SideBar = require(rootPath + '/pages/maverick/platform/side-bar');
let AudLibrary = require(rootPath + '/pages/maverick/campaign-manager/' +
    'audience-library');
let AudPage = require(rootPath + '/pages/maverick/campaign-manager/' +
    'audience-form');
let audLibrary;
let audPage;
let sideBar;
let loginPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');

// fixtures(s)
const testFixture001 = rootPath + '/fixtures/common/audience/create005.txt';
const testFixture002 =
    require(rootPath + '/fixtures/common/audience/create001');
let testData001 = Object.assign({}, testFixture002);
testData001.name = testData001.name + shortTimeStamp + ' (SHA1)';


describe('{{MAVERICK}} /audience-form {CREATE} @SS-AGENCY >>> ' +
    '(+) upload audience - SHA1 file >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        audPage = new AudPage(driver);
        audLibrary = new AudLibrary(driver);
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

    it('it should navigate to audiences page', function(done) {
        sideBar.clickAudiencesLink();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should create audience', function(done) {
        audLibrary.clickNewAudience();
        audPage.setInputAdvertiser(targetAdv.name);
        audPage.setInputAudienceName(testData001.name);
        audPage.setInputFile(testFixture001);
        audPage.clickDataType();
        audPage.clickSpan('SHA1');
        audPage.clickUpload();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('audience should be displayed in audience view', function(done) {
        audLibrary.clickCreated();
        audLibrary.waitUntilSpinnerDissapear();
        audLibrary.getAudienceName(testData001.name);
        driver.sleep(driverTimeOut).then(() => done());
    });

});
