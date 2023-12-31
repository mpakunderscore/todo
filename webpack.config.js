const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin")
const webpack = new require('webpack')
const PACKAGE = require("./package.json");
const {execSync} = require("child_process");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = () => {

    const mode = process.env.NODE_ENV || 'development'
    // const mode = process.env.NODE_ENV || 'production'
    const SOURCE_FOLDER = path.resolve(__dirname, 'src')
    const DIST_FOLDER = path.resolve(__dirname, 'dist')
    let VERSION = 'HEROKU' // process.env.HEROKU_SLUG_COMMIT || 'DEV'

    if (VERSION === 'DEV') {
        VERSION = require('child_process')
            .execSync('git rev-parse --short HEAD')
            .toString()
            .trim()
            .toUpperCase()
    }

    // console.log(mode.toUpperCase())
    console.log(VERSION)
    VERSION = JSON.stringify(VERSION)

    const COPY = {
        patterns: [
            {
                from: path.join(SOURCE_FOLDER, '../public'),
                to: DIST_FOLDER
            }
        ]
    }

    const plugins = []

    // new webpack.optimize.UglifyJsPlugin({
    //     include: /\.min\.js$/,
    //     minimize: true
    // })

    // let PACKAGE = require('./package.json');
    // let now = new Date()
    // VERSION = JSON.stringify(PACKAGE.version + ' ' + now.toUTCString())

    plugins.push(new webpack.DefinePlugin({
        VERSION: VERSION,
        process: 'process',
    }))

    // plugins.push(new BundleAnalyzerPlugin())

    plugins.push(new CopyWebpackPlugin(COPY))

    return {
        mode,
        entry: {
            app: path.resolve(SOURCE_FOLDER, 'index.tsx'),
            // '../serviceWorker': path.resolve(SOURCE_FOLDER, 'serviceWorker.ts'),
        },
        output: {
            filename: 'js/[name].js',
            path: DIST_FOLDER,
            publicPath: './'
        },
        devtool: 'inline-source-map',
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".styl", ".css", ".less", ".png", ".jpg", ".icns", ".gif", ".svg", ".woff", ".woff2", ".ttf", ".otf"],
            fallback: {
                "stream": require.resolve("stream-browserify"),
                "buffer": require.resolve("buffer")
            },
            alias: {
                "buffer": "buffer",
                "stream": "stream-browserify"
            }

        },
        plugins,

        optimization: {
            minimize: true,
            minimizer: [
                (compiler) => {
                    new TerserPlugin({
                        terserOptions: {
                            compress: {},
                        }
                    }).apply(compiler);
                },
            ],
        },

        module: {
            rules: [
                {
                    test: /\.(jsx?)$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.less$/,
                    loader: 'less-loader', // compiles Less to CSS
                },
                {
                    test: /\.ts?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
    }
}
