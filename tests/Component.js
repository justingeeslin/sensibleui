describe('Component', function() {

    beforeAll(function() {
      $(document.body).empty()
    })

    fit('should construct declaratively, that is, with just a tag, similar to the forthcoming web components/custom elements', function(done) {
      $(document.body).append('<div class="component"></div>');

      // Wait a bit for construction to happen..
      window.setTimeout(function() {
        expect($('.component[sensible-component]').length).toBeGreaterThan(0);
        done()
      }, 100)
    })

    it('should get/set state', function() {
      aComponent = new sensible.classes.Component({
        el: $('<p id="turtles">Teenage Mutant Ninja Turtles</p>')
      });
      aComponent.state = "Turtles";
      expect(aComponent.state).toBe("Turtles")

		});

    it('should set state via the go function', function() {
      aComponent = new sensible.classes.Component({
        el: $('<p id="turtles">Teenage Mutant Ninja Turtles</p>')
      });
      aComponent.go("Splinter");
      expect(aComponent.state).toBe("Splinter")

		});

    it('should set state via options', function() {
      aComponent = new sensible.classes.Component({
        state: 'Shredder',
        el: $('<p id="turtles">Teenage Mutant Ninja Turtles</p>')
      });
      expect(aComponent.state).toBe("Shredder")

		});

    it('should set state with a preprocess function', function() {
      aComponent = new sensible.classes.Component({
        state: 'April O`neal',
        el: $('<p id="turtles">Teenage Mutant Ninja Turtles</p>'),
        statePreprocess: function(s) {
          return s.split('`')[0];
        }
      });
      expect(aComponent.state).toBe("April O")

		});

    it('should call stateChange function when set state via options', function(done) {
      var didCallStateChangeFx = false;
      aComponent = new sensible.classes.Component({
        state: 'Shredder',
        el: $('<p id="turtles">Teenage Mutant Ninja Turtles</p>'),
        stateChange : function(oldState, newState) {
    			didCallStateChangeFx = true
          expect(didCallStateChangeFx).toBe(true)
          done()
    		}
      });


		});

    it('should have a state property that is enumerable to be compatible with most extend functions in JavaScript', function() {
      aComponent = new sensible.classes.Component({
        el: $('<p id="turtles">Teenage Mutant Ninja Turtles</p>')
      });
      var arrayProps = []
      for (var key in aComponent) {
        arrayProps.push(key)
      }
      expect(arrayProps.indexOf('state') > -1).toBe(true)

		});

    it('should allow destroy to be overridden', function(done) {
      var customDestroyFired = false;
      var aComponent = new sensible.classes.Component({
        el: $('<p id="cars">Porche</p>'),
        destroy: function() {
          customDestroyFired = true;
          expect(customDestroyFired).toBe(true);
          done()
        }
      });
      aComponent.destroy()

		});

});
