describe('JumpToTop', function() {
    var theJumpToTop = new sensible.classes.JumpToTop();
    it('Should exist', function() {
        expect(theJumpToTop.el[0].nodeName).toBe('DIV');
    });



		it('Should scroll the window to the top onClick', function() {
      theJumpToTop.el.trigger('click');
			expect($(window).scrollTop()).toBe(0);
		});
});
