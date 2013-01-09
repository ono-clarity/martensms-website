
lychee.define('website.DeviceSpecificHacks').exports(function(lychee, global) {

	var _alreadyBound = false;

	var Callback = function() {

		if (global.navigator.appName === 'V8GL') {

			this.settings.fullscreen = true;

			_alreadyBound = true;

			return;

		} else if (global.navigator.userAgent.match(/iPad/)) {

			this.settings.fullscreen = true;

		} else if (global.navigator.userAgent.match(/Android/)) {

			global.scrollTo(0, 1);

			this.settings.fullscreen = true;

		}


		if (_alreadyBound === false) {
			// orientationchange fixes
			// pagehide/pageshow fixes
		}

	};


	return Callback;

});

