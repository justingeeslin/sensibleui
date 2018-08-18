var Component = require('./sensibleComponent.js');
var S = require('sortablejs');
Sortable = function (opts) {
	var self = this;

	var defaults = {};

	$.extend(this, defaults, opts);
	$.extend(this, new Component(this));

  S.create(this.el[0]);

	return this;
}

module.exports = Sortable;
