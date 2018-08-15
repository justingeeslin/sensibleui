var Component = require('./sensibleComponent.js');

Sidebar = function (opts) {
	var self = this;

	var defaults = {};

	$.extend(this, defaults, opts);
	$.extend(this, new Component(this));

	// Add ARIA roles of menu https://w3c.github.io/aria-practices/#menu
	this.el.attr('role', 'menu');

	return this;
}

module.exports = Sidebar;
sensible.classes.Sidebar = Sidebar;
sensible.registerComponent('div[sidebar]', sensible.classes.Sidebar);
