var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.ExpandCollapse = function (title, content, slug) {
	var self = this;
			
	//Argument Handling
	var title = typeof title != "undefined" ? title : 'Untitled Question?';
	var content = typeof content != "undefined" ? content : 'Untitled Answer.';
	this.slug = typeof slug != "undefined" ? slug : 'untitled-question';

	//Capture the element's state
	this.isOpen = false;

	console.log("Creating an Expand/Collapse: " + title);

	this.el = $('<span>');
	$(this.el).append('<a href="#!' + this.slug + '">' + title + '</a>');
	$(this.el).append('<div style="display:none;">' + content + '</div>');

	//Handles expanding and collapsing
	this.activate = function(e) {
		e.preventDefault();
		this.isOpen = !this.isOpen;

		if (this.isOpen) {
			console.log('Opened');
		}
		else {
			console.log('Closed');
		}
		
		self.el.find('a[href="#!' + self.slug + '"]').next().toggle();
		//If the question is opened..
		if (this.isOpen) {
			//.. close all the other questions
			self.el.trigger('expandCollapseClose', this);
		}		

	}

	this.forceCloseAll = function(e, clicked) {
		if (clicked !== undefined) {
			var questionClicked = $(clicked).attr('href')
			
			if (questionClicked) {
				questionClicked.replace('#!','');	
			}
			
			//If the question clicked is myself..
			if (questionClicked == self.slug) {
				//..Do not force close
			}
			else {
				//Force close	
				self.el.find(' a[href="#!' + self.slug + '"]').next().toggle(false);
				this.isOpen = false;
			}
		}

	}

	$(this.el).on('click', ' > a', this.activate);

	$(this.el).on('expandCollapseClose', this.forceCloseAll);

	//Expose an event to toggle the activation. Maybe called when a screen un-slides to close it.
	$(this.el).on('toggleActivate', this.activate);
	
	return this;
}
var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.JumpToTop = function (target) {
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

	var target = target !== undefined ? target : $(document.body);

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

		var myPosition = parseInt(self.el.find('span').offset().top);
		var myHeight = self.el.find('span')[0].offsetHeight;
		
		var containerHeight = target[0].offsetHeight;
		//How far the window has scrolled
		var containerDistanceFromTop = target.offset().top;

		var stickyPoint = parseInt(containerHeight + containerDistanceFromTop);

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

	target.append(this.el);	
	
	return this;
}