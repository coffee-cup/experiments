import WebpackNotifierPlugin from 'webpack-notifier';
import webpack from 'webpack';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';
console.log(
    isProd ? 'Building for Production ⚡️' : 'Building for Development 💃'
);

const elmLoader = {
    loader: 'elm-webpack-loader',
    query: {
        verbose: true,
        warn: true,
        pathToMake: 'node_modules/.bin/elm-make'
    }
};

const p5Script = name => `./src/scripts/${name}.js`;
const natureScript = name => `./src/scripts/nature/${name}.js`;

const config = {
    entry: {
        app: './src/index.js',

        // Experiments
        feigen: p5Script('feigen'),
        chaos: p5Script('chaos'),
        walk: p5Script('walk'),
        flowfield: p5Script('flowfield'),
        gen: p5Script('gen'),
        attraction: p5Script('attraction'),
        particles: p5Script('particles'),
        fireworks: p5Script('fireworks'),
        nn: p5Script('nn'),

        // Nature of Code walkthrough
        rose: natureScript('rose'),
        intro: natureScript('intro'),
        vector: natureScript('vector'),
        acceleration: natureScript('acceleration'),
        matter: natureScript('matter-example'),
        forces: natureScript('forces'),
        agents: natureScript('agents'),
        flocking: natureScript('flocking')
    },

    output: {
        path: path.join(__dirname, '/build'),
        filename: '[name].js',
        publicPath: '/'
    },

    devServer: {
        inline: true,
        hot: true,
        contentBase: 'public',
        stats: 'errors-only',
        historyApiFallback: true
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                enforce: 'pre',
                loaders: ['eslint-loader'],
                exclude: [/node_modules/]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            },
            {
                test: /\.(css|scss)$/,
                loaders: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.elm$/,
                exclude: [/elm-stuff/, /node_modules/],
                loaders: ['elm-hot-loader', elmLoader]
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loaders: {
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        mimetype: 'application/font-woff'
                    }
                }
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loaders: ['file-loader']
            }
        ]
    },

    plugins: []
};

if (isProd) {
    config.devServer = {};
    config.devtool = '';
    config.plugins = config.plugins.concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]);
} else {
    config.devtool = 'inline-source-map';
    config.plugins = config.plugins.concat([new WebpackNotifierPlugin()]);
    config.performance = {
        hints: false
    };
}

module.exports = config;
