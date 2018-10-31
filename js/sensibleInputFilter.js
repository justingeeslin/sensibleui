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
