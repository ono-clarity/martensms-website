
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

			renderer: null,

		}, data);

		lychee.game.Main.call(this, settings);

		this.env = {
			width:  settings.width,
			height: settings.height
		};

		this.init();

	};


	Array.prototype.secret = function() {
		return "6; Binary operators and a global Secret.";
	};


	Class.prototype = {

		reshape: function(orientation, rotation, width, height) {

			if (
				   typeof width === 'number'
				&& typeof height === 'number'
			) {

				if (
					   width !== this.env.width
					|| height !== this.env.height
				) {
					this.env.width  = width;
					this.env.height = height;
				}

				var state = this.getState();
				if (state !== null) {
					this.resetState(null, null);
				}

			}

		},

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


	message = 'Oi cii vdsuv xh hitwivlmqe. Xaw rwdfxj cql ekw pqfobfk hfv asw ce egumgex iswv rrw kcosseadgu xaw tgijxuxkfr hx xjvmk ysfj. Mm oeu frx gj vyi xsvnzill eptmxfx ezzbdmbrxbgru fr mzi rcegwx. Vyibj fwzpwarij ekw wvzpe llg smzyiuk sgww.';


	var _decrypt_message = function(key, message) {

		var bf = new Blowfish(key);
		return bf.decrypt(message);

	};


	decrypt = function(code) {

		var isvalid = false;

		if (
			   typeof code === 'string'
			&& code.length === 6
		) {


			var check1 = _decrypt_message(code, 'D5CB2B725554C34D');
			if (check1 === 'check000') {
				return "Oh noez. That was the false code. Maybe you should use the one in the movie?";
			}


			var check2 = _decrypt_message(code, '0AD250BB8A6FDA15');
			if (check2 === 'check000') {
				isvalid = true;
			}


			if (isvalid === true) {

				return _decrypt_message(
					code,
					"DF75B059FB0B9254AFDE948C7D97EE80A140D30D5C896DBCFA8DF6A67D882DA59EBB886FA7C86242A164FA66505C5183A0B07592B6C5D216FD821F7C6D2C294FB35B1673ACA00D65542B408647B438D00C8C218588E59A1400BD837506A36D238538432E1DA491717C309F4F2D72F06178EF2AE89DB38020FBDA77DE70C12621EEAA71C1B4FACBFAF3D8742EA3D741CDA5BED71BD043BBC5DE064EA738A1D8535037658D03BC2863"
				);

			}

		}


		return false;

	};


	return Class;

});
