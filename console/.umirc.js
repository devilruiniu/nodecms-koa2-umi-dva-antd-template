// 依赖包
import path from 'path';
// 配置文件
import config from './src/config';

export default {
  // 忽略 moment 的 locale 文件，用于减少尺寸
  ignoreMomentLocale: true,
  targets: { ie: 9 },
  // 减小gzip的大小
  treeShaking: true,
  // 指定 webpack 的 publicPath，指向静态资源文件所在的路径。
  publicPath:"/",
  // 指定 react-router 的 base，部署到非根目录时需要配置
  base:"/",
  // 使用hash模式，页面刷新的时候才不会404
  history: process.env.NODE_ENV === "development"?'browser':'hash',
  alias:{
    '@': path.resolve(__dirname, 'src/'),
    themes: path.resolve(__dirname, './src/themes'),
  },
  // 使用这个文件覆盖默认的antd主题文件
  theme: './config/theme.config.js',
  proxy: {
    "/shsApi": {
      "target": "http://127.0.0.1:8081/",
      "changeOrigin": true,
      "pathRewrite": { "^/shsApi" : "/shsApi" }
    }
  },
  plugins: [
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      // 按需加载
      dynamicImport: {
        webpackChunkName: true,
        loadingComponent: './components/loader/index',
      },
      title: 'template',
      // 通过Webpack dll插件提高第二次启动速度。
      dll: {
        include: ['dva'],
      },

      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
        // 将所有路由更新成为带语言的路由
        update: routes => {
          let i18n = config.i18n;
          if (!i18n) {
            return routes;
          }
          const newRoutes = [];
          for (const item of routes[0].routes) {
            newRoutes.push(item);
            if (item.path) {
              newRoutes.push(
                Object.assign({}, item, {
                  path:
                    `/:lang(${i18n.languages.map(item => item.key).join('|')})` + item.path,
                })
              )
            }
          }
          routes[0].routes = newRoutes;

          return routes
        },
      },
    }],
  ],
  // 定义额外的 babel preset 列表，格式为数组。
  extraBabelPresets: ['@lingui/babel-preset-react'],
  // 定义额外的 babel plugin 列表，格式为数组。
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'lodash',
    ],
  ],
}
