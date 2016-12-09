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

    it('Should highlight words specified when there is more than one term and without finding the exact phrase.', function() {
      var options = {
        target : container,
        textToHighlight : 'Wall Koch',
      }
      var bankHL = new sensible.classes.Highlight(options);

      var toHighlight = options.textToHighlight.split(' ');
      var highlightedText = [];

      var highlightedCorrectWords = true;

      //Look for exceptions
      $('.highlight').each(function() {
        var highlight = $(this).text().split(' ');

        for (var i in highlight) {
          if (highlightedText.indexOf(highlight[i]) == -1) {
            highlightedText.push(highlight[i]);
          }
        }

      });

      console.log('These are the words to highlight:')
      console.log(toHighlight)
      console.log('These are the words that are highlighted:')
      console.log(highlightedText)

      // Make sure the set of words to highlight match the words highlighted.
      if (highlightedText.length != toHighlight.length) {
        console.log('There is a word missing.')
        highlightedCorrectWords = false;
        expect(highlightedCorrectWords).toBe(true);
      }

      for(var i in highlightedText ) {
        // should the word highlighted be highlighted?
        if (toHighlight.indexOf(highlightedText[i]) == -1) {
          console.log('The word ' + highlightedText[i] + ' seems to be highlighted and should not be.')
          highlightedCorrectWords = false
          expect(highlightedCorrectWords).toBe(true);
        }
      }

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
