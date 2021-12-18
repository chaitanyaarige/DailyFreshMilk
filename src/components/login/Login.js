import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import Paper from "@mui/material/Paper";

import TextField from "@mui/material/TextField";

import { userlogin, getToken } from "store/auth";
import { getUser } from "store/user";
import UserContext from "UserContext";
import eyecloseIcon from "svgs/eye_close.svg";
import eyeopenIcon from "svgs/eye_open.svg";
import "./login.scss";
import DailyMilkFreshLogo from "logo.png";
import ForgotPassword from "./ForgotPassword";

export default function Login() {
  const [resetPasswordClicked, setResetPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [clickedonce, setClickOnce] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiresponsemessage, setapiresponse] = useState(null);

  let navigate = useNavigate();

  const userInfo = useContext(UserContext);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  function validateForm() {
    return username.length > 3 && password.length > 3;
  }

  const toggleForgotPassword = (e) => {
    e.preventDefault();
    setResetPassword(true);
    setapiresponse(null);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setClickOnce(true);

    let tokkk = jwt.sign(
      {
        data: password,
        timestamp: new Date().toISOString(),
      },
      "xeo9tcj5xyvqoghxm6wtbh6hfiamm3ji7ain02oa9lzu51"
    );

    let data = {
      phone_no: username,
      password: tokkk,
      app_token: uuidv4(),
    };

    userInfo.setIsLoggedIn(false);
    userInfo.setAccessToken(null);
    userInfo.setIsAdmin(false);
    userInfo.setRefreshToken(null);
    userlogin(data)
      .then((res) => {
        validateToken(res.data.code);
        setClickOnce(false);
      })
      .catch((err) => {
        setapiresponse(err && err.response && err.response.data.message);
        setClickOnce(false);
        console.log("error in request", err);
      });
  };
  const validateToken = (authcode) => {
    getToken(authcode)
      .then((res) => {
        getUserDetails(res.data.access_token, res.data.refresh_token);
      })
      .catch((err) => {
        setapiresponse(err.response.data.message);
        console.log("error in request", err);
      });
  };

  const getUserDetails = (token, refresh_token) => {
    getUser(token).then((res) => {
      // localStorage.setItem("userDetails", );

      if (res.data.data.user_type === 1) {
        userInfo.setIsLoggedIn(true);
        userInfo.setAccessToken(token);
        userInfo.setIsAdmin(true);
        userInfo.setRefreshToken(refresh_token);
        userInfo.saveuserDetails(res.data.data);
        return navigate("/dashboard");
      } else if (res.data.data.user_type === 2) {
        userInfo.setIsLoggedIn(true);
        userInfo.setAccessToken(token);
        userInfo.setIsAdmin(false);
        userInfo.setRefreshToken(refresh_token);
        userInfo.saveuserDetails(res.data.data);
        return navigate("/dashboard");
      } else {
        setapiresponse("Un Authorized User");
      }
    });
  };
  return (
    <div className="Login__main-container">
      <Paper className="Login__paper" elevation={2}>
        <img
          className="Login__logo-image"
          src={DailyMilkFreshLogo}
          alt="this is logo"
        ></img>

        {!resetPasswordClicked ? (
          <form className="Login__sub-container">
            {/* <div className="Login__logo-name">DailyFreshMilk </div> */}
            {/* <div className="Login__logo-caption">MILK AT your door step</div> */}
            <div className="Login__login-header"> Sign in - Admin Panel </div>
            {apiresponsemessage ? (
              <div className="Login__wrong-password">{apiresponsemessage}</div>
            ) : null}
            <div className="Login__col-3">
              <TextField
                error={Boolean(apiresponsemessage)}
                id="username"
                label="Phone Number"
                fullWidth
                size="small"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="Login__col-3">
              <TextField
                type={showPassword ? "text" : "password"}
                error={Boolean(apiresponsemessage)}
                id="password"
                label="Password"
                fullWidth
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {showPassword ? (
                <span
                  onClick={toggleShowPassword}
                  className="Login__show-password"
                >
                  <img className="" src={eyecloseIcon} alt="closeeye"></img>
                </span>
              ) : (
                <span
                  onClick={toggleShowPassword}
                  className="Login__show-password"
                >
                  <img className="" src={eyeopenIcon} alt="closeeye"></img>
                </span>
              )}
            </div>

            <div className="Login__col-3">
              <input
                onClick={handleLogin}
                disabled={!validateForm() || clickedonce}
                type="submit"
                value="Log In"
                className={
                  validateForm()
                    ? "Login__submit"
                    : "Login__submit Login__submit-disabled"
                }
              ></input>
            </div>

            <div
              className="Login__signup"
              onClick={(e) => toggleForgotPassword(e)}
            >
              <span className="Login__forgot"> Forgot your password ? </span>
            </div>
          </form>
        ) : (
          <ForgotPassword
            username={username}
            setUsername={setUsername}
            setResetPassword={setResetPassword}
            apiresponsemessage={apiresponsemessage}
            setapiresponse={setapiresponse}
            clickedonce={clickedonce}
            setClickOnce={setClickOnce}
          ></ForgotPassword>
        )}
      </Paper>
    </div>
  );
}
