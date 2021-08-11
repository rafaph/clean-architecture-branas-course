## Clean Code and Clean Architecture course

[![CI](https://github.com/rafaph/clean-architecture-branas-course/actions/workflows/pipeline.yml/badge.svg)](https://github.com/rafaph/clean-architecture-branas-course/actions/workflows/pipeline.yml)
[![Coverage Status](https://coveralls.io/repos/github/rafaph/clean-architecture-branas-course/badge.svg?branch=master)](https://coveralls.io/github/rafaph/clean-architecture-branas-course?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/c89ca516c5f49327c3af/maintainability)](https://codeclimate.com/github/rafaph/clean-architecture-branas-course/maintainability)

### Running

#### Create containers
`docker-compose up -d --build`

#### Start a bash
`docker-compose exec node bash`

#### Install dependencies
`npm ci`

#### Run tests
`npm test`

### Useful commands

#### Down
- Remove containers

`docker-compose down --remove-orphans -t 30`

#### Stop
- Stop containers

`docker-compose stop`
