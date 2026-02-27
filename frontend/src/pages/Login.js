import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

import styles from "./../styles/auth.module.css";

import Toast from "../components/Toast";
import Response from "../components/Response";

import { AuthContext } from "../store/AuthContext";
import { AppContext } from "../store/AppContext";
import { users } from "../utils/apiendpoints";

const Login = () => {
  const { authState, login } = useContext(AuthContext);
  const { addToast } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    const form = e.target;

    const user = {
      email: form.email.value.trim(),
      password: form.password.value,
    };

    if (!user.email || !user.password) {
      addToast({
        type: "error",
        message: "Please fill all fields",
      });
      return;
    }

    try {
      setIsLoading(true);

      const data = await users.login(user);

      login(data.user);
      localStorage.setItem("jwt", data.token);

      addToast({
        type: "success",
        message: data.message,
      });

      navigate("/");
    } catch (error) {
      addToast({
        type: "error",
        message: error?.message,
      });

      console.log(".....API ERROR.....", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authState.authenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Toast />
      {isLoading && <Response />}
      <div className="flex full_container">
        <section className={`flex col gap ${styles.container}`}>
          <div>
            <div className={`w_full text_primary ${styles.heading}`}>
              Welcome back
            </div>
            <div className={`w_full text_secondary ${styles.sub_heading}`}>
              Please enter your details.
            </div>
          </div>
          <form
            className={`flex col gap w_full ${styles.form}`}
            onSubmit={handleSubmit}
          >
            <div className={`flex col w_full ${styles.group}`}>
              <label htmlFor="email" className="text_primary">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="example@domain.com"
                autoComplete="email"
                required
              />
            </div>
            <div className={`flex col w_full ${styles.group}`}>
              <label htmlFor="password" className="text_primary">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <span
                className={`${styles.password_eye} flex`}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            <div className={`flex col w_full ${styles.group}`}>
              <button
                type="submit"
                disabled={isLoading}
                className={`button primary flex gap2 ${styles.submit_button}`}
              >
                {isLoading ? (
                  <>
                    Logging in
                    <div className="loading"></div>
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </div>

            <div className={styles.link}>
              Don’t have an account?
              <Link to="/register" className={styles.submit_button}>
                Register
              </Link>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};

export default Login;
