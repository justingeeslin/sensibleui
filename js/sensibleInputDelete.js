var Component = require('./sensibleComponent.js');

InputDelete = function (opts) {
	var self = this;

	var defaults = {};

	console.log('Creating an Input with Delete button.');
	$.extend(this, defaults, opts)
	$.extend(this, new Component(this));

	//Wrap in a Div if not already wrapped
	var classToAdd = "deletable";
	var deleteButton = $('<div class="close">x</div>');

	// Wrap with a deletable class. Add a X button.
	this.el.wrap('<div class="' + classToAdd + '"></div>')
	// this.el = $().append(this.el);

	this.el.after(deleteButton);

	var inputBox = this.el.find('input');

	//When the user types..
	this.el.on('input', function() {
		console.log('Should I show the delete button?');

		if ($(this).val().length > 0) {
			console.log('Showing delete button');
			deleteButton.css('visibility', 'visible')
		}
		else {
			console.log('hiding delete button');
			deleteButton.css('visibility', 'hidden')
		}
	});

	deleteButton.on('click', function(e) {
		console.log('Clicked delete button')
		//Clear the input box
		self.el.val('');
		//Hide the x if neccessary.
		self.el.trigger('input');
	});

	return this;
}

module.exports = InputDelete;
sensible.classes.InputDelete = InputDelete;
sensible.registerComponent('input[deletable=true]', sensible.classes.InputDelete);
