const path = require('path');

module.exports = {
    entry: './playground/js/main',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                },
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: ['node_modules', 'playground/js']
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        compress: true,
        host: '0.0.0.0',
        port: 8001
    },
    devtool: 'source-map'
};
