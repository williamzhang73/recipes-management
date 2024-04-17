/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import {
  ClientError,
  defaultMiddleware,
  errorMiddleware,
} from './lib/index.js';
import argon2, { hash } from 'argon2';

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`;
const db = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

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
/* app.post('/api/recipe', async (req, res, next) => {
  try {
  } catch (error) {
    console.error(error);
    next(error);
  }
}); */
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
