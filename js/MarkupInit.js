var selectorClassMap = [
  {
    sel: 'input[deletable=true]',
    class: sensible.classes.InputDelete
  }
];

var insertableSelctors = "";
for( var i in selectorClassMap) {
  insertableSelctors += selectorClassMap[i].sel;
  if (typeof selectorClassMap[i+1] !== "undefined") {
     insertableSelctors += ', '
  }
}

var markupInit = function( options ) {

    var target = typeof options !== "undefined" ? options.target : $(document.body);

    console.log('markup init')

    // Instanticate objects based on their markup.
    // $('div.expand-collapse').each(function() {
    //   var titleEl = $(this).find('.title');
    //   var bodyEl = $(this).find('.body');
    //   console.log('Creating an Expand Collapse.')
    //   var newElement = $(document.createDocumentFragment());
    //   var anExpCol = new sensible.classes.ExpandCollapse({
    //     target: newElement,
    //     title: titleEl.text(),
    //     content: bodyEl.html()
    //   })
    //   // consider never doing this. What if someone put events on this element before my replace? They'd be destroyed that's what.
    //   $(this).replaceWith(newElement)
    // })

    // Init Deletable input. (only those that are not already init-ed)
    for( var i in selectorClassMap) {
      var item = selectorClassMap[i];
      $(item.sel + ':not([sensible-component])').each(function() {
        var aComponent = new item.class({
          el: $(this)
        })
      });
    }



}

// Listen for an event that runs when the page is loaded and can also be triggered. (jQuery's ready cannot be triggered.)
document.addEventListener("DOMContentLoaded", markupInit);

// Listen for Body insertions using CSS and Animations in liue of their being no Mutation Observers.
var insertListener = function(event){
	if (event.animationName == "nodeInserted") {
		// This is the debug for knowing our listener worked!
		// event.target is the new node!
		console.warn("A component has been inserted! ", event, event.target);
    document.dispatchEvent(new Event("DOMContentLoaded"));
	}
}

// Add animation styles to the body
var sheet = (function() {
	// Create the <style> tag
	var style = document.createElement("style");

	// Add a media (and/or media query) here if you'd like!
	// style.setAttribute("media", "screen")
	// style.setAttribute("media", "only screen and (max-width : 1024px)")

	// WebKit hack :(
	style.appendChild(document.createTextNode(""));

	// Add the <style> element to the page
	document.head.appendChild(style);

	return style.sheet;
})();

function addCSSRule(sheet, selector, rules, index) {
	if("insertRule" in sheet) {
		sheet.insertRule(selector + "{" + rules + "}", index);
	}
	else if("addRule" in sheet) {
		sheet.addRule(selector, rules, index);
	}
}

addCSSRule(document.styleSheets[0], "@keyframes nodeInserted", "from { opacity: 0.99; } to { opacity: 1; } ");
addCSSRule(document.styleSheets[0], insertableSelctors, "animation-duration: 0.001s; animation-name: nodeInserted;");

document.addEventListener("animationstart", insertListener, false); // standard + firefox
document.addEventListener("MSAnimationStart", insertListener, false); // IE
document.addEventListener("webkitAnimationStart", insertListener, false); // Chrome + Safari
