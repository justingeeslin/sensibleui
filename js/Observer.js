window.sensible = window.sensible !== undefined ? window.sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

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
    console.log('Adding a rule for ', selector);
    selectorClassMap.push({
      sel: selector,
      class: sensibleClass
    });
  }

  //Attach a Mutation Observer to the document body
  var observer = new MutationObserver(function(mutations) {
  	mutations.forEach(function(mutation) {
  		// console.log("Observed", mutation.addedNodes);

      // For each added node, new to the DOM
      mutation.addedNodes.forEach(function(node) {

        // If this node is not an element..
        if (node.nodeType != 1) {
          // continue trying to find a match
          return true;
        }

        // Try to match the newly added node to a selector
        console.log('Trying to match node:', node)

        for(var j in selectorClassMap) {
          var item = selectorClassMap[j];
          if (node.matches(item.sel) && !node.hasAttribute('sensible-component')) {
            console.log('About to construct upon ', node);
            var options = {
              el: $(node)
            };
            var aComponent = new item.class(options);
            aComponent.el.trigger('complete');
          }
          else {
            // console.log('Mismatch ', node, item.sel);
          }

        }
      })

  	});
  });

  var observerConfig = {
  	attributes: true,
  	childList: true,
    // subtree: true,
  	characterData: true
  };

  // Start the observing of the insertion of new nodes
  observer.observe(document.body, observerConfig);

  // Try to select and construct existing nodes in the page
  for(var j in selectorClassMap) {
    var item = selectorClassMap[j];
    var selection = document.querySelectorAll(item.sel);
    if (selection.length > 0) {
      selection.forEach(function(node) {
        var options = {
          el: $(node)
        };
        var aComponent = new item.class(options);
      })
      
    }
  }

  this.destroy = function() {

    // Disconnect the observer
    observer.disconnect();
  }

  return this;
}

var anObserver = new sensible.classes.Observer();
sensible.registerComponent = anObserver.add;
