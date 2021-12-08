# pull_requests

A simple Github dashboard

## Project setup
```
npm install

touch ./src/config.js
```

`config.js` should export the following variables:
```
GITHUB_BEARER_TOKEN // Generate token at: https://github.com/settings/tokens
GITHUB_USERNAME // Your Github username
```

Example: `config.js`:
```
export const GITHUB_BEARER_TOKEN = 'ghp_soopersecret'
export const GITHUB_USERNAME = 'elon_musk'
```

### Compiles and hot-reloads for development
```
npm run serve
visit: http://localhost:8888
```
