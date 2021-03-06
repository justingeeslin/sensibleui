describe('InputFilter', function() {

    beforeAll(function(done) {

      // Does the 'complete' event fire at the end of a search and filter
      firedCompleteEvent = false;
      // Does the 'complete' callback at the end of a search and filter
      calledCompleteCallback = false;
      // A filter event is important for informing other components like scrollspy.
      firedFilterEvent = false;

      setupContainer = function(container) {
        //create a list to filter.
        container.append('<h4>Category 1</h4><ul><li>Item 1</li><li>Item 2</li><li>Alert Module Colors</li><li>Item 3 <ul><li>Nested Item a</li><li>Nested Item b</li></ul></li></ul>');
        container.append('<h4>Category 2</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>');
        container.append('<h4>Category 3</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><h5>SubCat 3.1</h5><ul><li><h6>Nested Heading</h6>Item 4</li><li>Item 5</li><li>Item 3</li></ul>');
        $('body').append(container);

        container.on('complete.inputfilter.sensible', function() {
          firedCompleteEvent = true;
        })

        container.on('filter', function() {
          firedFilterEvent = true;
        })
      }

      setTimeout(function() {
        done();
      }, 1000);

    });

    it('should construct declaratively', function(done) {

      var inputBox = $('<input filterable></input>');

      // Wait a bit for construction to happen..
      inputBox.on('complete', function() {
        expect($('input[filterable][sensible-component]').length).toBeGreaterThan(0);
        done()
      });

      $('body').append(inputBox);

    })

    it('should only show items containing characters entered', function(done) {
      var container = $('<div name="filter-container"></div>');
      var inputBox = $('<input filterable></input>');
      container.prepend(inputBox);
      // Populates with filterable things and appends to body.
      setupContainer(container);

      // Wait a bit for construction to happen..
      inputBox.on('complete', function() {
        //Enter 1
  			inputBox.val('1');
  			inputBox.trigger('input');

  			//Should hide 2 & 3
  			expect(container.find('li:contains("Item 2")').css('display')).toBe('none');
  			expect(container.find('li:contains("Item 3")').css('display')).toBe('none');

        done()
      });

    });

    it('should show an item if it contains the terms and not the exact phrase', function(done) {
      var container = $('<div name="filter-container"></div>');
      var inputBox = $('<input filterable></input>');
      container.prepend(inputBox);
      // Populates with filterable things and appends to body.
      setupContainer(container);

      // Wait a bit for construction to happen..
      inputBox.on('complete', function() {
        //Enter 1
  			inputBox.val('alert colors');
  			inputBox.trigger('input');

  			//
  			expect(container.find('li:contains("alert module colors")').css('display') != 'none').toBe(true);

        done()
      })


    });

    xit('should highlight', function(cb) {
      //Enter 1
			inputBox.val('1');
			inputBox.trigger('input');

      inputBox.on('complete', function() {
        expect($('.highlight').length > 0).toBe(true);
        cb();
      }, 666);

    });

		it('should be case-insenstive', function(done) {
      var container = $('<div name="filter-container"></div>');
      var inputBox = $('<input filterable></input>');


      // Wait a bit for construction to happen..
      inputBox.on('complete', function() {
        //Enter
  			inputBox.val('ITEM');
  			inputBox.trigger('input');

  			expect(container.find('li:contains("Item")').css('display')).toBe('list-item');

        done()
      })

      container.prepend(inputBox);
      // Populates with filterable things and appends to body.
      setupContainer(container);

    });

    // it('should fire event when filter is complete', function() {
    //   expect(firedCompleteEvent).toBe(true);
    // });
    //
    // it('should call a "complete" callback when filter is complete', function() {
    //   expect(calledCompleteCallback).toBe(true);
    // });
    //
    // it('should call a "filter" event when filter is complete', function() {
    //   expect(firedFilterEvent).toBe(true);
    // });

    it('should show a blank slate message when no results are displayed', function(done) {
      var container = $('<div class="filter-container"></div>');
      var inputBox = $('<input filterable></input>');
      container.prepend(inputBox);

      // Wait a bit for construction to happen..
      inputBox.on('complete', function() {
        inputBox.val('Koch');
  			inputBox.trigger('input');

        expect(inputBox.parent().children('.blank-slate:visible').length ).not.toBe(0)
        done()
      });

      // Populates with filterable things and appends to body.
      setupContainer(container);
    });

    it('should show a blank slate message with correct text', function(done) {
      var container = $('<div name="filter-container"></div>');
      var blankMessage = "No results found"
      var inputBox = $('<input filterable blankmessage="' + blankMessage + '"></input>');

      // Wait a bit for construction to happen..
      inputBox.on('complete', function() {
        inputBox.val('Koch');
  			inputBox.trigger('input');

        expect(container.children('.blank-slate').text()).toBe(blankMessage);
        done()
      });

      container.prepend(inputBox);
      // Populates with filterable things and appends to body.
      setupContainer(container);

    })

    xit('should not highlight terms in the blank slate message', function(cb) {
      setTimeout(function() {
        expect($('.blank-slate').find('.highlight').length > 0).toBe(false);
        cb();
      }, 666);
    })
});
