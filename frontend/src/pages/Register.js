import React from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

import styles from "./../styles/auth.module.css";

const Regiter = () => {
    const handlesubmit = (e) => {
        e.preventDefault();
        const user = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        }

        axios.get("http://localhost:4000/api/users/regiter", user)
            .then(() => {
                console.log({ message: 'successfully' });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <div className="flex full-container">
            <section className={`flex col gap ${styles.container}`}>
                <div>
                    <div className={`w-full ${styles.heading}`}>Welcome</div>
                    <div className={`w-full ${styles.sub_heading}`}>Please enter your details.</div>
                </div>
                <form className={`flex col gap w-full ${styles.form}`} onSubmit={(e) => handlesubmit(e)}>
                    <div className={`flex col w-full ${styles.group}`}>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id='name'
                            name='name'
                            placeholder='batman'
                        />
                    </div>
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
                        <button type='submit' className={`btn primary ${styles.submit_button}`}>Register</button>
                    </div>

                    <div className={styles.link}>
                        Already have an account?
                        <Link className={styles.submit_button} to='/login'>login</Link>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default Regiter;