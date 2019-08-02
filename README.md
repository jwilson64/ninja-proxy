# Ninja Proxy

### What is it?

This is based off of [Zeit's micro-proxy](https://github.com/zeit/micro-proxy)

The goal is to give a user a quick way to spin up a proxy.

## Usage

Firstly, install the package:

`npm i -g ninja-proxy`

Then add following rules to a filename called rules.json:

```
{
  "rules": [
    {"pathname": "/blog", "method":["GET", "POST", "OPTIONS"], "dest": "http://localhost:5000"},
    {"pathname": "/**", "dest": "http://localhost:4000"}
  ]
}
```

Visit path alias documentation to learn more about rules.

Run the proxy server with:

`ninja-proxy -r rules.json -p 9000`
Now you can access the proxy via: http://localhost:9000

## Programmatic Usage

You can run the proxy programmatically inside your codebase. For that, add ninja-proxy to your project with:

`npm install ninja-proxy`

Then create the proxy server like this:

```
const createProxy = require('ninja-proxy')
const proxy = createProxy([
  {"pathname": "/blog", "method":["GET", "POST", "OPTIONS"], "dest": "http://localhost:5000"},
  {"pathname": "/**", "dest": "http://localhost:4000"}
])

proxy.listen(9000, (err) => {
  if (err) {
    throw err
  }
  console.log(`> Ready on http://localhost:9000`)
})
```
