set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
 drop schema "public" cascade; 

create schema "public";
CREATE TABLE "public"."likes" (
  "likesId" serial,
  "userId" integer,
  "recipeId" integer,
  "createdAt" timestamp,
  primary key ("likesId")
);

CREATE TABLE "public"."recipes" (
  "recipeId" serial,
  "userId" integer,
  "title" text not null,
  "imageUrl" text not null,
  "preparationTime" integer not null,
  "cuisine" text not null,
  "glutenFree" boolean,
  "vegetarian" boolean,
  "ingredients" text,
  "instructions" text,
  "createdAt" timestamp,
  primary key ("recipeId")
);

CREATE TABLE "public"."users" (
  "userId" serial,
  "username" text not null,
  "hashedPwd" text not null,
  "createdAt" timestamp,
  primary key ("userId")
);

CREATE TABLE "public"."comments" (
  "commentId" serial,
  "userId" integer,
  "recipeId" integer,
  "message" text not null,
  "createdAt" timestamp,
    primary key ("commentId")
);

ALTER TABLE "likes" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "likes" ADD FOREIGN KEY ("recipeId") REFERENCES "recipes" ("recipeId");

ALTER TABLE "recipes" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "comments" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "comments" ADD FOREIGN KEY ("recipeId") REFERENCES "recipes" ("recipeId");
