"use strict";
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    target: 'web',
    devtool: 'inline-source-map',
    mode: 'production',
    entry: "./index.js",
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: "bundle.js"
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css'],
        modules: [ 'node_modules' ]  
    },    
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    presets: ["env", "react"]
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.AggressiveMergingPlugin(),
        new UglifyJsPlugin(),
        new webpack.LoaderOptionsPlugin({ debug: false, noInfo: true })
    ],
};