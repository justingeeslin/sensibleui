describe('SweetIndicator', function() {


    beforeAll(function() {
      console.log('Testing Sweet INdicator.')
      container = $('<div id="sweet-indicator"></div>');
      $(document.body).append(container);

      container.append('<ul><li>Item 1</li><li>Item 2<ul><li>Item 2.1</li><li>Item 2.2</li><li>Item 2.3</li></ul></li><li>Item 3</li></ul>');

      var options = {
        target : container,
        itemSelector : 'li',
        color : '#333'
      }
      var theSweetness = new sensible.classes.SweetIndicator(options);
    });


    it('Should exist', function() {
        expect(container.children().length > 0).toBe(true);
    });

});
