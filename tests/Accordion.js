describe('Accordion', function() {
    var my = new sensible.classes.Accordion();
    my.el.appendTo($(document.body));
    var my2 = new sensible.classes.Accordion({slug: 'untitled2', url: 'unititled2'});
    my2.el.appendTo($(document.body));

		var theQuestion = my.el.find('a');
    var theAnswer = my.el.find('div');

    var theQuestion2 = my2.el.find('a');
    theAnswer2 = my2.el.find('div');

    var isOpen = function() {
      return theAnswer.filter(':visible').length > 0
    }

    it('should have only one open at a time', function() {
      theQuestion.click();
      theQuestion2.click();

      expect(theAnswer2.filter(':visible').length <= 0).toBe(true)
    });
});