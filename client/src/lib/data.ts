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
