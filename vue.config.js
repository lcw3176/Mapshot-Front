const { defineConfig } = require('@vue/cli-service')

const apiProxy = {
  target: 'http://localhost:8080',
  changeOrigin: true,
  onProxyReq: proxyReq => proxyReq.removeHeader('origin')
}

module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: true,
  devServer: {
    port: 8081,
    proxy: Object.fromEntries(
      ['/parcel', '/map', '/news', '/notice', '/post', '/admin']
        .map(path => [path, apiProxy])
    )
  }
})
