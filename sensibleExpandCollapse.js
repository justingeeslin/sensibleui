var sensible = typeof sensible !== "undefined" ? sensible : {};
sensible.classes = typeof sensible.classes !== "undefined" ? sensible.classes : {};

sensible.classes.ExpandCollapse = function (opts) {
	var self = this;

	var defaults = {
		title : "Untitled",
		content : "Untitled Body.",
		slug : "untitled",
		url : 'untitled',
		classes : 'expand-collapse'
	};

	$.extend(this, defaults, opts);

	console.log("Creating an Expand/Collapse: " + this.title);
	console.log(this);

	this.el = $('<span></span>');
	this.el.addClass(this.classes);
	this.el.append('<a href="#' + this.url + '">' + this.title + '</a>');
	var answer = $('<div style="display:none;">' + this.content + '</div>');
	this.el.append(answer);

	//Handles expanding and collapsing
	this.toggle = function(e) {
		//No need for this to bubble
		e.preventDefault()

		//Update the URL incase the windows is refreshed
		history.replaceState(null, null, $(this).attr('href') )

		console.log('Toggling... ' + self.slug);

		if (!self.isOpen()) {
			self.open();
		}
		else {
			self.close();
		}

	}

	this.isOpen = function() {
		console.log('This is my element:')
		console.log(self.el);
		return self.el.find('div').is(':visible');
	}

	this.close = function() {
		console.log('Closing: ' + self.slug);
		answer.hide()
	}

	this.open = function() {
		console.log('Opening: ' + self.slug);
		answer.show()
	}

	$(this.el).on('click', ' > a', this.toggle);

	//Expose an events..
	// ...to toggle the activation. Maybe called when a screen un-slides to close it.
	$(this.el).on('toggle', this.toggle);
	// ...to close
	$(this.el).on('close', this.close);
	// ...to open
	$(this.el).on('open', this.open);

	//Append to the Document or whatever
	//If a target was supplied..
	if (typeof this.target !== undefined) {
		//... append to it.
		self.el.appendTo(self.target);
	}

	return this;
}
