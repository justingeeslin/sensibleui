(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.sensible = window.sensible !== undefined ? window.sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.Component = require('sensible-component');
sensible.classes.ExpandCollapse = require('sensible-expandcollapse');
sensible.classes.Accordion = require('sensible-accordion');
sensible.classes.JumpToTop = require('./js/sensibleJumpToTop.js')
sensible.classes.Highlight = require('./js/sensibleHighlight.js')
sensible.classes.Input = require('./js/sensibleInput.js')
sensible.classes.InputDelete = require('./js/sensibleInputDelete.js')
sensible.classes.InputFilter = require('./js/sensibleInputFilter.js')
sensible.classes.InputDeleteFilter = require('./js/sensibleInputDeleteFilter.js')
sensible.classes.SweetIndicator = require('sensible-indicator')
sensible.classes.ScrollSpy = require('./js/sensibleScrollSpy.js')

},{"./js/sensibleHighlight.js":2,"./js/sensibleInput.js":3,"./js/sensibleInputDelete.js":4,"./js/sensibleInputDeleteFilter.js":5,"./js/sensibleInputFilter.js":6,"./js/sensibleJumpToTop.js":7,"./js/sensibleScrollSpy.js":8,"sensible-accordion":10,"sensible-component":12,"sensible-expandcollapse":14,"sensible-indicator":16}],2:[function(require,module,exports){

Highlight = function (opts, contentTarget) {
	var self = this;

	var defaults = {
		target : $(document.body),
		className : 'highlight',
		nodeName : 'span',
		omitClass: 'blank-slate',
		textToHighlight : '',
		debug: false
	};

	$.extend(this, defaults, opts);

	this.log = function(msg) {
		if (self.debug) {
			console.log(msg)
		}
	}

	self.log('Highlighting upon:')
	self.log(this.target[0])

  this.highlight = function() {

		var highlightNodes = function(node, text) {
			// var node = node ? node : this.target[0];
			var nodeName = self.nodeName
			var className = self.className

			self.log('Should this element be highlighted? ', node, $(node).hasClass(self.omitClass))
			if ($(node).hasClass(self.omitClass)) {
				self.log('Not highlighting:', node)
				return true; // continue
			}

			//Case insenstive
			text = text.toLowerCase()

			if (text.length <= 0) {
				return;
			}

	    if (node.nodeType === 3) {
				var lowercaseData = node.data.toLowerCase();

	      var match = lowercaseData.match(text);
	      if (match) {
					self.log('Yes, found a match.')
		      var highlight = document.createElement(nodeName);
		      highlight.className = className;
		      var wordNode = node.splitText(match.index);
		      wordNode.splitText(match[0].length);
		      var wordClone = wordNode.cloneNode(true);
		      highlight.appendChild(wordClone);
		      wordNode.parentNode.replaceChild(highlight, wordNode);
		      return 1; //skip added node in parent
	      }
	    } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
	            !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
	            !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted

					for (var i = 0; i < node.childNodes.length; i++) {
	            i += highlightNodes(node.childNodes[i], text);
	        }
	    }
			else {
				self.log('These aren\'t the nodes I\'m use to');
			}
	    return 0;
		}

		self.target.each(function() {
			//There could be multiple terms in the text to highlight
			var terms = self.textToHighlight.split(' ');

			self.log('These are the terms:')

			for (var i in terms) {
				if (terms.hasOwnProperty(i)) {
					self.log(terms[i]);

					highlightNodes(this, terms[i]);
				}
			}

		})

  }

	this.remove = function() {
		return $(this.target).find("." + this.className).each(function () {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
	}

	//Upon construction we should remove previous highlights and highlight again
	this.go = function() {
		self.log('Removing previous highlights..')
		this.remove();
		self.log('Highlighting..')
		this.highlight();
	}
	this.go();

	this.target.on('go', this.go);

	return this;
}

module.exports = Highlight

},{}],3:[function(require,module,exports){
var Component = require('sensible-component')

Input = function (opts) {
	var self = this;

	var defaults = {
		placeholderText : "",
		//This can always be overridden
		el : $('<input type="text"></input>')
	}

	$.extend(this, defaults, opts);
	$.extend(this, new Component(this));

	this.el.attr('placeholder', this.placeholderText);

	//Add to DOM
	if (typeof this.target !== "undefined") {
		this.el.appendTo(this.target);
	}

	return this;
}

module.exports = Input;

},{"sensible-component":12}],4:[function(require,module,exports){
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

module.exports = InputDelete;

},{"./sensibleInput.js":3}],5:[function(require,module,exports){
window.sensible = window.sensible !== undefined ? window.sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.InputDeleteFilter = function (opts) {

	$.extend(this, new sensible.classes.InputDelete(opts));

	$.extend(this, new sensible.classes.InputFilter(opts));

	return this;
}

},{}],6:[function(require,module,exports){
var Highlight = require('./sensibleHighlight.js')
var Input = require('./sensibleInput.js')

InputFilter = function (opts) {
	var self = this;

	var defaults = {
		//The toFilter selection has this element as children. Selector. li, ul, a, etc.
		itemSelector: " > ul > li",
    highlight: false,
		blankSlateMessage: "No Results Found with \"<term>\"",
		autoHideHeadings: true,
		// Runs with a search and filter is about to begin; before any elements are hidden or selected.
		start : function() {},
		// Runs with a search and filter is complete
    complete : function() {},
	};

  //Find the input, Search box.
	function getSearchBox() {
		//Select the Input if it is a child and if it is the root element
		return self.el.find('input').add(self.el.filter('input'));
	}

  //A DOM selection (jQuery) of elements to filter
	defaults.toFilter = function() { return this.el.parent() }

	$.extend(this, defaults, opts);
	//Create a Input Component with our options.
	$.extend(this, new Input(this));

	var searchBox = getSearchBox()

	this.el.addClass('filterable');

	//jQuery contains case insenstive
	$.extend($.expr[":"], {
		"containsIN": function(elem, i, match, array) {
		return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
		}
	});

	var completeTO;
	searchBox.on('input', function(e) {

		var searchTerms = searchBox.val().split(' ');

		var items = self.toFilter().find(self.itemSelector);
		//Show by default
		items.show();

		//For each term, add to the selection of things to hide.
		var itemsToHide = {};

		for (var i in searchTerms) {
			if (searchTerms.hasOwnProperty(i)) {
				//Hide question items that do not contain the search term
				var withoutTerm = items.not(":containsIN(" + searchTerms[i] + ")")

				if (itemsToHide !== undefined) {
					itemsToHide = withoutTerm
				}
				else {
					itemsToHide.add(withoutTerm)
				}
			}

		}

		itemsToHide.hide();

		function hideParentWhenAllChildrenAreHidden() {

	    var parents = items.parent();
	    console.log(parents);

	    parents.show();
	    parents.each(function() {
	      // If all of the list's children are hidden...
	      if ($(this).children(':visible').length <= 0) {
	        //Hide yourself
	        $(this).hide();
	      }
	    });
		}

		hideParentWhenAllChildrenAreHidden();

		if (self.autoHideHeadings) {
			// //This list's heading
			var selectorHeadings = 'h1,h2,h3,h4,h5,h6';
			var headings = self.toFilter().children(selectorHeadings);
			// console.log('Show all the headings..')
			// console.log(headings);
			headings.show();
			headings.each(function() {
	      // If all of the heading's next filterable items are hidden... (not including the input box with the filter)
				var visibleNextSiblings = $(this).nextUntil(selectorHeadings).find('*').filter(items).filter(':visible').not(self.el);
	      if (visibleNextSiblings.length <= 0) {
	        // console.log('Hiding Heading:')
					// console.log($(this))
	        //Hide yourself
	        $(this).hide();

	      }
				else {
					// console.log('I have ' + visibleNextSiblings.length + ' visbile next siblings');
					// console.log(visibleNextSiblings);
				}
	    });
		}


		//Are all the items hidden? If so trigger the blank slate message
		console.log('Blank slate: Items: ', items.length)
		if (items.length > 0 && items.length === itemsToHide.length) {
			self.blankSlate.show();
		}
		else {
			self.blankSlate.hide();
		}


    clearTimeout(completeTO);
    completeTO = setTimeout(function() {
      self.el.trigger('complete.inputfilter.sensible')

			// Trigger a filtered event on the target. Other objects like the ScrollSpy / Indicator might like to know.
			self.toFilter().trigger('filter');

			// Information to return to the callback
			var data = {}
			// Return the items searched upon.
			data.items = items;
			// Return the items shown.
			data.resultSet = items.not(itemsToHide);

			self.complete(data);
    }, 333)

	});

	var filter = this;
	this.blankSlate = {
		isCreated: false,
		el: $('<div class="blank-slate">' + self.blankSlateMessage + '</div>'),
		show: function() {
			console.log('Showing Blank slate')
			if (!this.isCreated) {
				console.log('Showing but it is not created..')
				this.create();
			}
			var message = self.blankSlateMessage.replace('<term>', searchBox.val());
			this.el.html(message);
			this.el.show();
		},
		hide: function() {
			this.el.hide();
		},
		create: function() {
			console.log('Creating a blank slate for InputFilter as a child of ', filter.toFilter(), self)
			//Hide and then append
			this.hide();
			self.toFilter().append(this.el)
			this.isCreated = true;
		}
	}


  if (this.highlight) {
    var typingTO;
    var timeAfterLastKeyPress = 333;
    var theHighlighter;

    var highlightFx = function() {
      console.log('Time to highlight..');
      theHighlighter = new Highlight({
        target: self.toFilter(),
        textToHighlight: searchBox.val()
      });
    }
    searchBox.on('input', function() {
      clearTimeout(typingTO);
      typingTO = setTimeout(function() {
        highlightFx()
      }, timeAfterLastKeyPress)
    });
  }

	//If a target was supplied..
	if (typeof this.target !== 'undefined') {
		//... append to it.
		self.el.appendTo(self.target);
		//Create a blank slate message. Hidden.
		// console.log('Target supplied.')
		// console.log(this.target);
	}

	return this;
}

module.exports = InputFilter;

},{"./sensibleHighlight.js":2,"./sensibleInput.js":3}],7:[function(require,module,exports){
JumpToTop = function (options) {
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

	var defaults = {
		target: $(document.body)
	}

	$.extend(self, defaults, options);

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

		var myPosition = parseInt(self.el.find('span').offset().top, 10);
		var myHeight = self.el.find('span')[0].offsetHeight;

		var containerHeight = self.target[0].offsetHeight;
		//How far the window has scrolled
		var containerDistanceFromTop = self.target.offset().top;

		var stickyPoint = parseInt(containerHeight + containerDistanceFromTop, 10);

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

	self.target.append(this.el);

	return this;
}

module.exports = JumpToTop

},{}],8:[function(require,module,exports){
ScrollSpy = function (opts) {
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

	// A collection of headers
	var headers = [];
	console.log('Finding all the headers matching this selector: ' + this.headerSelector);
	//Find all the headers and subheaders in the target. Make sure they are visible.
	headers = self.target.find(self.headerSelector).filter(':visible');

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

		//If the window is at the top select the first element. (Sometimes headings aren't positioned to trigger the first and last element because the page isn't tall enought to take the heading to middle of the screen.)
		var windowScrollTop = $(window).scrollTop();
		var windowScrollBottom = windowScrollTop + $(window).height();
		if (windowScrollTop <= 0) {
			id = headers.filter(':first').attr('id')
			console.log('Activating the first outline item for the first (visible) header: ' + id);
		}
		else if (windowScrollBottom >= $(document).height()) {
			id = headers.filter(':last').attr('id')
		}
		else {
			// Detect the appropriate header to activate
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
		}
		
		if (id !== currentHeadingId) {
			//Select the outline's link for this heading and trigger the 'go' event.
			console.log('Current Heading is now ' + id, '[href="#' + id + '"]:first');
			$('[href="#' + id + '"]:first').trigger('go');
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

module.exports = ScrollSpy

},{}],9:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) { /**/ }

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0];
	var i = 1;
	var length = arguments.length;
	var deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}
	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};

},{}],10:[function(require,module,exports){
window.sensible = typeof sensible !== "undefined" ? sensible : {};
sensible.classes = typeof sensible.classes !== "undefined" ? sensible.classes : {};

window.sensible.classes.Accordion = require('./js/sensibleAccordion.js');

module.exports = window.sensible.classes.Accordion;

},{"./js/sensibleAccordion.js":11}],11:[function(require,module,exports){
Accordion = function (opts) {
	var self = this;

	var defaults = {
		//When large items collaps sometimes the activated item falls out of view. This option stops that from hapening.
		scrollCompensate: true,
		// Characteristic of the according. Others should close when the selected one opens. You might want to disable this temporarily, say for Quick Find.
		shouldCloseOthers: true
	};

	$.extend(this, defaults, opts);
	var ExpandCollapse = require('sensible-expandcollapse');
	$.extend(this, new ExpandCollapse(this));

	var closeOthers = function() {
		console.log('should close others is:' + self.shouldCloseOthers);
		if (!self.shouldCloseOthers) {
			console.log('shouldCloseOthers is disabled. I won\'t close others that might be open');
			return;
		}
		console.log('Accordion: Closing others...');

		if (self.scrollCompensate) {
			//Do a balancing act. When large items collapse, scroll up by that amount to follow the newly activated item
			//Get my height..
			var openedRect = $(this)[0].getBoundingClientRect();
			openedRect.y = openedRect.top;
		}

		//Trigger a close on everyone who is open but not me
		$('.' + self.classes + '.open').not(self.el).each(function() {

			if (self.scrollCompensate) {
				var closingRect = $(this)[0].getBoundingClientRect();
				closingRect.y = closingRect.top;

				//Is this element above me?
				if (closingRect.y < openedRect.y) {
					// scroll up by the height of the collapsing question's body
					var closingBodyHeight = $(this).children('div').height();
					window.scrollBy(0, -closingBodyHeight);
				}
			}

			$(this).trigger('close');
		});
	}

	$(this.el).on('open', closeOthers);
	$(this.el).on('go', closeOthers);

	$(this.el).on('click', ' > a', closeOthers);

	//Create an event by which an accordion can be disabled and enabled
	$(this.el).on('enableAutoClose', function() {
		self.shouldCloseOthers = true;
	});
	$(this.el).on('disableAutoClose', function() {
		console.log('Disabling Auto Close. Now, this accordion won\'t close others. ');
		self.shouldCloseOthers = false;
	});

	//Append to the Document or whatever
	//If a target was supplied..
	if (typeof this.target !== undefined) {
		//... append to it.
		self.el.appendTo(self.target);
	}

	return this;
}

module.exports = Accordion;

},{"sensible-expandcollapse":14}],12:[function(require,module,exports){
window.sensible = typeof sensible !== "undefined" ? sensible : {};
sensible.classes = typeof sensible.classes !== "undefined" ? sensible.classes : {};

sensible.classes.Component = require('./js/sensibleComponent.js');

module.exports = sensible.classes.Component;

},{"./js/sensibleComponent.js":13}],13:[function(require,module,exports){
var extend = require('extend');
var Component = function (options) {
	var self = this;

	// Use the private members for custom hidden setters and getters.
	// An identifier for the component's current state.
	var state = '';
	// The element to which this component (el) should be rendered/appended to.
	var target = undefined;

	var defaults = {
		// To log or not to log..
		debug: false,
		el : $(document.createDocumentFragment()),
		stateChange : function(oldState, newState) {
			self.log('Changing state from ' + oldState + ' to ' + newState);
		},
		preload: function() { },
		postload: function() { },
		statePreprocess: function(state) {
			return state;
		},
		// To avoid collisions and incase you want to namespace individual components
		eventNamespace: 'sensible',
		// Call render automatically upon construction becuse sometimes you just want to construct the thing. Disable if the component request data async and should not be show until it is loaded.
		autoRender: true,
	};

	// Supply a default target only as a last resort. This way the body isn't selected every time.
	if (typeof $contentTarget !== "undefined") {
		defaults.target = $contentTarget;
	}
	else if (typeof options !== "undefined" && typeof options.target !== "undefined") {
		target = options.target
	}
	else {
		target = $(document.body);
	}

	this.log = function(msg) {
		if (self.debug) {
			console.log(msg);
		}
	}

	Object.defineProperty(this, 'target', {
		get: function() {
			return target;
		},
		set: function(arg) {
			// If the argument is a string, it is a selector convert it to a jQuery object
			if (typeof arg === "string") {
				target = $(arg);
			}
			else if (arg instanceof jQuery) {
				target = arg
			}
			else {
				console.warn('Unregonized target selector.', arg);
			}
		},
		enumerable: true
	});

	Object.defineProperty(this, 'state', {
		get: function() { return state; },
		set: function(newState) {
			var oldState = state;
			newState = this.statePreprocess(newState);
			state = newState;
			this.stateChange(oldState, newState)
			return true
		},
		enumerable: true
	});

	// $.extend(this, defaults, options);
	self = extend(this, defaults)
	self = extend(this, options)

	// Extend does not trigger custom setters and getters. There are some properties that if defined on init the custom setter/getter is not called. make the assigment manually for these sensitive properties.
	if (options && options.state) {
		this.state = options.state
	}

	this.go = function(newState) {
		this.state = newState;
	}

	// Append the El with all of its markup and events to the targetEl
	this.render = function() {
		self.preload();
		self.log('Rendering..');
		self.target.append(this.el);
		self.postload();
	}

	this.destroy = function() {
		self.target.empty();
	}

	// Call render automatically upon construction
	if (this.autoRender) {
		this.render()
	}

	return this;
}



module.exports = Component;

},{"extend":9}],14:[function(require,module,exports){
window.sensible = typeof sensible !== "undefined" ? sensible : {};
sensible.classes = typeof sensible.classes !== "undefined" ? sensible.classes : {};

sensible.classes.ExpandCollapse = require('./js/sensibleExpandCollapse.js');

module.exports = sensible.classes.ExpandCollapse;

},{"./js/sensibleExpandCollapse.js":15}],15:[function(require,module,exports){
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

	this.id = this.url.split('/').join('-');

	this.el = $('<div></div>');
	this.el.addClass(this.classes);
	this.el.append('<a href="#' + this.url + '" id="' + this.id + '">' + this.title + '</a>');
	var answer = $('<div style="display:none;">' + this.content + '</div>');
	this.el.append(answer);

	//Handles expanding and collapsing
	this.toggle = function(e) {
		//No need for this to bubble
		e.preventDefault()

		//Update the URL incase the windows is refreshed. Prevent default and use this because a normal click is a push and not a replace
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

	$(this.el).on('go', this.toggle);

	$(this.el).on('go', function(e) {
		console.log('Go: ' + self.slug + ' by ');
		console.log(e.target);
	});

	//Append to the Document or whatever
	//If a target was supplied..
	if (typeof this.target !== undefined) {
		//... append to it.
		self.el.appendTo(self.target);
	}

	return this;
}

module.exports = ExpandCollapse;

},{}],16:[function(require,module,exports){
window.sensible = typeof sensible !== "undefined" ? sensible : {};
sensible.classes = typeof sensible.classes !== "undefined" ? sensible.classes : {};

sensible.classes.SweetIndicator = require('./js/sensibleSweetIndicator.js');

module.exports = sensible.classes.SweetIndicator;

},{"./js/sensibleSweetIndicator.js":17}],17:[function(require,module,exports){
var extend = require('extend')
var Component = require('sensible-component')
var SweetIndicator = function (opts) {
	var self = this;

	var defaults = {
		color : 'black',
		itemSelector : 'li'
	};

	$.extend(this, defaults, opts);

	self = extend(self, new Component(self))

	// Items that might be clicked on.
	var items = this.target.find(this.itemSelector);

	var container = $('<div class="sensible indicator"></div>')
	container.css('position', 'absolute');

	var indicator = this.indicator = $('<div class="bar">&nbsp;</div>');
	indicator.css('position', 'absolute');
	indicator.css('background-color', this.color);

	indicator.css('left', '0');
	indicator.css('top', '0');
	container.append(indicator);

	items.on('click go', function() {
		self.log('Clicking/Going on this item. Setting the state..')
		self.state = $(this)[0].id;
	})

	var indicate = function(el) {
		if (el === undefined || el.length <= 0) {
			console.warn('Attempting to indicate an element that is not there.', el);
			return;
		}
		self.log('Clicked/Activated the item. Indicating: ' + el.text()  + ' with a height of ' + el.height());

		//The height (from the window) of the container
		var containerTop = container.position().top
		//The height of the item clicked
		var itemTop = el.position().top;
		//How far to move. Might be negative (when moving up) which is totally okay.
		var distanceToMove = itemTop - containerTop;


		//Change the height of the bar and Slide to the item
		indicator.animate({
			top: distanceToMove + 'px',
			height: el.height()
		}, 250);

	}

	// Insert (only one)
	container.insertBefore(this.target.filter(':first'));

	this.stateChange = function(oldState, newState) {
		self.log('Indicator State Change: ' + oldState + ', ' + newState)
		if (newState.length < 0) {
			//Activate the first item
			self.log('Indicating the first item' + items.filter(':first').text() + ' from the following items');
			indicate(items.filter(':first'))
		}
		else {
			self.log('Indicating an item for the following state:' + newState);
			indicate(items.filter('#' + newState))
		}
	}


	return this;
}

module.exports = SweetIndicator;

},{"extend":18,"sensible-component":12}],18:[function(require,module,exports){
function extend(a, b) {
  a._super = b
  for(var key in b) {
    if(b.hasOwnProperty(key)) {
      a[key] = b[key];
    }
    // Does the property have a custom getter or setter?
    if (typeof b.__lookupGetter__(key) == "function") {
      // console.log('found a getter for ' + key);
      a.__defineGetter__(key, b.__lookupGetter__(key))
    }
    if (typeof b.__lookupSetter__(key) == "function") {
      // console.log('found a setter for ' + key);
      a.__defineSetter__(key, b.__lookupSetter__(key))
    }

  }

  return a;
}

module.exports = extend;

},{}]},{},[1]);
