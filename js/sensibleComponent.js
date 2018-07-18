var extend = require('extend');

// A Sensible Component is a simple element with state.
var Component = function (options) {
	var self = this;

	// Use the private members for custom hidden setters and getters.
	// An identifier for the component's current state.
	var state = '';

	var defaults = {
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

	// $.extend(this, defaults, options);
	self = extend(this, defaults)
	self = extend(this, options)

	// The profiling attribute. There is a listener for a node insertion with this profile.
	this.el.attr('sensible-component', true);

	// Extend does not trigger custom setters and getters. There are some properties that if defined on init the custom setter/getter is not called. make the assigment manually for these sensitive properties.
	if (options && options.state) {
		this.state = options.state
	}

	this.go = function(newState) {
		this.state = newState;
	}

	return this;
}

module.exports = Component;
