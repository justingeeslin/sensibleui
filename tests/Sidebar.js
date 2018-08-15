describe('Sidebar', function() {

  afterAll(function() {

    //For manual testing and eyeballing.
    var sidebarButton = $('<button>Toggle Sidebar</button>');

    var sidebar = $('[sidebar][sensible-component]:first');
    sidebar.css('background-color', '#787878');

    sidebarButton.on('click', function() {
      if (sidebar.attr('closed') === undefined) {
        // Close it
        sidebar.attr('closed', 'true');
      }
      else {
        // Open it
        sidebar[0].removeAttribute('closed')
      }

    })
    $(document.body).append(sidebarButton);

  })

  it('should construct declaratively', function(done) {
    $(document.body).append('<div sidebar><h1>Section One</h1></div>');

    // Wait a bit for construction to happen..
    window.setTimeout(function() {
      expect($('div[sidebar][sensible-component]').length).toBeGreaterThan(0);
      done()
    }, 100)
  })

  it('should close', function(done) {
    var sidebar = $('<div sidebar></div>');
    $(document.body).append(sidebar);

    sidebar.attr('closed', '');

    // Wait a bit for construction to happen..
    window.setTimeout(function() {
      expect(sidebar.css('right')).not.toBe(0);
      done()
    }, 100)
  })
})
