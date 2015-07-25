/*
 
 The MIT License (MIT)
 
 Copyright (c) <2015> <Eka Rudianto>
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 
 Created on : Jul 17, 2015, 12:02:31 AM
 Author     : Eka Rudianto
 Website    : http://ekarudianto.com
 Github     : https://github.com/ekarudianto
 
 */

/*
 * this class filled with certain collection of 
 * Materialize css methods
 * =============================================
 */

var MaterializeMethods = function() {
    this.Materialize = Materialize;
}

/*
 * below method returns a string representing the object
 * =====================================================
 */

MaterializeMethods.prototype.toString = function() {
    return "You're accessing MaterializeMethods class";
}

/*
 * Materialize collapsible 
 * =======================
 */

MaterializeMethods.prototype.collapsible = function(selector) {
    $(selector).collapsible();
}

/*
 * Materialize toast
 * =================
 */

MaterializeMethods.prototype.simpleToast = function(content, timeout) {
    timeout = (!timeout) ? 2000 : timeout;
    content = (!content) ? "This is Toast !" : content;

    this.Materialize.toast(content, timeout);
}

/*
 * Materialize Tooltips
 * =====================
 */

MaterializeMethods.prototype.tooltip = function(selector) {
    $(selector).tooltip();
}

/*
 * Materialize Dropdown
 * ====================
 */

MaterializeMethods.prototype.dropdown = function(selector) {
    $(selector).dropdown({
        inDuration: 300,
        outDuration: 250,
        hover: true
    });
}

/*
 * Materialize materialBox
 * =======================
 */

MaterializeMethods.prototype.materialBox = function(selector) {
    $(selector).materialbox();
}

/*
 * Materialize slider
 * ===================
 */

MaterializeMethods.prototype.slider = function(selector, fullScreen) {
    $(selector).slider({full_width: fullScreen});
}

/*
 * Materialize open modal programatically
 * ======================================
 */

MaterializeMethods.prototype.openModal = function(selector) {
    $(selector).openModal();
}

/*
 * Materialize close modal programatically
 * =======================================
 */

MaterializeMethods.prototype.closeModal = function(selector) {
    $(selector).closeModal();
}

/*
 * Materialize tabs
 * ================
 */

MaterializeMethods.prototype.tabs = function(selector) {
    $(selector).tabs();
}

/*
 * Materialize select tab programatically
 * ======================================
 */

MaterializeMethods.prototype.tabSelect = function(selector, tabId) {
    $(selector).tabs('select_tab', tabId);
}