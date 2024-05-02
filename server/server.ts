/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import { sesClient } from './lib/ses_Client';
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
import { error } from 'node:console';
import { title } from 'node:process';

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

export type EmailSentForm = {
  toAddress: string;
  fromAddress: string;
  title: string;
  message: string;
};

const app = express();
const tokenSecret = process.env.TOKEN_SECRET;
if (!tokenSecret) throw new Error('TOKEN_SECRET not found in .env');
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;
app.use(express.static(reactStaticDir));
app.use(express.static(uploadsStaticDir));
app.use(express.json());

function validateUser(username: string, password: string): void {
  if (!username) throw new ClientError(400, 'username is required');
  if (!password) throw new ClientError(400, 'password is required');
}

app.post('/api/auth/sign-up', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    validateUser(username, password);
    const sql = `insert into "users" ("username", "hashedPwd") 
                values ($1, $2) 
                returning *; `;
    const hashedPwd = await argon2.hash(password);
    const results = await db.query(sql, [username, hashedPwd]);
    const [row] = results.rows;
    res.status(201).json(row);
  } catch (error) {
    const subString = `Key (username)=(${username}) already exists`;
    if (JSON.stringify(error).includes(subString)) {
      res.json('duplicate username');
      return;
    }
    console.error(error);
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
      const user = {
        userId: row.userId,
        username,
      };
      const token = jwt.sign(user, tokenSecret);
      res.status(201).json({ user, token });
    } else {
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
    where c."recipeId"=$1
    order by "createdAt" desc;`;
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
  '/api/addrecipe',
  authMiddleware,
  uploadsMiddleware.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) throw new Error('no file exist.');
      const body = req.body as Recipe;
      const ingredients = req.body.ingredients;
      let glutenFree = false;
      let vegetarian = false;
      body.vegetarian === 'on' ? (vegetarian = true) : (vegetarian = false);
      body.glutenFree === 'on' ? (glutenFree = true) : (glutenFree = false);
      const userId = req.user?.userId;
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

app.post('/api/searchRecipe', async (req, res, next) => {
  try {
    const { searchInput } = req.body;
    if (!searchInput)
      throw new ClientError(400, 'searchInput field is required');
    const sql = `select "recipes".*, "users"."username" 
    from "recipes" 
    join "users" 
    using ("userId")
    where "recipes"."ingredients" like $1;`;
    const result = await db.query(sql, [`%${searchInput}%`]);
    const rows = result.rows;
    res.json(rows);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

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

app.get('/api/likes/:userId/:recipeId', async (req, res, next) => {
  try {
    const { recipeId, userId } = req.params;
    if (!recipeId) throw new ClientError(400, 'recipeId is required.');
    if (!userId) throw new ClientError(400, 'userId is required.');
    const selectSql = `select * from "likes" where "recipeId"=$1 and "userId"=$2;`;
    const selectResult = await db.query(selectSql, [recipeId, userId]);
    const selectRows = selectResult.rows;
    if (selectRows.length === 0) {
      res.json('dislike');
    } else {
      res.json('like');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get('/api/likes/:recipeId', async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    if (!recipeId) throw new ClientError(400, 'recipeId is required.');
    const sql = `select count(*) as count 
                 from "likes" 
                 where "recipeId"=$1 
                 group by "recipeId";`;
    const result = await db.query(sql, [recipeId]);
    let [rows] = result.rows;
    if (!rows) {
      rows = { count: 0 };
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post('/api/likes', authMiddleware, async (req, res, next) => {
  try {
    const { recipeId, userId } = req.body;
    if (!recipeId) throw new ClientError(400, 'recipeId is required.');
    if (!userId) throw new ClientError(400, 'userId is required.');
    const selectSql = `select * from "likes" where "recipeId"=$1 and "userId"=$2;`;
    const insertSql = `insert into "likes" ("recipeId", "userId") values ($1,$2) returning *`;
    const deleteSql = `delete from "likes" where "recipeId"=$1 and "userId"=$2 returning *`;
    const selectResult = await db.query(selectSql, [recipeId, userId]);
    const selectRows = selectResult.rows;
    if (selectRows.length === 0) {
      const insertResult = await db.query(insertSql, [recipeId, userId]);
      const insertRows = insertResult.rows;
      res.status(201).json('inserted');
    } else {
      const deleteResult = await db.query(deleteSql, [recipeId, userId]);
      const deleteRows = deleteResult.rows;
      res.json('deleted');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get('/api/fetchlikes/:userId', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) throw new ClientError(400, 'userId is required.');
    const sql = `select r.*, u."username" 
    from "likes" l 
    join "users" u using ("userId") 
    join "recipes" r using ("recipeId") 
    where l."userId"=$1;`;
    const result = await db.query(sql, [userId]);
    const rows = result.rows;
    if (!rows) throw new ClientError(404, 'userId not found.');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post('/api/sendemail', async (req, res, next) => {
  const reqBody = req.body;
  const objectData = reqBody.objectData as EmailSentForm;
  const toAddress = objectData.toAddress;
  const fromAddress = objectData.fromAddress;
  const emailTitle = objectData.title;
  const message = objectData.message;

  if (!objectData) {
    throw new ClientError(400, 'email form object can not be undefined.');
  }
  const recipe: Recipe = reqBody.recipe;
  if (!recipe) {
    res.json('recipe undefined');
    return;
  }

  const createSendEmailCommand = (
    toAddress: string,
    fromAddress: string,
    subject: string,
    recipe: Recipe,
    message: string
  ): any => {
    return new SendEmailCommand({
      Destination: {
        CcAddresses: [],
        ToAddresses: [toAddress],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<div><div>${message}</div><br/><div>${recipe.ingredients}</div><br/>
            <div>${recipe.instructions}</div></div>`,
          },
          Text: {
            Charset: 'UTF-8',
            Data: '',
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [],
    });
  };

  try {
    const sendEmailCommand = createSendEmailCommand(
      toAddress,
      fromAddress,
      emailTitle,
      recipe,
      message
    );
    const dataSent = await sesClient.send(sendEmailCommand);
    res.status(200).json('sent');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.use(defaultMiddleware(reactStaticDir));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
