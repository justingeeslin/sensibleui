var sensible = typeof sensible !== "undefined" ? sensible : {};
sensible.classes = typeof sensible.classes !== "undefined" ? sensible.classes : {};

sensible.classes.Accordion = function (opts) {
	var self = this;

	var defaults = {};

	$.extend(this, defaults, opts);
	$.extend(this, new sensible.classes.ExpandCollapse(this));

	var closeOthers = function() {
		console.log('Accordion: Closing others...');
		//Trigger a close on everyone who is open but not me
		$('.' + self.classes + '.open').not(self.el).trigger('close');
	}

	$(this.el).on('open', closeOthers);
	$(this.el).on('go', closeOthers);

	$(this.el).on('click', ' > a', closeOthers);

	//Append to the Document or whatever
	//If a target was supplied..
	if (typeof this.target !== undefined) {
		//... append to it.
		self.el.appendTo(self.target);
	}

	return this;
}
