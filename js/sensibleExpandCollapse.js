var Component = require('./sensibleComponent.js');

var ExpandCollapse = function (opts) {
	var self = this;

	var defaults = {
		title : "Untitled",
		content : "Untitled Body.",
		slug : "untitled",
		url : 'untitled',
		classes : 'expand-collapse'
	};

	$.extend(this, defaults, opts);
	$.extend(this, new Component(this));

	this.id = this.url.split('/').join('-');

	// Discover the attributes
	var title = this.el.find('.title');
	var titleText = title.html();
	if (titleText.length > 0) {
		this.title = titleText;
	}

	var body = this.el.find('.body')
	var bodyText = body.html();
	if (bodyText.length > 0) {
		this.content = bodyText;
	}

	//Handles expanding and collapsing
	this.toggle = function(e) {
		//No need for this to bubble
		e.preventDefault()

		console.log('Toggling... ' + self.slug);
		//Update the URL incase the windows is refreshed. Prevent default and use this because a normal click is a push and not a replace
		// history.replaceState(null, null, '#' + self.slug )

		if (!self.isOpen()) {
			self.open();
		}
		else {
			self.close();
		}

	}

	this.isOpen = function() {
		return body.is(':visible');
	}

	this.close = function() {
		console.log('Closing: ' + self.slug);
		self.el.removeClass('open');
		body.hide()
	}

	this.open = function() {
		console.log('Opening: ' + self.slug);
		self.el.addClass('open');
		body.show()
	}

	title.on('click', this.toggle);

	//Expose an events..
	// ...to toggle the activation. Maybe called when a screen un-slides to close it.
	$(this.el).on('toggle', this.toggle);
	// ...to close
	$(this.el).on('close', this.close);
	// ...to open
	$(this.el).on('open', this.open);

	$(this.el).on('go', this.toggle);

	// Debug
	$(this.el).on('go', function(e) {
		console.log('Go: ' + self.slug + ' by ');
		console.log(e.target);
	});

	// Should be closed upon construction.
	this.close();

	return this;
}

module.exports = ExpandCollapse;
sensible.classes.ExpandCollapse = ExpandCollapse;
sensible.registerComponent('div.expand-collapse', sensible.classes.ExpandCollapse);
