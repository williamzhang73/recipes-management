set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
 drop schema "public" cascade; 

create schema "public";
CREATE TABLE "public"."likes" (
  "likesId" serial,
  "userId" integer not null,
  "recipeId" integer not null,
  "createdAt" timestamptz(6) not null default now(),
  primary key ("likesId")
);

CREATE TABLE "public"."users" (
  "userId" serial,
  "username" text not null,
  "hashedPwd" text not null,
  "createdAt"  timestamptz(6) not null default now(),
  primary key ("userId")
);

CREATE TABLE "public"."recipes" (
  "recipeId" serial,
  "userId" integer not null,
  "title" text not null,
  "imageUrl" text not null,
  "preparationTime" integer not null,
  "cuisine" text not null,
  "glutenFree" boolean,
  "vegetarian" boolean,
  "ingredients" text not null,
  "instructions" text not null,
  "createdAt" timestamptz(6) not null default now(),
  primary key ("recipeId")
);

CREATE TABLE "public"."comments" (
  "commentId" serial,
  "userId" integer not null,
  "recipeId" integer not null,
  "message" text not null,
  "createdAt" timestamptz(6) not null default now(),
    primary key ("commentId")
);

ALTER TABLE "likes" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "likes" ADD FOREIGN KEY ("recipeId") REFERENCES "recipes" ("recipeId");

ALTER TABLE "recipes" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "comments" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "comments" ADD FOREIGN KEY ("recipeId") REFERENCES "recipes" ("recipeId");

ALTER TABLE "users" ADD CONSTRAINT unique_username UNIQUE ("username");
