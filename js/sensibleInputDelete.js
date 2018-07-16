var Input = require('./sensibleInput.js')

InputDelete = function (opts) {
	var self = this;

	var defaults = {};

	console.log('Creating an Input with Delete button.');
	$.extend(this, defaults, opts)
	$.extend(this, new Input(this));

	//Wrap in a Div if not already wrapped
	var classToAdd = "deletable";
	var deleteButton = $('<div>x</div>');
	
	// Wrap with a deletable class. Add a X button.
	this.el = $('<div class="' + classToAdd + '"></div>').append(this.el);

	this.el.append(deleteButton);

	var inputBox = this.el.find('input');

	//When the user types..
	inputBox.on('input', function() {
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
		inputBox.val('');
		//Hide the x if neccessary.
		inputBox.trigger('input');
	});

	//If a target was supplied..
	if (typeof this.target !== undefined) {
		//... append to it.
		self.el.appendTo(self.target);
	}

	return this;
}

module.exports = InputDelete;
