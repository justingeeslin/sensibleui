var sensible = typeof sensible !== "undefined" ? sensible : {};
sensible.classes = typeof sensible.classes !== "undefined" ? sensible.classes : {};

sensible.classes.ExpandCollapse = function (opts) {
	var self = this;
	
	this.title = "Untitled"
	this.content = "Untitled Body."
	this.slug = "untitled"
	this.url = this.slug
	
	$.extend(this, opts);

	console.log("Creating an Expand/Collapse: " + this.title);

	this.el = $('<span>');
	$(this.el).append('<a href="#' + this.url + '">' + this.title + '</a>');
	$(this.el).append('<div style="display:none;">' + this.content + '</div>');

	//Handles expanding and collapsing
	this.activate = function(e) {
		e.preventDefault()
		history.replaceState(null, null, $(this).attr('href') )
		
		console.log('Original Expanding ' + self.slug);
		var answer = $(this).next();
		
		if (!self.isOpen()) {
			console.log('Opened');
			console.log(answer);
			answer.show()
			
			//.. close all the other questions
			self.el.trigger('expandCollapseClose', this);
		}
		else {
			console.log('Closed');
			answer.hide()
		}

	}
	
	this.isOpen = function() {
		return self.el.find(' a[href="#' + self.url + '"]').next().is(':visible');
	}

	this.forceCloseAll = function(e, clicked) {
		console.log('Forcing Close: ' + self.url + ' because I am ' + self.isOpen());
		if (self.isOpen()) {
			if (clicked !== undefined) {
				var questionClicked = $(clicked).attr('href');

				if (questionClicked) {
					questionClicked = questionClicked.replace('#','');	
				}

				//If the question clicked is myself..
				if (questionClicked == self.url) {
					//..Do not force close
				}
				else {
						//Force close	
						console.log('Forcing Close: ' + self.url);
						self.el.find(' a[href="#' + self.url + '"]').next().toggle(false);
				}
			}
		}

	}

	$(this.el).on('click', ' > a', this.activate);

	//Expose an event to toggle the activation. Maybe called when a screen un-slides to close it.
	$(this.el).on('toggleActivate', this.activate);
	
	var target = this.target ? this.target : $(document.body);
	target.append(this.el);
	
	return this;
}
var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.JumpToTop = function (target) {
	var self = this;
	
	var windowHeight = $(window).height();

	var callScrollTO;
	$(window).on('resize', function() {
		windowHeight = $(window).height();

		//Call the scroll handler once
		window.clearTimeout(callScrollTO);
		callScrollTO = window.setTimeout(function() {
			$(window).trigger('scroll');	
		}, 250);

	});

	var target = target !== undefined ? target : $(document.body);

	console.log('Creating a Jump to Top');

	this.el = $('<div class="jump-to-top"><span></span></div>');

	var jump = function() {
		console.log('Jumping');
		window.scrollTo(0,0);
	}

	this.el.on('click', jump);

	$(window).on('scroll', function() {
		//Distance from the top
		var distanceFromTop = $(window).scrollTop();
		//Slower scroll, proportional to the window
		var scroll = distanceFromTop / (50.933 * ($(document).height() / document.body.offsetHeight));

		if (scroll > 1) {
			scroll = 1;	
		}

		self.el.css('opacity', scroll);
		var pxPerEm = 16;
		var EmsFromBottom = 9;

		var scrollPoint = $(window).scrollTop() + document.body.offsetHeight;

		var myPosition = parseInt(self.el.find('span').offset().top);
		var myHeight = self.el.find('span')[0].offsetHeight;
		
		var containerHeight = target[0].offsetHeight;
		//How far the window has scrolled
		var containerDistanceFromTop = target.offset().top;

		var stickyPoint = parseInt(containerHeight + containerDistanceFromTop);

		if (stickyPoint > 0 && scrollPoint >= stickyPoint) { 
			//Sticky stops at a point
			self.el.find('span').css('position', 'absolute');
			self.el.find('span').css('top', stickyPoint - myHeight + 'px');
			self.el.find('span').css('bottom', 'auto');
		}
		else {
			//Sticky
			self.el.find('span').css('position', 'fixed');
			self.el.find('span').css('top', 'auto');
			self.el.find('span').css('bottom', '1em');	
		}


	});

	target.append(this.el);	
	
	return this;
}
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
var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.InputFilter = function (opts, parent) {
	var self = this;
	
	this.toFilter = undefined;
	this.itemSelector = "li";
	this.placeholderText = undefined;
	
	//Build on the parent if there is one
	$.extend(this, parent);
	
	$.extend(this, opts);

	var searchBox = this.el.find("input");

	searchBox.on('input', function(e) {
		console.log('Searchbox input/ Keyup event. Value is '+ $(this).val());
		//jQuery contains case insenstive
		$.extend($.expr[":"], {
			"containsIN": function(elem, i, match, array) {
			return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
			}
		});

		//If tofilter is undefined
		if (self.toFilter === undefined) {
			console.log('Filter on siblings');
			//Filter nodes adjacent to the element
			self.toFilter = self.el.parent();
		}

		console.log('Looking for elements of type ' + self.itemSelector);
		var items = self.toFilter.find(self.itemSelector);

		//Show by default
		items.show();

		//Hide question items that do not contain the search term
		items.not(self.itemSelector + ":containsIN(" + $(this).val() + ")").hide();
	});

	return this;
}
var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.InputDeleteFilter = function (opts) {

	$.extend(this, new sensible.classes.InputDelete(opts, this));
	$.extend(this, new sensible.classes.InputFilter(opts, this));

	return this;
}