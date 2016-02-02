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