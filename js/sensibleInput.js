var Component = require('sensible-component')

Input = function (opts) {
	var self = this;

	var defaults = {
		placeholderText : "",
		//This can always be overridden
		el : $('<input type="text"></input>')
	}

	$.extend(this, defaults, opts);
	$.extend(this, new Component(this));

	this.el.attr('placeholder', this.placeholderText);

	return this;
}

module.exports = Input;
