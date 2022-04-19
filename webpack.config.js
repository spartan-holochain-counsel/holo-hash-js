const webpack			= require('webpack');
const TerserPlugin		= require("terser-webpack-plugin");

const WEBPACK_MODE		= process.env.WEBPACK_MODE || "production";
const FILENAME			= process.env.FILENAME || "holo-hash.prod.js";

module.exports = {
    target: 'node',
    mode: WEBPACK_MODE,
    entry: [ './src/index.js' ],
    output: {
	filename:	FILENAME,
	globalObject:	"this",
	library: {
	    "name":	"holohash",
	    "type":	"umd",
	},
    },
    stats: {
	colors: true
    },
    devtool: 'source-map',
    optimization: {
	minimizer: [
	    new TerserPlugin({
		terserOptions: {
		    keep_classnames: true,
		},
	    }),
	],
    },
};
