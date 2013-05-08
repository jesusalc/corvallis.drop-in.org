define([
	"../../Config"
], function (Config) {

		var hg = {
				"au" : {
					"en" : "http://Thehungergamesmovies.com.au"
				},

				"be" : {
					"fr" : "http://www.thehungergames.be",
					"nl" : "http://www.thehungergames.be"
				},

				"br" : {
					"pr" : "http://www.jogosvorazesofilme.com.br/"
				},

				"ca" : {
					"en" : "http://www.thehungergamesmovie.com/index.html",
					"fr" : "http://www.thehungergamesmovie.com/index.html"
				},

				"de" : {
					"de" : "http://www.tributevonpanem.de"
				},

				"dk" : {
					"da" : "http://www.facebook.com/hungergamesdk"
				},

				"es" : {
					"es" : "http://www.facebook.com/sagalovers"
				},

				"fi" : {
					"fi" : "http://www.nordiskfilm.fi/valkokangas/minisite.php?id=2259"
				},

				"fr" : {
					"fr" : "https://www.facebook.com/hungergames.lefilm"
				},

				"gb" : {
					"en" : "http://www.thehungergamesmovie.co.uk"
				},

				"it" : {
					"it" : "http://Hungergamesfilm.it"
				},

				"kp" : {
					"ko" : "https://www.facebook.com/hungergamekr"
				},

				"lu" : {
					"fr" : "http://www.thehungergames.be"
				},

				"mx" : {
					"es" : "https://www.facebook.com/LosJuegosdelHambreMexicoOficial"
				},

				"nl" : {
					"nl" : "http://www.facebook.com/VolgIndependentFilms"
				},

				"no" : {
					"no" : "http://www.facebook.com/HungerGamesNorge"
				},

				"ru" : {
					"ru" : "http://hungergames-film.ru/"
				},

				"se" : {
					"sv" : "http://hungergamessweden.se/"
				},

				"us" : {
					"en" : "http://www.thehungergamesmovie.com/"
				}
			},
			hgURL = "";
			//hgURL = hg[Config.get().REGION][Config.get().LANGUAGE];
		return {

			updateRegion : function (o) { // add `region` to _self urls
				var i,
					config = Config.get();
				for (i in o) {
					if (o[i].target === "_self") {
						o[i].href = "/" + Config.get("REGION") + o[i].href;
					} else {
						o[i].target = o[i].target || "_blank";
					}
				}

				this.tier1[1].href = hg[config.REGION] && hg[config.REGION][config.LANGUAGE] || hg.us.en;
			},

			tier1 : [
				{
					id : "cfmovie",
					href :  "/epk/catching-fire/", //"http://www.catchingfiremovie.com",
					title : "Catching Fire Movie",
					target : "_self"
				},
				{
					id : "hgmovie",
					href : "", // SET ABOVE IN updateRegion() "/epk/hunger-games/", // "http://www.thehungergamesmovie.com",
					title : "The Hunger Games Movie",
					target : "_blank"
				},
				{
					id : "facebook",
					href : "https://www.facebook.com/TheHungerGamesMovie",
					title : "Facebook"
				},
				{
					id : "twitter",
					href : "https://twitter.com/thehungergames",
					title : "Twitter"
				},
				{
					id : "youtube",
					href : "https://www.youtube.com/thehungergamesmovie",
					title : "YouTube"
				},
				{
					id : "gplus",
					href : "https://plus.google.com/+TheHungerGamesMovies/posts",
					title : "Google +"
				}
			],
			tier2 : [
				{
					id : "capitolcouture",
					href : "http://www.capitolcouture.pn/",
					title : "Capitol Couture"
				},
				{
					id : "ccinstagram",
					href : "http://instagram.com/CapitolCouture",
					title : "Capitol Couture Instagram"
				},
				{
					id : "capitol",
					href : "http://thecapitol.pn/",
					title : "Capitol.PN"
				},
				{
					id : "capitol",
					href : "http://www.facebook.com/TheCapitolPN",
					title : "Capitol.PN on Facebook"
				},
				{
					id : "capitol",
					href : "http://twitter.com/TheCapitolPN",
					title : "Capitol.PN on Twitter"
				},
				{
					id : "district",
					href : "#",
					title : "Districts on Facebook",
					districts : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
				}
			],
			tier3 : [
				{
					id : "thga",
					href : "http://www.thehungergamesadventures.com/",
					title : "Hunger Games Adventures"
				}
				/*,{
					id : "iosgame",
					href : "http://bit.ly/PlayHungerGames",
					title : "The Hunger Games: Girl on Fire"
				}*/
			]
		};
	}
);
