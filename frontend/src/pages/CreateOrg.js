import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

import styles from "./../styles/auth.module.css";

import Toast from "../components/Toast";
import Response from "../components/Response";

import { AuthContext } from "../store/AuthContext";
import { AppContext } from "../store/AppContext";
import { socket } from "../hooks/useSocket";
import { organizations } from "../utils/apiendpoints";

const CreateOrg = () => {
  const { authState } = useContext(AuthContext);
  const { addToast } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    const form = e.target;

    const orgData = {
      name: form.orgName.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
      orgName: form.orgName.value.trim(),
    };

    try {
      setIsLoading(true);

      const data = await organizations.create(orgData);

      if (socket?.connected) {
        socket.emit("user_join", data.user);
      }

      addToast({
        type: "success",
        message: `Organization created successfully! Code: ${data.organization.code}`,
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
              Create Organization
            </div>
            <div className={`w_full text_secondary ${styles.sub_heading}`}>
              Create your organization and become the admin.
            </div>
          </div>
          <form
            className={`flex col gap w_full ${styles.form}`}
            onSubmit={handleSubmit}
          >
            <div className={`flex col w_full items-stretch ${styles.group}`}>
              <label htmlFor="orgName" className="text_primary">
                Organization Name
              </label>
              <input
                type="text"
                id="orgName"
                name="orgName"
                placeholder="My Company"
                autoComplete="organization"
                required
              />
            </div>
            <div className={`flex col w_full items-stretch ${styles.group}`}>
              <label htmlFor="name" className="text_primary">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                autoComplete="name"
                required
              />
            </div>
            <div className={`flex col w_full items-stretch ${styles.group}`}>
              <label htmlFor="email" className="text_primary">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="admin@company.com"
                autoComplete="email"
                required
              />
            </div>
            <div className={`flex col w_full items-stretch ${styles.group}`}>
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
            <div className={`flex col w_full items-stretch ${styles.group}`}>
              <button
                type="submit"
                disabled={isLoading}
                className={`button primary flex gap2 ${styles.submit_button}`}
              >
                {isLoading ? (
                  <>
                    Creating
                    <div className="loading"></div>
                  </>
                ) : (
                  "Create Organization"
                )}
              </button>
            </div>

            <div className={styles.link}>
              <Link className={styles.submit_button} to="/login">
                Already have an account?
              </Link>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};

export default CreateOrg;
