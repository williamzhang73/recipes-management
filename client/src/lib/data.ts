import { User } from '../components/UserContext';
import { PostComment, Comment } from '../pages/Details';

export const tokenKey = 'um.token';

export type Recipe = {
  recipeId: string;
  title: string;
  userId: string;
  imageUrl: string;
  preparationTime: string;
  cuisine: string;
  glutenFree: boolean;
  vegetarian: boolean;
  ingredients: string;
  instructions: string;
  createdAt: string;
};

export type Recipe1 = Recipe & {
  username: string;
};

export function saveToken(token: string | undefined): void {
  if (token) {
    localStorage.setItem(tokenKey, token);
  } else {
    localStorage.removeItem(tokenKey);
  }
}

export function readToken(): string {
  const token = localStorage.getItem(tokenKey);
  if (!token) throw new Error('No token found');
  return token;
}

export function saveUser(user: User | undefined): void {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
}

export function readUser(): User | null {
  const userLocal = localStorage.getItem('user');
  if (!userLocal) return null;
  const user = JSON.parse(userLocal) as User;
  return user;
}

export async function insertComment(
  messageObject: PostComment
): Promise<Comment> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify(messageObject),
  };
  const response = await fetch('/api/comments', req);
  if (!response) throw new Error('Network response not ok.');
  return await response.json();
}

export async function searchComments(recipeId: string) {
  const response = await fetch(`/api/comments/${recipeId}`);
  if (!response.ok) throw new Error('Network response not ok.');
  return await response.json();
}

export async function searchFavorites(userId: number | undefined) {
  const req = {
    headers: {
      authorization: `Bearer ${readToken()}`,
    },
  };
  const response = await fetch(`/api/fetchlikes/${userId}`, req);
  if (!response.ok) throw new Error('Network response not ok.');
  return await response.json();
}

export async function searchIdeas() {
  const response = await fetch('/api/ideas');
  if (!response.ok) throw new Error('Network response not ok.');
  return await response.json();
}

export async function searchMyRecipes() {
  const req = {
    headers: {
      authorization: `Bearer ${readToken()}`,
    },
  };
  const response = await fetch('/api/myrecipes', req);
  if (!response.ok) throw new Error('Network response not ok.');
  return await response.json();
}

export async function insertRecipe(formData: FormData) {
  const req = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
    body: formData,
  };
  const response = await fetch('/api/addrecipe', req);
  if (!response.ok) throw new Error('Network response not ok.');
}

export async function validateSignIn(formData: FormData) {
  const formObject = Object.fromEntries(formData);
  const req = {
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(formObject),
  };
  const response = await fetch('/api/auth/sign-in', req);
  if (!response.ok) {
    alert(`username or password doesn't match.`);
    throw new Error('Network response not ok.');
  }
  return await response.json();
}

export async function register(formData: FormData) {
  const ObjectData = Object.fromEntries(formData);
  const req = {
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(ObjectData),
  };
  const response = await fetch('/api/auth/sign-up', req);
  if (!response.ok) {
    throw new Error('Network response not ok.');
  }
  return await response.json();
}

export async function searchIsLikes(
  userId: number | undefined,
  recipeId: string
) {
  const req = {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(`/api/likes/${userId}/${recipeId}`, req);
  if (!response.ok) throw new Error('Network response not ok.');
  return await response.json();
}

export async function searchLikesCount(recipeId: string) {
  const response = await fetch(`/api/likes/${recipeId}`);
  return await response.json();
}

export async function insertOrDeleteLikes(recipeId: string, userId: number) {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify({ recipeId, userId }),
  };
  const response = await fetch('/api/likes', req);
  if (!response.ok) throw new Error('Network response not ok.');
  return await response.json();
}
