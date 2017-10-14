window.sensible = window.sensible !== undefined ? window.sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.ScrollSpy = function (opts) {
	var self = this;

	var outline = {
		el : $('<div class="outline"></div>')
	}

	var defaults = {
		//The place where we'll by spying on. Contains headers.
		target : $(document.body),
		//The place where the outline will be written
		outlineTarget : $(document.body),
		//Create the outline from these headers.
		headerSelector : "h1,h2,h3,h4,h5,h6",
		//Whether to generate an outline from headers or not.
		generateOutline : true,
	};

	$.extend(this, defaults, opts);

	console.log('Creating ScrollSpy')

	outline.create = function() {
		console.log('Creating Outline..')

		// Each header..
		headers.each(function() {
			console.log('Adding an outline item')

			var id = $(this).attr('id') ? $(this).attr('id') : '';
			//.. add to the outline
			outline.el.append('<li><a href="#' + id + '">' + $(this).text() + "</a></li>");
		})
	}
	if (this.generateOutline) {
		outline.create();
	}

	// Keep track of the current heading so that we don't trigger events quite as often.
	var currentHeadingId = "";
	var activateOutlineItems = function() {

		//Find the most visible heading ie the one closest to the top without going past the window's height
		//Collect the id of the heading
		var id = "";

		// A collection of headers
		var headers = [];
		console.log('Finding all the headers matching this selector: ' + this.headerSelector);
		//Find all the headers and subheaders in the target. Make sure they are visible.
		headers = self.target.find(self.headerSelector).filter(':visible');

		//If the window is at the top select the first element. (Sometimes headings aren't positioned to trigger the first and last element because the page isn't tall enought to take the heading to middle of the screen.)
		var windowScrollTop = $(window).scrollTop();
		var windowScrollBottom = windowScrollTop + $(window).height();
		if (windowScrollTop <= 0) {
			console.log('Activating the first outline item for the first (visible) header');
			id = headers.filter(':first').attr('id')
		}
		else if (windowScrollBottom >= $(document).height()) {
			id = headers.filter(':last').attr('id')
		}

		var largestY = Number.NEGATIVE_INFINITY;
		headers.each(function() {
			headerRect = $(this)[0].getBoundingClientRect();
			//Not every browser has these brokenout into x and y.
			headerRect.x = headerRect.left;
			headerRect.y = headerRect.top;

			if (headerRect.y > largestY && headerRect.y < $(window).height() / 2) {
				largestY = headerRect.y;
				//Get the id
				id = $(this).attr('id') ? $(this).attr('id') : '';
			}

		})

		if (id !== currentHeadingId) {
			//Select the outline's link for this heading and trigger the 'go' event.
			$('[href="#' + id + '"]:first').trigger('go');
			console.log('Current Heading is now ' + id);
			currentHeadingId = id;
		}
	}

	//If a target was supplied..
	if (typeof this.outlineTarget !== undefined) {
		//... append to it.
		this.outlineTarget.append(outline.el);
	}

	//Activate the first outline item immediately
	activateOutlineItems();
	//Activate various items on scroll
	$(window).on('scroll', activateOutlineItems)

	// When the target is filtered, change the outline / the indicator
	$(this.target).on('filter', activateOutlineItems)

	return this;
}
