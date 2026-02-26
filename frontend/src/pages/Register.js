import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

import styles from "./../styles/auth.module.css";

import Toast from "../components/Toast";
import Response from "../components/Response";

import { AuthContext } from "../store/AuthContext";
import { AppContext } from "../store/AppContext";
import { socket } from "../hooks/useSocket";
import { users } from "../utils/apiendpoints";

const Register = () => {
  const { authState } = useContext(AuthContext);
  const { addToast } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    const form = e.target;

    const user = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
    };

    if (!user.name || !user.email || !user.password) {
      addToast({
        type: "error",
        message: "All fields are required",
      });
      return;
    }

    try {
      setIsLoading(true);

      const data = await users.register(user);

      if (socket?.connected) {
        socket.emit("user_join", data.user);
      }

      addToast({
        type: "success",
        message: data.message,
      });

      navigate("/login");
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
              Welcome
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
              <label htmlFor="name" className="text_primary">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="batman"
                autoComplete="username"
                required
              />
            </div>
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
                autoComplete="new-password"
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
                    Registering
                    <div className="loading"></div>
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </div>

            <div className={styles.link}>
              Already have an account?
              <Link className={styles.submit_button} to="/login">
                Login
              </Link>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};

export default Register;
