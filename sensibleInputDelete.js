var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.InputDelete = function (target) {
	var self = this;

	var target = target !== undefined ? target : $(document.body);

	console.log('Creating an Input with Delete button.');

	this.el = $('<div class="deletable"><input type="text"></input><div>x</div></div>');

	var inputBox = this.el.find('input');
	var deleteButton = this.el.find('div');
	
	//When the user types..
	this.el.on('input', 'input', function() {
		if ($(this).val().length > 0) {
			console.log('Showing delete button');
			deleteButton.css('visibility', 'visible')
		}
		else {
			console.log('hiding delete button');
			deleteButton.css('visibility', 'hidden')
		}
	});
	
	this.el.on('click', 'div', function(e) {
		console.log('Clicked delete button')
	
		//Clear the input box
		inputBox.val('');
		//Hide the x if neccessary.
		inputBox.trigger('input');
	});
	
	target.append(this.el);	
	
	return this;
}