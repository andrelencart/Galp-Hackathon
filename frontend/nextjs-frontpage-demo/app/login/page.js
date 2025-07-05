'use client';
import { useState } from 'react';
import Header from '../../components/Header';
import styles from '../../styles/login.module.css';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // For demonstration: handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Username: ${username}\nPassword: ${password}`);
    // Here you would handle login logic
  };

  const handleGoogleSignIn = () => {
    alert('Google Sign-In clicked!');
    // Here you would trigger real Google OAuth
  };

  return (
    <div className={styles.pageWrap}>
      <Header />
      <div className={styles.flexRow}>
        <div className={styles.rightPanel}>
          <form className={styles.loginBox} onSubmit={handleSubmit}>
            <h2 className={styles.loginTitle}>Sign In</h2>
            <label className={styles.label} htmlFor="username">
              Utilizador
            </label>
            <input
              className={styles.input}
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Utilizador"
            />
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              className={styles.input}
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.signInBtn}>
              Sign In
              </button>
              <Link href="/register">
                <button type="button" className={styles.registerBtn}>
                  Registar
                </button>
              </Link>
              <button
                type="button"
                className={styles.googleBtn}
                onClick={handleGoogleSignIn}
              >
                <span className={styles.googleLogo}></span>
                Utilizar conta Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}