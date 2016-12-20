var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.SweetIndicator = function (opts) {
	var self = this;

	var defaults = {
		target : $(document.body),
		color : 'black',
		itemSelector : 'li'
	};

	$.extend(this, defaults, opts);

	// Items that might be clicked on.
	var items = this.target.find(this.itemSelector);

	var container = $('<div class="sensible indicator"></div>')

	var indicator = $('<div class="bar">&nbsp;</div>');
	indicator.css('background-color', this.color);
	container.append(indicator);

	items.on('click go', function(e) {
		console.log('Clicked/Activated the item. Indicating: ' + $(this).text()  + ' with a height of ' + $(this).height());

		//The height (from the window) of the container
		var containerTop = container.position().top
		//The height of the item clicked
		var itemTop = $(this).position().top;
		//How far to move. Might be negative (when moving up) which is totally okay.
		var distanceToMove = itemTop - containerTop;


		//Change the height of the bar and Slide to the item
		console.log('Moving the indicator to: ' + distanceToMove + 'px');
		indicator.animate({
			top: distanceToMove + 'px',
			height: $(this).height()
		}, 250);


	});

	// Insert (only one)
	container.insertBefore(this.target.filter(':first'));

	//Activate the first item
	console.log('Indicating the first item' + items.filter(':first').text() + ' from the following items');
	items.filter(':first').trigger('go');

	return this;
}
