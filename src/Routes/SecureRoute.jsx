import { useEffect } from "react";
import { Route, Navigate, Routes } from "react-router-dom";

const SecureRoute = ({ children }) => {
  const isAuthenticated = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <>
    {isAuthenticated?children:<Navigate to="/" />}
    </>
  );
};

export default SecureRoute;
