var sensible = typeof sensible !== "undefined" ? sensible : {};
sensible.classes = typeof sensible.classes !== "undefined" ? sensible.classes : {};

sensible.classes.Accordion = function (opts) {
	var self = this;

	var defaults = {};

	$.extend(this, defaults, opts);
	$.extend(this, new sensible.classes.ExpandCollapse(this));

	$(this.el).on('click', ' > a', function() {
		//Trigger a close on everyone but me
		$('.' + self.classes).not($('[href="#' + self.url + '"]').parent()).trigger('close');
	});

	//Append to the Document or whatever
	//If a target was supplied..
	if (typeof this.target !== undefined) {
		//... append to it.
		self.el.appendTo(self.target);
	}

	return this;
}
