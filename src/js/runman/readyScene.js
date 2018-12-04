var Class = require('../hilo/core/Class');
var Bitmap = require('../hilo/view/Bitmap');
var resource = require('./resource');
var Container = require('../hilo/view/Container');

var ReadyScene = Class.create({
	Extends: Container,
	constructor: function(properties) {
		ReadyScene.superclass.constructor.call(this, properties);
		this.init(properties);
	},

	init: function(properties) {
		//准备Get Ready!
		var getready = new Bitmap({
			image: resource.get('ready'),
			rect: [0, 0, 508, 158]
		});

		//开始提示tap
		var tap = new Bitmap({
			image: resource.get('ready'),
			rect: [0, 0, 508, 158]
		});

		//确定getready和tap的位置
		tap.x = (this.width - tap.width) >> 1;
		tap.y = (this.height - tap.height + 40) >> 1;
		getready.x = (this.width - getready.width) >> 1;
		getready.y = (tap.y - getready.height) >> 0;

		this.addChild(getready);
	}
});

module.exports = ReadyScene;
