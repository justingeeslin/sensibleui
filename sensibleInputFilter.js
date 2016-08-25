var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.InputFilter = function (opts) {
	var self = this;

	var defaults = {
		//The toFilter selection has this element as children. Selector. li, ul, a, etc.
		itemSelector: " > ul > li",
	};

	$.extend(this, defaults, opts);
	//Create a Input Component with our options.
	$.extend(this, new sensible.classes.Input(this));

	//A DOM selection (jQuery) of elements to filter
	this.toFilter = function() { return self.el.parent() }

	//Find the input, Search box.
	var searchBox = this.el.find('input').add(this.el.filter('input'));

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

		itemsToHide.hide();

		console.log('Found these: ')
		console.log(itemsToHide);

    //If all the list items of a list are hidden, hide the list
    console.log('Looking for lists...')
    var lists = self.toFilter().children('ul');
    console.log(lists);

    lists.show();
		lists.parent().show();
    lists.each(function() {
      // If all of the list's children are hidden...
      if ($(this).children(':visible').length <= 0) {
        console.log('Hiding ' + $(this)[0])
        //Hide yourself
        $(this).hide();

				//Hide your container
				$(this).parent().hide();
      }
    });

		//This list's heading
		var selectorHeadings = 'h1,h2,h3,h4,h5,h6';
		var headings = self.toFilter().children(selectorHeadings);
		headings.show();
		headings.each(function() {
      // If all of the list's children are hidden...
      if ($(this).nextUntil(selectorHeadings).find(':visible').length <= 0) {
        console.log('Hiding ' + $(this)[0])
        //Hide yourself
        $(this).hide();

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
