'use strict';

// common runtime variables
const rootPath = process.env.ROOT_PATH;
const BasePage = require(rootPath + '/pages/maverick');

// selenium runtime variables
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

// inputs
const BUTTON_DATA_TYPE = By.css('div.padding-large > section > div > ' +
    'div._form--group > div._form--control > select-dropdown > div > button');
const CHECK_MERKLE = By.xpath('//input[@name="merkle"]/parent::label');
const CHECK_SHARE = By.xpath('//input[@name="isShared"]/parent::label');
const CHECK_EMAIL = By.xpath('//input[@name="emailMe"]/parent::label');
const INPUT_MERKLE = By.css('input[name="merkle"]');
const INPUT_SHARE = By.css('input[name="isShared"]');
const BUTTON_ACTION = By.css('div > div:nth-child(3) select-dropdown > ' +
    'div > button');

function AudienceEditFormPage(webdriver) {
    BasePage.call(this, webdriver);
}

AudienceEditFormPage.prototype = Object.create(BasePage.prototype);
AudienceEditFormPage.prototype.constructor = AudienceEditFormPage;


// Getters
AudienceEditFormPage.prototype.getButtonDataType = function() {
    this.waitUntilVisible(BUTTON_DATA_TYPE);
    return this.findElement(BUTTON_DATA_TYPE);
};

AudienceEditFormPage.prototype.getButtonAction = function() {
    this.waitUntilVisible(BUTTON_ACTION);
    return this.findElement(BUTTON_ACTION);
};

AudienceEditFormPage.prototype.getCheckMerkle = function() {
    this.waitUntilVisible(CHECK_MERKLE);
    return this.findElement(CHECK_MERKLE);
};

AudienceEditFormPage.prototype.getCheckShare = function() {
    this.waitUntilVisible(CHECK_SHARE);
    return this.findElement(CHECK_SHARE);
};

AudienceEditFormPage.prototype.getCheckEmail = function() {
    this.waitUntilVisible(CHECK_EMAIL);
    return this.findElement(CHECK_EMAIL);
};

AudienceEditFormPage.prototype.getInputMerkle = function() {
    // this.waitUntilVisible(INPUT_MERKLE);
    return this.findElement(INPUT_MERKLE);
};

AudienceEditFormPage.prototype.getInputShare = function() {
    // this.waitUntilVisible(INPUT_SHARE);
    return this.findElement(INPUT_SHARE);
};


// Clicks

AudienceEditFormPage.prototype.clickDataType = function() {
    this.waitUntilVisible(BUTTON_DATA_TYPE);
    this.click(BUTTON_DATA_TYPE);
    return this;
};

AudienceEditFormPage.prototype.clickAction = function() {
    this.waitUntilVisible(BUTTON_ACTION);
    this.click(BUTTON_ACTION);
    return this;
};

AudienceEditFormPage.prototype.clickCheckMerkle = function() {
    this.click(CHECK_MERKLE);
    return this;
};

AudienceEditFormPage.prototype.clickCheckEmail = function() {
    this.click(CHECK_EMAIL);
    return this;
};


module.exports = AudienceEditFormPage;
