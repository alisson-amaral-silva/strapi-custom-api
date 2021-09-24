# Api - Database

## Requirements

This project uses [PostgreSQL](https://www.postgresql.org/), so, in order to make it working, install in your local machine or use Docker.

The configuration to the Database can be found on [app/config/database.js](app/config/database.js)

This project uses [Dbeaver](https://dbeaver.com/download/) in order to check your data

## Docker

After cloning this project, you must run 2 docker commands:

```
docker-compose pull
```

and then run:

```
docker-compose up
```

I got some problems with postgresql, if you have any postgresql processes running you must kill it and then change your password to access the database on dbeaver, and for that we have a few commands that you must do like: 

With this command you're inside postgres docker:
```
docker exec -it api-react_postgres_1 bash
```

With this command you're inside your own database inside docker and change your password:
```
psql -h localhost -U strapi

strapi=# alter user strapi with password 'NEW_PASSWORD';

strapi=# \q
```

## Development

If you have any problem with some dependencies you should try:

```
npm install
```

I got some problems with this docker and few dependencies and i solved:
uninstall sharp completely and then running these 2 commands:

```
npm install --arch=x64 --platform=linux sharp

npm install pg --save
```

you also should read this [Sharp problem](https://stackoverflow.com/questions/60181138/error-running-sharp-inside-aws-lambda-function-darwin-x64-binaries-cannot-be-u) for more info's about it

After running docker the urls to access are:

- `http://localhost:1337/admin` - The Dashboard to create and populate data
- `http://localhost:1337/graphql` - GraphQL Playground to test your queries

The first time to access the Admin you'll need to create an user.

## Populate data

This project uses a `/games/populate` route in order to populate the data via GoG site.
In order to make it work, follow the steps:

- Go to Roles & Permissions > Public and make sure `game:populate` route is public available and the upload as well
- With Strapi running run the following comand in your console:

```bash
$ curl -X POST http://localhost:1337/games/populate

# you can pass query parameters like:
$ curl -X POST http://localhost:1337/games/populate?page=2
$ curl -X POST http://localhost:1337/games/populate?search=simcity
$ curl -X POST http://localhost:1337/games/populate?sort=rating&price=free
$ curl -X POST http://localhost:1337/games/populate?availability=coming&sort=popularity
```
## Using dump

This project uses `Postgres` and if you want all the data previously, unzip the [data/data.zip](data/data.zip), copy the `uploads` folder to [app/public/uploads](app/public/uploads) and restore the data from the `strapi.sql` file inside the zip.

for dump data in windows you must run this command

```
psql -h localhost -p 5432 -U wongames wongames < strapi.sql
```
