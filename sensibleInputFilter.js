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
		items = items.not(":containsIN(" + $(this).val() + ")")

		items.hide();

		console.log('Found these: ')
		console.log(items);
	});

	//If a target was supplied..
	if (typeof this.target !== undefined) {
		//... append to it.
		self.el.appendTo(self.target);
	}

	return this;
}
