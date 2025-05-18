// pages/login.js
"use client";

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Head from 'next/head';
import styles from './LoginSignup.module.css';
import { Mail, Lock, LogIn, ArrowRight, User, UserPlus, Gamepad2 } from 'lucide-react';

// Create a client component that safely uses useSearchParams
function LoginSignupContent({ defaultMode = "login" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [callbackUrl, setCallbackUrl] = useState('');
  const [mode, setMode] = useState(defaultMode);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Extract and store callbackUrl from query parameters
  useEffect(() => {
    const callback = searchParams.get('callbackUrl');
    setCallbackUrl(callback || '/');
  }, [searchParams]);

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

    if (mode === 'signup') {
      if (!name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (confirmPassword !== password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleLogin = async (e) => {
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
        // Redirect to role selection page after login
        setTimeout(() => router.push('/role-selection'), 1000);
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

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Here you would typically call your API to register the user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      setNotification({ 
        type: 'success', 
        message: 'Account created successfully! Logging you in...' 
      });
        // Auto login after successful signup
      setTimeout(async () => {
        await signIn('credentials', {
          redirect: true,
          email,
          password,
          callbackUrl: '/role-selection' // Redirect to role selection
        });
      }, 1500);
      
    } catch (error) {
      setNotification({ 
        type: 'error', 
        message: error.message || 'Registration failed. Please try again.' 
      });
      setIsLoading(false);
    }
  };
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signIn('google', { 
      callbackUrl: '/role-selection' // Redirect to role selection page after Google login
    }).catch(() => {
      setNotification({ 
        type: 'error', 
        message: 'Google sign-in failed. Please try again.' 
      });
      setIsLoading(false);
    });
  };

  const switchMode = (newMode) => {
    if (mode === newMode) return;
    
    setIsTransitioning(true);
    // Clear form fields and errors when switching modes
    setErrors({});
    setNotification({ type: '', message: '' });
    
    // Use setTimeout to wait for transition out animation to complete
    setTimeout(() => {
      setMode(newMode);
      setIsTransitioning(false);
    }, 300); // Match this with your CSS transition time
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{mode === 'login' ? 'Login' : 'Sign Up'} | GamesHub</title>
        <meta name="description" content={mode === 'login' ? 'Login to access your GamesHub account' : 'Create a new GamesHub account'} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`${styles.authCard} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}>
        <div className={styles.logoContainer}>
          <Gamepad2 className={styles.logoIcon} strokeWidth={2} size={28} />
          <h1 className={styles.logo}>Yokcash</h1>
        </div>
        
        <h2 className={styles.title}>
          {mode === 'login' ? 'Welcome back' : 'Create an account'}
        </h2>
        <p className={styles.subtitle}>
          {mode === 'login' 
            ? 'Enter your credentials to access your account' 
            : 'Fill in your information to get started'}
        </p>
        
        {notification.message && (
          <div 
            className={`${styles.notification} ${styles[notification.type]}`}
            role="alert"
          >
            {notification.message}
          </div>
        )}
        
        <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className={styles.form}>
          {mode === 'signup' && (
            <div className={styles.inputGroup}>
              <User className={styles.inputIcon} size={18} />
              <input
                type="text"
                id="name"
                name="name"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                aria-label="Full Name"
                aria-describedby={errors.name ? "name-error" : undefined}
                autoComplete="name"
              />
              {errors.name && (
                <span className={styles.errorMessage} id="name-error">
                  {errors.name}
                </span>
              )}
            </div>
          )}
          
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
              autoComplete={mode === 'login' ? "current-password" : "new-password"}
            />
            {errors.password && (
              <span className={styles.errorMessage} id="password-error">
                {errors.password}
              </span>
            )}
          </div>
          
          {mode === 'signup' && (
            <div className={styles.inputGroup}>
              <Lock className={styles.inputIcon} size={18} />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                aria-label="Confirm Password"
                aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <span className={styles.errorMessage} id="confirm-password-error">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          )}
          
          {mode === 'login' && (
            <div className={styles.formOptions}>
              <div className={styles.rememberMe}>
                <input type="checkbox" id="remember" className={styles.checkbox} />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="/forgot-password" className={styles.forgotPassword}>
                Forgot password?
              </a>
            </div>
          )}
          
          <button 
            type="submit" 
            className={styles.authButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.spinnerContainer}>
                <span className={styles.spinner}></span>
                <span>{mode === 'login' ? 'Logging in' : 'Signing up'}</span>
              </span>
            ) : (
              <>
                {mode === 'login' ? (
                  <>
                    Log In 
                    <LogIn className={styles.buttonIcon} size={18} />
                  </>
                ) : (
                  <>
                    Sign Up 
                    <UserPlus className={styles.buttonIcon} size={18} />
                  </>
                )}
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
          {mode === 'login' ? 'Sign in' : 'Sign up'} with Google
        </button>
        
        <p className={styles.switchModeText}>
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          {" "}
          <button 
            type="button"
            onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
            className={styles.switchModeLink}
          >
            {mode === 'login' ? 'Sign up' : 'Log in'} <ArrowRight size={14} className={styles.arrowIcon} />
          </button>
        </p>
      </div>
    </div>
  );
}

// Export a wrapper component that includes Suspense
export default function LoginSignup({ defaultMode = "login" }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginSignupContent defaultMode={defaultMode} />
    </Suspense>
  );
}