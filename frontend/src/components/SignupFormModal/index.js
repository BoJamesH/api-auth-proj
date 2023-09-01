import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [filledOut, setFilledOut] = useState(false)
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    if (email && username && firstName && lastName && password && confirmPassword) {
      setFilledOut(true)
    }
  }, [email, password, firstName, lastName, password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
    <div className="SignupFormDiv">
      <h1>Sign Up</h1>
      <form className="SignupForm" onSubmit={handleSubmit}>
          <input
            autocomplete="off"
            className="SignupInputField"
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        {errors.email && <p className="SignupErrors">{errors.email}</p>}
          <input
            type="text"
            autocomplete="off"
            className="SignupInputField"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        {errors.username && <p className="SignupErrors">{errors.username}</p>}
          <input
            type="text"
            autocomplete="off"
            className="SignupInputField"
            name="firstName"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        {errors.firstName && <p className="SignupErrors">{errors.firstName}</p>}
          <input
            type="text"
            autocomplete="off"
            className="SignupInputField"
            name="lastName"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        {errors.lastName && <p className="SignupErrors">{errors.lastName}</p>}
          <input
            type="password"
            name="password1"
            autocomplete="off"
            placeholder="Password"
            className="SignupInputField"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        {errors.password && <p className="SignupErrors">{errors.password}</p>}
          <input
            type="password"
            autocomplete="off"
            name="password2"
            placeholder="Confirm Password"
            className="SignupInputField"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        {errors.confirmPassword && (
          <p className="SignupErrors">{errors.confirmPassword}</p>
        )}
        <div className="SignupButtonDiv">
          <button className='SignupButton' type="submit" disabled={!filledOut}>
            Sign Up
          </button>
      </div>
      </form>
      </div>
    </>
  );
}

export default SignupFormModal;
