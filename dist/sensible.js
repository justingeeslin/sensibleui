(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
window.sensible = window.sensible !== undefined ? window.sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

require('./js/Observer.js')

sensible.classes.Component = require('./js/sensibleComponent.js')
sensible.registerComponent('div.component', sensible.classes.Component);

require('./js/sensibleInputDelete.js')
require('./js/sensibleInputFilter.js')
// sensible.classes.InputDeleteFilter = require('./js/sensibleInputDeleteFilter.js')
// sensible.classes.SweetIndicator = require('sensible-indicator')
// sensible.classes.ScrollSpy = require('./js/sensibleScrollSpy.js')

require('./js/sensibleExpandCollapse.js')
require('./js/sensibleAccordion.js');

require('./js/sensibleJumpToTop.js')

sensible.classes.Sidebar = require('./js/sensibleSidebar.js')
sensible.registerComponent('div[sidebar]', sensible.classes.Sidebar);

sensible.classes.Sortable = require('./js/sensibleSortable.js')
sensible.registerComponent('div[sortable]', sensible.classes.Sortable);

},{"./js/Observer.js":2,"./js/sensibleAccordion.js":3,"./js/sensibleComponent.js":4,"./js/sensibleExpandCollapse.js":5,"./js/sensibleInputDelete.js":7,"./js/sensibleInputFilter.js":8,"./js/sensibleJumpToTop.js":9,"./js/sensibleSidebar.js":10,"./js/sensibleSortable.js":11}],2:[function(require,module,exports){
window.sensible = window.sensible !== undefined ? window.sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

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

  var triggerEvent = function(el, name) {
    if (typeof(Event) === 'function') {
      var event = new Event(name);
    } else {
      var event = document.createEvent('Event');
      event.initEvent(name, true, true);
    }

    el.dispatchEvent(event);
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
          var options = {
            el: $(this)
          };
          // Get attributes of the element, they will be the options of the constructor.
          Array.prototype.slice.call(this.attributes).forEach(function(item) {
          	console.log(item.name + ': '+ item.value);
            options[item.name] = item.value;
          });
          console.log('Constructing with options: ', options)
          var aComponent = new item.class(options)
          triggerEvent($(this)[0], 'complete');
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
      triggerEvent(document, "DOMContentLoaded");

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
// A Sensible Component is a simple element with state.
var Component = function (options) {
	var self = this;

	// Use the private members for custom hidden setters and getters.
	// An identifier for the component's current state.
	var state = '';

	var defaults = {
		el : $(document.createDocumentFragment()),
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

	$.extend(this, defaults, options);

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

},{}],5:[function(require,module,exports){
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
var Component = require('./sensibleComponent.js');

InputDelete = function (opts) {
	var self = this;

	var defaults = {};

	console.log('Creating an Input with Delete button.');
	$.extend(this, defaults, opts)
	$.extend(this, new Component(this));

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

	return this;
}

module.exports = InputDelete;
sensible.classes.InputDelete = InputDelete;
sensible.registerComponent('input[deletable=true]', sensible.classes.InputDelete);

},{"./sensibleComponent.js":4}],8:[function(require,module,exports){
var Component = require('./sensibleComponent.js');

InputFilter = function (opts) {
	var self = this;

	var defaults = {
		//The toFilter selection has this element as children. Selector. li, ul, a, etc.
		itemSelector: " > ul > li",
    highlight: true,
		blankmessage: "No Results Found with \"<term>\"",
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
		el: $('<div class="blank-slate">' + self.blankmessage + '</div>'),
		show: function() {
			console.log('Showing Blank slate')
			if (!this.isCreated) {
				console.log('Showing but it is not created..')
				this.create();
			}
			var message = self.blankmessage.replace('<term>', searchBox.val());
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
sensible.registerComponent('input[filterable]', sensible.classes.InputFilter);

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
var Component = require('./sensibleComponent.js');

Sidebar = function (opts) {
	var self = this;

	var defaults = {};

	$.extend(this, defaults, opts);
	$.extend(this, new Component(this));

	// Add ARIA roles of menu https://w3c.github.io/aria-practices/#menu
	this.el.attr('role', 'menu');

	return this;
}

module.exports = Sidebar;

},{"./sensibleComponent.js":4}],11:[function(require,module,exports){
var Component = require('./sensibleComponent.js');
var S = require('sortablejs');
Sortable = function (opts) {
	var self = this;

	var defaults = {};

	$.extend(this, defaults, opts);
	$.extend(this, new Component(this));

  S.create(this.el[0]);

	return this;
}

module.exports = Sortable;

},{"./sensibleComponent.js":4,"sortablejs":12}],12:[function(require,module,exports){
/**!
 * Sortable
 * @author	RubaXa   <trash@rubaxa.org>
 * @license MIT
 */

(function sortableModule(factory) {
	"use strict";

	if (typeof define === "function" && define.amd) {
		define(factory);
	}
	else if (typeof module != "undefined" && typeof module.exports != "undefined") {
		module.exports = factory();
	}
	else {
		/* jshint sub:true */
		window["Sortable"] = factory();
	}
})(function sortableFactory() {
	"use strict";

	if (typeof window === "undefined" || !window.document) {
		return function sortableError() {
			throw new Error("Sortable.js requires a window with a document");
		};
	}

	var dragEl,
		parentEl,
		ghostEl,
		cloneEl,
		rootEl,
		nextEl,
		lastDownEl,

		scrollEl,
		scrollParentEl,
		scrollCustomFn,

		lastEl,
		lastCSS,
		lastParentCSS,

		oldIndex,
		newIndex,

		activeGroup,
		putSortable,

		autoScroll = {},

		tapEvt,
		touchEvt,

		moved,

		/** @const */
		R_SPACE = /\s+/g,
		R_FLOAT = /left|right|inline/,

		expando = 'Sortable' + (new Date).getTime(),

		win = window,
		document = win.document,
		parseInt = win.parseInt,
		setTimeout = win.setTimeout,

		$ = win.jQuery || win.Zepto,
		Polymer = win.Polymer,

		captureMode = false,
		passiveMode = false,

		supportDraggable = ('draggable' in document.createElement('div')),
		supportCssPointerEvents = (function (el) {
			// false when IE11
			if (!!navigator.userAgent.match(/(?:Trident.*rv[ :]?11\.|msie)/i)) {
				return false;
			}
			el = document.createElement('x');
			el.style.cssText = 'pointer-events:auto';
			return el.style.pointerEvents === 'auto';
		})(),

		_silent = false,

		abs = Math.abs,
		min = Math.min,

		savedInputChecked = [],
		touchDragOverListeners = [],

		_autoScroll = _throttle(function (/**Event*/evt, /**Object*/options, /**HTMLElement*/rootEl) {
			// Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
			if (rootEl && options.scroll) {
				var _this = rootEl[expando],
					el,
					rect,
					sens = options.scrollSensitivity,
					speed = options.scrollSpeed,

					x = evt.clientX,
					y = evt.clientY,

					winWidth = window.innerWidth,
					winHeight = window.innerHeight,

					vx,
					vy,

					scrollOffsetX,
					scrollOffsetY
				;

				// Delect scrollEl
				if (scrollParentEl !== rootEl) {
					scrollEl = options.scroll;
					scrollParentEl = rootEl;
					scrollCustomFn = options.scrollFn;

					if (scrollEl === true) {
						scrollEl = rootEl;

						do {
							if ((scrollEl.offsetWidth < scrollEl.scrollWidth) ||
								(scrollEl.offsetHeight < scrollEl.scrollHeight)
							) {
								break;
							}
							/* jshint boss:true */
						} while (scrollEl = scrollEl.parentNode);
					}
				}

				if (scrollEl) {
					el = scrollEl;
					rect = scrollEl.getBoundingClientRect();
					vx = (abs(rect.right - x) <= sens) - (abs(rect.left - x) <= sens);
					vy = (abs(rect.bottom - y) <= sens) - (abs(rect.top - y) <= sens);
				}


				if (!(vx || vy)) {
					vx = (winWidth - x <= sens) - (x <= sens);
					vy = (winHeight - y <= sens) - (y <= sens);

					/* jshint expr:true */
					(vx || vy) && (el = win);
				}


				if (autoScroll.vx !== vx || autoScroll.vy !== vy || autoScroll.el !== el) {
					autoScroll.el = el;
					autoScroll.vx = vx;
					autoScroll.vy = vy;

					clearInterval(autoScroll.pid);

					if (el) {
						autoScroll.pid = setInterval(function () {
							scrollOffsetY = vy ? vy * speed : 0;
							scrollOffsetX = vx ? vx * speed : 0;

							if ('function' === typeof(scrollCustomFn)) {
								return scrollCustomFn.call(_this, scrollOffsetX, scrollOffsetY, evt);
							}

							if (el === win) {
								win.scrollTo(win.pageXOffset + scrollOffsetX, win.pageYOffset + scrollOffsetY);
							} else {
								el.scrollTop += scrollOffsetY;
								el.scrollLeft += scrollOffsetX;
							}
						}, 24);
					}
				}
			}
		}, 30),

		_prepareGroup = function (options) {
			function toFn(value, pull) {
				if (value === void 0 || value === true) {
					value = group.name;
				}

				if (typeof value === 'function') {
					return value;
				} else {
					return function (to, from) {
						var fromGroup = from.options.group.name;

						return pull
							? value
							: value && (value.join
								? value.indexOf(fromGroup) > -1
								: (fromGroup == value)
							);
					};
				}
			}

			var group = {};
			var originalGroup = options.group;

			if (!originalGroup || typeof originalGroup != 'object') {
				originalGroup = {name: originalGroup};
			}

			group.name = originalGroup.name;
			group.checkPull = toFn(originalGroup.pull, true);
			group.checkPut = toFn(originalGroup.put);
			group.revertClone = originalGroup.revertClone;

			options.group = group;
		}
	;

	// Detect support a passive mode
	try {
		window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
			get: function () {
				// `false`, because everything starts to work incorrectly and instead of d'n'd,
				// begins the page has scrolled.
				passiveMode = false;
				captureMode = {
					capture: false,
					passive: passiveMode
				};
			}
		}));
	} catch (err) {}

	/**
	 * @class  Sortable
	 * @param  {HTMLElement}  el
	 * @param  {Object}       [options]
	 */
	function Sortable(el, options) {
		if (!(el && el.nodeType && el.nodeType === 1)) {
			throw 'Sortable: `el` must be HTMLElement, and not ' + {}.toString.call(el);
		}

		this.el = el; // root element
		this.options = options = _extend({}, options);


		// Export instance
		el[expando] = this;

		// Default options
		var defaults = {
			group: Math.random(),
			sort: true,
			disabled: false,
			store: null,
			handle: null,
			scroll: true,
			scrollSensitivity: 30,
			scrollSpeed: 10,
			draggable: /[uo]l/i.test(el.nodeName) ? 'li' : '>*',
			ghostClass: 'sortable-ghost',
			chosenClass: 'sortable-chosen',
			dragClass: 'sortable-drag',
			ignore: 'a, img',
			filter: null,
			preventOnFilter: true,
			animation: 0,
			setData: function (dataTransfer, dragEl) {
				dataTransfer.setData('Text', dragEl.textContent);
			},
			dropBubble: false,
			dragoverBubble: false,
			dataIdAttr: 'data-id',
			delay: 0,
			forceFallback: false,
			fallbackClass: 'sortable-fallback',
			fallbackOnBody: false,
			fallbackTolerance: 0,
			fallbackOffset: {x: 0, y: 0},
			supportPointer: Sortable.supportPointer !== false
		};


		// Set default options
		for (var name in defaults) {
			!(name in options) && (options[name] = defaults[name]);
		}

		_prepareGroup(options);

		// Bind all private methods
		for (var fn in this) {
			if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
				this[fn] = this[fn].bind(this);
			}
		}

		// Setup drag mode
		this.nativeDraggable = options.forceFallback ? false : supportDraggable;

		// Bind events
		_on(el, 'mousedown', this._onTapStart);
		_on(el, 'touchstart', this._onTapStart);
		options.supportPointer && _on(el, 'pointerdown', this._onTapStart);

		if (this.nativeDraggable) {
			_on(el, 'dragover', this);
			_on(el, 'dragenter', this);
		}

		touchDragOverListeners.push(this._onDragOver);

		// Restore sorting
		options.store && this.sort(options.store.get(this));
	}


	Sortable.prototype = /** @lends Sortable.prototype */ {
		constructor: Sortable,

		_onTapStart: function (/** Event|TouchEvent */evt) {
			var _this = this,
				el = this.el,
				options = this.options,
				preventOnFilter = options.preventOnFilter,
				type = evt.type,
				touch = evt.touches && evt.touches[0],
				target = (touch || evt).target,
				originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0]) || target,
				filter = options.filter,
				startIndex;

			_saveInputCheckedState(el);


			// Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.
			if (dragEl) {
				return;
			}

			if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
				return; // only left button or enabled
			}

			// cancel dnd if original target is content editable
			if (originalTarget.isContentEditable) {
				return;
			}

			target = _closest(target, options.draggable, el);

			if (!target) {
				return;
			}

			if (lastDownEl === target) {
				// Ignoring duplicate `down`
				return;
			}

			// Get the index of the dragged element within its parent
			startIndex = _index(target, options.draggable);

			// Check filter
			if (typeof filter === 'function') {
				if (filter.call(this, evt, target, this)) {
					_dispatchEvent(_this, originalTarget, 'filter', target, el, el, startIndex);
					preventOnFilter && evt.preventDefault();
					return; // cancel dnd
				}
			}
			else if (filter) {
				filter = filter.split(',').some(function (criteria) {
					criteria = _closest(originalTarget, criteria.trim(), el);

					if (criteria) {
						_dispatchEvent(_this, criteria, 'filter', target, el, el, startIndex);
						return true;
					}
				});

				if (filter) {
					preventOnFilter && evt.preventDefault();
					return; // cancel dnd
				}
			}

			if (options.handle && !_closest(originalTarget, options.handle, el)) {
				return;
			}

			// Prepare `dragstart`
			this._prepareDragStart(evt, touch, target, startIndex);
		},

		_prepareDragStart: function (/** Event */evt, /** Touch */touch, /** HTMLElement */target, /** Number */startIndex) {
			var _this = this,
				el = _this.el,
				options = _this.options,
				ownerDocument = el.ownerDocument,
				dragStartFn;

			if (target && !dragEl && (target.parentNode === el)) {
				tapEvt = evt;

				rootEl = el;
				dragEl = target;
				parentEl = dragEl.parentNode;
				nextEl = dragEl.nextSibling;
				lastDownEl = target;
				activeGroup = options.group;
				oldIndex = startIndex;

				this._lastX = (touch || evt).clientX;
				this._lastY = (touch || evt).clientY;

				dragEl.style['will-change'] = 'all';

				dragStartFn = function () {
					// Delayed drag has been triggered
					// we can re-enable the events: touchmove/mousemove
					_this._disableDelayedDrag();

					// Make the element draggable
					dragEl.draggable = _this.nativeDraggable;

					// Chosen item
					_toggleClass(dragEl, options.chosenClass, true);

					// Bind the events: dragstart/dragend
					_this._triggerDragStart(evt, touch);

					// Drag start event
					_dispatchEvent(_this, rootEl, 'choose', dragEl, rootEl, rootEl, oldIndex);
				};

				// Disable "draggable"
				options.ignore.split(',').forEach(function (criteria) {
					_find(dragEl, criteria.trim(), _disableDraggable);
				});

				_on(ownerDocument, 'mouseup', _this._onDrop);
				_on(ownerDocument, 'touchend', _this._onDrop);
				_on(ownerDocument, 'touchcancel', _this._onDrop);
				_on(ownerDocument, 'selectstart', _this);
				options.supportPointer && _on(ownerDocument, 'pointercancel', _this._onDrop);

				if (options.delay) {
					// If the user moves the pointer or let go the click or touch
					// before the delay has been reached:
					// disable the delayed drag
					_on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchend', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
					_on(ownerDocument, 'mousemove', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchmove', _this._disableDelayedDrag);
					options.supportPointer && _on(ownerDocument, 'pointermove', _this._disableDelayedDrag);

					_this._dragStartTimer = setTimeout(dragStartFn, options.delay);
				} else {
					dragStartFn();
				}


			}
		},

		_disableDelayedDrag: function () {
			var ownerDocument = this.el.ownerDocument;

			clearTimeout(this._dragStartTimer);
			_off(ownerDocument, 'mouseup', this._disableDelayedDrag);
			_off(ownerDocument, 'touchend', this._disableDelayedDrag);
			_off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
			_off(ownerDocument, 'mousemove', this._disableDelayedDrag);
			_off(ownerDocument, 'touchmove', this._disableDelayedDrag);
			_off(ownerDocument, 'pointermove', this._disableDelayedDrag);
		},

		_triggerDragStart: function (/** Event */evt, /** Touch */touch) {
			touch = touch || (evt.pointerType == 'touch' ? evt : null);

			if (touch) {
				// Touch device support
				tapEvt = {
					target: dragEl,
					clientX: touch.clientX,
					clientY: touch.clientY
				};

				this._onDragStart(tapEvt, 'touch');
			}
			else if (!this.nativeDraggable) {
				this._onDragStart(tapEvt, true);
			}
			else {
				_on(dragEl, 'dragend', this);
				_on(rootEl, 'dragstart', this._onDragStart);
			}

			try {
				if (document.selection) {
					// Timeout neccessary for IE9
					_nextTick(function () {
						document.selection.empty();
					});
				} else {
					window.getSelection().removeAllRanges();
				}
			} catch (err) {
			}
		},

		_dragStarted: function () {
			if (rootEl && dragEl) {
				var options = this.options;

				// Apply effect
				_toggleClass(dragEl, options.ghostClass, true);
				_toggleClass(dragEl, options.dragClass, false);

				Sortable.active = this;

				// Drag start event
				_dispatchEvent(this, rootEl, 'start', dragEl, rootEl, rootEl, oldIndex);
			} else {
				this._nulling();
			}
		},

		_emulateDragOver: function () {
			if (touchEvt) {
				if (this._lastX === touchEvt.clientX && this._lastY === touchEvt.clientY) {
					return;
				}

				this._lastX = touchEvt.clientX;
				this._lastY = touchEvt.clientY;

				if (!supportCssPointerEvents) {
					_css(ghostEl, 'display', 'none');
				}

				var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
				var parent = target;
				var i = touchDragOverListeners.length;

				if (target && target.shadowRoot) {
					target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
					parent = target;
				}

				if (parent) {
					do {
						if (parent[expando]) {
							while (i--) {
								touchDragOverListeners[i]({
									clientX: touchEvt.clientX,
									clientY: touchEvt.clientY,
									target: target,
									rootEl: parent
								});
							}

							break;
						}

						target = parent; // store last element
					}
					/* jshint boss:true */
					while (parent = parent.parentNode);
				}

				if (!supportCssPointerEvents) {
					_css(ghostEl, 'display', '');
				}
			}
		},


		_onTouchMove: function (/**TouchEvent*/evt) {
			if (tapEvt) {
				var	options = this.options,
					fallbackTolerance = options.fallbackTolerance,
					fallbackOffset = options.fallbackOffset,
					touch = evt.touches ? evt.touches[0] : evt,
					dx = (touch.clientX - tapEvt.clientX) + fallbackOffset.x,
					dy = (touch.clientY - tapEvt.clientY) + fallbackOffset.y,
					translate3d = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)';

				// only set the status to dragging, when we are actually dragging
				if (!Sortable.active) {
					if (fallbackTolerance &&
						min(abs(touch.clientX - this._lastX), abs(touch.clientY - this._lastY)) < fallbackTolerance
					) {
						return;
					}

					this._dragStarted();
				}

				// as well as creating the ghost element on the document body
				this._appendGhost();

				moved = true;
				touchEvt = touch;

				_css(ghostEl, 'webkitTransform', translate3d);
				_css(ghostEl, 'mozTransform', translate3d);
				_css(ghostEl, 'msTransform', translate3d);
				_css(ghostEl, 'transform', translate3d);

				evt.preventDefault();
			}
		},

		_appendGhost: function () {
			if (!ghostEl) {
				var rect = dragEl.getBoundingClientRect(),
					css = _css(dragEl),
					options = this.options,
					ghostRect;

				ghostEl = dragEl.cloneNode(true);

				_toggleClass(ghostEl, options.ghostClass, false);
				_toggleClass(ghostEl, options.fallbackClass, true);
				_toggleClass(ghostEl, options.dragClass, true);

				_css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));
				_css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));
				_css(ghostEl, 'width', rect.width);
				_css(ghostEl, 'height', rect.height);
				_css(ghostEl, 'opacity', '0.8');
				_css(ghostEl, 'position', 'fixed');
				_css(ghostEl, 'zIndex', '100000');
				_css(ghostEl, 'pointerEvents', 'none');

				options.fallbackOnBody && document.body.appendChild(ghostEl) || rootEl.appendChild(ghostEl);

				// Fixing dimensions.
				ghostRect = ghostEl.getBoundingClientRect();
				_css(ghostEl, 'width', rect.width * 2 - ghostRect.width);
				_css(ghostEl, 'height', rect.height * 2 - ghostRect.height);
			}
		},

		_onDragStart: function (/**Event*/evt, /**boolean*/useFallback) {
			var _this = this;
			var dataTransfer = evt.dataTransfer;
			var options = _this.options;

			_this._offUpEvents();

			if (activeGroup.checkPull(_this, _this, dragEl, evt)) {
				cloneEl = _clone(dragEl);

				cloneEl.draggable = false;
				cloneEl.style['will-change'] = '';

				_css(cloneEl, 'display', 'none');
				_toggleClass(cloneEl, _this.options.chosenClass, false);

				// #1143: IFrame support workaround
				_this._cloneId = _nextTick(function () {
					rootEl.insertBefore(cloneEl, dragEl);
					_dispatchEvent(_this, rootEl, 'clone', dragEl);
				});
			}

			_toggleClass(dragEl, options.dragClass, true);

			if (useFallback) {
				if (useFallback === 'touch') {
					// Bind touch events
					_on(document, 'touchmove', _this._onTouchMove);
					_on(document, 'touchend', _this._onDrop);
					_on(document, 'touchcancel', _this._onDrop);

					if (options.supportPointer) {
						_on(document, 'pointermove', _this._onTouchMove);
						_on(document, 'pointerup', _this._onDrop);
					}
				} else {
					// Old brwoser
					_on(document, 'mousemove', _this._onTouchMove);
					_on(document, 'mouseup', _this._onDrop);
				}

				_this._loopId = setInterval(_this._emulateDragOver, 50);
			}
			else {
				if (dataTransfer) {
					dataTransfer.effectAllowed = 'move';
					options.setData && options.setData.call(_this, dataTransfer, dragEl);
				}

				_on(document, 'drop', _this);

				// #1143: Бывает элемент с IFrame внутри блокирует `drop`,
				// поэтому если вызвался `mouseover`, значит надо отменять весь d'n'd.
				// Breaking Chrome 62+
				// _on(document, 'mouseover', _this);

				_this._dragStartId = _nextTick(_this._dragStarted);
			}
		},

		_onDragOver: function (/**Event*/evt) {
			var el = this.el,
				target,
				dragRect,
				targetRect,
				revert,
				options = this.options,
				group = options.group,
				activeSortable = Sortable.active,
				isOwner = (activeGroup === group),
				isMovingBetweenSortable = false,
				canSort = options.sort;

			if (evt.preventDefault !== void 0) {
				evt.preventDefault();
				!options.dragoverBubble && evt.stopPropagation();
			}

			if (dragEl.animated) {
				return;
			}

			moved = true;

			if (activeSortable && !options.disabled &&
				(isOwner
					? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
					: (
						putSortable === this ||
						(
							(activeSortable.lastPullMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) &&
							group.checkPut(this, activeSortable, dragEl, evt)
						)
					)
				) &&
				(evt.rootEl === void 0 || evt.rootEl === this.el) // touch fallback
			) {
				// Smart auto-scrolling
				_autoScroll(evt, options, this.el);

				if (_silent) {
					return;
				}

				target = _closest(evt.target, options.draggable, el);
				dragRect = dragEl.getBoundingClientRect();

				if (putSortable !== this) {
					putSortable = this;
					isMovingBetweenSortable = true;
				}

				if (revert) {
					_cloneHide(activeSortable, true);
					parentEl = rootEl; // actualization

					if (cloneEl || nextEl) {
						rootEl.insertBefore(dragEl, cloneEl || nextEl);
					}
					else if (!canSort) {
						rootEl.appendChild(dragEl);
					}

					return;
				}


				if ((el.children.length === 0) || (el.children[0] === ghostEl) ||
					(el === evt.target) && (_ghostIsLast(el, evt))
				) {
					//assign target only if condition is true
					if (el.children.length !== 0 && el.children[0] !== ghostEl && el === evt.target) {
						target = el.lastElementChild;
					}

					if (target) {
						if (target.animated) {
							return;
						}

						targetRect = target.getBoundingClientRect();
					}

					_cloneHide(activeSortable, isOwner);

					if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt) !== false) {
						if (!dragEl.contains(el)) {
							el.appendChild(dragEl);
							parentEl = el; // actualization
						}

						this._animate(dragRect, dragEl);
						target && this._animate(targetRect, target);
					}
				}
				else if (target && !target.animated && target !== dragEl && (target.parentNode[expando] !== void 0)) {
					if (lastEl !== target) {
						lastEl = target;
						lastCSS = _css(target);
						lastParentCSS = _css(target.parentNode);
					}

					targetRect = target.getBoundingClientRect();

					var width = targetRect.right - targetRect.left,
						height = targetRect.bottom - targetRect.top,
						floating = R_FLOAT.test(lastCSS.cssFloat + lastCSS.display)
							|| (lastParentCSS.display == 'flex' && lastParentCSS['flex-direction'].indexOf('row') === 0),
						isWide = (target.offsetWidth > dragEl.offsetWidth),
						isLong = (target.offsetHeight > dragEl.offsetHeight),
						halfway = (floating ? (evt.clientX - targetRect.left) / width : (evt.clientY - targetRect.top) / height) > 0.5,
						nextSibling = target.nextElementSibling,
						after = false
					;

					if (floating) {
						var elTop = dragEl.offsetTop,
							tgTop = target.offsetTop;

						if (elTop === tgTop) {
							after = (target.previousElementSibling === dragEl) && !isWide || halfway && isWide;
						}
						else if (target.previousElementSibling === dragEl || dragEl.previousElementSibling === target) {
							after = (evt.clientY - targetRect.top) / height > 0.5;
						} else {
							after = tgTop > elTop;
						}
						} else if (!isMovingBetweenSortable) {
						after = (nextSibling !== dragEl) && !isLong || halfway && isLong;
					}

					var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

					if (moveVector !== false) {
						if (moveVector === 1 || moveVector === -1) {
							after = (moveVector === 1);
						}

						_silent = true;
						setTimeout(_unsilent, 30);

						_cloneHide(activeSortable, isOwner);

						if (!dragEl.contains(el)) {
							if (after && !nextSibling) {
								el.appendChild(dragEl);
							} else {
								target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
							}
						}

						parentEl = dragEl.parentNode; // actualization

						this._animate(dragRect, dragEl);
						this._animate(targetRect, target);
					}
				}
			}
		},

		_animate: function (prevRect, target) {
			var ms = this.options.animation;

			if (ms) {
				var currentRect = target.getBoundingClientRect();

				if (prevRect.nodeType === 1) {
					prevRect = prevRect.getBoundingClientRect();
				}

				_css(target, 'transition', 'none');
				_css(target, 'transform', 'translate3d('
					+ (prevRect.left - currentRect.left) + 'px,'
					+ (prevRect.top - currentRect.top) + 'px,0)'
				);

				target.offsetWidth; // repaint

				_css(target, 'transition', 'all ' + ms + 'ms');
				_css(target, 'transform', 'translate3d(0,0,0)');

				clearTimeout(target.animated);
				target.animated = setTimeout(function () {
					_css(target, 'transition', '');
					_css(target, 'transform', '');
					target.animated = false;
				}, ms);
			}
		},

		_offUpEvents: function () {
			var ownerDocument = this.el.ownerDocument;

			_off(document, 'touchmove', this._onTouchMove);
			_off(document, 'pointermove', this._onTouchMove);
			_off(ownerDocument, 'mouseup', this._onDrop);
			_off(ownerDocument, 'touchend', this._onDrop);
			_off(ownerDocument, 'pointerup', this._onDrop);
			_off(ownerDocument, 'touchcancel', this._onDrop);
			_off(ownerDocument, 'pointercancel', this._onDrop);
			_off(ownerDocument, 'selectstart', this);
		},

		_onDrop: function (/**Event*/evt) {
			var el = this.el,
				options = this.options;

			clearInterval(this._loopId);
			clearInterval(autoScroll.pid);
			clearTimeout(this._dragStartTimer);

			_cancelNextTick(this._cloneId);
			_cancelNextTick(this._dragStartId);

			// Unbind events
			_off(document, 'mouseover', this);
			_off(document, 'mousemove', this._onTouchMove);

			if (this.nativeDraggable) {
				_off(document, 'drop', this);
				_off(el, 'dragstart', this._onDragStart);
			}

			this._offUpEvents();

			if (evt) {
				if (moved) {
					evt.preventDefault();
					!options.dropBubble && evt.stopPropagation();
				}

				ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

				if (rootEl === parentEl || Sortable.active.lastPullMode !== 'clone') {
					// Remove clone
					cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
				}

				if (dragEl) {
					if (this.nativeDraggable) {
						_off(dragEl, 'dragend', this);
					}

					_disableDraggable(dragEl);
					dragEl.style['will-change'] = '';

					// Remove class's
					_toggleClass(dragEl, this.options.ghostClass, false);
					_toggleClass(dragEl, this.options.chosenClass, false);

					// Drag stop event
					_dispatchEvent(this, rootEl, 'unchoose', dragEl, parentEl, rootEl, oldIndex);

					if (rootEl !== parentEl) {
						newIndex = _index(dragEl, options.draggable);

						if (newIndex >= 0) {
							// Add event
							_dispatchEvent(null, parentEl, 'add', dragEl, parentEl, rootEl, oldIndex, newIndex);

							// Remove event
							_dispatchEvent(this, rootEl, 'remove', dragEl, parentEl, rootEl, oldIndex, newIndex);

							// drag from one list and drop into another
							_dispatchEvent(null, parentEl, 'sort', dragEl, parentEl, rootEl, oldIndex, newIndex);
							_dispatchEvent(this, rootEl, 'sort', dragEl, parentEl, rootEl, oldIndex, newIndex);
						}
					}
					else {
						if (dragEl.nextSibling !== nextEl) {
							// Get the index of the dragged element within its parent
							newIndex = _index(dragEl, options.draggable);

							if (newIndex >= 0) {
								// drag & drop within the same list
								_dispatchEvent(this, rootEl, 'update', dragEl, parentEl, rootEl, oldIndex, newIndex);
								_dispatchEvent(this, rootEl, 'sort', dragEl, parentEl, rootEl, oldIndex, newIndex);
							}
						}
					}

					if (Sortable.active) {
						/* jshint eqnull:true */
						if (newIndex == null || newIndex === -1) {
							newIndex = oldIndex;
						}

						_dispatchEvent(this, rootEl, 'end', dragEl, parentEl, rootEl, oldIndex, newIndex);

						// Save sorting
						this.save();
					}
				}

			}

			this._nulling();
		},

		_nulling: function() {
			rootEl =
			dragEl =
			parentEl =
			ghostEl =
			nextEl =
			cloneEl =
			lastDownEl =

			scrollEl =
			scrollParentEl =

			tapEvt =
			touchEvt =

			moved =
			newIndex =

			lastEl =
			lastCSS =

			putSortable =
			activeGroup =
			Sortable.active = null;

			savedInputChecked.forEach(function (el) {
				el.checked = true;
			});
			savedInputChecked.length = 0;
		},

		handleEvent: function (/**Event*/evt) {
			switch (evt.type) {
				case 'drop':
				case 'dragend':
					this._onDrop(evt);
					break;

				case 'dragover':
				case 'dragenter':
					if (dragEl) {
						this._onDragOver(evt);
						_globalDragOver(evt);
					}
					break;

				case 'mouseover':
					this._onDrop(evt);
					break;

				case 'selectstart':
					evt.preventDefault();
					break;
			}
		},


		/**
		 * Serializes the item into an array of string.
		 * @returns {String[]}
		 */
		toArray: function () {
			var order = [],
				el,
				children = this.el.children,
				i = 0,
				n = children.length,
				options = this.options;

			for (; i < n; i++) {
				el = children[i];
				if (_closest(el, options.draggable, this.el)) {
					order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
				}
			}

			return order;
		},


		/**
		 * Sorts the elements according to the array.
		 * @param  {String[]}  order  order of the items
		 */
		sort: function (order) {
			var items = {}, rootEl = this.el;

			this.toArray().forEach(function (id, i) {
				var el = rootEl.children[i];

				if (_closest(el, this.options.draggable, rootEl)) {
					items[id] = el;
				}
			}, this);

			order.forEach(function (id) {
				if (items[id]) {
					rootEl.removeChild(items[id]);
					rootEl.appendChild(items[id]);
				}
			});
		},


		/**
		 * Save the current sorting
		 */
		save: function () {
			var store = this.options.store;
			store && store.set(this);
		},


		/**
		 * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
		 * @param   {HTMLElement}  el
		 * @param   {String}       [selector]  default: `options.draggable`
		 * @returns {HTMLElement|null}
		 */
		closest: function (el, selector) {
			return _closest(el, selector || this.options.draggable, this.el);
		},


		/**
		 * Set/get option
		 * @param   {string} name
		 * @param   {*}      [value]
		 * @returns {*}
		 */
		option: function (name, value) {
			var options = this.options;

			if (value === void 0) {
				return options[name];
			} else {
				options[name] = value;

				if (name === 'group') {
					_prepareGroup(options);
				}
			}
		},


		/**
		 * Destroy
		 */
		destroy: function () {
			var el = this.el;

			el[expando] = null;

			_off(el, 'mousedown', this._onTapStart);
			_off(el, 'touchstart', this._onTapStart);
			_off(el, 'pointerdown', this._onTapStart);

			if (this.nativeDraggable) {
				_off(el, 'dragover', this);
				_off(el, 'dragenter', this);
			}

			// Remove draggable attributes
			Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
				el.removeAttribute('draggable');
			});

			touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);

			this._onDrop();

			this.el = el = null;
		}
	};


	function _cloneHide(sortable, state) {
		if (sortable.lastPullMode !== 'clone') {
			state = true;
		}

		if (cloneEl && (cloneEl.state !== state)) {
			_css(cloneEl, 'display', state ? 'none' : '');

			if (!state) {
				if (cloneEl.state) {
					if (sortable.options.group.revertClone) {
						rootEl.insertBefore(cloneEl, nextEl);
						sortable._animate(dragEl, cloneEl);
					} else {
						rootEl.insertBefore(cloneEl, dragEl);
					}
				}
			}

			cloneEl.state = state;
		}
	}


	function _closest(/**HTMLElement*/el, /**String*/selector, /**HTMLElement*/ctx) {
		if (el) {
			ctx = ctx || document;

			do {
				if ((selector === '>*' && el.parentNode === ctx) || _matches(el, selector)) {
					return el;
				}
				/* jshint boss:true */
			} while (el = _getParentOrHost(el));
		}

		return null;
	}


	function _getParentOrHost(el) {
		var parent = el.host;

		return (parent && parent.nodeType) ? parent : el.parentNode;
	}


	function _globalDragOver(/**Event*/evt) {
		if (evt.dataTransfer) {
			evt.dataTransfer.dropEffect = 'move';
		}
		evt.preventDefault();
	}


	function _on(el, event, fn) {
		el.addEventListener(event, fn, captureMode);
	}


	function _off(el, event, fn) {
		el.removeEventListener(event, fn, captureMode);
	}


	function _toggleClass(el, name, state) {
		if (el) {
			if (el.classList) {
				el.classList[state ? 'add' : 'remove'](name);
			}
			else {
				var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
				el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
			}
		}
	}


	function _css(el, prop, val) {
		var style = el && el.style;

		if (style) {
			if (val === void 0) {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					val = document.defaultView.getComputedStyle(el, '');
				}
				else if (el.currentStyle) {
					val = el.currentStyle;
				}

				return prop === void 0 ? val : val[prop];
			}
			else {
				if (!(prop in style)) {
					prop = '-webkit-' + prop;
				}

				style[prop] = val + (typeof val === 'string' ? '' : 'px');
			}
		}
	}


	function _find(ctx, tagName, iterator) {
		if (ctx) {
			var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;

			if (iterator) {
				for (; i < n; i++) {
					iterator(list[i], i);
				}
			}

			return list;
		}

		return [];
	}



	function _dispatchEvent(sortable, rootEl, name, targetEl, toEl, fromEl, startIndex, newIndex) {
		sortable = (sortable || rootEl[expando]);

		var evt = document.createEvent('Event'),
			options = sortable.options,
			onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);

		evt.initEvent(name, true, true);

		evt.to = toEl || rootEl;
		evt.from = fromEl || rootEl;
		evt.item = targetEl || rootEl;
		evt.clone = cloneEl;

		evt.oldIndex = startIndex;
		evt.newIndex = newIndex;

		rootEl.dispatchEvent(evt);

		if (options[onName]) {
			options[onName].call(sortable, evt);
		}
	}


	function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvt, willInsertAfter) {
		var evt,
			sortable = fromEl[expando],
			onMoveFn = sortable.options.onMove,
			retVal;

		evt = document.createEvent('Event');
		evt.initEvent('move', true, true);

		evt.to = toEl;
		evt.from = fromEl;
		evt.dragged = dragEl;
		evt.draggedRect = dragRect;
		evt.related = targetEl || toEl;
		evt.relatedRect = targetRect || toEl.getBoundingClientRect();
		evt.willInsertAfter = willInsertAfter;

		fromEl.dispatchEvent(evt);

		if (onMoveFn) {
			retVal = onMoveFn.call(sortable, evt, originalEvt);
		}

		return retVal;
	}


	function _disableDraggable(el) {
		el.draggable = false;
	}


	function _unsilent() {
		_silent = false;
	}


	/** @returns {HTMLElement|false} */
	function _ghostIsLast(el, evt) {
		var lastEl = el.lastElementChild,
			rect = lastEl.getBoundingClientRect();

		// 5 — min delta
		// abs — нельзя добавлять, а то глюки при наведении сверху
		return (evt.clientY - (rect.top + rect.height) > 5) ||
			(evt.clientX - (rect.left + rect.width) > 5);
	}


	/**
	 * Generate id
	 * @param   {HTMLElement} el
	 * @returns {String}
	 * @private
	 */
	function _generateId(el) {
		var str = el.tagName + el.className + el.src + el.href + el.textContent,
			i = str.length,
			sum = 0;

		while (i--) {
			sum += str.charCodeAt(i);
		}

		return sum.toString(36);
	}

	/**
	 * Returns the index of an element within its parent for a selected set of
	 * elements
	 * @param  {HTMLElement} el
	 * @param  {selector} selector
	 * @return {number}
	 */
	function _index(el, selector) {
		var index = 0;

		if (!el || !el.parentNode) {
			return -1;
		}

		while (el && (el = el.previousElementSibling)) {
			if ((el.nodeName.toUpperCase() !== 'TEMPLATE') && (selector === '>*' || _matches(el, selector))) {
				index++;
			}
		}

		return index;
	}

	function _matches(/**HTMLElement*/el, /**String*/selector) {
		if (el) {
			selector = selector.split('.');

			var tag = selector.shift().toUpperCase(),
				re = new RegExp('\\s(' + selector.join('|') + ')(?=\\s)', 'g');

			return (
				(tag === '' || el.nodeName.toUpperCase() == tag) &&
				(!selector.length || ((' ' + el.className + ' ').match(re) || []).length == selector.length)
			);
		}

		return false;
	}

	function _throttle(callback, ms) {
		var args, _this;

		return function () {
			if (args === void 0) {
				args = arguments;
				_this = this;

				setTimeout(function () {
					if (args.length === 1) {
						callback.call(_this, args[0]);
					} else {
						callback.apply(_this, args);
					}

					args = void 0;
				}, ms);
			}
		};
	}

	function _extend(dst, src) {
		if (dst && src) {
			for (var key in src) {
				if (src.hasOwnProperty(key)) {
					dst[key] = src[key];
				}
			}
		}

		return dst;
	}

	function _clone(el) {
		if (Polymer && Polymer.dom) {
			return Polymer.dom(el).cloneNode(true);
		}
		else if ($) {
			return $(el).clone(true)[0];
		}
		else {
			return el.cloneNode(true);
		}
	}

	function _saveInputCheckedState(root) {
		var inputs = root.getElementsByTagName('input');
		var idx = inputs.length;

		while (idx--) {
			var el = inputs[idx];
			el.checked && savedInputChecked.push(el);
		}
	}

	function _nextTick(fn) {
		return setTimeout(fn, 0);
	}

	function _cancelNextTick(id) {
		return clearTimeout(id);
	}

	// Fixed #973:
	_on(document, 'touchmove', function (evt) {
		if (Sortable.active) {
			evt.preventDefault();
		}
	});

	// Export utils
	Sortable.utils = {
		on: _on,
		off: _off,
		css: _css,
		find: _find,
		is: function (el, selector) {
			return !!_closest(el, selector, el);
		},
		extend: _extend,
		throttle: _throttle,
		closest: _closest,
		toggleClass: _toggleClass,
		clone: _clone,
		index: _index,
		nextTick: _nextTick,
		cancelNextTick: _cancelNextTick
	};


	/**
	 * Create sortable instance
	 * @param {HTMLElement}  el
	 * @param {Object}      [options]
	 */
	Sortable.create = function (el, options) {
		return new Sortable(el, options);
	};


	// Export
	Sortable.version = '1.7.0';
	return Sortable;
});

},{}]},{},[1]);
