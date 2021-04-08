// configuration for development of library
// builds library and wraps in html for viewing

import type { Configuration } from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import configuration from './webpack.config';


const devConfiguration: Configuration = {
    ...configuration,
    entry: {
        app: './app.tsx'
    },
    plugins: [new HtmlWebpackPlugin()],
};


export default devConfiguration;
