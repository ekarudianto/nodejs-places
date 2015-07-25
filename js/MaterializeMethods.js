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