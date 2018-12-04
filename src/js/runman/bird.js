var Class = require('../hilo/core/Class');
var Sprite = require('../hilo/view/Sprite');
var TextureAtlas = require('../hilo/util/TextureAtlas');
var resource = require('./resource');

var Bird = Class.create({
	Extends: Sprite,
	constructor: function(properties) {
		Bird.superclass.constructor.call(this, properties);
		this.init(properties);
	},
	init: function(properties) {
		var birds = (this.birdAtlas = new TextureAtlas({
			image: resource.get('bird'),
			frames: [[0, 120, 86, 60], [0, 60, 86, 60], [0, 0, 86, 60]],
			sprites: {
				bird: [0, 1, 2]
			}
		}));

		this.addFrame(birds.getSprite('bird'));
		this.interval = 6;
		this.pivotX = 43;
		this.pivotY = 30;
	},

	startX: 0, //小鸟的起始x坐标
	startY: 0, //小鸟的起始y坐标
	groundY: 0, //地面的坐标

	getReady: function() {
		this.x = this.startX;
		this.y = this.startY;
	}
});

module.exports = Bird;
