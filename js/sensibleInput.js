
window.sensible = window.sensible !== undefined ? window.sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};
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

	//Add to DOM
	if (typeof this.target !== "undefined") {
		this.el.appendTo(this.target);
	}

	return this;
}

module.exports = Input;
