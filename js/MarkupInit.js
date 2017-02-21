var markupInit = function() {

    // Instanticate objects based on their markup.
    $('.expand-collapse').each(function() {
      var titleEl = $(this).find('.title');
      var bodyEl = $(this).find('.body');
      console.log('Creating an Expand Collapse.')
      var newElement = $(document.createDocumentFragment());
      var anExpCol = new sensible.classes.ExpandCollapse({
        target: newElement,
        title: titleEl.text(),
        content: bodyEl.html()
      })
      $(this).replaceWith(newElement)
    })

}

$(document).ready(markupInit)
