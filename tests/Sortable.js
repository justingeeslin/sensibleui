describe('Sortable', function() {

    beforeAll(function(done) {
      setTimeout(function() {
        done();
      }, 1000);
    })

    it('should construct declaratively, that is, with just a tag, similar to the forthcoming web components/custom elements', function(done) {
      var aComponent = $('<div sortable><div>Item 1</div><div>Item 2</div></div>');

      // Wait a bit for construction to happen..
      aComponent.on('complete', function() {
        expect($('[sortable][sensible-component]').length).toBeGreaterThan(0);
        done()
      })

      $(document.body).append(aComponent);

    })

});
