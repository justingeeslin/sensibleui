describe('Accordion', function() {

    var my2 = new sensible.classes.Accordion({slug: 'accordion2', url: 'accordion2'});
    my2.el.appendTo($(document.body));

    var theQuestion2 = my2.el.find('a');
    theAnswer2 = my2.el.find('div');

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
});
