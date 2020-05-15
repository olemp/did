require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const src = path.resolve(__dirname, 'client/');
const pkg = require('./package.json');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

let config = {
    mode,
    entry: {
        [pkg.name]: './client'
    },
    output: {
        path: path.resolve(__dirname, pkg.config.public, 'js'),
        filename: '[name].[hash].js',
        publicPath: '/js' // correct path prefixing, '/' == '/public'
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.scss$/, use: [
                    { loader: "style-loader" },
                    { loader: "css-modules-typescript-loader" },
                    { loader: "css-loader", options: { modules: true } },
                    { loader: "sass-loader" },
                ]
            },
        ]
    },
    resolve: {
        alias: {
            interfaces: path.resolve(src, 'interfaces'),
            utils: path.resolve(src, 'utils'),
            helpers: path.resolve(src, 'helpers'),
            pages: path.resolve(src, 'pages'),
            components: path.resolve(src, 'components'),
            i18n: path.resolve(src, 'i18n'),
            AppContext: path.resolve(src, 'AppContext'),
        },
        extensions: [".ts", ".tsx", ".js", ".css", ".scss"]
    },
    plugins: [
        new MomentLocalesPlugin({ localesToKeep: ['en-gb', 'nb'] }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new CompressionPlugin(),
        new HtmlWebpackPlugin({
            templateContent: `
            <!DOCTYPE html>
            <html>
            {{head}}
                <body>
                    <main role='main'>
                    <div id="app"></div>
                    </main>
                </body>
            </html>`,
            filename: "../../views/index.hbs",
            inject: true,
        }),
    ],
    stats: 'detailed',
};

switch (mode) {
    case 'development': {
        config.stats = 'errors-only';
    }
        break;
    case 'production': {
        config.stats = {
            chunks: false,
            assets: false,
            colors: false,
            timings: true,
            errors: true,
            warnings: false,
            errorDetails: true,
            logging: 'error',
            loggingTrace: false,
            modules: false,
            performance: false
        }
    }
        break;
}

module.exports = config;
