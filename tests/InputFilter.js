describe('InputFilter', function() {
    container = $('<div id="input-filter"></div>')

    //create a list to filter.
    container.append('<h4>Category 1</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3 <ul><li>Nested Item a</li><li>Nested Item b</li></ul></li></ul>');
    container.append('<h4>Category 2</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>');
    container.append('<h4>Category 3</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><h5>SubCat 3.1</h5><ul><li><h6>Nested Heading</h6>Item 4</li><li>Item 5</li><li>Item 3</li></ul>');
    container.append('<h4>Category DIV</h4><div><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul></div>');

    $(document.body).append(container);

    var options = {
      target: container,
      placeholderText : "Search for Items..",
      // itemSelector : '> div > ul > li'
    };

    var theInputFilter = new sensible.classes.InputFilter(options);

    var inputBox = $('input.filterable');

    it('Should exist', function() {
        expect(inputBox.length > 0).toBe(true);
    });

    it('should only show items containing characters entered', function() {
			//Enter 1
			inputBox.val('1');
			inputBox.trigger('input');

			//Should hide 2 & 3
			expect(container.find('li:contains("Item 2")').css('display')).toBe('none');
			expect(container.find('li:contains("Item 3")').css('display')).toBe('none');

    });

		it('should be case-insenstive', function() {
			//Enter
			inputBox.val('ITEM');
			inputBox.trigger('input');

			expect(container.find('li:contains("Item")').css('display')).toBe('list-item');


    });

    it('should set the placeholder text', function() {
      expect(inputBox.attr('placeholder')).toBe(options.placeholderText);
    });
});
