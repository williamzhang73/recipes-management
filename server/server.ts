/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import {
  ClientError,
  authMiddleware,
  defaultMiddleware,
  errorMiddleware,
} from './lib/index.js';
import argon2, { hash } from 'argon2';
import { brotliDecompress } from 'node:zlib';
import { uploadsMiddleware } from './lib/uploads-middleware.js';
import { idText } from 'typescript';

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`;
const db = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});
type Recipe = {
  title: string;
  imageUrl: string;
  preparationTime: string;
  cuisine: string;
  glutenFree: string;
  vegetarian: string;
  ingredients: string;
  instructions: string;
};
const app = express();
const tokenSecret = process.env.TOKEN_SECRET;
if (!tokenSecret) throw new Error('TOKEN_SECRET not found in .env');
/* console.log('tokensecret: ', tokenSecret); */
// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;
/* console.log('reactStaticDir: ', reactStaticDir);
console.log('uploadsStaticDir: ', uploadsStaticDir); */
app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

function validateUser(username: string, password: string): void {
  if (!username) throw new ClientError(400, 'username is required');
  if (!password) throw new ClientError(400, 'password is required');
}

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    validateUser(username, password);
    const sql = `insert into "users" ("username", "hashedPwd") 
                values ($1, $2) 
                returning *; `;
    const hashedPwd = await argon2.hash(password);
    console.log('hashed: ', hashedPwd);
    const results = await db.query(sql, [username, hashedPwd]);
    const [row] = results.rows;
    res.status(201).json(row);
  } catch (error) {
    console.error('register error', error);
    next(error);
  }
});
app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    validateUser(username, password);
    const sql = `select * from "users" where "username"=$1;`;
    const results = await db.query(sql, [username]);
    const [row] = results.rows;
    if (!row) throw new ClientError(404, 'user not found.');
    const pwdVerify = await argon2.verify(row.hashedPwd, password);
    if (pwdVerify) {
      console.log('login in successfully');
      const user = {
        userId: row.userId,
        username,
      };
      const token = jwt.sign(user, tokenSecret);
      res.status(201).json({ user, token });
    } else {
      console.log('password verify failed');
      throw new ClientError(400, 'password verify failed');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});
app.post('/api/comments', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { message, recipeId } = req.body;
    console.log(req.body.recipeId);
    if (!userId) throw new ClientError(400, 'userId required');
    if (!recipeId) throw new ClientError(400, 'recipeId required');
    if (!message) throw new ClientError(400, 'message required');
    const sql = `insert into "comments" ("userId", "recipeId", "message") 
    values ($1, $2, $3) 
    returning *;`;
    const result = await db.query(sql, [userId, recipeId, message]);
    const [row] = result.rows;
    res.status(201).json(row);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get('/api/comments/:recipeId', async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    if (!recipeId) throw new ClientError(400, 'recipeId is required.');
    const sql = `select u."username", c.* 
    from "users" u 
    join "comments" c 
    using ("userId")
    where c."recipeId"=$1`;
    const result = await db.query(sql, [recipeId]);
    const rows = result.rows;
    if (!rows) throw new ClientError(404, 'recipeId not found.');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post(
  '/api/recipe',
  authMiddleware,
  uploadsMiddleware.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) throw new Error('no file exist.');
      console.log('file: ', req.file);
      const body = req.body as Recipe;
      let glutenFree = false;
      let vegetarian = false;
      body.vegetarian === 'on' ? (vegetarian = true) : (vegetarian = false);
      body.glutenFree === 'on' ? (glutenFree = true) : (glutenFree = false);
      // modify userId
      const userId = req.user?.userId;
      // modify imageUrl
      const imageUrl = `/images/${req.file.filename}`;
      const sql = `insert into "recipes" 
    ("userId", "title", "imageUrl", "preparationTime","cuisine", "glutenFree", "vegetarian", "ingredients", "instructions" )
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    returning *`;
      const params = [
        userId,
        body.title,
        imageUrl,
        body.preparationTime,
        body.cuisine,
        glutenFree,
        vegetarian,
        body.ingredients,
        body.instructions,
      ];
      const result = await db.query(sql, params);
      const [row] = result.rows;
      res.status(201).json(row);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);
app.get('/api/myrecipes', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new ClientError(400, 'userId is needed.');
    const sql = `select "recipes".*, "users"."username" 
    from "recipes" 
    join "users" 
    using ("userId") 
    where "userId"=$1;`;
    const result = await db.query(sql, [userId]);
    const rows = result.rows;
    if (!rows) throw new ClientError(404, 'userId not found.');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
app.get('/api/ideas', async (req, res, next) => {
  try {
    const sql = `select "recipes".*, "users"."username" 
    from "recipes" 
    join "users" 
    using ("userId");`;
    const result = await db.query(sql);
    const rows = result.rows;
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
/*
 * Middleware that handles paths that aren't handled by static middleware
 * or API route handlers.
 * This must be the _last_ non-error middleware installed, after all the
 * get/post/put/etc. route handlers and just before errorMiddleware.
 */
app.use(defaultMiddleware(reactStaticDir));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
