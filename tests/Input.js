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

});
