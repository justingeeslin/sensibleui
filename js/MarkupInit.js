var markupInit = function() {

    // Instanticate objects based on their markup.
    $('div.expand-collapse').each(function() {
      var titleEl = $(this).find('.title');
      var bodyEl = $(this).find('.body');
      console.log('Creating an Expand Collapse.')
      var newElement = $(document.createDocumentFragment());
      var anExpCol = new sensible.classes.ExpandCollapse({
        target: newElement,
        title: titleEl.text(),
        content: bodyEl.html()
      })
      // consider never doing this. What if someone put events on this element before my replace? They'd be destroyed that's what.
      $(this).replaceWith(newElement)
    })

    // Init Deletable input
    $('input[deletable=true]').each(function() {
      var anInputDel = new sensible.classes.InputDelete({
        el: $(this)
      })
    });

}

$(document).ready(markupInit)
