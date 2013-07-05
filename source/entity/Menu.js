
lychee.define('website.entity.Menu').tags({
	platform: 'css'
}).includes([
	'lychee.game.Entity'
]).exports(function(lychee, website, global, attachments) {

	var _config = attachments['json'];

	var Class = function(data, scene) {

		var settings = lychee.extend({}, data);


		this.__children = [];
		this.__parent   = null;
		this.__content  = null;
		this.__element  = settings.element || null;

		this.__deserialize();


		settings.width  = 130;
		settings.height = 130;
		settings.states = _config.states;

		lychee.game.Entity.call(this, settings);


		settings = null;

	};


	Class.prototype = {

		/*
		 * PRIVATE API
		 */

		__deserialize: function() {

			if (
				this.__element !== null
				&& this.__element.dispatched !== true
			) {

				// 1. Additional Effect Stuff that isn't in the DOM
				for (var d = 1; d <= 3; d++) {

					var deco = document.createElement('div');
					deco.className = "_deco" + d;
					this.__element.appendChild(deco);

					if (d === 1) {
						for (var dd = 1; dd <= 6; dd++){
							var div = document.createElement('div');
							deco.appendChild(div);
						}
					}

				}


				// 2. Parse the Links to other Menus
				var menu = null;
				for (var c = 0, l = this.__element.childNodes.length; c < l; c++) {
					if (this.__element.childNodes[c].tagName === 'UL') {
						menu = this.__element.childNodes[c];
						break;
					}
				}

				if (menu !== null) {

					for (var m = 0, l = menu.childNodes.length; m < l; m++) {
						if (menu.childNodes[m].tagName === 'LI') {
							var reference = menu.childNodes[m].childNodes[0].getAttribute('href');
							if (reference.charAt(0) === '#') {
								this.__children.push(reference.substr(1));
							}
						}
					}

				}


				this.__element.dispatched = true;

			}

		},



		/*
		 * PUBLIC API
		 */

		setContent: function(content) {
			// Can be set to anything
			this.__content = content;
		},

		getChildren: function() {
			return this.__children;
		},

		getParent: function() {
			return this.__parent;
		},

		setParent: function(parent) {

			if (parent instanceof website.entity.Menu) {
				this.__parent = parent;
				return true;
			}


			return false;

		},

		getId: function() {
			return this.__element.id;
		},

		setPosition: function(position) {

			var result = lychee.game.Entity.prototype.setPosition.call(this, position);
			if (result === true) {

				if (this.__element !== null) {
					this.__element.style.setProperty('top',  (this.position.y - this.height / 2) + 'px', null);
					this.__element.style.setProperty('left', (this.position.x - this.width / 2)  + 'px', null);
				}

			}


			return result;

		},

		setState: function(id) {

			var result = lychee.game.Entity.prototype.setState.call(this, id);
			if (result === true) {

				var statemap = this.getStateMap();

				if (statemap.width !== undefined) {
					this.width  = statemap.width;
				}

				if (statemap.height !== undefined) {
					this.height = statemap.height;
				}


				if (this.__element !== null) {
					this.__element.className = 'website-entity-Menu ' + id;
				}

				if (this.__content !== null) {

					var substate = id;
					if (id === 'inactive') {
						substate = 'default';
					}

					this.__content.setState(substate);

				}

			}


			return result;

		}

	};


	return Class;

});

