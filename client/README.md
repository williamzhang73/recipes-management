# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Recipe App

-The Recipe App allows users to submit, organize, and view recipes. Users can also explore other users’ recipes and share their favorite ones with friends.

## Table of Contents

- Overview
- Demo
- Technologies Used
- Installation
- Usage
- Contributors
- License

## Overview

The Recipe App simplifies recipe management by providing the following features:

- Submit a Recipe: Users can add their own recipes, complete with title, cuisine, preparation time, gluten free, ingredients, instructions, and images.
- Organize Recipes: Users can view recipes they posted, users can add and delete recipes from Favorites catagories.
- View Other Users’ Recipes: Explore a variety of recipes shared by the community.
- Share Favorites: Share favorite recipes with friends via email.

## Demo

- Live AWS link: http://recipes-management-dev.us-west-1.elasticbeanstalk.com/

## Technologies Used

- HTML5
- Tailwind CSS 3.4.3
- TypeScript 5.4.3
- Vite 5.2.3
- React 18.2.0

## Installation

To run the Recipe App locally, follow these steps:To run the Recipe App locally, follow these steps:

- Clone the repository:

  git clone git@github.com:williamzhang73/recipes-management.git

- Set up your Postgresql database

  [Link](../README.md)

- Navigate into the client

  cd client

- Install all dependencies and dev dependencies

  npm install

- start the front-end server

  npm run dev

## Usage

Note: make sure the Postgressql database already set up properly

- Visit the app at http://localhost:8080.
- Create an account or log in.
- Explore recipes, add your own, and organize them.

## Contributors

- Author: William Zhang
- contributor: Robert Gardner
