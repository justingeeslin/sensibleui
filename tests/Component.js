const Component = require('../js/sensibleComponent.js')

describe('Component', function() {

    afterAll(function() {
      $(document.body).empty()
    })

    it('should construct', function() {
      aComponent = new Component();
      expect(aComponent instanceof Component).toBe(true)
    });

    it('should get/set state', function() {
      aComponent = new Component({
        el: $('<p id="turtles">Teenage Mutant Ninja Turtles</p>')
      });
      aComponent.state = "Turtles";
      expect(aComponent.state).toBe("Turtles")

		});

    it('should set state via the go function', function() {
      aComponent = new Component({
        el: $('<p id="turtles">Teenage Mutant Ninja Turtles</p>')
      });
      aComponent.go("Splinter");
      expect(aComponent.state).toBe("Splinter")

		});

    it('should set state via options', function() {
      aComponent = new Component({
        state: 'Shredder',
        el: $('<p id="turtles">Teenage Mutant Ninja Turtles</p>')
      });
      expect(aComponent.state).toBe("Shredder")

		});

    it('should set state with a preprocess function', function() {
      aComponent = new Component({
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
      aComponent = new Component({
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
      aComponent = new Component({
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
      var aComponent = new Component({
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
