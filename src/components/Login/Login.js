import { useState, useEffect } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const Login = ({ onLogin }) => {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState();
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    // debounce user input with setTimeout;
    // now validation is not executed on every key stroke
    const timerId = setTimeout(() => {
      // set to true if both conditions are true
      setFormIsValid(
        enteredEmail.includes('@') && enteredPassword.trim().length > 6
      );
    }, 500);
    // need clean up function for setTimeout that is executed BEFORE useEffect runs the next time
    // OR BEFORE the component is removed from the DOM (-> is unmounted);
    // save setTimeout above in variable and for next key stroke that's cleared
    // that I have only one ongoing timer at a time
    return () => clearTimeout(timerId);

    // set all changable variables as dependencies, so that useEffect reruns if one of them changes
  }, [enteredEmail, enteredPassword]);

  const emailHandler = ({ target }) => setEnteredEmail(target.value);

  const passwordHandler = ({ target }) => setEnteredPassword(target.value);

  const validateEmailHandler = () =>
    setEmailIsValid(enteredEmail.includes('@'));

  const validatePasswordHandler = () =>
    setPasswordIsValid(enteredPassword.trim().length > 6);

  const submitHandler = (e) => {
    e.preventDefault();
    onLogin(enteredEmail, enteredPassword);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailIsValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor='email'>E-Mail</label>
          <input
            type='email'
            id='email'
            value={enteredEmail}
            onChange={emailHandler}
            // onBlur is activated when input loses focus
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordIsValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={enteredPassword}
            onChange={passwordHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type='submit' className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
