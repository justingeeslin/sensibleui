var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.Input = function (opts) {
	var self = this;

	var defaults = {
		placeholderText : "",
		//This can always be overridden
		el : $('<input type="text"></input>')
	}

	$.extend(this, defaults, opts);
	$.extend(this, new sensible.classes.Component(this));

	this.el.attr('placeholder', this.placeholderText);

	//Add to DOM
	if (typeof this.target != "undefined") {
		this.el.appendTo(this.target);
	}

	return this;
}
