describe('ExpandCollapse', function() {

  beforeAll(function(done) {
    // Add expand collapse element
    el = $('<div class="expand-collapse"><div class="title">Untitled Title</div><div class="body">Untitled Body</div></div>');
    $(document.body).append(el)


		theTitle = el.find('.title');
    theBody = el.find('.body');

    isOpen = function() {
      return theBody.filter(':visible').length > 0
    }

    setTimeout(function() {
      // Wait a bit before performing tests on all the constructed elements.
      done()
    }, 100)
  });


    it('Should construct declaratively', function() {
      expect($('div.expand-collapse[sensible-component]').length > 0).toBe(true);
    });

		it('should show content on click and hide on the second click.', function() {
      theTitle.trigger('click');
			expect(isOpen()).toBe(true);
      theTitle.trigger('click');
			expect(isOpen()).toBe(false);
		});

    it('should close when triggering the close event', function() {
      el.trigger('close');
			expect(isOpen()).toBe(false);
		});

    it('should open when triggering the open event', function() {
      el.trigger('open');
			expect(isOpen()).toBe(true);
		});

    it('should show/hide when triggering the toggle event', function() {
      var beforeState = isOpen();
      el.trigger('toggle');
      var afterState = isOpen();
      expect(beforeState).toBe(!afterState);
    });

    it('should open when triggering the go event', function() {
      el.trigger('go');
			expect(isOpen()).toBe(true);
		});

});
