describe('ExpandCollapse', function() {
    var myExpandCollapse = sensible.classes.ExpandCollapse();
	
		var theQuestion = myExpandCollapse.el.find('a');
    it('Should exist and be named Untitled', function() {
        expect(theQuestion.attr('href')).toBe('#!untitled-question');
    });
	
		theQuestion.trigger('click');
	
		it('Answer should be visible on click.', function() {
				expect(theQuestion.next().filter(':visible').length > 0 ).toBe(true);
		});
});