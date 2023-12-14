import { Link, useNavigate } from 'react-router-dom';
import useFetch from './Utilits/useFetch';
import { useEffect, useState } from 'react';
import handleInputChange from './Utilits/handleInputChange';
import Cookies from 'js-cookie';

// eslint-disable-next-line react/prop-types
const LoginForm = ({ setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { data, isPending, setIsPending } = useFetch('http://localhost:8000/accounts');
  const [isValidForm, setIsValidForm] = useState(true);
  const [isEmailExists, setIsEmailExists] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const invalidForm = () => {
    setIsPending(true);
    setIsValidForm(false);
    setTimeout(() => {
      setIsPending(false);
      setIsValidForm(true);
    }, 500);
  };

  // if user already logged => redirect to main page
  useEffect(() => {
    const storedUser = Cookies.get('user');
    if (storedUser) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // checking whether email is valid or not
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email.length < 1 || !validateEmail()) {
      setIsValidEmail(false);
      invalidForm();
      return;
    }
    if (password.length < 7) {
      setIsValidPassword(false);
      invalidForm();
      return;
    }

    const userData = data.find((account) => {
      if (account.email === email) {
        return true;
      }
    });
    if (!userData) {
      invalidForm();
      setIsEmailExists(false);
      return;
    }

    if (userData.password !== password) {
      invalidForm();
      setIsValidPassword(false);
      return;
    }
    Cookies.set('user', JSON.stringify(userData));
    setUser(userData);
    navigate('/');
  };

  return (
    <div className='login__container'>
      <div className='login'>
        <h1 className='login__title'>Log in</h1>
        <form action='' className='login__form form'>
          <label htmlFor='email' className='input-label'>
            Email address
          </label>
          {!isEmailExists && isValidEmail && <p className='form__invalid-warning'>This email is not registered</p>}
          {!isValidEmail && <p className='form__invalid-warning'>Invalid email</p>}
          <input
            type='email'
            className='form__input email-input'
            id='email'
            placeholder='Email'
            required={true}
            onChange={(event) => {
              handleInputChange(setEmail, event);
              if (!isValidEmail) {
                setIsValidEmail(true);
              }
              if (!isEmailExists) {
                setIsEmailExists(true);
              }
            }}
          />
          <label htmlFor='password' className='input-label'>
            Password
          </label>
          {!isValidPassword && <p className='form__invalid-warning'>Incorrect password</p>}
          <input
            type='password'
            className='form__input password-input'
            id='password'
            placeholder='Password'
            minLength={8}
            maxLength={20}
            required={true}
            onChange={(event) => {
              handleInputChange(setPassword, event);
              if (!isValidPassword) {
                setIsValidPassword(true);
              }
            }}
          />
          <p className='form__unregistered'>
            Do not have an account? <Link to='/registration'>Register now!</Link>
          </p>
          <div className='submit__container'>
            <input
              type='submit'
              value='Submit'
              disabled={isPending}
              className={!isValidForm ? 'form__submit submit submit-invalid' : 'form__submit submit'}
              onClick={(event) => {
                handleSubmit(event);
              }}
            />
          </div>
        </form>
        <div className='login__navigations'>
          <button
            className='login__previous-page previous-page'
            onClick={() => {
              navigate(-1);
            }}
          >
            <img src='src/images/back-arrow.svg' alt='<' />
            Back
          </button>
          <Link to='/' className='login__go-main'>
            Main page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
