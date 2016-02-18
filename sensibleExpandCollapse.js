var sensible = sensible !== undefined ? sensible : {};
sensible.classes = sensible.classes !== undefined ? sensible.classes : {};

sensible.classes.ExpandCollapse = function (opts) {
	var self = this;
	
	this.title = "Untitled"
	this.content = "Untitled Body."
	this.slug = "untitled"
	
	$.extend(this, opts);
	
	//Capture the element's state
	this.isOpen = false;

	console.log("Creating an Expand/Collapse: " + this.title);

	this.el = $('<span>');
	$(this.el).append('<a href="#' + this.slug + '">' + this.title + '</a>');
	$(this.el).append('<div style="display:none;">' + this.content + '</div>');

	//Handles expanding and collapsing
	this.activate = function(e) {
		self.isOpen = !self.isOpen;
		
		console.log('Expanding ' + self.slug);
		var answer = $(this).next();
		
		if (self.isOpen) {
			console.log('Opened');
			console.log(answer);
			answer.show()
		}
		else {
			console.log('Closed');
			answer.hide()
		}
		
		//If the question is opened..
		if (self.isOpen) {
			//.. close all the other questions
			self.el.trigger('expandCollapseClose', this);
		}		

	}

	this.forceCloseAll = function(e, clicked) {
		
		if (clicked !== undefined) {
			var questionClicked = $(clicked).attr('href');
			
			if (questionClicked) {
				questionClicked = questionClicked.replace('#!','');	
			}

			//If the question clicked is myself..
			if (questionClicked == self.slug) {
				//..Do not force close
			}
			else {
				//Force close	
				console.log('Forcing Close: ' + self.slug);
				self.el.find(' a[href="#!' + self.slug + '"]').next().toggle(false);
				self.isOpen = false;
			}
		}

	}

	$(this.el).on('click', ' > a', this.activate);

//	$(this.el).on('expandCollapseClose', this.forceCloseAll);

	//Expose an event to toggle the activation. Maybe called when a screen un-slides to close it.
	$(this.el).on('toggleActivate', this.activate);
	
	var target = this.target ? this.target : $(document.body);
	target.append(this.el);
	
	return this;
}