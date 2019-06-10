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

let driver; // initialized during test runtime

// selenium page object(s)
//  initialized during test runtime
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let SideBarPage = require(rootPath + '/pages/maverick/platform/side-bar');
let NavBarPage = require(rootPath + '/pages/maverick/platform/nav-bar');
let DealsDetailsPage = require(rootPath +
     '/pages/maverick/inventory-manager/deals-details');
let DealsFormPage = require(rootPath +
     '/pages/maverick/inventory-manager/deals-form');
let loginPage;
let sideBarPage;
let navBarPage;
let dealsDetailsPage;
let dealsFormPage;

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const driverBuilder = require(rootPath + '/helpers/driver-builder');
const timeStampShort =
    '@' + moment().format('YYYY-MM-DDTHH:mm');
const packageName = 'initestMGuserPackage 7-27';
const dspName = 'Centro';
const buyerName = 'Sitescout';

describe('<SMOKE> {{MAVERICK}} /deals {CREATE} @MANAGER >>> ' +
    '(+) verify ui elements >>>', function() {

    // disable mocha time outs
    this.timeout(0);
    let testFixture = Object.assign(
        {}, require(rootPath + '/fixtures/common/deals/create001')
    );
    testFixture.name = testFixture.name + timeStampShort;

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        sideBarPage = new SideBarPage(driver);
        navBarPage = new NavBarPage(driver);
        dealsDetailsPage = new DealsDetailsPage(driver);
        dealsFormPage = new DealsFormPage(driver);
        driver.manage().deleteAllCookies().then( ()=> {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('maverick - login', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('should load deals form', function(done) {
        navBarPage.clickInventoryManager();
        navBarPage.closeOuterDiv();
        sideBarPage.clickDealsLink();
        dealsDetailsPage.clickCreateDeal();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should fill required fields', function(done) {
        dealsFormPage.fillDealName(testFixture.name);
        dealsFormPage.fillPackage(packageName);
        dealsFormPage.fillDealFloor(testFixture.floor);
        dealsFormPage.clickDemandTypeDropdown();
        dealsFormPage.clickSpan('Direct');
        dealsFormPage.clickDeviceIdDropdown();
        dealsFormPage.clickSpan('Cookie ID');
        dealsFormPage.fillDSP(dspName);
        dealsFormPage.fillBuyer(buyerName);
        dealsFormPage.clickName();
        dealsFormPage.clickCreateDeal();
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should wait for success alert', function(done) {
        dealsFormPage.waitForAlert();
        driver.sleep(driverTimeOut).then(() => done());
    });
});
