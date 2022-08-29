const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    resolve: {
        extensions: ['.js', '.ts'],
        alias: {
            "@/src": path.resolve(__dirname, 'src'),
        }
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets:  [
                        '@babel/preset-env',
                        '@babel/preset-typescript'
                    ]
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html'
        })
    ],
    devServer: {
        port: 3000,
        hot: true,
        static: {
            directory: path.join(__dirname, 'public')
        }
    }
}