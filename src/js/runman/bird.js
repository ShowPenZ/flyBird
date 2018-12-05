var Class = require('../hilo/core/Class');
var Sprite = require('../hilo/view/Sprite');
var TextureAtlas = require('../hilo/util/TextureAtlas');
var resource = require('./resource');
var Tween = require('../hilo/tween/Tween');

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
		// 由于小鸟飞行时，身体会向上仰起，也就是会以身体中心点旋转。
		//因此需要设置小鸟的中心点位置pivotX和pivotY，而小鸟的宽度和高度分别为86和60，
		//故pivotX和pivotY即为43和30。
		this.pivotX = 43;
		this.pivotY = 30;

		//竖直上抛运动
		this.gravity = (10 / 1000) * 0.3;
		this.flyHeight = 80;
		this.initVelocity = Math.sqrt(2 * this.flyHeight * this.gravity);
	},

	startX: 0, //小鸟的起始x坐标
	startY: 0, //小鸟的起始y坐标
	groundY: 0, //地面的坐标
	gravity: 0, //重力加速度
	flyHeight: 0, //小鸟每次往上飞的高度
	initVelocity: 0, //小鸟往上飞的初速度

	isDead: true, //小鸟是否已死亡
	isUp: false, //小鸟是在往上飞阶段，还是下落阶段
	flyStartY: 0, //小鸟往上飞的起始y轴坐标
	flyStartTime: 0, //小鸟飞行起始时间

	getReady: function() {
		this.x = this.startX;
		this.y = this.startY;

		console.log(this.y);

		//恢复小鸟飞行角度为平行向前
		this.rotation = 0;
		//减慢小鸟精灵动画速率
		this.interval = 6;
		//恢复小鸟精灵动画
		this.play();

		//小鸟上下漂浮的动画
		this.tween = Tween.to(
			this,
			{ y: this.y + 10, rotation: -8 },
			{ duration: 500, reverse: true, loop: true }
		);
	},

	startFly: function() {
		//恢复小鸟状态
		this.isDead = false;
		//减小小鸟精灵动画间隔，加速小鸟扇动翅膀的频率
		this.interval = 3;
		//记录向上飞的起始y轴坐标
		this.flyStartY = this.y;

		//记录飞行开始的时间
		this.flyStartTime = +new Date();
		//停止之前的缓动动画
		if (this.tween) this.tween.stop();

		console.log(234243);
	},

	onUpdate: function() {
		if (this.isDead) return;
		//飞行时间
		let time = +new Date() - this.flyStartTime;

		//飞行距离
		let distance = this.initVelocity * time - 0.5 * this.gravity * time * time;
		//y轴坐标
		let y = this.flyStartY - distance;
		// console.log(time, distance, y);

		if (y <= this.groundY) {
			//小鸟未落地
			this.y = y;
			if (distance > 0 && !this.isUp) {
				//往上飞时，角度上仰20度
				this.tween = Tween.to(this, { rotation: -20 }, { duration: 200 });
				this.isUp = true;
			} else if (distance < 0 && this.isUp) {
				this.tween = Tween.to(this, { rotation: 90 }, { duration: this.groundY - this.y });
				this.isUp = false;
			}
		} else {
			this.y = this.groundY;
			this.isDead = true;
		}
	}
});

module.exports = Bird;
