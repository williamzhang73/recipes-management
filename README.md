# full-stack-project

This is a full-stack dynamic web application developed with PERN stack(PostgreSQL, Express.js, React, Node.js) and TypeScript. This application is built for home cooks and food enthusiasts who want to organize and share recipes.

## Demo

- Live AWS link: http://recipes-management-dev.us-west-1.elasticbeanstalk.com/

### Clone

1. In the main page of repo, click the Code button, and then click the SSH tab, then copy the SSH URL
1. In the VS Code Studio, open the terminal, and run `git clone <SSH URL>`

### Dependencies setup

1. Switch to the root directory `cd <your-folder-name>`.
1. Install all dependencies with `npm install`.

#### Database setup

1. Start the PostgreSQL database `sudo service postgresql start`.
1. Check the PostgreSQL database status `sudo service postgresql status`.
1. Create a database `createdb <name-of-database>`
1. In the `server/.env` file, in the `DATABASE_URL` value, replace database name with the name of your database, from the last step
1. While you are editing `server/.env`, also change the value of `TOKEN_SECRET` to a custom value, without spaces.
1. Run command `npm run db:import` to create all tables and import all existing data.

#### Start the development servers

1. Run `npm run dev` to start all servers including Vite and Express servers.
1. If you want stop servers, type `Ctrl-c` in the running server terminal.

#### Verify the client

1. Go to the browser, and enter http://localhost:8080, a react app should be running. If not, make sure your database set up correctly, and your development servers are running.

### Available `npm` commands explained

1. `start`
   - The `start` script starts the Node server in `production` mode, without any file watchers.
1. `build`
   - The `build` script executes `npm run build` in the context of the `client` folder. This builds your React app for production. This is used during deployment, and not commonly needed during development.
1. `db:import`
   - The `db:import` script executes `database/import.sh`, which executes the `database/schema.sql` and `database/data.sql` files to build and populate your database.
1. `dev`
   - Starts all the development servers.
1. `lint`
   - Runs ESLint against all the client and server code.
1. Not directly used by developer
   1. `install:*`
   - These scripts install dependencies in the `client` and `server` folders, and copy `.env.example` to `.env` if it doesn't already exist.
   1. `dev:*`
   - These scripts start the individual development servers.
   1. `lint:*`
   - These scripts run lint in the client and server directories.
   1. `postinstall`
      - The `postinstall` script is automatically run when you run `npm install`. It is executed after the dependencies are installed. Specifically for this project the `postinstall` script is used to install the `client` and `server` dependencies.
   1. `prepare`
      - The `prepare` script is similar to `postinstall` — it is executed before `install`. Specifically for this project it is used to install `husky`.
   1. `deploy`
      - The `deploy` script is used to deploy the project by pushing the `main` branch to the `pub` branch, which triggers the GitHub Action that deploys the project.
