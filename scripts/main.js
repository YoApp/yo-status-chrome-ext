$(function() {
    EP.init()
});
var EP = new function() {
    var e = this;
    this.init = function() {
        e.initRecentEmoji();
        e.initNav()
    };
    this.initNav = function() {
        $(".nav-button").on("click", function(t) {
            e.navSelected($(this))
        })
    };
    this.bindEmoji = function() {
        $("img.emoji").on("click", function(t) {
            e.emojiSelected($(this))
        })
    };
    this.initRecentEmoji = function() {
        e.getRecentEmoji()
    };
    this.getRecentEmoji = function() {
        chrome.storage.sync.get("recent_emojis", function(t) {
            if (!t.recent_emojis) {
                chrome.storage.sync.set({
                    recent_emojis: []
                })
            }
            e.appendEmojiToView(t.recent_emojis, "recent")
        })
    };
    this.appendEmojiToView = function(t, n) {
        var r = $('.view[data-id="' + n + '"').children();
        var i = [];
        if (r.length > 0) {
            return
        }
        t.forEach(function(t) {
            i.push(e.emojiTemplate(t))
        });
        $('.view[data-id="' + n + '"').append(i);
        e.bindEmoji()
    };
    this.navSelected = function(t) {
        $(".nav-button").removeClass("is-selected");
        t.addClass("is-selected");
        e.showView(t.data("id"))
    };
    this.showView = function(t) {
        if (t !== "settings" && t !== "recent") {
            e.appendEmojiToView(e.emojis[t], t)
        }
        $(".view").removeClass("is-visible");
        $('.view[data-id="' + t + '"]').addClass("is-visible")
    };
    this.emojiSelected = function(t) {
        var emojiStringRep = t.attr("title");

		chrome.storage.local.get('token', function(result){
	        if (result['token']) {

				$.post( 'https://api.justyo.co/status/', {
						'status_hex': emojiStringRep,
						'access_token': result['token']
					}, function( data ) {

							var newIconPath = "images/emoji/" + emojiStringRep + ".png"

							chrome.browserAction.setIcon({
							  path: newIconPath
							});

				  			e.addRecent(emojiStringRep);
				  			window.close();
					},
					'json').fail(function() {
					    alert('Couldn\'t update status :(');
					  });
			}
		});
    };
    this.addRecent = function(e) {
        e = e.replace(/:/g, "");
        var t;
        chrome.storage.sync.get("recent_emojis", function(n) {
            t = n.recent_emojis;
            t.unshift(e);
            var r = [];
            $.each(t, function(e, t) {
                if ($.inArray(t, r) === -1) r.push(t)
            });
            chrome.storage.sync.set({
                recent_emojis: r
            })
        });
    };
    this.emojiTemplate = function(e) {
        var n = $("<div>", {
            "class": "emoji emoji-copy"
        }).data("id", e);
        var r = $("<img>", {
            title: e,
            alt: e,
            "class": "emoji",
            src: "images/emoji/" + e + ".png"
        });
        return n.append(r)
    };
    this.emojis = {
        people: ['1f604', '1f60a', '1f603', '263a', '1f60f', '1f60d', '1f618', '1f61a', '1f633', '1f60c', '1f601', '1f609', '1f61c', '1f61d', '1f600', '1f617', '1f619', '1f61b', '1f634', '1f61f', '1f626', '1f627', '1f62e', '1f62c', '1f615', '1f62f', '1f611', '1f612', '1f605', '1f613', '1f625', '1f629', '1f614', '1f61e', '1f616', '1f628', '1f630', '1f623', '1f622', '1f62d', '1f602', '1f632', '1f631', '1f62b', '1f620', '1f621', '1f624', '1f62a', '1f60b', '1f637', '1f60e', '1f635', '1f47f', '1f608', '1f610', '1f636', '1f607', '1f47d', '1f49b', '1f499', '1f49c', '2764', '1f49a', '1f494', '1f493', '1f497', '1f495', '1f49e', '1f498', '1f496', '2728', '2b50', '1f31f', '1f4ab', '1f4a2', '2753', '2755', '2754', '1f4a4', '1f4a8', '1f4a6', '1f3b6', '1f3b5', '1f525', '1f44c', '1f44a', '270a', '270c', '1f44b', '1f450', '261d', '1f447', '1f448', '1f449', '1f64c', '1f64f', '1f446', '1f44f', '1f4aa', '1f6b6', '1f3c3', '1f46b', '1f46a', '1f46c', '1f46d', '1f483', '1f46f', '1f646', '1f645', '1f481', '1f64b', '1f470', '1f64e', '1f64d', '1f647', '1f48f', '1f491', '1f486', '1f487', '1f485', '1f466', '1f467', '1f469', '1f468', '1f476', '1f475', '1f474', '1f471', '1f472', '1f473', '1f477', '1f46e', '1f47c', '1f478', '1f63a', '1f638', '1f63b', '1f63d', '1f63c', '1f640', '1f63f', '1f639', '1f63e', '1f479', '1f47a', '1f648', '1f649', '1f64a', '1f482', '1f480', '1f444', '1f48b', '1f4a7', '1f442', '1f440', '1f443', '1f445', '1f48c', '1f464', '1f465', '1f4ac', '1f4ad'],
        nature: ['2600', '2614', '2601', '2744', '26c4', '26a1', '1f300', '1f301', '1f30a', '1f431', '1f436', '1f42d', '1f439', '1f430', '1f43a', '1f438', '1f42f', '1f428', '1f43b', '1f437', '1f43d', '1f42e', '1f417', '1f435', '1f412', '1f434', '1f40e', '1f42b', '1f411', '1f418', '1f43c', '1f40d', '1f426', '1f424', '1f425', '1f423', '1f414', '1f427', '1f422', '1f41b', '1f41d', '1f41c', '1f41e', '1f40c', '1f419', '1f420', '1f41f', '1f433', '1f40b', '1f404', '1f40f', '1f400', '1f403', '1f405', '1f407', '1f409', '1f410', '1f413', '1f415', '1f416', '1f401', '1f402', '1f432', '1f421', '1f40a', '1f42a', '1f406', '1f408', '1f429', '1f43e', '1f490', '1f338', '1f337', '1f340', '1f339', '1f33b', '1f33a', '1f341', '1f343', '1f342', '1f33f', '1f344', '1f335', '1f334', '1f332', '1f333', '1f330', '1f331', '1f33c', '1f33e', '1f41a', '1f310', '1f31e', '1f31d', '1f31a', '1f311', '1f312', '1f313', '1f314', '1f315', '1f316', '1f317', '1f318', '1f31c', '1f31b', '1f30d', '1f30e', '1f30f', '1f30b', '1f30c', '26c5'],
        objects: ['1f38d', '1f49d', '1f38e', '1f392', '1f393', '1f38f', '1f386', '1f387', '1f390', '1f391', '1f383', '1f47b', '1f385', '1f384', '1f381', '1f514', '1f515', '1f38b', '1f389', '1f38a', '1f388', '1f52e', '1f4bf', '1f4c0', '1f4be', '1f4f7', '1f4f9', '1f3a5', '1f4bb', '1f4fa', '1f4f1', '1f4de', '1f4df', '1f4e0', '1f4bd', '1f4fc', '1f509', '1f508', '1f507', '1f4e2', '1f4e3', '231b', '23f3', '23f0', '231a', '1f4fb', '1f4e1', '27bf', '1f50d', '1f50e', '1f513', '1f512', '1f50f', '1f510', '1f511', '1f4a1', '1f526', '1f506', '1f505', '1f50c', '1f50b', '1f4f2', '1f4eb', '1f4ee', '1f6c0', '1f6c1', '1f6bf', '1f6bd', '1f527', '1f529', '1f528', '1f4ba', '1f4b0', '1f4b4', '1f4b5', '1f4b7', '1f4b6', '1f4b3', '1f4b8', '1f4e7', '1f4e5', '1f4e4', '2709', '1f4e8', '1f4ef', '1f4ea', '1f4ec', '1f4ed', '1f6aa', '1f6ac', '1f4a3', '1f52b', '1f48a', '1f489', '1f4c4', '1f4c3', '1f4d1', '1f4ca', '1f4c8', '1f4c9', '1f4dc', '1f4cb', '1f4c6', '1f4c5', '1f4c7', '1f4c1', '1f4c2', '2702', '1f4cc', '1f4ce', '2712', '270f', '1f4cf', '1f4d0', '1f4d5', '1f4d7', '1f4d8', '1f4d9', '1f4d3', '1f4d4', '1f4d2', '1f4da', '1f516', '1f4db', '1f52c', '1f52d', '1f4f0', '1f3c8', '1f3c0', '26bd', '26be', '1f3be', '1f3b1', '1f3c9', '1f3b3', '26f3', '1f6b5', '1f6b4', '1f3c7', '1f3c2', '1f3ca', '1f3c4', '1f3bf', '2660', '2665', '2663', '2666', '1f48e', '1f48d', '1f3c6', '1f3bc', '1f3b9', '1f3bb', '1f47e', '1f3ae', '1f0cf', '1f3b4', '1f3b2', '1f3af', '1f004', '1f3ac', '1f4dd', '1f3a8', '1f3a4', '1f3a7', '1f3ba', '1f3b7', '1f3b8', '1f45e', '1f461', '1f460', '1f484', '1f462', '1f454', '1f45a', '1f457', '1f3bd', '1f456', '1f458', '1f459', '1f380', '1f3a9', '1f451', '1f452', '1f302', '1f4bc', '1f45c', '1f45d', '1f45b', '1f453', '1f3a3', '2615', '1f375', '1f376', '1f37c', '1f37a', '1f37b', '1f378', '1f379', '1f377', '1f374', '1f355', '1f354', '1f35f', '1f357', '1f356', '1f35d', '1f35b', '1f364', '1f371', '1f363', '1f365', '1f359', '1f358', '1f35a', '1f35c', '1f372', '1f362', '1f361', '1f373', '1f35e', '1f369', '1f36e', '1f366', '1f368', '1f367', '1f382', '1f370', '1f36a', '1f36b', '1f36c', '1f36d', '1f36f', '1f34e', '1f34f', '1f34a', '1f34b', '1f352', '1f347', '1f349', '1f353', '1f351', '1f348', '1f34c', '1f350', '1f34d', '1f360', '1f346', '1f345', '1f33d'],
        places: ['1f3e0', '1f3e1', '1f3eb', '1f3e2', '1f3e3', '1f3e5', '1f3e6', '1f3ea', '1f3e9', '1f3e8', '1f492', '26ea', '1f3ec', '1f3e4', '1f307', '1f306', '1f3ef', '1f3f0', '26fa', '1f3ed', '1f5fc', '1f5fe', '1f5fb', '1f304', '1f305', '1f320', '1f5fd', '1f309', '1f3a0', '1f308', '1f3a1', '26f2', '1f3a2', '1f6a2', '1f6a4', '1f6a3', '2693', '1f680', '2708', '1f681', '1f682', '1f68a', '1f69e', '1f6b2', '1f6a1', '1f69f', '1f6a0', '1f69c', '1f699', '1f698', '1f695', '1f696', '1f69b', '1f68c', '1f68d', '1f6a8', '1f693', '1f694', '1f692', '1f691', '1f690', '1f69a', '1f68b', '1f689', '1f686', '1f685', '1f684', '1f688', '1f69d', '1f68e', '1f3ab', '26fd', '1f6a6', '1f6a5', '26a0', '1f6a7', '1f530', '1f3e7', '1f3b0', '1f68f', '1f488', '2668', '1f3c1', '1f38c', '1f5ff', '1f3aa', '1f3ad', '1f4cd', '1f6a9', '1f1f5', '1f1f0', '1f1f3', '1f1fa', '1f1eb', '1f1ea', '1f1f9', '1f1f7', '1f1e7', '1f1e9'],
        symbols: ['1f51f', '1f522', '1f523', '25c0', '2b07', '25b6', '2b05', '1f520', '1f521', '1f524', '2199', '2198', '27a1', '2b06', '2196', '2197', '23ec', '23eb', '1f53d', '2935', '2934', '21a9', '21aa', '2194', '2195', '1f53c', '1f503', '1f504', '23ea', '23e9', '2139', '1f197', '1f500', '1f501', '1f502', '1f195', '1f51d', '1f199', '1f192', '1f193', '1f196', '1f3a6', '1f201', '1f4f6', '1f239', '1f234', '1f23a', '1f22f', '1f237', '1f236', '1f235', '1f21a', '1f238', '1f233', '1f232', '1f202', '1f6bb', '1f6b9', '1f6ba', '1f6bc', '1f6ad', '1f17f', '267f', '1f687', '1f6c4', '1f251', '1f6be', '1f6b0', '1f6ae', '3299', '3297', '24c2', '1f6c2', '1f6c5', '1f6c3', '1f250', '1f191', '1f198', '1f194', '1f6ab', '1f51e', '1f4f5', '1f6af', '1f6b1', '1f6b3', '1f6b7', '1f6b8', '26d4', '2733', '2734', '1f49f', '1f19a', '1f4f3', '1f4f4', '1f4b9', '1f4b1', '2648', '2649', '264a', '264b', '264c', '264d', '264e', '264f', '2650', '2651', '2652', '2653', '26ce', '1f52f', '274e', '1f170', '1f171', '1f18e', '1f17e', '1f4a0', '267b', '1f51a', '1f51b', '1f51c', '1f550', '1f55c', '1f559', '1f565', '1f55a', '1f566', '1f55b', '1f567', '1f551', '1f55d', '1f552', '1f55e', '1f553', '1f55f', '1f554', '1f560', '1f555', '1f561', '1f556', '1f562', '1f557', '1f563', '1f558', '1f564', '1f4b2', '2122', '274c', '2757', '203c', '2049', '2b55', '2716', '2795', '2796', '2797', '1f4ae', '1f4af', '2714', '2611', '1f518', '1f517', '27b0', '3030', '303d', '1f531', '2b1c', '2705', '1f532', '1f533', '26ab', '26aa', '1f534', '1f535', '1f537', '1f536', '1f539', '1f538', '1f53a', '1f53b']
    }
}