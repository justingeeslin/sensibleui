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
    });

});
