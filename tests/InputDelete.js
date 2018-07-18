describe('InputDelete', function() {

    beforeAll(function(done) {
      $(document.body).empty()

      container = $('<div></div>')
      $(document.body).append(container);
      //create a list to filter.
      container.append('<h4>Category 1</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3 <ul><li>Nested Item 1</li><li>Nested Item 2</li></ul></li></ul>');
      container.append('<h4>Category 2</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>');
      container.append('<h4>Category 3</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>');

      // For testing declarative construction
      var input = $('<input type="text" deletable="true"></input>')
      $(document.body).append(input);

      setTimeout(function() {
        // Wait a bit before performing tests on all the constructed elements.
        done()
      }, 100)

    })

    it('Should exist', function() {
      var inputBox = $('<input type="text"></input>');
      $(document.body).append(inputBox);
      var theInputFilter = new sensible.classes.InputDelete({el: inputBox});
      expect(theInputFilter.el.parent().hasClass('deletable')).toBe(true);
    });

    it('Should construct declaratively', function() {
        $('input[deletable=true]').each(function() {
          // Should be wrapped in div with a class `deletable`
          expect($(this).parent().hasClass('deletable')).toBe(true);
          expect($(this).parent().find('div.close').text()).toBe('x');
        });

    });

    it('should display a close icon', function() {
      var inputBox = $('<input type="text"></input>');
      $(document.body).append(inputBox);
      var theInputFilter = new sensible.classes.InputDelete({el: inputBox});
      expect(theInputFilter.el.parent().hasClass('deletable')).toBe(true);

      //Input text
      inputBox.val('Item 1');
      inputBox.trigger('input');
      //Did the close x display?
      expect(theInputFilter.el.parent().find('.close').css('display')).toBe('block');
    });

    it('should clear when close icon is clicked', function() {
      var inputBox = $('<input type="text"></input>');
      $(document.body).append(inputBox);
      var theInputFilter = new sensible.classes.InputDelete({el: inputBox});
      expect(theInputFilter.el.parent().hasClass('deletable')).toBe(true);

      //Input text
      inputBox.val('Item Close Clearing test');
      inputBox.trigger('input');

      var closeButton = theInputFilter.el.parent().find('.close');
      closeButton.trigger('click');

      expect(inputBox.val()).toBe('');

    });

});
