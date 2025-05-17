import React from "react";
import HomePage from "./homepage/HomePage";
import { Route, Routes } from "react-router-dom";
import SignupForm from "./signup/SignupForm";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </>
  );
};

export default App;
