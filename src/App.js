import { React, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { Route, Navigate} from "react-router";

import SignIn from './components/SignIn/SignIn';
import HomePage from './components/HomePage/HomePage';

const defaultTheme = createTheme();

function App() {
  const [token, setToken] = useState("");

  const getAuth = () => {
      const isAuth = localStorage.getItem("isAuth");

      return isAuth === 'true';
  }

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={
            getAuth() ? <HomePage/> : <Navigate to="/login"/>
          }/>
          <Route path="/login" element={
            getAuth() ?
            <Navigate to="/"/> :
            <SignIn
              defaultTheme={defaultTheme}
              setToken={setToken}
            />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
