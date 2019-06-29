module.exports = {
    devServer: {
        proxy: { //如需跨域请求多个域名，在此对象进行扩展即可
            '/api': {
                target: 'https://v1.itooi.cn',

                pathRewrite: {
                    '^/api': ''
                },

                changeOrigin: true,

            },
        }
    },
    baseUrl: './',
    // 输出文件目录
    outputDir: 'dist',
    // webpack-dev-server 相关配置
    devServer: {
        port: 8888,
    },

}