const path = require('path')

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  env: {
    CORE_SERVER_API: process.env.CORE_SERVER_API,
    SECRET: process.env.SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET
  },
  images: {
    loader: 'imgix',
    path: 'https://log21ruby.imgix.net'
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }
}
