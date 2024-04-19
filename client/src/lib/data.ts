import { User } from '../components/UserContext';
import { PostComment, Comment } from '../pages/Details';

export const tokenKey = 'um.token';
export function saveToken(token: string | undefined): void {
  if (token) {
    sessionStorage.setItem(tokenKey, token);
  } else {
    sessionStorage.removeItem(tokenKey);
  }
}

export function readToken(): string {
  const token = sessionStorage.getItem(tokenKey);
  if (!token) throw new Error('No token found');
  return token;
}

export function saveUser(user: User | undefined): void {
  if (user) {
    sessionStorage.setItem('user', JSON.stringify(user));
  } else {
    sessionStorage.removeItem('user');
  }
}

export function readUser(): User | null {
  const getUser = sessionStorage.getItem('user');
  let user = null as User | null;
  if (getUser) {
    user = JSON.parse(getUser);
    console.log('user: ', user);
    return user;
  }
  if (getUser === null) throw new Error('No user found');
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
