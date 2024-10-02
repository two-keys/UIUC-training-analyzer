module.exports = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/app',
        permanent: true,
      }
    ]
  },
}