var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.Component = function (opts) {
  var self = this;

  var defaults = {
      target : undefined,
      el : $('<div>Component</div>')
  }

  $.extend(this, defaults, opts);

  //If a target was supplied..
	if (typeof this.target !== undefined) {
		//... append to it.
		self.el.appendTo(self.target);
	}

}

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

	this.id = this.url.split('/').join('-');

	this.el = $('<span></span>');
	this.el.addClass(this.classes);
	this.el.append('<a href="#' + this.url + '" id="' + this.id + '">' + this.title + '</a>');
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
		self.el.removeClass('open');
		answer.hide()
	}

	this.open = function() {
		console.log('Opening: ' + self.slug);
		self.el.addClass('open');
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
	$(this.el).on('activate', this.open);

	//Append to the Document or whatever
	//If a target was supplied..
	if (typeof this.target !== undefined) {
		//... append to it.
		self.el.appendTo(self.target);
	}

	return this;
}

var sensible = typeof sensible !== "undefined" ? sensible : {};
sensible.classes = typeof sensible.classes !== "undefined" ? sensible.classes : {};

sensible.classes.Accordion = function (opts) {
	var self = this;

	var defaults = {};

	$.extend(this, defaults, opts);
	$.extend(this, new sensible.classes.ExpandCollapse(this));

	var closeOthers = function() {
		console.log('Accordion: Closing others...');
		//Trigger a close on everyone who is open but not me
		$('.' + self.classes + '.open').not(self.el).trigger('close');
	}

	$(this.el).on('open', closeOthers);
	$(this.el).on('activate', closeOthers);

	$(this.el).on('click', ' > a', closeOthers);

	//Append to the Document or whatever
	//If a target was supplied..
	if (typeof this.target !== undefined) {
		//... append to it.
		self.el.appendTo(self.target);
	}

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

sensible.classes.Input = function (opts) {
	var self = this;

	var defaults = {
		placeholderText : "",
		//This can always be overridden
		el : $('<input type="text"></input>')
	}

	$.extend(this, defaults, opts);
	$.extend(this, new sensible.classes.Component(this));

	this.el.attr('placeholder', this.placeholderText);

	//Add to DOM
	if (typeof this.target != "undefined") {
		this.el.appendTo(this.target);
	}

	return this;
}

var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.InputDelete = function (opts) {
	var self = this;

	var defaults = {};

	console.log('Creating an Input with Delete button.');
	$.extend(this, defaults, opts)
	$.extend(this, new sensible.classes.Input(this));

	//Wrap in a Div if not already wrapped
	var classToAdd = "deletable";
	var deleteButton = $('<div>x</div>');
	if (this.el.filter('div').length > 0) {
		this.el.addClass(classToAdd);
	}
	else {
		// Wrap with a deletable class. Add a X button.
		this.el = $('<div class="' + classToAdd + '"></div>').append(this.el);
	}
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

var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.InputFilter = function (opts) {
	var self = this;

	var defaults = {
		//The toFilter selection has this element as children. Selector. li, ul, a, etc.
		itemSelector: " > ul > li",
	};

	function getSearchBox() {
		//Select the Input if it is a child and if it is the root element
		return self.el.find('input').add(self.el.filter('input'));
	}

  //A DOM selection (jQuery) of elements to filter
	defaults.toFilter = function() { return getSearchBox().parent() }

	$.extend(this, defaults, opts);
	//Create a Input Component with our options.
	$.extend(this, new sensible.classes.Input(this));

	//Find the input, Search box.

	var searchBox = getSearchBox()

	this.el.addClass('filterable');

	searchBox.on('input', function(e) {

		console.log('Searchbox input/ Keyup event. Value is '+ searchBox.val());
		console.log($(this));
		//jQuery contains case insenstive
		$.extend($.expr[":"], {
			"containsIN": function(elem, i, match, array) {
			return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
			}
		});

		console.log('Looking for elements of type ' + self.itemSelector + ' with the text ' + searchBox.val() + ' among the following elements ');
		console.log(self.toFilter().children());
		var items = self.toFilter().find(self.itemSelector);

		//Show by default
		items.show();

		//Hide question items that do not contain the search term
		itemsToHide = items.not(":containsIN(" + $(this).val() + ")")

		console.log('Found these: ')
		console.log(itemsToHide);

		itemsToHide.hide();

    // //If all the list items of a list are hidden, hide the list
    // console.log('Looking for lists...')
    // var lists = self.toFilter().children('ul');
    // console.log(lists);
		//
    // lists.show();
    // lists.each(function() {
    //   // If all of the list's children are hidden...
    //   if ($(this).children(':visible').length <= 0) {
    //     console.log('Hiding ' + $(this)[0])
    //     //Hide yourself
    //     $(this).hide();
		//
		//
    //   }
    // });

		function hideParentWhenAllChildrenAreHidden() {

	    var parents = items.parent();
	    console.log(parents);

	    parents.show();
	    parents.each(function() {
	      // If all of the list's children are hidden...
	      if ($(this).children(':visible').length <= 0) {
	        console.log('Hiding: ')
					console.log($(this))
	        //Hide yourself
	        $(this).hide();
	      }
	    });
		}

		hideParentWhenAllChildrenAreHidden();

		// //This list's heading
		var selectorHeadings = 'h1,h2,h3,h4,h5,h6';
		var headings = self.toFilter().children(selectorHeadings);
		console.log('Show all the headings..')
		console.log(headings);
		headings.show();
		headings.each(function() {
      // If all of the heading's next filterable items are hidden... (not including the input box with the filter)
			var visibleNextSiblings = $(this).nextUntil(selectorHeadings).find('*').filter(items).filter(':visible').not(self.el);
      if (visibleNextSiblings.length <= 0) {
        console.log('Hiding Heading:')
				console.log($(this))
        //Hide yourself
        $(this).hide();

      }
			else {
				console.log('I have ' + visibleNextSiblings.length + ' visbile next siblings');
				console.log(visibleNextSiblings);
			}
    });

	});

	//If a target was supplied..
	if (typeof this.target !== undefined) {
		//... append to it.
		self.el.appendTo(self.target);
	}

	return this;
}

var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.InputDeleteFilter = function (opts) {

	$.extend(this, new sensible.classes.InputDelete(opts));

	$.extend(this, new sensible.classes.InputFilter(opts));

	return this;
}
