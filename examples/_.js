// Can we just talk about how much sense this makes?
var myInputDelete = sensible.classes.InputDelete();
//Label it Clearable Input box
$(myInputDelete.el).before('<h3>Clearable Input box</h3>');

//Create a Jump to Top
var myJump = sensible.classes.JumpToTop();

//Create an Expand/Collapse
var myExpandCollapse = sensible.classes.ExpandCollapse();
$(myExpandCollapse.el).before('<h3>Expand / Collapse</h3>');

//Create an Input Delete with Filter
var myInputDeleteFilter = sensible.classes.InputDeleteFilter({
	itemSelector : 'a'
});
$(document.body).append("<h3>Clearable Input as a Filter</h3>");
$(document.body).append(myInputDeleteFilter.el)
$(document.body).append('<a href="#">Mississippi</a>');
$(document.body).append('<a href="#">Tennessee</a>');
$(document.body).append('<a href="#">Connecticut</a>');