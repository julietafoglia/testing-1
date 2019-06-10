'use strict';

// vendor dependencies
const chai = require('chai');
const expect = chai.expect;

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const driverBuilder = require(rootPath + '/helpers/driver-builder');
const driverTimeOut = 0;

//  Page object(s)
let LoginPage = require(rootPath + '/pages/maverick/platform/login');
let DashboardPage =
    require(rootPath + '/pages/maverick/inventory-manager/dashboard');
let NewsletterDetailsPage =
    require(rootPath + '/pages/maverick/inventory-manager/newsletter-details');

// maverick runtime variables
const targetEnvironment =
    require(rootPath + '/config/maverick/' + process.env.NODE_ENV);
const targetServer = targetEnvironment.server;
const targetEndpoint =
    require(rootPath + '/config/maverick/endpoints');
const targetEnvironmentUsers =
    require(rootPath + '/config/users/' + process.env.NODE_ENV);
const targetUser = targetEnvironmentUsers.admin;

// bootstrap
const entitiesFile =
    require(rootPath + '/bootstrap/entities-ssp.json');
const entitiesObj = entitiesFile;
const targetMediaGroup = entitiesObj.manager.mediaGroup001;
const targetPublisher = targetMediaGroup.publisher001;
const targetNewsletter = targetPublisher.newsletter001;

// shared test variable(s)
let driver;
let newsletterName = 'test newsletter';
let newsletterId = 'ID: 25312';
let publisherTitle = 'PUBLISHER';
let newsletterTitle = 'NEWSLETTER';
let adslotsTitle = '# OF AD SLOTS';
let createdTitle = 'CREATED';
let lastUpdTitle = 'LAST UPDATED';

// page objects
let dashboardPage, loginPage, newsletterDetailsPage;

