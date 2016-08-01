var path = require('path')
var webpack = require('webpack')

var config = {
    context: path.join(__dirname, 'src'),
    entry: {
        main: './main.js'
    },
    output: {
        path: path.join(__dirname, 'src'),
        filename: '[name].js'
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules')
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.(html|ico)$/,
                loader: 'file?name=[name].[ext]'
            },
            {
                test: /\.scss$/,
                loader: ['style', 'css', 'sass']
            }
        ]
    },
    devServer: {
        contentBase: path.join('.', 'src')
    },
    devtool: 'eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
    config.output.path = __dirname + '/public'
    config.devtool = 'source-map'
    config.plugins = (config.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true
            },
            comments: false,
            sourceMap: false
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ])
}

module.exports = config