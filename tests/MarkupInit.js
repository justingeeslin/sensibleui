// Require all the components.
require('../index.js')

describe('MarkupInit', function() {

    beforeAll(function(done) {
      console.log('Markup init tests.. appending')

      // Add expand collapse element
      // var el = $('<div class="expand-collapse"><div class="title">Untitled Title</div><div class="body">Untitled Body</div></div>');
      // $(document.body).append(el)



      setTimeout(function() {
        // Wait a bit before performing tests on all the constructed elements.
        done()
      }, 100)

    })

    xit('Should init Expand Collapse', function() {
      expect($('div.expand-collapse > a').length > 0).toBe(true);

    });

    it('Should init Input Delete', function() {
      var input = $('<input type="text" deletable="true"></input>')
      $(document.body).append(input);


        $('input[deletable=true]').each(function() {
          // Should be wrapped in div with a class `deletable`
          expect($(this).parent().hasClass('deletable')).toBe(true);
          expect($(this).parent().find('div.close').text()).toBe('x');
        });

    });

});
