var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.InputDelete = function (opts, $contentTarget) {
	var self = this;

	var options = {
		"target" : $(document.body)
	}
	
	$.extend(options, opts)

	console.log('Creating an Input with Delete button.');
	
	if (typeof $contentTarget !== 'undefined') {
		//Operate on the existing version
		this.el = $contentTarget;
	}
	else {
		this.el = $('<div class="deletable"><input type="text"></input><div>x</div></div>');
	}
	
	var inputBox = this.el.find('input');
	var deleteButton = this.el.find('div');
	
	//When the user types..
	inputBox.on('input', function() {
		console.log('Should I show the delete button?');
//		var deleteButton = $(this).siblings('div');
		
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
//		var inputBox = $(this).siblings('input');
		//Clear the input box
		inputBox.val('');
		//Hide the x if neccessary.
		inputBox.trigger('input');
	});
	
//	options.target.append(this.el);	
	
	return this;
}