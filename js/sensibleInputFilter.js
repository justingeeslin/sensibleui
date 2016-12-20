var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.InputFilter = function (opts) {
	var self = this;

	var defaults = {
		//The toFilter selection has this element as children. Selector. li, ul, a, etc.
		itemSelector: " > ul > li",
    highlight: false,
		blankSlateMessage: "No Results Found with \"<term>\"",
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
	$.extend(this, new sensible.classes.Input(this));

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

    // this.el.trigger('start.inputfilter.sensible')

		var searchTerms = searchBox.val().split(' ');


		console.log('Searchbox input/ Keyup event. Value is: ');
		console.log(searchTerms);

		console.log('Looking for elements of type ' + self.itemSelector + ' with the text ' + searchTerms + ' among the following elements ');
		console.log(self.toFilter().children());
		var items = self.toFilter().find(self.itemSelector);
		//Show by default
		items.show();

		//For each term, add to the selection of things to hide.
		var itemsToHide = {};

		for (var i in searchTerms) {
			console.log('This is a term: ' + searchTerms[i])
			//Hide question items that do not contain the search term
			var withoutTerm = items.not(":containsIN(" + searchTerms[i] + ")")

			if (itemsToHide !== undefined) {
				itemsToHide = withoutTerm
			}
			else {
				itemsToHide.add(withoutTerm)
			}

		}


		console.log('Found these to hide: ')
		console.log(itemsToHide);

		if (items.length == itemsToHide.length) {
			console.log('Hiding them all.')
		}

		itemsToHide.hide();

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

		//Are all the items hidden? If so trigger the blank slate message
		if (items.length == itemsToHide.length) {
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
			console.log('Creating a blank slate for InputFilter as a child of ')
			console.log(self.toFilter())
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
      theHighlighter = new sensible.classes.Highlight({
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
		console.log('Target supplied.')
		console.log(this.target);
		self.blankSlate.create();
	}

	return this;
}