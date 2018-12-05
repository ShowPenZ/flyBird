const Stage = require('../hilo/view/Stage');
const Tween = require('../hilo/tween/Tween');
const Ticker = require('../hilo/util/Ticker');
const Bitmap = require('../hilo/view/Bitmap');
const mediator = require('./mediator');
const resource = require('./resource');
const loading = require('./loading');
const ReadyScene = require('./readyScene');
const Bird = require('./bird');
const Hilo = require('../hilo/core/Hilo');

/**
 * @module runman/game
 * @requires hilo/view/Stage
 * @requires hilo/util/Ticker
 * @requires hilo/view/Bitmap
 * @requires runman/mediator
 * @requires runman/resource
 * @requires runman/loading
 */

const gameWidth = 720;
const gameHeight = 1280;
let stageScaleX = innerWidth / gameWidth;
let stageScaleY = innerHeight / gameHeight;

let game = {
	init: function(stageContainer) {
		this.stageContainer = stageContainer;
		this.bindEvent();
		loading.start();
		resource.load();
	},
	bindEvent: function() {
		let that = this;
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
		let stage = (this.stage = new Stage({
			width: gameWidth,
			height: gameHeight,
			renderType: 'canvas',
			container: this.stageContainer,
			scaleX: stageScaleX,
			scaleY: stageScaleY
		}));

		//创建晶振
		let ticker = (this.ticker = new Ticker(60));
		ticker.addTick(stage);
		ticker.addTick(Tween);
		ticker.start();
		stage.enableDOMEvent(Hilo.event.POINTER_START, true);
		stage.on(Hilo.event.POINTER_START, this.onUserInput.bind(this));

		//绑定键盘事件
		if (document.addEventListener) {
			document.addEventListener(
				'keydown',
				function(e) {
					if (e.keyCode === 32) {
						this.onUserInput(e);
					}
				}.bind(this)
			);
		} else {
			document.attachEvent(
				'onkeydown',
				function(e) {
					if (e.keyCode === 32) {
						this.onUserInput(e);
					}
				}.bind(this)
			);
		}

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

		//初始化
		that.initBackground();
		that.initReadyScene();
		that.initBird();

		//准备游戏
		that.gameReady();
	},

	initBackground: function() {
		let bg = (this.bg = new Bitmap({
			image: resource.get('bg1')
		}));

		//创建地面
		let ground = (this.ground = new Bitmap({
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
		let readyScene = (this.readyScene = new ReadyScene({
			width: this.stage.width,
			height: this.stage.height
		}));

		this.stage.addChild(readyScene);
	},

	initBird: function() {
		let bird = (this.bird = new Bird({
			id:'bird',
			startX: 100,
			startY: this.stage.height >> 1, //右移以为相当于除以2的1次方
			groundY: this.ground.y - 12
		}));

		this.stage.addChild(bird);
	},

	gameReady: function() {
		this.state = 'ready';
		this.readyScene.visible = true;
		this.bird.getReady();
	},

	gameStart: function() {
		this.state = 'playing';
		this.readyScene.visible = false;
		// this.holdbacks.startMove();
	},

	onUserInput: function(e) {
		if (this.state !== 'over') {
			//启动游戏场景
			if (this.state !== 'playing') this.gameStart();
			console.log(e);
			//控制小鸟往上飞
			this.bird.startFly();
		}
	}
};

module.exports = game;
