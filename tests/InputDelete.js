describe('InputDelete', function() {
    var theInputFilter = new sensible.classes.InputDelete({target: $(document.body)});

    inputBox = $('.deletable > input');
    closeX = $('.deletable > div');

    //create a list to filter.
    $(document.body).append('<h4>Category 1</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3 <ul><li>Nested Item 1</li><li>Nested Item 2</li></ul></li></ul>');
    $(document.body).append('<h4>Category 2</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>');
    $(document.body).append('<h4>Category 3</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>');

    it('Should exist', function() {
        expect(inputBox.length > 0).toBe(true);
    });

    it('should display a close icon', function() {
      //Input text
      inputBox.val('Item 1');

      //Did the close x display?
      expect(closeX.css('display')).toBe('block');
    });

    it('should clear when close icon is clicked', function() {
      closeX.trigger('click');

      expect(closeX.val()).toBe('');

    });

});