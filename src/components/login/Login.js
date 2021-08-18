import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './login.scss';
import DailyMilkFreshLogo from '../../DailyMilkFresh.png';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  let history = useHistory();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    // setIsLoggedIn(false);
    if (username === '123' && password === 'chai') {
      localStorage.setItem('loggedIn', true);
      // setIsLoggedIn(true);
      return history.push('/dashboard');
    } else {
      setWrongCredentials(true);
    }
  };

  return (
    <div className="Login__main-container">
      <div className="Login__sub-container">
        <img
          className="Login__logo-image"
          src={DailyMilkFreshLogo}
          alt="this is logo"
        ></img>
        <div className="Login__logo-name">DailyFreshMilk </div>
        <div className="Login__logo-caption">MILK AT your door step</div>
        <div className="Login__login-header">Login</div>
        {wrongCredentials ? (
          <div className="Login__wrong-password">
            You have entered wrong Username/Password
          </div>
        ) : null}
        <div className="Login__col-3">
          <input
            className="Login__input-focus-effect"
            type="text"
            placeholder="Phone/Email"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          ></input>
          <span className="focus-border"></span>
        </div>

        <div className="Login__col-3">
          <input
            className="Login__input-focus-effect"
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Password"
          ></input>
          <span className="focus-border"></span>

          {showPassword ? (
            <span onClick={toggleShowPassword} className="Login__show-password">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-eye"
                viewBox="0 0 16 16"
              >
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
              </svg>
            </span>
          ) : (
            <span onClick={toggleShowPassword} className="Login__show-password">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-eye-slash"
                viewBox="0 0 16 16"
              >
                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
              </svg>
            </span>
          )}
        </div>
        <input
          onClick={handleLogin}
          disabled={!validateForm()}
          type="submit"
          value="Log In"
          className={
            validateForm()
              ? 'Login__submit'
              : 'Login__submit Login__submit-disabled'
          }
        ></input>
        <div className="Login__signup">
          Dont have an account ?<Link to="/"> SignUp</Link>
        </div>
      </div>
    </div>
  );
}