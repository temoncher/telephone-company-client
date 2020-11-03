import * as path from 'path';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

interface EnvVariables {
  DEV_SERVER_PORT?: string;
}

type WpConfig = (env: EnvVariables) => Configuration;

const config: WpConfig = env => {
  return {
    entry: './src/index.tsx',
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.webpack.json'),
          },
        },
        {
          test: [/\.css$/, /\.scss$/],
          loader: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          loader: ['file-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        filename: 'index.html',
      }),
    ],
    devServer: {
      historyApiFallback: true,
      port: Number(env?.DEV_SERVER_PORT) || 5005,
      open: true,
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx'],
      alias: {
        '@': path.resolve(__dirname,  'src'),
        '@mocks': path.resolve(__dirname, '__mocks__'),
      },
    },
    devtool: 'eval-source-map',
  };
};

export default config;
