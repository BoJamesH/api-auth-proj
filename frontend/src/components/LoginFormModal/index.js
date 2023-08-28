// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { Link } from 'react-router-dom'

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemoUserClick = (e) => {
    // e.preventDefault();
    return dispatch(sessionActions.login({ credential: 'demo@user.io', password: 'password'}))
    .then(closeModal)
  };

  return (
    <div className="LoginFormDiv">
      <h2 className="LoginTitle">Log In</h2>
      <form onSubmit={handleSubmit}>
        <div className="CredentialInputDiv">
          <input
            type="text"
            className="LoginInputField"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder="Username or Email"
          />
        </div>
        <div className="PasswordInputDiv">
          <input
            type="password"
            className="LoginInputField"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        </div>
        <div className="LoginButtonDiv">
        <button className="LoginButton" type="submit">Log In</button>
        </div>
        <div className="DemoUserDiv">
          <button className='DemoUserButton' onClick={handleDemoUserClick}>Demo User</button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
