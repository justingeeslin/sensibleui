describe('Highlight', function() {

    beforeAll(function() {
      console.log('Testing Highlight.')
      container = $('<div id="highlight"></div>');
      $(document.body).append(container);

      container.append('<p>Wall Street, Big Banks, Charles Koch</p>');
      container.append('<p>Kochakola, Bank Roll</p>');

      //Add some style to the highlight class so we can tell
      $('<style>.highlight { background-color:yellow; }</style>').appendTo(document.head);

    });


    it('Should highlight (construct)', function() {
      var options = {
        target : container,
        textToHighlight : 'Koch',
      }
      theHighlighter = new sensible.classes.Highlight(options);

      expect($('.highlight').length > 0).toBe(true);
    });

    it('Should remove highlights', function() {
      theHighlighter.remove()

      expect($('.highlight').length <= 0).toBe(true);
    });

    it('Should highlight words specified', function() {
      var options = {
        target : container,
        textToHighlight : 'Bank',
      }
      var bankHL = new sensible.classes.Highlight(options);

      var highlightedCorrectWords = true;

      //Look for exceptions
      $('.highlight').each(function() {
        var highlightedText = $(this).text();
        if (highlightedText != options.textToHighlight) {
          console.log('Something went wrong. Highlighted: ' + highlightedText + ' when you should have highlighted ' + options.textToHighlight);
          highlightedCorrectWords = false;
          return 0;
        }
      });

      expect(highlightedCorrectWords).toBe(true);
    });

    it('Should highlight words specified testing for automatic highlight removal', function() {
      var options = {
        target : container,
        textToHighlight : 'Street',
      }
      var streetHL = new sensible.classes.Highlight(options);

      var highlightedCorrectWords = true;

      //Look for exceptions
      $('.highlight').each(function() {
        var highlightedText = $(this).text();
        if (highlightedText != options.textToHighlight) {
          console.log('Something went wrong. Highlighted: ' + highlightedText + ' when you should have highlighted ' + options.textToHighlight);
          highlightedCorrectWords = false;
          return 0;
        }
      });

      expect(highlightedCorrectWords).toBe(true);
    });

});
