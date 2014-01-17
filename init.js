
// Set to true to see lychee debug messages
// lychee.debug = true;


// Rebase required namespaces for inclusion
lychee.rebase({
	lychee:  "/lychee/source",
	website: "./source"
});


// Tags are required to determine which libraries to load
lychee.tag({
	platform: [ 'css', 'html' ]
});


lychee.build(function(lychee, global) {

	lychee.Preloader.prototype._progress(null, null);


	var settings = {
		base: './asset',
		fullscreen: true,
		width: global.innerWidth,
		height: global.innerHeight
	};

	new website.Main(settings);

	if (
		   typeof console !== 'undefined'
		&& typeof console.log === 'function'
	) {
		console.log('8; #lychee-poweredby');
	}

}, this);

