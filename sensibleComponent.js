var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.Component = function (opts) {
  var self = this;

  var defaults = {
      target : undefined,
      el : $('<div>Component</div>')
  }

  $.extend(this, defaults, opts);

  //If a target was supplied..
	if (typeof this.target !== undefined) {
		//... append to it.
		self.el.appendTo(self.target);
	}

}
