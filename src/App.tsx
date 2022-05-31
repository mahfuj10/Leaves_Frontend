import React, { useEffect } from 'react';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import { Routes, Route } from "react-router-dom";
import { useAppDispatch, useAppSelector } from './components/Redux/hooks';
import { gellAllGroups, getAllUsers } from './components/Redux/counterSlice';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import UserSetting from './Pages/UserSetting/UserSetting';
import { ForgetPass } from './components/ForgetPass/ForgetPass';


const App = () => {

  const { loginUser } = useAppSelector(state => state?.data);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(gellAllGroups());
    dispatch(getAllUsers());
  }, [loginUser]);
  // https://enigmatic-garden-12643.herokuapp.com

  return (

    <>

      <Routes>

        <Route path="/" element={<PrivateRoute>
          <Home />
        </PrivateRoute>} />

        <Route path="/login" element={<Login />}
        />

        <Route path="/reseatpass" element={<ForgetPass />}
        />

        <Route path="/setting/:userId" element={<UserSetting />}
        />

      </Routes>
      {/* <Login /> */}

    </>
  );
}

export default App;
