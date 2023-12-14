import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import handleInputChange from './Utilits/handleInputChange';
import Cookies from 'js-cookie';

// eslint-disable-next-line react/prop-types
const RegistrationForm = ({ setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [name, setName] = useState('');
  const [isValidName, setIsValidName] = useState(true);
  const [password, setPassword] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidForm, setIsValidForm] = useState(true);
  const [isPending, setIsPending] = useState(false);

  // variables for checking whether data base already has this name or email
  const [nameAlreadyUsed, setNameAlreadyUsed] = useState(false);
  const [emailAlreadyUsed, setEmailAlreadyUsed] = useState(false);

  // if user already logged => redirect to main page
  useEffect(() => {
    const storedUser = Cookies.get('user');
    if (storedUser) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // all inputs' validations
  const validateName = () => {
    name.length < 4 ? setIsValidName(false) : setIsValidName(true);
  };
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    setIsValidEmail(isValid);
  };
  const validatePassword = () => {
    password.length < 8 ? setIsValidPassword(false) : setIsValidPassword(true);
  };

  // function for triggering animation on button
  const invalidForm = () => {
    setIsPending(true);
    setIsValidForm(false);
    setTimeout(() => {
      setIsPending(false);
      setIsValidForm(true);
    }, 500);
  };

  // function for checking if db already has this user
  const checkDataBase = (data, userData) => {
    let isNameUsed = false;
    let isEmailUsed = false;
    data.forEach((account) => {
      if (account.name === userData.name) {
        isNameUsed = true;
      }
      if (account.email === userData.email) {
        isEmailUsed = true;
      }
    });

    return { isNameUsed, isEmailUsed };
  };

  const handleRegistration = (event) => {
    event.preventDefault();
    validateName();
    validateEmail();
    validatePassword();
    if (name.length >= 4 && password.length >= 8 && isValidEmail) {
      setIsPending(true);
      setIsValidForm(true);
      const date = new Date();
      const currentMinutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      const registrationDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${currentMinutes}`;
      // const bio = '';
      const userData = {
        name,
        email,
        password,
        registrationDate,
        bio: '',
      };

      fetch('http://localhost:8000/accounts')
        .then((response) => {
          return response.json();
        })
        .then((answer) => {
          const { isNameUsed, isEmailUsed } = checkDataBase(answer, userData);

          if (isNameUsed) {
            throw 'Name already taken';
          } else if (isEmailUsed) {
            throw 'Email already used';
          }

          // we ned to get ID from json-server
          const getId = async () => {
            const response = await fetch('http://localhost:8000/accounts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(userData),
            });
            const postedData = await response.json();
            userData.id = postedData.id;

            Cookies.set('user', JSON.stringify(userData));
            setUser(userData);
            navigate('/');
            setIsPending(false);
          };
          getId();
        })
        .catch((error) => {
          invalidForm();

          switch (error) {
            case 'Name already taken':
              setNameAlreadyUsed(true);
              break;
            case 'Email already used':
              setEmailAlreadyUsed(true);
              break;
          }
        });
    } else {
      invalidForm();
    }
  };

  return (
    <div className='registration__container'>
      <div className='registration'>
        <h1 className='registration__title'>Registration</h1>
        <form action='' className='registration__form form'>
          <label htmlFor='name' className='input-label'>
            Your name
          </label>
          {!isValidName && <p className='form__invalid-warning'>Invalid name</p>}
          {nameAlreadyUsed && <p className='form__invalid-warning'>Name already taken</p>}
          <input
            type='text'
            className='form__input name-input'
            id='name'
            placeholder='Name'
            minLength={4}
            maxLength={20}
            required={true}
            value={name}
            onChange={(event) => {
              handleInputChange(setName, event);
              if (nameAlreadyUsed) {
                setNameAlreadyUsed(false);
              }
            }}
            onBlur={validateName}
          />
          <label htmlFor='email' className='input-label'>
            Email address
          </label>
          {!isValidEmail && <p className='form__invalid-warning'>Invalid email</p>}
          {emailAlreadyUsed && <p className='form__invalid-warning'>Email already used</p>}
          <input
            type='email'
            className='form__input email-input'
            id='email'
            placeholder='Email'
            required={true}
            value={email}
            onChange={(event) => {
              handleInputChange(setEmail, event);
              if (emailAlreadyUsed) {
                setEmailAlreadyUsed(false);
              }
            }}
            onBlur={validateEmail}
          />
          <label htmlFor='password' className='input-label'>
            Password
          </label>
          {!isValidPassword && <p className='form__invalid-warning'>Invalid password</p>}
          <input
            type='password'
            className='form__input password-input'
            id='password'
            placeholder='Password'
            minLength={8}
            maxLength={20}
            required={true}
            value={password}
            onChange={(event) => {
              handleInputChange(setPassword, event);
            }}
            onBlur={validatePassword}
          />
          <p className='form__already-registered'>
            Already have an account? <Link to='/login'>Log in!</Link>
          </p>
          <div className='submit__container'>
            <input
              type='submit'
              value='Submit'
              disabled={isPending}
              className={!isValidForm ? 'form__submit submit submit-invalid' : 'form__submit submit'}
              onClick={(event) => {
                handleRegistration(event);
              }}
            />
          </div>
        </form>
        <div className='registration__navigations'>
          <button
            className='registration__previous-page previous-page'
            onClick={() => {
              navigate(-1);
            }}
          >
            <img src='src/images/back-arrow.svg' alt='<' />
            Back
          </button>
          <Link to='/' className='registration__go-main'>
            Main page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
