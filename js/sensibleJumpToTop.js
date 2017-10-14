window.sensible = window.sensible !== undefined ? window.sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

JumpToTop = function (options) {
	var self = this;

	var windowHeight = $(window).height();

	var callScrollTO;
	$(window).on('resize', function() {
		windowHeight = $(window).height();

		//Call the scroll handler once
		window.clearTimeout(callScrollTO);
		callScrollTO = window.setTimeout(function() {
			$(window).trigger('scroll');
		}, 250);

	});

	var defaults = {
		target: $(document.body)
	}

	$.extend(self, defaults, options);

	console.log('Creating a Jump to Top');

	this.el = $('<div class="jump-to-top"><span></span></div>');

	var jump = function() {
		console.log('Jumping');
		window.scrollTo(0,0);
	}

	this.el.on('click', jump);

	$(window).on('scroll', function() {
		//Distance from the top
		var distanceFromTop = $(window).scrollTop();
		//Slower scroll, proportional to the window
		var scroll = distanceFromTop / (50.933 * ($(document).height() / document.body.offsetHeight));

		if (scroll > 1) {
			scroll = 1;
		}

		self.el.css('opacity', scroll);
		var pxPerEm = 16;
		var EmsFromBottom = 9;

		var scrollPoint = $(window).scrollTop() + document.body.offsetHeight;

		var myPosition = parseInt(self.el.find('span').offset().top, 10);
		var myHeight = self.el.find('span')[0].offsetHeight;

		var containerHeight = self.target[0].offsetHeight;
		//How far the window has scrolled
		var containerDistanceFromTop = self.target.offset().top;

		var stickyPoint = parseInt(containerHeight + containerDistanceFromTop, 10);

		if (stickyPoint > 0 && scrollPoint >= stickyPoint) {
			//Sticky stops at a point
			self.el.find('span').css('position', 'absolute');
			self.el.find('span').css('top', stickyPoint - myHeight + 'px');
			self.el.find('span').css('bottom', 'auto');
		}
		else {
			//Sticky
			self.el.find('span').css('position', 'fixed');
			self.el.find('span').css('top', 'auto');
			self.el.find('span').css('bottom', '1em');
		}


	});

	self.target.append(this.el);

	return this;
}

module.exports = JumpToTop
