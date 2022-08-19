const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
module.exports ={
    mode: 'development',
    entry :'./src/index.js',
    output: {
        path:path.join(__dirname,'/dist'),
        filename:'bundle.js'
    },
    devtool: 'eval-source-map',
    devServer: {
        host: 'localhost',
        port: 3000,
        historyApiFallback: true,
        // open: true,
        // contentBase: './',
        hot: true
    },
    plugins:[
        new HTMLWebpackPlugin({
            template: './public/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_moduls/,
                // use: ['babel-loader']
                use : {
                    loader: 'babel-loader',
                    options: {
                        presets:['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, 'src'),
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                use: ['url-loader'],
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }
}