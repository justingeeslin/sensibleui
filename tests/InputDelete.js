var InputDelete = require('../js/sensibleInputDelete.js')

describe('InputDelete', function() {
    var container = $('<div id="input-delete"></div>')

    //create a list to filter.
    container.append('<h4>Category 1</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3 <ul><li>Nested Item 1</li><li>Nested Item 2</li></ul></li></ul>');
    container.append('<h4>Category 2</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>');
    container.append('<h4>Category 3</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>');

    $(document.body).append(container);
    var theInputFilter = new InputDelete({target: container});

    inputBox = $('.deletable > input');
    closeX = $('.deletable > div');


    afterAll(function() {
      // container.empty()
    })

    it('Should exist', function() {
        expect(inputBox.length > 0).toBe(true);
    });

    it('should display a close icon', function() {
      //Input text
      inputBox.val('Item 1');
      inputBox.trigger('input');
      //Did the close x display?
      expect(closeX.css('display')).toBe('block');
    });

    it('should clear when close icon is clicked', function() {
      closeX.trigger('click');

      expect(closeX.val()).toBe('');

    });

});
