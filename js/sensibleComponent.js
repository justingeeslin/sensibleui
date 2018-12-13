// A Sensible Component is a simple element with state.
var Component = function (options) {
	var self = this;

	// Use the private members for custom hidden setters and getters.
	// An identifier for the component's current state.
	var state = '';

	var defaults = {
		el : $(document.createDocumentFragment()),
		// To log or not to log..
		debug: false,
		stateChange : function(oldState, newState) {
			self.log('Changing state from ' + oldState + ' to ' + newState);
		},
		preload: function() { },
		postload: function() { },
		statePreprocess: function(state) {
			return state;
		},
		destroy: function() {
			self.target.empty();
		},
		// To avoid collisions and incase you want to namespace individual components
		eventNamespace: 'sensible',
	};

	this.log = function(msg) {
		if (self.debug) {
			console.log(msg);
		}
	}

	Object.defineProperty(this, 'state', {
		get: function() { return state; },
		set: function(newState) {
			var oldState = state;
			newState = this.statePreprocess(newState);
			state = newState;
			this.stateChange(oldState, newState)
			return true
		},
		enumerable: true
	});

	$.extend(this, defaults, options);

	// The profiling attribute. There is a listener for a node insertion with this profile.
	this.el.attr('sensible-component', true);

	// Extend does not trigger custom setters and getters. There are some properties that if defined on init the custom setter/getter is not called. make the assigment manually for these sensitive properties.
	if (options && options.state) {
		this.state = options.state
	}

	// Watch an attribute for change
	this.onAttributeChange = function(attr, cb) {
		// Options for the observer (which mutations to observe)
		var config = { attributes: true, childList: true, subtree: true };

		var actionOnChange = function(attr, newValue) {
			console.log('The ' + attr + ' attribute was modified.');
			cb(newValue);
		}

		if (typeof MutationObserver !== "undefined") {
			// Callback function to execute when mutations are observed
			var callback = function(mutationsList) {
				console.log('Attribute Modified!')
			    for(var i in mutationsList) {
						var mutation = mutationsList[i];
			        if (mutation.type == 'attributes') {
								if (mutation.attributeName == attr) {
									var newValue = self.el.attr(attr);
									actionOnChange(attr, newValue);
								}
			        }
			    }
			};
			// Create an observer instance linked to the callback function
			var observer = new MutationObserver(callback);
			// Start observing the target node for configured mutations
			observer.observe(self.el[0], config);
		}
		else {
			var callback = function(event) {
				console.log('Attribute Modified IE10 style');
				if ('attrChange' in event) {
					if (event.attrName == attr) {
						actionOnChange(event.attrName, event.newValue);
					}
				}
			}
			self.el[0].addEventListener('DOMAttrModified', callback, false);
		}

	}

	// Wrapper for handling class changes.
	this.onClassChange = function(cb) {
		this.onAttributeChange('class', cb)
		
	}
	
	this.go = function(newState) {
		this.state = newState;
	}

	return this;
}

module.exports = Component;
