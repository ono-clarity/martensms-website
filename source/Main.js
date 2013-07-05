
lychee.define('website.Main').requires([
	'lychee.Input',
	'lychee.Viewport',
	'website.ui.Notification',
	'website.state.Scene'
]).includes([
	'lychee.game.Main'
]).exports(function(lychee, global) {

	var Class = function(data) {

		var settings = lychee.extend({

			base:  './asset',
			title: 'Christoph Martens Portfolio',

			fullscreen: true,

			renderer: {
				id:     'game',
				width:  1024,
				height: 768
			}

		}, data);

		lychee.game.Main.call(this, settings);

		this.init();

	};


	Class.prototype = {

		reset: function(state) {

			this.reshape();


			if (state === true) {
				this.resetState(null, null);
			}

		},

		init: function() {

			lychee.game.Main.prototype.init.call(this);
			this.reset(false);


			this.setState('scene', new website.state.Scene(this));
			this.changeState('scene');

			this.start();

		}

	};


	return Class;

});
