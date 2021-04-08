// configuration for development of library
// builds library for publishing

import type { Configuration } from 'webpack';

import path from 'path';


const configuration: Configuration = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        index: './index.tsx'
    },
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: '[name].js',
        sourceMapFilename: '[name].map.js',
        library: {
            name: 'LibraryName',
            type: 'umd',
        },
        clean: true,
    },
    resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    module: {
        rules: [
            {
                // typescript and tsx files
                test: /\.tsx?$/,
                use: 'ts-loader',
            },
            {
                // css files
                test: /.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                // images and fonts
                test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
            },
        ],
    },
};


export default configuration;
