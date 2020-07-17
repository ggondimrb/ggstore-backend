# GGStore Backend

API for this application: [GGStore](https://github.com/ggondimrb/ggstore-frontend)

```
A Node.js 8.0.0+ setup with [yarn](https://yarnpkg.com/) is recommended.
```

## If using docker:

```bash
docker run --name <NAME> -e POSTGRES_PASSWORD=<PASSWORD> -p 5432:<PORT> -d postgres

docker run --name <NAME> -p 27017:<PORT> -d -t mongo

docker run --name <NAME> -p 6379:<PORT> -d -t redis:alpine
```

## In root directory execute:

```bash
# install dependencies
yarn

# ...or
npm install

```

### To start run:

```bash

npm run queue
npm run dev
```
