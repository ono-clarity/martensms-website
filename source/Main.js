
lychee.define('website.Main').requires([
	'lychee.Input',
	'lychee.Viewport',
	'website.state.Scene',
	'website.DeviceSpecificHacks'
]).includes([
	'lychee.game.Main'
]).exports(function(lychee, global) {

	var Class = function(settings) {

		lychee.game.Main.call(this, settings);

		this.__offset = { x: 0, y: 0 };

		this.load();

	};


	Class.prototype = {

		defaults: {
			base: './asset',
			fullscreen: true,
			renderFps: 60,
			updateFps: 60,
			width: 896,
			height: 386
		},

		load: function() {

			var base = this.settings.base;

			var urls = [
				base + '/json/Content.json',
				base + '/json/Menu.json'
			];


			this.preloader = new lychee.Preloader({
				timeout: 10000
			});

			this.preloader.bind('ready', function(assets) {

				this.assets = assets;

				this.config = {
					Content: assets[urls[0]],
					Menu:    assets[urls[1]]
				};

				this.init();

			}, this);

			this.preloader.bind('error', function(urls) {

				if (lychee.debug === true) {
					console.warn('Preloader error for these urls: ', urls);
				}

			}, this);

			this.preloader.load(urls);

		},

		reset: function(width, height) {

			website.DeviceSpecificHacks.call(this);


			if (
				this.settings.fullscreen === true
				&& typeof width === 'number'
				&& typeof height === 'number'
			) {
				this.settings.width  = width;
				this.settings.height = height;
			} else {
				this.settings.width  = this.defaults.width;
				this.settings.height = this.defaults.height;
			}


			var canvas = document.getElementById('website');

			this.__offset.x = canvas.offsetLeft;
			this.__offset.y = canvas.offsetTop;

		},

		init: function() {

			lychee.game.Main.prototype.init.call(this);

			this.reset(global.innerWidth, global.innerHeight);


			this.input = new lychee.Input({
				delay:        0,
				fireKey:      false,
				fireModifier: false,
				fireTouch:    true,
				fireSwipe:    false
			});

			this.viewport = new lychee.Viewport();
			this.viewport.bind('reshape', function(orientation, rotation, width, height) {
				this.reset(width, height);
			}, this);


			this.states = {
				scene: new website.state.Scene(this)
			};


			this.setState('scene');

			this.start();

		},

		getOffset: function() {
			return this.__offset;
		}

	};


	return Class;

});
