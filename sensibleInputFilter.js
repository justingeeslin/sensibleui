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