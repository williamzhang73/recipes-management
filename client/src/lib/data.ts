import { User } from '../components/UserContext';
import { PostComment, Comment } from '../pages/Details';

export const tokenKey = 'um.token';

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
