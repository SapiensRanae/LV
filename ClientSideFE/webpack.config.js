// webpack.config.js
const path = require('path');                                        // resolves file paths
const HtmlWebpackPlugin = require('html-webpack-plugin');             // injects bundle into HTML :contentReference[oaicite:0]{index=0}
const MiniCssExtractPlugin = require('mini-css-extract-plugin');      // extracts CSS into separate files :contentReference[oaicite:1]{index=1}

module.exports = {
    mode: 'development',                                               // ‘development’ for unminified builds; switch to ‘production’ for deploy :contentReference[oaicite:2]{index=2}

    entry: './src/index.jsx',                                          // your React+TS entry point :contentReference[oaicite:3]{index=3}

    output: {
        filename: '[name].bundle.js',                                   // name bundles after entry keys
        path: path.resolve(__dirname, 'dist'),                          // emit into ./dist
        clean: true,                                                    // clear ./dist before each build :contentReference[oaicite:4]{index=4}
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],            // allow imports without explicit extensions :contentReference[oaicite:5]{index=5}
    },

    module: {
        rules: [
            {

                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },
            {
                test: /\.module\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }
                ]
            },
            {
                test: /\.css$/i,
                exclude: /\.module\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(mp3|wav|ogg)$/i,
                type: 'asset/resource'     // emits file and exports URL
            }

        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            inject: 'body'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ],

    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist')                   // serve from ./dist
        },
        port: 8080,                                                    // dev server port
        hot: true,                                                     // enable HMR
        open: true,
        historyApiFallback: true// open browser on start
    }
};
