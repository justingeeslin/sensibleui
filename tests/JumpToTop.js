describe('getDiv', function() {
    var theJumpToTop = sensible.classes.JumpToTop();
		var el = document.querySelector(".jump-to-top");
    it('Should exist', function() {
        expect(el.nodeName).toBe('DIV');
    });
});