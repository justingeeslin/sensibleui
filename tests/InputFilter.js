describe('InputFilter', function() {
    container = $('<div id="input-filter"></div>')

    //create a list to filter.
    container.append('<h4>Category 1</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3 <ul><li>Nested Item a</li><li>Nested Item b</li></ul></li></ul>');
    container.append('<h4>Category 2</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>');
    container.append('<h4>Category 3</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><h5>SubCat 3.1</h5><ul><li><h6>Nested Heading</h6>Item 4</li><li>Item 5</li><li>Item 3</li></ul>');
    // container.append('<h4>Category DIV</h4><div><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul></div>');

    $(document.body).append(container);

    // Does the 'complete' event fire at the end of a search and filter
    firedCompleteEvent = false;
    // Does the 'complete' callback at the end of a search and filter
    calledCompleteCallback = false;
    // A filter event is important for informing other components like scrollspy.
    firedFilterEvent = false;

    container.on('complete.inputfilter.sensible', function() {
      firedCompleteEvent = true;
    })


    container.on('filter', function() {
      firedFilterEvent = true;
    })

    afterAll(function() {
      container.remove();
    })

    $('<style>.highlight { background-color:yellow; }</style>').appendTo(document.head);

    it('Should exist', function() {
      options = {
        // target: container,
        placeholderText : "Search for Items..",
        // itemSelector : '> div > ul > li',
        highlight: true,
        complete: function() {
          calledCompleteCallback = true;
        }
      };

      theInputFilter = new sensible.classes.InputFilter(options);

      container.append(theInputFilter.el)

      inputBox = $('input.filterable');
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

    it('should highlight', function(cb) {
      setTimeout(function() {
        expect($('.highlight').length > 0).toBe(true);
        cb();
      }, 666);

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

    it('should fire event when filter is complete', function() {
      expect(firedCompleteEvent).toBe(true);
    });

    it('should call a "complete" callback when filter is complete', function() {
      expect(calledCompleteCallback).toBe(true);
    });

    it('should call a "filter" event when filter is complete', function() {
      expect(firedFilterEvent).toBe(true);
    });

    it('should show a blank slate message when no results are displayed', function() {
      inputBox.val('Koch');
			inputBox.trigger('input');

      expect(container.children('.blank-slate:visible').length == 1).toBe(true)
    });

    it('should show a blank slate message with correct text', function() {
      var msg = theInputFilter.blankSlateMessage.replace('<term>', inputBox.val())
      expect(container.children('.blank-slate').text()).toBe(msg);
    })
});
