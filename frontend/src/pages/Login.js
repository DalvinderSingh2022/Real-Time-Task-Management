import React, { useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from "axios";

import styles from "./../styles/auth.module.css";

import { AuthContext } from '../store/AuthContext';

const Login = () => {
    const { authState, login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handlesubmit = (e) => {
        e.preventDefault();
        const user = {
            email: e.target.email.value,
            password: e.target.password.value
        }

        axios.put("http://localhost:4000/api/users/login", user)
            .then(({ data }) => {
                const { name, email } = data.user;
                login({ name, email });
                localStorage.setItem("jwt", data.token);
                navigate("/");
            })
            .catch((error) => {
                console.error(error);
            });
    }

    if (authState.authenticated) {
        return <Navigate to="/" />
    }

    return (
        <div className="flex full-container">
            <section className={`flex col gap ${styles.container}`}>
                <div>
                    <div className={`w-full ${styles.heading}`}>Welcome back</div>
                    <div className={`w-full ${styles.sub_heading}`}>Please enter your details.</div>
                </div>
                <form className={`flex col gap w-full ${styles.form}`} onSubmit={(e) => handlesubmit(e)}>
                    <div className={`flex col w-full ${styles.group}`}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id='email'
                            name='email'
                            placeholder='exapmle@domain.com'
                        />
                    </div>
                    <div className={`flex col w-full ${styles.group}`}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id='password'
                            name='password'
                            placeholder='12345678'
                        />
                    </div>

                    <div className={`flex col w-full ${styles.group}`}>
                        <button type='submit' className={`btn primary ${styles.submit_button}`}>Log In</button>
                    </div>

                    <div className={styles.link}>
                        Don’t have an account?
                        <Link to='/register' className={styles.submit_button}>register</Link>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default Login;