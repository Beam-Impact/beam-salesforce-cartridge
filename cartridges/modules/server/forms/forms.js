'use strict';

var field = require('./formfield');
var action = require('./formaction');

/**
 * Convert dw.web.Form or dw.web.FormGroup to plain JS object
 * @param  {dw.web.Form|dw.web.FormGroup} form Form to be parsed
 * @return {Object} Plain JS form object
 */
function parseForm(form) {
    var formField = require('dw/web/FormField');
    var formAction = require('dw/web/FormAction');
    var formGroup = require('dw/web/FormGroup');
    var result = {
        valid: form.valid,
        htmlName: form.htmlName,
        dynamicHtmlName: form.dynamicHtmlName,
        error: form.error || null,
        attributes: 'name = "' + form.htmlName + '" id = "' + form.htmlName + '"',
        formType: 'formGroup'
    };
    Object.keys(form).forEach(function (key) {
        if (form[key] instanceof formField) {
            result[key] = field(form[key]);
        } else if (form[key] instanceof formAction) {
            result[key] = action(form[key]);
        } else if (form[key] instanceof formGroup) {
            result[key] = parseForm(form[key]);
        }
    });

    return result;
}

/**
 * Copy the values of an object to form
 * @param {Object} object - the object to set the new form values to
 * @param  {dw.web.Form|dw.web.FormGroup} currentForm - Form to be parsed
 */
function copyObjectToForm(object, currentForm) {
    Object.keys(currentForm).forEach(function (key) {
        if (currentForm[key] && currentForm[key].formType === 'formGroup') {
            copyObjectToForm(object, currentForm[key]);
        } else if (object[key] && !Object.hasOwnProperty.call(currentForm[key], 'options')) {
            currentForm[key].value = object[key]; // eslint-disable-line no-param-reassign
        } else if (object[key] && Object.hasOwnProperty.call(currentForm[key], 'options')) {
            currentForm[key].options.forEach(function (option) {
                if (option.value === object[key]) {
                    option.selected = true; // eslint-disable-line no-param-reassign
                }
            });
        }
    });
}

/**
 * Copy the values of an object to form
 * @param {Object} formGroup - the object to set the new form values to
 * @param {Object} name - the object representing the current form
 * @return {Object} Object with a nested value
 */
function findValue(formGroup, name) {
    var ObjectWrapper = {};
    ObjectWrapper[name] = {};
    var nestedProperty = ObjectWrapper[name];
    var result;
    Object.keys(formGroup).forEach(function (key) {
        var formField = formGroup[key];
        if (formField instanceof Object) {
            if (formField.formType === 'formField') {
                nestedProperty[key] = formField.value;
                var itest = ObjectWrapper;
                result = itest;
            } else if (formField.formType === 'formGroup') {
                result[key] = findValue(formField, key);
            }
        }
    });
    return result;
}

/**
 * Clear option values
 * @param {Object} obj - the object representing the current form or formField
 */
function clearOptions(obj) {
    Object.keys(obj).forEach(function (formField) {
        if (formField === 'options') {
            obj[formField].forEach(function (key) {
                if (key.selected) {
                    key.selected = false; // eslint-disable-line no-param-reassign
                }
            });
        } else if (typeof obj[formField] === 'object'
            && Object.hasOwnProperty.call(obj[formField], 'formType')
            && (obj[formField].formType === 'formGroup'
            || obj[formField].formType === 'formField')) {
            clearOptions(obj[formField]);
        }
    });
}

module.exports = function (session) {
    return {
        getForm: function (name) {
            var currentForm = session.forms[name];
            var result = parseForm(currentForm);
            result.base = currentForm;
            result.clear = function () {
                currentForm.clearFormElement();
                clearOptions(this);
            };
            result.copyFrom = function (object) {
                copyObjectToForm(object, result);
            };
            result.toObject = function () {
                var formObj = {};
                var form = this;
                Object.keys(form).forEach(function (key) {
                    var formField = form[key];
                    if (typeof form[key] !== 'function'
                        && formField instanceof Object) {
                        if (formField.formType === 'formField') {
                            formObj[key] = formField.value;
                        } else if (formField.formType === 'formGroup') {
                            var nested = findValue(formField, key);
                            formObj[key] = nested[key];
                        }
                    }
                });
                return formObj;
            };
            return result;
        }
    };
};
