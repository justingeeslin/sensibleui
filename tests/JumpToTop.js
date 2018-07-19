describe('JumpToTop', function() {

  beforeAll(function(done) {
    $(document.body).empty();
    $(document.body).append('<div class="jump-to-top"><span></span></div>');

    // Wait a bit for construction to happen..
    window.setTimeout(function() {
      done()
    }, 100);
  })

    it('Should construct declaratively', function() {
      expect($('div.jump-to-top[sensible-component]').length).toBeGreaterThan(0);
    });

		it('Should scroll the window to the top onClick', function() {
      $('div.jump-to-top[sensible-component]').trigger('click');
			expect($(window).scrollTop()).toBe(0);
		});
});