describe('<STABLE> {{MAVERICK}} inventory manager - Newsletter ' +
    'inventory library >>> (+) basic ui validation >>>', function() {

    // disable mocha time outs
    this.timeout(0);

    before('get webdriver and reset session', (done) => {
        driver = driverBuilder();
        loginPage = new LoginPage(driver);
        newsletterDetailsPage = new NewsletterDetailsPage(driver);
        dashboardPage = new DashboardPage(driver);
        driver.manage().deleteAllCookies().then( () => {
            done();
        }, (err) => {
            done(err);
        });
    });

    it('should login to maverick', function(done) {
        loginPage.login(targetServer, targetUser)
            .then(() => done());
    });

    it('should navigate to inventory library page', (done) => {
        let url = targetServer + targetEndpoint.inventoryDashboard;
        dashboardPage.goto(url);
        dashboardPage.waitUntilSpinnerNotVisible();
        expect(dashboardPage.getCreatePublisherButton()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show Newsletter table', (done) => {
        dashboardPage.selectNewsletterView();
        expect(dashboardPage.getFirstColumnTitle()).to.exist;
        dashboardPage.getFirstColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(newsletterTitle);
            });
        expect(dashboardPage.getSecondColumnTitle()).to.exist;
        dashboardPage.getSecondColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(publisherTitle);
            });
        expect(dashboardPage.getThirdColumnTitle()).to.exist;
        dashboardPage.getThirdColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(adslotsTitle);
            });
        expect(dashboardPage.getFourthColumnTitle()).to.exist;
        dashboardPage.getFourthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(createdTitle);
            });
        expect(dashboardPage.getFifthColumnTitle()).to.exist;
        dashboardPage.getFifthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(lastUpdTitle);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show expected element after filtering table', function(done) {
        dashboardPage.setSearchField(newsletterId.split(' ')[1]);
        dashboardPage.waitUntilFilterNotVisible();
        dashboardPage.waitUntilFilterNotVisible();
        expect(dashboardPage.getFirstTableName()).to.exist;
        dashboardPage.getFirstTableName().getText().
            then(function(getText) {
                expect(getText).to.include(newsletterName);
            });
        expect(dashboardPage.getFirstTableRow()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should show table after removing filter added', function(done) {
        dashboardPage.removeFilterOption();
        dashboardPage.noRemoveFilterOptionDisplayed()
            .then(function(arr) {
                expect(arr).to.be.empty;
            });
        expect(dashboardPage.getFirstTableRow()).to.exist;
        expect(dashboardPage.getFirstColumnTitle()).to.exist;
        dashboardPage.getFirstColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(newsletterTitle);
            });
        expect(dashboardPage.getSecondColumnTitle()).to.exist;
        dashboardPage.getSecondColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(publisherTitle);
            });
        expect(dashboardPage.getThirdColumnTitle()).to.exist;
        dashboardPage.getThirdColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(adslotsTitle);
            });
        expect(dashboardPage.getFourthColumnTitle()).to.exist;
        dashboardPage.getFourthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(createdTitle);
            });
        expect(dashboardPage.getFifthColumnTitle()).to.exist;
        dashboardPage.getFifthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(lastUpdTitle);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough Next table pages', function(done) {
        dashboardPage.waitUntilNextControlButtonEnabled();
        dashboardPage.clickNextPageTableControl();
        dashboardPage.waitUntilFirstControlButtonEnabled();
        dashboardPage.waitUntilPreviousControlButtonEnabled();
        expect(dashboardPage.getSearchField()).to.exist;
        expect(dashboardPage.getFirstTableRow()).to.exist;
        expect(dashboardPage.getFirstColumnTitle()).to.exist;
        dashboardPage.getFirstColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(newsletterTitle);
            });
        expect(dashboardPage.getSecondColumnTitle()).to.exist;
        dashboardPage.getSecondColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(publisherTitle);
            });
        expect(dashboardPage.getThirdColumnTitle()).to.exist;
        dashboardPage.getThirdColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(adslotsTitle);
            });
        expect(dashboardPage.getFourthColumnTitle()).to.exist;
        dashboardPage.getFourthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(createdTitle);
            });
        expect(dashboardPage.getFifthColumnTitle()).to.exist;
        dashboardPage.getFifthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(lastUpdTitle);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough Previous table pages', function(done) {
        dashboardPage.clickPreviousPageTableControl();
        dashboardPage.waitUntilFirstControlButtonDisabled();
        dashboardPage.waitUntilPreviousControlButtonDisabled();
        expect(dashboardPage.getSearchField()).to.exist;
        expect(dashboardPage.getFirstTableRow()).to.exist;
        expect(dashboardPage.getFirstColumnTitle()).to.exist;
        dashboardPage.getFirstColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(newsletterTitle);
            });
        expect(dashboardPage.getSecondColumnTitle()).to.exist;
        dashboardPage.getSecondColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(publisherTitle);
            });
        expect(dashboardPage.getThirdColumnTitle()).to.exist;
        dashboardPage.getThirdColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(adslotsTitle);
            });
        expect(dashboardPage.getFourthColumnTitle()).to.exist;
        dashboardPage.getFourthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(createdTitle);
            });
        expect(dashboardPage.getFifthColumnTitle()).to.exist;
        dashboardPage.getFifthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(lastUpdTitle);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough Last table pages', function(done) {
        dashboardPage.waitUntilLastControlButtonEnabled();
        dashboardPage.clickLastPageTableControl();
        dashboardPage.waitUntilLastControlButtonDisabled();
        dashboardPage.waitUntilNextControlButtonDisabled();
        expect(dashboardPage.getSearchField()).to.exist;
        expect(dashboardPage.getFirstTableRow()).to.exist;
        expect(dashboardPage.getFirstColumnTitle()).to.exist;
        dashboardPage.getFirstColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(newsletterTitle);
            });
        expect(dashboardPage.getSecondColumnTitle()).to.exist;
        dashboardPage.getSecondColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(publisherTitle);
            });
        expect(dashboardPage.getThirdColumnTitle()).to.exist;
        dashboardPage.getThirdColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(adslotsTitle);
            });
        expect(dashboardPage.getFourthColumnTitle()).to.exist;
        dashboardPage.getFourthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(createdTitle);
            });
        expect(dashboardPage.getFifthColumnTitle()).to.exist;
        dashboardPage.getFifthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(lastUpdTitle);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should navigate trough First table pages', function(done) {
        dashboardPage.waitUntilFirstControlButtonEnabled();
        dashboardPage.clickFirstPageTableControl();
        dashboardPage.waitUntilFirstControlButtonDisabled();
        dashboardPage.waitUntilPreviousControlButtonDisabled();
        expect(dashboardPage.getSearchField()).to.exist;
        expect(dashboardPage.getFirstTableRow()).to.exist;
        expect(dashboardPage.getFirstColumnTitle()).to.exist;
        dashboardPage.getFirstColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(newsletterTitle);
            });
        expect(dashboardPage.getSecondColumnTitle()).to.exist;
        dashboardPage.getSecondColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(publisherTitle);
            });
        expect(dashboardPage.getThirdColumnTitle()).to.exist;
        dashboardPage.getThirdColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(adslotsTitle);
            });
        expect(dashboardPage.getFourthColumnTitle()).to.exist;
        dashboardPage.getFourthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(createdTitle);
            });
        expect(dashboardPage.getFifthColumnTitle()).to.exist;
        dashboardPage.getFifthColumnTitle().getText().
            then(function(getText) {
                expect(getText).to.equal(lastUpdTitle);
            });
        driver.sleep(driverTimeOut).then(() => done());
    });

    it('should access Newsletter detail page', function(done) {
        dashboardPage.setSearchField(newsletterId.split(' ')[1]);
        dashboardPage.waitUntilFilterNotVisible();
        expect(dashboardPage.getFirstTableName()).to.exist;
        expect(dashboardPage.getFirstTableRow()).to.exist;
        dashboardPage.sortByCreatedDate();
        dashboardPage.openFirstEntity(newsletterName);
        newsletterDetailsPage.getNewsletterName().then((name) => {
            expect(name).to.equal(newsletterName);
        });
        newsletterDetailsPage.getNewsletterId().then((name) => {
            expect(name).to.equal(newsletterId);
        });
        expect(newsletterDetailsPage.getCreateAdSlotButton()).to.exist;
        // expect(newsletterDetailsPage.getAdSlotTableHeader()).to.exist;
        expect(newsletterDetailsPage.getEditNewsletterLink()).to.exist;
        expect(newsletterDetailsPage.getViewTagsNewsletterLink()).to.exist;
        expect(newsletterDetailsPage.getDownloadTagsNewsletterLink()).to.exist;
        expect(newsletterDetailsPage.getDeleteNewsletterLink()).to.exist;
        expect(newsletterDetailsPage.getBreadcrumbLink()).to.exist;
        driver.sleep(driverTimeOut).then(() => done());
    });
});
