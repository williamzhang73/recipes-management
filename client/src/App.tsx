import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MyRecipes from './pages/MyRecipes';
import Favorites from './pages/Favorites';
import SignInForm from './pages/SignInForm';
import SignUpForm from './pages/SignUpForm';
import Details from './pages/Details';
import RecipeForm from './pages/RecipeForm';
import { User, UserProvider } from './components/UserContext';
import { insertComment, readUser, saveToken, saveUser } from './lib/data';
import { useEffect, useState } from 'react';
import SearchList from './pages/SearchList';
import Ideas from './pages/Ideas';
import { EmailSentForm } from './pages/EmailSentForm';
import PasswordAssistance from './pages/PasswordAssistance';
import OtpVerification from './pages/OtpVefication';
import PasswordReset from './pages/PasswordReset';

export default function App() {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
  const [error, setError] = useState<unknown>();
  useEffect(() => {
    const userLocal = readUser();
    if (userLocal !== null) {
      setUser(userLocal);
    }
  }, []);

  function handleSignIn(user: User, token: string) {
    setUser(user);
    setToken(token);
    saveToken(token);
    saveUser(user);
  }

  function handleSignOut() {
    setUser(undefined);
    setToken(undefined);
    saveToken(undefined);
    saveUser(undefined);
  }

  async function handleCommentPost(message: string, recipeId: string) {
    if (!user) {
      alert('login required.');
      return;
    }
    try {
      const messageObject = {
        userId: user.userId,
        message,
        recipeId,
      };
      await insertComment(messageObject);
      alert('message posted.');
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }

  const contextValue = { user, token, handleSignIn, handleSignOut };

  return (
    <UserProvider value={contextValue}>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route
            index
            element={
              <Ideas
                handleCommentPost={handleCommentPost}
                error={error}
                setError={setError}
              />
            }></Route>
          <Route
            path="ideas"
            element={
              <Ideas
                handleCommentPost={handleCommentPost}
                error={error}
                setError={setError}
              />
            }></Route>
          <Route
            path="my-recipes"
            element={
              <MyRecipes
                handleCommentPost={handleCommentPost}
                error={error}
                setError={setError}
              />
            }></Route>
          <Route
            path="favorites"
            element={
              <Favorites
                handleCommentPost={handleCommentPost}
                error={error}
                setError={setError}
              />
            }></Route>
          <Route path="add-recipe" element={<RecipeForm />}></Route>
          <Route path="sign-in" element={<SignInForm />}></Route>
          <Route path="sign-up" element={<SignUpForm />}></Route>
          <Route
            path="password-assistance"
            element={<PasswordAssistance />}></Route>
          <Route path="details" element={<Details />}></Route>
          <Route
            path="search-list"
            element={
              <SearchList
                handleCommentPost={handleCommentPost}
                error={error}
                setError={setError}
              />
            }></Route>
          <Route path="email-sent-form" element={<EmailSentForm />}></Route>
          <Route path="otp-verification" element={<OtpVerification />}></Route>
          <Route path="password-reset" element={<PasswordReset />}></Route>
        </Route>
      </Routes>
    </UserProvider>
  );
}
