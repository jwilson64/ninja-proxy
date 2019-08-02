module.exports = {
  rules: [
    { pathname: '/', destination: 'http://localhost:3000' },
    { pathname: '/home', destination: 'http://localhost:3000', rewrite: '/' },
  ],
}
