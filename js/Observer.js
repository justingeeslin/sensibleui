
sensible.classes.Observer = function() {
  var self = this;

  // A mapping from selector to Sensible Class.
  var selectorClassMap = [
    // {
    //   sel: 'div.component',
    //   class: sensible.classes.Component
    // },
    // {
    //   sel: 'input[deletable=true]',
    //   class: sensible.classes.InputDelete
    // },
    // {
    //   sel: 'div.expand-collapse',
    //   class: sensible.classes.ExpandCollapse
    // }
  ];

  this.getInsertableSelectors = function() {
    var insertableSelctors = "";
    for( var i in selectorClassMap) {
      i = parseInt(i);
      insertableSelctors += selectorClassMap[i].sel;
      if (typeof selectorClassMap[i+1] !== "undefined") {
         insertableSelctors += ', '
      }
    }
    return insertableSelctors;
  }

  this.add = function(selector, sensibleClass) {
    console.log('Adding a rule for ', selector, sensibleClass);
    selectorClassMap.push({
      sel: selector,
      class: sensibleClass
    });

    // Add the CSS rule
    addCSSRule(document.styleSheets[0], selector, "animation-duration: 0.001s; animation-name: nodeInserted;");
  }

  var markupInit = function( options ) {

      var target = typeof options !== "undefined" ? options.target : $(document.body);

      console.log('markup init')

      // Init Sensible Components. (only those that are not already init-ed, that is, with the `sensible-component` attribute)
      for( var i in selectorClassMap) {
        var item = selectorClassMap[i];
        $(item.sel + ':not([sensible-component])').each(function() {
          var options = {
            el: $(this)
          };
          // Get attributes of the element, they will be the options of the constructor.
          Array.prototype.slice.call(this.attributes).forEach(function(item) {
          	console.log(item.name + ': '+ item.value);
            options[item.name] = item.value;
          });
          console.log('Constructing with options: ', options)
          var aComponent = new item.class(options)
        });
      }

  }

  // Listen for an event that runs when the page is loaded and can also be triggered. (jQuery's ready cannot be triggered.)
  document.addEventListener("DOMContentLoaded", markupInit);

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

  // Listen for Body insertions using CSS and Animations in liue of their being no Mutation Observers.
  var insertListener = function(event){
    if (event.animationName == "nodeInserted") {
      // This is the debug for knowing our listener worked!
      // event.target is the new node!
      console.warn("A component has been inserted! ", event, event.target);
      $(document).trigger("DOMContentLoaded");
    }
  }

  document.addEventListener("animationstart", insertListener, false); // standard + firefox
  document.addEventListener("MSAnimationStart", insertListener, false); // IE
  document.addEventListener("webkitAnimationStart", insertListener, false); // Chrome + Safari

  return this;
}

var anObserver = new sensible.classes.Observer();
sensible.registerComponent = anObserver.add;
