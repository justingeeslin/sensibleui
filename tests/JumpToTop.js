describe('JumpToTop', function() {
    var theJumpToTop = new sensible.classes.JumpToTop();
    it('Should exist', function() {
        expect(theJumpToTop.el[0].nodeName).toBe('DIV');
    });

		theJumpToTop.el.trigger('click');

		it('Should scroll the window to the top onClick', function() {
				expect($(window).scrollTop()).toBe(0);
		});
});
