## Clean Code and Clean Architecture course

[![Build Status](https://travis-ci.com/rafaph/clean-architecture-branas-course.svg?branch=master)](https://travis-ci.com/rafaph/clean-architecture-branas-course)

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
