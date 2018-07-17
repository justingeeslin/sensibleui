// Require all the components.
require('../index.js')

fdescribe('MarkupInit', function() {

    beforeAll(function(done) {
      $(document.body).append($('<div class="expand-collapse"><div class="title">Untitled Title</div><div class="body">Untitled Body</div></div>'))

      setTimeout(function() {
        $(document).trigger('ready');
        done()
      }, 100)
    })

    it('Should init Expand Collapse', function() {
      expect($('.expand-collapse > a').length > 0).toBe(true);
    it('Should init Input Delete', function(done) {

        $('input[deletable=true]').each(function() {
          // Should be wrapped in div with a class `deletable`
          expect($(this).parent().hasClass('deletable')).toBe(true);
          expect($(this).parent().find('div.close').text()).toBe('x');
          done();
        });

    });

});
