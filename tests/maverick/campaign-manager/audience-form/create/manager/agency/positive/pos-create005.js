'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const usersTargetEnvironment =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = usersTargetEnvironment.admin;
const driverTimeOut = 0;

// bootstrap variables
const entitiesFile = require(rootPath + '/bootstrap/entities-dsp.json');
const entitiesObj = entitiesFile;
const targetAdv = entitiesObj.agency001.children.advertiser001;

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

describe('{{MAVERICK}} /audience-form {CREATE} @MANAGER >>> ' +
    '(+) upload audience - MatchRate SHA1 file >>>', function() {

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
        audPage.clickAction();
        audPage.clickSpan('Get Match Rate');
        audPage.clickDataTypeRate();
        audPage.clickSpan('SHA1');
        audPage.setInputFile(testFixture001);
        audPage.clickUpload();
        driver.sleep(driverTimeOut).then(() => done());
    });

    /* it('audience should be displayed in file view', function(done) {
        audLibrary.clickMatchView();
        audLibrary.getSpan(fileName);
        driver.sleep(driverTimeOut).then(() => done());
    });*/

});
