import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Ideas from './pages/Ideas';
import MyRecipes from './pages/MyRecipes';
import Favorites from './pages/Favorites';
import AddRecipes from './pages/AddRecipes';
import SignInForm from './pages/SignInForm';
import SignUpForm from './pages/SignUpForm';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Header />}>
        <Route index element={<Ideas />}></Route>
        <Route path="ideas" element={<Ideas />}></Route>
        <Route path="myrecipes" element={<MyRecipes />}></Route>
        <Route path="favorites" element={<Favorites />}></Route>
        <Route path="addrecipe" element={<AddRecipes />}></Route>
        <Route path="sign-in" element={<SignInForm />}></Route>
        <Route path="sign-up" element={<SignUpForm />}></Route>
      </Route>
    </Routes>
  );
}
