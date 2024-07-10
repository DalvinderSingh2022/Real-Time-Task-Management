import React, { useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from "axios";

import styles from "./../styles/auth.module.css";

import Toast from '../components/Toast';
import { AuthContext } from '../store/AuthContext';
import { AppContext } from '../store/AppContext';

const Register = () => {
    const { authState, login } = useContext(AuthContext);
    const { addToast } = useContext(AppContext);
    const navigate = useNavigate();

    const handlesubmit = (e) => {
        e.preventDefault();
        const user = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        }

        axios.post("http://localhost:4000/api/users/register", user)
            .then(({ data }) => {
                login(data.user);
                localStorage.setItem("jwt", data.token);
                navigate("/");
            })
            .catch((error) => {
                addToast({ type: 'error', message: error.response.data.message })
                console.error(error);
            });
    }


    if (authState.authenticated) {
        return <Navigate to="/" />
    }

    return (
        <>
            <Toast />
            <div className="flex full_container">
                <section className={`flex col gap ${styles.container}`}>
                    <div>
                        <div className={`w_full text_primary ${styles.heading}`}>Welcome</div>
                        <div className={`w_full text_secondary ${styles.sub_heading}`}>Please enter your details.</div>
                    </div>
                    <form className={`flex col gap w_full ${styles.form}`} onSubmit={(e) => handlesubmit(e)}>
                        <div className={`flex col w_full ${styles.group}`}>
                            <label htmlFor="name" className='text_primary'>Name</label>
                            <input
                                type="text"
                                id='name'
                                name='name'
                                placeholder='batman'
                            />
                        </div>
                        <div className={`flex col w_full ${styles.group}`}>
                            <label htmlFor="email" className='text_primary'>Email</label>
                            <input
                                type="email"
                                id='email'
                                name='email'
                                placeholder='exapmle@domain.com'
                            />
                        </div>
                        <div className={`flex col w_full ${styles.group}`}>
                            <label htmlFor="password" className='text_primary'>Password</label>
                            <input
                                type="password"
                                id='password'
                                name='password'
                                placeholder='12345678'
                            />
                        </div>

                        <div className={`flex col w_full ${styles.group}`}>
                            <button type='submit' className={`button primary ${styles.submit_button}`}>Register</button>
                        </div>

                        <div className={styles.link}>
                            Already have an account?
                            <Link className={styles.submit_button} to='/login'>login</Link>
                        </div>
                    </form>
                </section>
            </div>
        </>
    )
}

export default Register;