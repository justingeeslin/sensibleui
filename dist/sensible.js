(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
window.sensible = window.sensible !== undefined ? window.sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

require('./js/Observer.js')

require('./js/sensibleComponent.js')
require('./js/sensibleInputDelete.js')
require('./js/sensibleInputFilter.js')
// sensible.classes.InputDeleteFilter = require('./js/sensibleInputDeleteFilter.js')
// sensible.classes.SweetIndicator = require('sensible-indicator')
// sensible.classes.ScrollSpy = require('./js/sensibleScrollSpy.js')

require('./js/sensibleExpandCollapse.js')
require('./js/sensibleAccordion.js');

require('./js/sensibleJumpToTop.js')

},{"./js/Observer.js":2,"./js/sensibleAccordion.js":3,"./js/sensibleComponent.js":4,"./js/sensibleExpandCollapse.js":5,"./js/sensibleInputDelete.js":7,"./js/sensibleInputFilter.js":8,"./js/sensibleJumpToTop.js":9}],2:[function(require,module,exports){

sensible.classes.Observer = function() {
  var self = this;

  // A mapping from selector to Sensible Class.
  var selectorClassMap = [
    // {
    //   sel: 'div.component',
    //   class: sensible.classes.Component
    // },
    // {
    //   sel: 'input[deletable=true]',
    //   class: sensible.classes.InputDelete
    // },
    // {
    //   sel: 'div.expand-collapse',
    //   class: sensible.classes.ExpandCollapse
    // }
  ];

  this.getInsertableSelectors = function() {
    var insertableSelctors = "";
    for( var i in selectorClassMap) {
      i = parseInt(i);
      insertableSelctors += selectorClassMap[i].sel;
      if (typeof selectorClassMap[i+1] !== "undefined") {
         insertableSelctors += ', '
      }
    }
    return insertableSelctors;
  }

  this.add = function(selector, sensibleClass) {
    console.log('Adding a rule for ', selector, sensibleClass);
    selectorClassMap.push({
      sel: selector,
      class: sensibleClass
    });

    // Add the CSS rule
    addCSSRule(document.styleSheets[0], selector, "animation-duration: 0.001s; animation-name: nodeInserted;");
  }

  var markupInit = function( options ) {

      var target = typeof options !== "undefined" ? options.target : $(document.body);

      console.log('markup init')

      // Init Sensible Components. (only those that are not already init-ed, that is, with the `sensible-component` attribute)
      for( var i in selectorClassMap) {
        var item = selectorClassMap[i];
        $(item.sel + ':not([sensible-component])').each(function() {
          var aComponent = new item.class({
            el: $(this)
          })
        });
      }

  }

  // Listen for an event that runs when the page is loaded and can also be triggered. (jQuery's ready cannot be triggered.)
  document.addEventListener("DOMContentLoaded", markupInit);

  // Add animation styles to the body
  var sheet = (function() {
  	// Create the <style> tag
  	var style = document.createElement("style");

  	// Add a media (and/or media query) here if you'd like!
  	// style.setAttribute("media", "screen")
  	// style.setAttribute("media", "only screen and (max-width : 1024px)")

  	// WebKit hack :(
  	style.appendChild(document.createTextNode(""));

  	// Add the <style> element to the page
  	document.head.appendChild(style);

  	return style.sheet;
  })();

  function addCSSRule(sheet, selector, rules, index) {
  	if("insertRule" in sheet) {
  		sheet.insertRule(selector + "{" + rules + "}", index);
  	}
  	else if("addRule" in sheet) {
  		sheet.addRule(selector, rules, index);
  	}
  }

  addCSSRule(document.styleSheets[0], "@keyframes nodeInserted", "from { opacity: 0.99; } to { opacity: 1; } ");

  // Listen for Body insertions using CSS and Animations in liue of their being no Mutation Observers.
  var insertListener = function(event){
    if (event.animationName == "nodeInserted") {
      // This is the debug for knowing our listener worked!
      // event.target is the new node!
      console.warn("A component has been inserted! ", event, event.target);
      document.dispatchEvent(new Event("DOMContentLoaded"));
    }
  }

  document.addEventListener("animationstart", insertListener, false); // standard + firefox
  document.addEventListener("MSAnimationStart", insertListener, false); // IE
  document.addEventListener("webkitAnimationStart", insertListener, false); // Chrome + Safari

  return this;
}

var anObserver = new sensible.classes.Observer();
sensible.registerComponent = anObserver.add;

},{}],3:[function(require,module,exports){
var ExpandCollapse = require('./sensibleExpandCollapse.js');

Accordion = function (opts) {
	var self = this;

	var defaults = {
		//When large items collaps sometimes the activated item falls out of view. This option stops that from hapening.
		scrollCompensate: true,
		// Characteristic of the according. Others should close when the selected one opens. You might want to disable this temporarily, say for Ctrl+F word searching.
		shouldCloseOthers: true
	};

	$.extend(this, defaults, opts);
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
		$('.accordion.open').not(self.el).each(function() {

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

	$(this.el).on('click', '.title', closeOthers);

	//Create an event by which an accordion can be disabled and enabled
	$(this.el).on('enableAutoClose', function() {
		self.shouldCloseOthers = true;
	});
	$(this.el).on('disableAutoClose', function() {
		console.log('Disabling Auto Close. Now, this accordion won\'t close others. ');
		self.shouldCloseOthers = false;
	});

	return this;
}

module.exports = Accordion;
sensible.classes.Accordion = Accordion;
sensible.registerComponent('div.accordion', sensible.classes.Accordion);

},{"./sensibleExpandCollapse.js":5}],4:[function(require,module,exports){
var extend = require('extend');

// A Sensible Component is a simple element with state.
var Component = function (options) {
	var self = this;

	// Use the private members for custom hidden setters and getters.
	// An identifier for the component's current state.
	var state = '';

	var defaults = {
		// To log or not to log..
		debug: false,
		stateChange : function(oldState, newState) {
			self.log('Changing state from ' + oldState + ' to ' + newState);
		},
		preload: function() { },
		postload: function() { },
		statePreprocess: function(state) {
			return state;
		},
		destroy: function() {
			self.target.empty();
		},
		// To avoid collisions and incase you want to namespace individual components
		eventNamespace: 'sensible',
	};

	this.log = function(msg) {
		if (self.debug) {
			console.log(msg);
		}
	}

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

	// The profiling attribute. There is a listener for a node insertion with this profile.
	this.el.attr('sensible-component', true);

	// Extend does not trigger custom setters and getters. There are some properties that if defined on init the custom setter/getter is not called. make the assigment manually for these sensitive properties.
	if (options && options.state) {
		this.state = options.state
	}

	this.go = function(newState) {
		this.state = newState;
	}

	return this;
}

module.exports = Component;
sensible.classes.Component = Component;
sensible.registerComponent('div.component', sensible.classes.Component);

},{"extend":10}],5:[function(require,module,exports){
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

},{"./sensibleComponent.js":4}],6:[function(require,module,exports){

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

},{}],7:[function(require,module,exports){
InputDelete = function (opts) {
	var self = this;

	var defaults = {};

	console.log('Creating an Input with Delete button.');
	$.extend(this, defaults, opts)

	//Wrap in a Div if not already wrapped
	var classToAdd = "deletable";
	var deleteButton = $('<div class="close">x</div>');

	// Wrap with a deletable class. Add a X button.
	this.el.wrap('<div class="' + classToAdd + '"></div>')
	// this.el = $().append(this.el);

	this.el.after(deleteButton);

	var inputBox = this.el.find('input');

	//When the user types..
	this.el.on('input', function() {
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
		self.el.val('');
		//Hide the x if neccessary.
		self.el.trigger('input');
	});

	//If a target was supplied..
	if (typeof this.target !== undefined) {
		//... append to it.
		self.el.appendTo(self.target);
	}

	return this;
}

module.exports = InputDelete;
sensible.classes.InputDelete = InputDelete;
sensible.registerComponent('input[deletable=true]', sensible.classes.InputDelete);

},{}],8:[function(require,module,exports){
var Component = require('./sensibleComponent.js');

InputFilter = function (opts) {
	var self = this;

	var defaults = {
		//The toFilter selection has this element as children. Selector. li, ul, a, etc.
		itemSelector: " > ul > li",
    highlight: true,
		blankSlateMessage: "No Results Found with \"<term>\"",
		autoHideHeadings: true,
		// Runs with a search and filter is about to begin; before any elements are hidden or selected.
		start : function() {},
		// Runs with a search and filter is complete
    complete : function() {},
	};


  //A DOM selection (jQuery) of elements to filter
	defaults.toFilter = function() { return this.el.parent() }

	$.extend(this, defaults, opts);
	$.extend(this, new Component(this));

  // Sometimes the el will be wrapped in a Div because we need to wrap elements like a clearing X in InputDelete.
	var searchBox = this.el.find('input').add(this.el.filter('input'));

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
    var Highlight = require('./sensibleHighlight.js')
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
      console.log('Typing..')
      clearTimeout(typingTO);
      typingTO = setTimeout(function() {
        highlightFx()
      }, timeAfterLastKeyPress)
    });
  }

	return this;
}

module.exports = InputFilter;
sensible.classes.InputFilter = InputFilter;
sensible.registerComponent('input[filterable=true]', sensible.classes.InputFilter);

},{"./sensibleComponent.js":4,"./sensibleHighlight.js":6}],9:[function(require,module,exports){
var Component = require('./sensibleComponent.js');

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
	}

	$.extend(self, defaults, options);
	$.extend(this, new Component(this));

	console.log('Creating a Jump to Top');

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

	return this;
}

module.exports = JumpToTop;
sensible.classes.JumpToTop = JumpToTop;
sensible.registerComponent('div.jump-to-top', sensible.classes.JumpToTop);

},{"./sensibleComponent.js":4}],10:[function(require,module,exports){
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
