describe('Accordion', function() {

  beforeAll(function(done) {
    // var my2 = new sensible.classes.Accordion({slug: 'accordion2', url: 'accordion2'});
    // my2.el.appendTo($(document.body));

    // var theQuestion2 = my2.el.find('a');
    // theAnswer2 = my2.el.find('div');

    el = $('<div class="accordion"><div class="title">Untitled Title</div><div class="body">Untitled Body</div></div>');
    $(document.body).append(el);
    // Append a second for testing that only one stays open.
    $(document.body).append('<div class="accordion"><div class="title">Untitled Title</div><div class="body">Untitled Body</div></div>');
    $(document.body).append('<div class="accordion"><div class="title">Untitled Title</div><div class="body">Untitled Body</div></div>');

    //Make the question bodies large so that we can test scroll things
    // $('<style>.accordion > div { height:100vh; }</style>').appendTo(document.head);
    //Also make the body large so that the bottom of the window doesn't push us back up
    // $('<style>html,body { height:500vh; }</style>').appendTo(document.head);

    // Wait a bit for construction to happen..
    setTimeout(function() {
      done()
    }, 1000)
  })


    it('should construct declaratively', function() {
      expect($('.accordion[sensible-component]').length).toBeGreaterThan(0);

    });

    it('should have only one open at a time', function() {
      var i = 0;
      $('.accordion').each(function() {
        // Click the even ones
        if (i % 2 == 0) {
          console.log('Clicking ', $(this).find('.title').text());
          $(this).find('.title').click();
        }
        // With each iteration make sure there is only one open.
        expect($('.accordion.open').length).toEqual(1);

        i++;
      })
    });

    // it('can open more than one open at a time except if autoclose is disabled.', function() {
    //
    //
    // });

    xit('should keep the newly expanded question in view despite closing questions', function(done) {


    });

});
