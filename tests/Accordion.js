describe('Accordion', function() {

    var my2 = new sensible.classes.Accordion({slug: 'accordion2', url: 'accordion2'});
    my2.el.appendTo($(document.body));

    var theQuestion2 = my2.el.find('a');
    theAnswer2 = my2.el.find('div');

    //Make the question bodies large so that we can test scroll things
    $('<style>.expand-collapse > div { height:100vh; }</style>').appendTo(document.head);
    //Also make the body large so that the bottom of the window doesn't push us back up
    $('<style>html,body { height:500vh; }</style>').appendTo(document.head);

    var isOpen = function() {
      return theAnswer.filter(':visible').length > 0
    }

    it('should construct', function() {
      my = new sensible.classes.Accordion({slug: 'accordion', url: 'accordion'});

      theQuestion = my.el.find('a');
      theAnswer = my.el.find('div');
    });

    it('should append to the DOM', function() {
      my.el.appendTo($(document.body));
    });

    it('should have only one open at a time', function() {
      theQuestion.click();
      theQuestion2.click();

      var visibleAnswers = $('.expand-collapse > div:visible')

      expect(visibleAnswers.length == 1).toBe(true)
    });

    it('should keep the newly expanded question in view despite closing questions', function(done) {
      $('.expand-collapse:nth(0)').trigger('open');

      setTimeout(function() {
        //Scroll to the second question
        $(window).scrollTop($('.expand-collapse:nth(1)').offset().top)

        theQuestion.click();

        //Is the second question in view? aka does it have a y coord in the positive
        var myRect = theQuestion[0].getBoundingClientRect()
        myRect.y = myRect.top;
        console.log(myRect.y)
        expect(myRect.y >= 0).toBe(true)
        done()
      }, 1000)

    });

});
