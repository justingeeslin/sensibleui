var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.InputDeleteFilter = function (opts) {

	$.extend(this, new sensible.classes.InputDelete(opts, this));
	$.extend(this, new sensible.classes.InputFilter(opts, this));

	return this;
}