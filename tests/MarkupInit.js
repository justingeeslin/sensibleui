describe('MarkupInit', function() {

    beforeAll(function(done) {
      $(document.body).append($('<div class="expand-collapse"><div class="title">Untitled Title</div><div class="body">Untitled Body</div></div>'))
      $(document).trigger('ready');
      setTimeout(function() {
        done()
      }, 100)
    })

    it('Should init Expand Collapse', function() {
      expect($('.expand-collapse > a').length > 0).toBe(true);
    });

});
