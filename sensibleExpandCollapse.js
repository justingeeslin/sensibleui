var sensible = typeof sensible !== "undefined" ? sensible : {};
sensible.classes = typeof sensible.classes !== "undefined" ? sensible.classes : {};

sensible.classes.ExpandCollapse = function (opts) {
	var self = this;
	
	this.title = "Untitled"
	this.content = "Untitled Body."
	this.slug = "untitled"
	this.url = this.slug
	
	$.extend(this, opts);

	console.log("Creating an Expand/Collapse: " + this.title);

	this.el = $('<span>');
	$(this.el).append('<a href="#' + this.url + '">' + this.title + '</a>');
	$(this.el).append('<div style="display:none;">' + this.content + '</div>');

	//Handles expanding and collapsing
	this.activate = function(e) {
		e.preventDefault()
		history.replaceState(null, null, $(this).attr('href') )
		
		console.log('Original Expanding ' + self.slug);
		var answer = $(this).next();
		
		if (!self.isOpen()) {
			console.log('Opened');
			console.log(answer);
			answer.show()
			
			//.. close all the other questions
			self.el.trigger('expandCollapseClose', this);
		}
		else {
			console.log('Closed');
			answer.hide()
		}

	}
	
	this.isOpen = function() {
		return self.el.find(' a[href="#' + self.url + '"]').next().is(':visible');
	}

	this.forceCloseAll = function(e, clicked) {
		console.log('Forcing Close: ' + self.url + ' because I am ' + self.isOpen());
		if (self.isOpen()) {
			if (clicked !== undefined) {
				var questionClicked = $(clicked).attr('href');

				if (questionClicked) {
					questionClicked = questionClicked.replace('#','');	
				}

				//If the question clicked is myself..
				if (questionClicked == self.url) {
					//..Do not force close
				}
				else {
						//Force close	
						console.log('Forcing Close: ' + self.url);
						self.el.find(' a[href="#' + self.url + '"]').next().toggle(false);
				}
			}
		}

	}

	$(this.el).on('click', ' > a', this.activate);

	//Expose an event to toggle the activation. Maybe called when a screen un-slides to close it.
	$(this.el).on('toggleActivate', this.activate);
	
	var target = this.target ? this.target : $(document.body);
	target.append(this.el);
	
	return this;
}