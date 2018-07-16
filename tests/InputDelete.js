var InputDelete = require('../js/sensibleInputDelete.js')

fdescribe('InputDelete', function() {

    beforeAll(function() {
      container = $('<div></div>')
      $(document.body).append(container);
      //create a list to filter.
      container.append('<h4>Category 1</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3 <ul><li>Nested Item 1</li><li>Nested Item 2</li></ul></li></ul>');
      container.append('<h4>Category 2</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>');
      container.append('<h4>Category 3</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>');

    })

    afterAll(function() {
      // container.empty()
    })

    it('Should exist', function() {
      var inputBox = $('<input type="text"></input>');
      $(document.body).append(inputBox);
      var theInputFilter = new InputDelete({el: inputBox});
      expect(theInputFilter.el.parent().hasClass('deletable')).toBe(true);
    });

    it('should display a close icon', function() {
      var inputBox = $('<input type="text"></input>');
      $(document.body).append(inputBox);
      var theInputFilter = new InputDelete({el: inputBox});
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
      var theInputFilter = new InputDelete({el: inputBox});
      expect(theInputFilter.el.parent().hasClass('deletable')).toBe(true);

      //Input text
      inputBox.val('Item Close Clearing test');
      inputBox.trigger('input');

      var closeButton = theInputFilter.el.parent().find('.close');
      closeButton.trigger('click');

      expect(inputBox.val()).toBe('');

    });

});
