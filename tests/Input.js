var Input = require('../js/sensibleInput.js')

describe('Input', function() {

  it('should construct', function() {

    anInput = new Input();

    expect(anInput instanceof Input).toBe(true);
  });

  it('should set placeholder text on input element', function() {

    anInput = new Input({
      placeholderText : "Search for Items..",
    });

    expect(anInput.el.attr('placeholder')).toBe(anInput.placeholderText);
  });

  it('should call preload callback on render', function() {
    var didPreload = false;
    aComponent = new Input({
      preload: function() {
        didPreload = true;
      }
    });

    expect(didPreload).toBe(true)
  });

  it('should call postload callback on render', function() {
    var didPreload = false;
    aComponent = new Input({
      postload: function() {
        didPreload = true;
      }
    });

    expect(didPreload).toBe(true)
  });

});
