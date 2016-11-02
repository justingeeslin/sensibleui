var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.InputFilter = function (opts) {
	var self = this;

	var defaults = {
		//The toFilter selection has this element as children. Selector. li, ul, a, etc.
		itemSelector: " > ul > li",
    highlight: false,
    start : function() {},
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

	searchBox.on('input', function(e) {

    // this.el.trigger('start.inputfilter.sensible')

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

    var completeTO;
    clearTimeout(completeTO);
    completeTO = setTimeout(function() {
      self.el.trigger('complete.inputfilter.sensible')
    }, 333)

	});

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
    console.log('Binding to key presses for highlighting.')
  }

	//If a target was supplied..
	if (typeof this.target !== undefined) {
		//... append to it.
		self.el.appendTo(self.target);
	}

	return this;
}
