
describe('Sensible Observer', function() {

    beforeAll(function(done) {

    })

    it('should constrct an object', function(done) {
      sensible.registerComponent('div.component', sensible.classes.Component);

      var aComponent = $('<div class="component"></div>');
      $(document.body).append(aComponent)

      setTimeout(function() {
        expect(aComponent[0].hasAttribute('sensible-component')).toBe(true);
        done();
      }, 1);


    })

});
