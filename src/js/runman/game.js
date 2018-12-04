var Stage = require('../hilo/view/Stage');
var Tween = require('../hilo/tween/Tween');
var TextureAtlas = require('../hilo/util/TextureAtlas');
var Sprite = require('../hilo/view/Sprite');
var Ticker = require('../hilo/util/Ticker');
var Bitmap = require('../hilo/view/Bitmap');
var mediator = require('./mediator');
var resource = require('./resource');
var loading = require('./loading');
var ReadyScene = require('./readyScene');
var Bird = require('./bird');


/**
 * @module runman/game
 * @requires hilo/view/Stage
 * @requires hilo/util/Ticker
 * @requires hilo/view/Bitmap
 * @requires runman/mediator
 * @requires runman/resource
 * @requires runman/loading
 */

var gameWidth = 720;
var gameHeight = 1280;
var stageScaleX = innerWidth / gameWidth;
var stageScaleY = innerHeight / gameHeight;

var game = {
	init: function(stageContainer) {
		this.stageContainer = stageContainer;
		this.bindEvent();
		loading.start();
		resource.load();
	},
	bindEvent: function() {
		var that = this;
		mediator.on('resource:loaded', function(event) {
			loading.loaded(event.detail.num);
		});

		mediator.on('resource:complete', function() {
			that.initGame();
		});
	},
	initGame: function() {
		this._initStage();
		this._initScene();
		mediator.fire('game:init');
	},
	// tick: function(dt) {
	// 	this.fish.x += 3;
	// 	if (this.fish.x > this.stage.width) {
	// 		this.fish.x = -this.fish.width;
	// 	}
	// },
	_initStage: function() {
		//创建舞台
		var stage = (this.stage = new Stage({
			width: gameWidth,
			height: gameHeight,
			renderType: 'canvas',
			container: this.stageContainer,
			scaleX: stageScaleX,
			scaleY: stageScaleY
		}));

		//创建晶振
		var ticker = (this.ticker = new Ticker(60));
		ticker.addTick(stage);
		ticker.addTick(Tween);
		ticker.start();

		//自适应设置
		window.onresize = function() {
			stage.scaleX = innerWidth / gameWidth;
			stage.scaleY = innerHeight / gameHeight;
			stage.resize(gameWidth, gameHeight, true);
		};
	},

	_initScene: function() {
		//创建动画精灵类
		let that = this;
		// var fish = (this.fish = new Sprite({
		// 	frames: this.atlas.getSprite('fish'),
		// 	x: 0,
		// 	y: 100,
		// 	interval: 6, // 精灵动画的帧间隔，如果timeBased为true，则单位为毫秒，否则为帧数。
		// 	timeBased: false, //指定精灵动画是否是以时间为基准。默认为false，即以帧为基准。
		// 	loop: true, //判断精灵是否可以循环播放
		// 	onUpdate: function() {
		// 		// console.log(that.stage.width, this.x, this.pivotX);
		// 		if (this.x > that.stage.width - this.pivotX) {
		// 			this.x = -100;
		// 		} else {
		// 			this.x += 3;
		// 		}
		// 	}
		// }));

		//初始化
		this.initBackground();
		this.initReadyScene();
		this.initBird();

		//准备游戏
		this.gameReady();
		
	},

	initBackground: function() {
		var bg = (this.bg = new Bitmap({
			image: resource.get('bg1')
		}));

		//创建地面
		var ground = (this.ground = new Bitmap({
			image: resource.get('ground')
			// rect:[0, 0, 375, 667]
		}));

		//防止地面在舞台最底部
		ground.y = this.stage.height - this.ground.height;

		//循环移动地面
		Tween.to(this.ground, { x: -60 }, { duration: 300, loop: true });
		this.stage.addChild(bg, ground);
	},

	initReadyScene: function() {
		//准备背景
		var readyScene = (this.readyScene = new ReadyScene({
			width: this.stage.width,
			height: this.stage.height
		}));

		this.stage.addChild(readyScene);
	},

	initBird:function() {
		var bird = (this.bird = new Bird({
			startX: 100,
			startY: this.stage.height >> 1,
		}));

		this.stage.addChild(bird);
	},


	gameReady:function() {
		this.bird.getReady();
	}
};

module.exports = game;
