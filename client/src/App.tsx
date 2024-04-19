import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Ideas from './pages/Ideas';
import MyRecipes from './pages/MyRecipes';
import Favorites from './pages/Favorites';
import SignInForm from './pages/SignInForm';
import SignUpForm from './pages/SignUpForm';
import Details from './pages/Details';
import RecipeForm from './pages/RecipeForm';
import { User, UserProvider } from './components/UserContext';
import { readUser, saveToken, saveUser } from './lib/data';
import { useEffect, useState } from 'react';

export default function App() {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    const userSession = readUser();
    if (userSession !== null) {
      setUser(userSession);
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

  const contextValue = { user, token, handleSignIn, handleSignOut };

  return (
    <UserProvider value={contextValue}>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Ideas />}></Route>
          <Route path="ideas" element={<Ideas />}></Route>
          <Route path="myrecipes" element={<MyRecipes />}></Route>
          <Route path="favorites" element={<Favorites />}></Route>
          <Route path="addrecipe" element={<RecipeForm />}></Route>
          <Route path="sign-in" element={<SignInForm />}></Route>
          <Route path="sign-up" element={<SignUpForm />}></Route>
          <Route path="details" element={<Details />}></Route>
        </Route>
      </Routes>
    </UserProvider>
  );
}
