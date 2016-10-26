describe('ScrollSpy', function() {

    beforeAll(function() {
      //Create content section with headings
      var content = '<div id="content"><h1 id="one">Heading 1</h1><h1 id="two">Heading 2</h1><h1 id="three">Heading 3</h1></div>';
      $(document.body).append(content);

      //Ensure scrolling
      $('h1').css('margin-bottom', '150vh');

      //Create a container where a online, links to each heading, will be created
      $(document.body).append($('<div id="outline" style="position:fixed;top:0;right:0;"></div>'));

      var options = {
        target: $('#content'),
        outlineTarget: $('#outline')
      }
      var theScrollSpy = new sensible.classes.ScrollSpy(options);
    })


    it('Should have children added to the outline', function() {
        expect($('#outline').find('li').length > 0).toBe(true);
    });

    it('Should "go" links when scrolling', function(done) {
      outlineItems = $('#outline .outline').children();
      var didActivateOnScroll = false;

      outlineItems.on('go', function() {
        console.log('This item has gone. ' + $(this).text());
        $(this).css('color', 'red');
        didActivateOnScroll = true;
        expect(didActivateOnScroll).toBe(true)
        done()
      });

      //For some reason we have to wait a little bit before scrolling. Investigate further.
      setTimeout(function() {
        console.log('Scrolling to the second heading. ' + $('h1:nth(1)')[0].getBoundingClientRect().top);
  			$(window).scrollTop($('h1:nth(1)')[0].getBoundingClientRect().top);
        console.log('Scrolled');
			}, 2);


    });

    it('Should activate the first outline item when at the top of the page', function(done) {
      var didActivateOnScroll = false;
      $(window).scrollTop($(document).height());
      outlineItems.filter(':first').on('go', function() {
        console.log('Activated first child when scolling to the top. ' + $(this).text());
        didActivateOnScroll = true;
        expect(didActivateOnScroll).toBe(true)
        done()
      });

      setTimeout(function() {
        //Scroll to the top
  			$(window).scrollTop(0);
			}, 2);
    });

    it('Should activate the last outline item when at the bottom of the page', function(done) {
      var didActivateOnScroll = false;
      $(window).scrollTop(0);
      outlineItems.on('go', function() {
        console.log('Activated last child when scolling to the bottom. ' + $(this).text());
        didActivateOnScroll = true;
        expect(didActivateOnScroll).toBe(true)
        done()
      });

      setTimeout(function() {
        //Scroll to the bottom
        $(window).scrollTop($(document).height());
      }, 2);
    });


});
