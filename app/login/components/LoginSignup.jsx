// pages/login.js
"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import styles from './LoginSignup.module.css';
import { Mail, Lock, LogIn, ArrowRight, User } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      });
      
      if (!result || result.error) {
        setNotification({ 
          type: 'error', 
          message: 'Invalid email or password' 
        });
      } else {
        setNotification({ 
          type: 'success', 
          message: 'Login successful!' 
        });
        setTimeout(() => router.push('/dashboard'), 1000);
      }
    } catch (error) {
      setNotification({ 
        type: 'error', 
        message: 'An error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signIn('google', { 
      callbackUrl: '/dashboard'
    }).catch(() => {
      setNotification({ 
        type: 'error', 
        message: 'Google sign-in failed. Please try again.' 
      });
      setIsLoading(false);
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Login | YourApp</title>
        <meta name="description" content="Login to access your YourApp account" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.loginCard}>
        <div className={styles.logoContainer}>
          <User className={styles.logoIcon} strokeWidth={2} />
          <h1 className={styles.logo}>YourApp</h1>
        </div>
        
        <h2 className={styles.title}>Welcome back</h2>
        <p className={styles.subtitle}>Enter your credentials to access your account</p>
        
        {notification.message && (
          <div 
            className={`${styles.notification} ${styles[notification.type]}`}
            role="alert"
          >
            {notification.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <Mail className={styles.inputIcon} size={18} />
            <input
              type="email"
              id="email"
              name="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              aria-label="Email address"
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="email"
            />
            {errors.email && (
              <span className={styles.errorMessage} id="email-error">
                {errors.email}
              </span>
            )}
          </div>
          
          <div className={styles.inputGroup}>
            <Lock className={styles.inputIcon} size={18} />
            <input
              type="password"
              id="password"
              name="password"
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              aria-label="Password"
              aria-describedby={errors.password ? "password-error" : undefined}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className={styles.errorMessage} id="password-error">
                {errors.password}
              </span>
            )}
          </div>
          
          <div className={styles.formOptions}>
            <div className={styles.rememberMe}>
              <input type="checkbox" id="remember" className={styles.checkbox} />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="/forgot-password" className={styles.forgotPassword}>
              Forgot password?
            </a>
          </div>
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.spinnerContainer}>
                <span className={styles.spinner}></span>
                <span>Logging in</span>
              </span>
            ) : (
              <>
                Log In 
                <LogIn className={styles.buttonIcon} size={18} />
              </>
            )}
          </button>
        </form>
        
        <div className={styles.divider}>
          <span>or continue with</span>
        </div>
        
        <button 
          onClick={handleGoogleSignIn} 
          className={styles.googleButton}
          disabled={isLoading}
          type="button"
          aria-label="Sign in with Google"
        >
          <svg className={styles.googleIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          Sign in with Google
        </button>
        
        <p className={styles.signupText}>
          Don't have an account?{" "}
          <a href="/signup" className={styles.signupLink}>
            Sign up <ArrowRight size={14} className={styles.arrowIcon} />
          </a>
        </p>
      </div>
    </div>
  );
}