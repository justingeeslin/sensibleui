describe('ExpandCollapse', function() {
    var myExpandCollapse = new sensible.classes.ExpandCollapse();
    var myExpandCollapse2 = new sensible.classes.ExpandCollapse({slug: 'untitled2'});

		var theQuestion = myExpandCollapse.el.find('a');
    var theAnswer = myExpandCollapse.el.find('div');

    var isOpen = function() {
      return theAnswer.filter(':visible').length > 0
    }

    it('Should exist and be named Untitled', function() {
        expect(theQuestion.attr('href')).toBe('#untitled');
    });

		it('should show content on click.', function() {
      theQuestion.trigger('click');
			expect(isOpen()).toBe(true);
		});

    it('should hide content on second click', function() {
      theQuestion.trigger('click');
			expect(isOpen()).toBe(false);
		});

    it('should close when triggering the toggle event', function() {
      myExpandCollapse.el.trigger('close');
			expect(isOpen()).toBe(false);
		});

    it('should open when triggering the toggle event', function() {
      myExpandCollapse.el.trigger('open');
			expect(isOpen()).toBe(true);
		});

    it('should show/hide when triggering the toggle event', function() {
      var beforeState = isOpen();
      myExpandCollapse.el.trigger('toggle');
      var afterState = isOpen();
      expect(beforeState).toBe(!afterState);
    });
});
