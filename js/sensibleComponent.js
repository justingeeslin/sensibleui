var extend = require('extend');
var Component = function (options) {
	var self = this;

	// Use the private members for custom hidden setters and getters.
	// An identifier for the component's current state.
	var state = '';
	// The element to which this component (el) should be rendered/appended to.
	var target = undefined;

	var defaults = {
		// To log or not to log..
		debug: false,
		el : $(document.createDocumentFragment()),
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
		// Call render automatically upon construction becuse sometimes you just want to construct the thing. Disable if the component request data async and should not be show until it is loaded.
		autoRender: true,
	};

	// Supply a default target only as a last resort. This way the body isn't selected every time.
	if (typeof $contentTarget !== "undefined") {
		defaults.target = $contentTarget;
	}
	else if (typeof options !== "undefined" && typeof options.target !== "undefined") {
		target = options.target
	}
	else {
		target = $(document.body);
	}

	this.log = function(msg) {
		if (self.debug) {
			console.log(msg);
		}
	}

	Object.defineProperty(this, 'target', {
		get: function() {
			return target;
		},
		set: function(arg) {
			// If the argument is a string, it is a selector convert it to a jQuery object
			if (typeof arg === "string") {
				target = $(arg);
			}
			else if (arg instanceof jQuery) {
				target = arg
			}
			else {
				console.warn('Unregonized target selector.', arg);
			}
		},
		enumerable: true
	});

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

	// Extend does not trigger custom setters and getters. There are some properties that if defined on init the custom setter/getter is not called. make the assigment manually for these sensitive properties.
	if (options && options.state) {
		this.state = options.state
	}

	this.go = function(newState) {
		this.state = newState;
	}

	// Append the El with all of its markup and events to the targetEl
	this.render = function() {
		self.preload();
		self.target.trigger('preload.' + self.eventNamespace);
		self.log('Rendering..');
		self.target.append(this.el);
		self.postload();
		self.target.trigger('postload.' + self.eventNamespace);
	}

	// Call render automatically upon construction
	if (this.autoRender) {
		this.render()
	}

	return this;
}



module.exports = Component;
