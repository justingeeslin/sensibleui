describe('ExpandCollapse', function() {

  beforeAll(function(done) {
    // Add expand collapse element
    el = $('<details><summary>Untitled Title</summary><p>Untitled Body</p></details>');
    $(document.body).append(el)

		theTitle = el.find('summary');
    theBody = theTitle.siblings();

    isOpen = function() {
      return theBody.is(':visible')
    }

    setTimeout(function() {
      // Wait a bit before performing tests on all the constructed elements.
      done()
    }, 100)
  });
					
		beforeEach(function() {
			// Begin each test with an open Collapsible
			 console.log('Adding open attribute..')
			 el[0].setAttribute('open', '')
		 })


    it('Should construct declaratively', function() {
      expect($('details[sensible-component]').length > 0).toBe(true);
    });

		// Attempting to test toggling on click. Might there be other gestures you need to test other than click?
		xit('should show content on click and hide on the second click.', function(done) {
      var isOpenIntially = isOpen()
      // Click once
      theTitle.trigger('click');
      window.setTimeout(function() {
        expect(isOpen()).toBe(!isOpenIntially, ' Clicked once and didn\'t change.');
        if (isOpen()) {
          expect(el.attr('open')).not.toBe(undefined);
        }

        // // click twice
        // theTitle.trigger('click');
        // window.setTimeout(function() {
        //   expect(isOpen()).toBe(isOpenIntially);
        //   if (isOpen()) {
        //     expect(el.attr('open')).not.toBe(undefined);
        //   }
          done()
        // }, 10)
      }, 10)

		});

    it('should show content on open attribute', function() {
      expect(isOpen()).toBe(true);
		});

    // Fails in IE10 because removing attributes doesn't trigger the ATTR modified event as it should https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-mutationevents
    it('should hide content without open attribute', function() {
      console.log('Removing open attribute..')
      el[0].removeAttribute('open');
			expect(isOpen()).toBe(false, 'Removed attribute but it was still open');


		});

		// Does this case matter?
    xit('should hide content with open attribute set to false', function() {
      console.log('Setting open attribute to false..')
      el[0].setAttribute('open', false)
			expect(isOpen()).toBe(false, 'Setting open attribute to false but it was still open');


		});

});
