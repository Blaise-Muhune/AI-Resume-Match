import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Header from './components/header';
import { AuthProvider } from './contexts/authContext';
import { useRoutes } from 'react-router-dom';
import Home from './Home';
import Resumes from './Resumes';
import UserBackground from './UserBackground';

function AppRoutes() {
  const routesArray = [
    {
      path: '*',
      element: <Home />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/home',
      element: <Home />,
    },
    {
      path: '/myresumes',
      element: <Resumes/>,
    },
    {
      path: '/mybackground',
      element: <UserBackground/>,
    },
    
  ];
  return useRoutes(routesArray);
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className=' flex flex-col'>

        <Header />
        <div className="w-full h-screen flex flex-col">
          <AppRoutes />
        </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
