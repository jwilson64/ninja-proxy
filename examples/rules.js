module.exports = {
  rules: [
    {
      pathname: '/home',
      destination: 'http://localhost:3000',
      rewrite: '/',
      headers: {
        stubHeader: 'I am a header to be passed on',
      },
    },
    /**
     * It's very important that a root path is at the very end of your list.
     * the first rule in the list takes precedence over everything else.
     * If the root is in all traffic that makes it to this point will route to our localhost:3000
     * for example:
     * http://localhost:4000/bad_name will route to http://localhost:3000/bad_name
     */
    { pathname: '/', destination: 'http://localhost:3000' },
  ],
}
