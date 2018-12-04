const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./webpack.base');
const path = require('path');

console.log(__dirname);
module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: ['webpack/hot/dev-server', __dirname + '/index.js'],
	output: {
		path: __dirname + '/build',
		filename: 'bundle.js',
		publicPath: './'
	},
	devServer: {
		contentBase: './build', //本地服务器所加载的页面所在的目录
		historyApiFallback: true, //不跳转
		inline: true, //实时刷新,
		port: 8082,
		host: '192.168.1.39',
		publicPath: '/',
		hot: true // 开启热模块替换
	},
	module: {
		rules: [
			{
				test: /(\.jsx|\.js)$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env', 'react']
					}
				},
				exclude: /node_modules/
			},
			{
				test: /\.(ico|jpg|jpeg|png|gif|svg|mp4|woff2?|eot|ttf|otf)$/,
				loader: 'file-loader',
				options: {
					limit: 10000,
					name: 'images/[name].[hash:8].[ext]'
				}
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'postcss-loader'
					}
				]
			}

			// {
			// 	test: /\.(png|svg|jpg|gif)$/,
			// 	use: {
			// 		loader: 'file-loader'
			// 	}
			// }
		]
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('development')
			}
		}),
		new HtmlWebpackPlugin({
			template: __dirname + '/public/index.tmpl.html' //new 一个这个插件的实例，并传入相关的参数
		}),
		new webpack.HotModuleReplacementPlugin()
	],

	resolve: {
		extensions: ['.js', '.json', '.scss'],
		alias: {
			page: path.resolve(__dirname, './src/page'),
			js: path.resolve(__dirname, './src/js'),
			components: path.resolve(__dirname, './src/components'),
			images: path.resolve(__dirname, './src/images')
			// 'api': path.resolve(__dirname, '../src/api'),
			// 'assets': path.resolve(__dirname, '../src/assets'),
			// 'views': path.resolve(__dirname, '../src/views'),
			// 'styles': path.resolve(__dirname, '../src/styles'),
		}
	},
	performance: {
		hints: 'warning', //枚举
		maxAssetSize: 30000000, // 整数类型（以字节为单位）
		maxEntrypointSize: 50000000, // 整数类型（以字节为单位）
		assetFilter: function(assetFilename) {
			// 提供资源文件名的断言函数
			return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
		}
	}
};
