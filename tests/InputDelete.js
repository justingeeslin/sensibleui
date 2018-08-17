describe('InputDelete', function() {

    beforeAll(function(done) {
      setupContainer = function(container) {
        //create a list to filter.
        container.append('<h4>Category 1</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3 <ul><li>Nested Item 1</li><li>Nested Item 2</li></ul></li></ul>');
        container.append('<h4>Category 2</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>');
        container.append('<h4>Category 3</h4><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>');
        $('body').append(container);

      }

      setTimeout(function() {
        done();
      }, 1000);

    })

    it('Should construct declaratively', function(done) {
      var container = $('<div></div>')
      setupContainer(container);
      var inputBox = $('<input type="text" deletable="true"></input>')

      // Wait a bit for construction to happen..
      inputBox.on('complete', function() {
        $('input[deletable=true]').each(function() {
          // Should be wrapped in div with a class `deletable`
          expect($(this).parent().hasClass('deletable')).toBe(true);
          expect($(this).parent().find('div.close').text()).toBe('x');
        });
        done()
      })

      container.prepend(inputBox);
    });

    it('should display a close icon', function(done) {
      var container = $('<div></div>')
      setupContainer(container);
      var inputBox = $('<input type="text" deletable="true"></input>')

      // Wait a bit for construction to happen..
      inputBox.on('complete', function() {
        //Input text
        inputBox.val('Item 1');
        inputBox.trigger('input');
        //Did the close x display?
        expect(inputBox.parent().find('.close').css('display')).toBe('block');
        done()
      })

      container.prepend(inputBox);

    });

    it('should clear when close icon is clicked', function(done) {
      var container = $('<div></div>')
      setupContainer(container);
      var inputBox = $('<input type="text" deletable="true"></input>')

      // Wait a bit for construction to happen..
      inputBox.on('complete', function() {
        //Input text
        inputBox.val('Item Close Clearing test');
        inputBox.trigger('input');

        var closeButton = inputBox.parent().find('.close');
        closeButton.trigger('click');

        expect(inputBox.val()).toBe('');
        done()
      })

      container.prepend(inputBox);

    });

});
