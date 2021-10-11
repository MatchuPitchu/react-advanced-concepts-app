import { useState, useEffect, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

// function expression outside of component because inside of reducer fn I don't need any
// data that is generated inside of component fn
const emailReducer = (prevState, action) => {
  // condition defined based on action parameter and a related wished state update return
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') };
  }
  if (action.type === 'INPUT_BLUR') {
    // it is guaranteed that prevState parameter is the last state snapshot
    return { value: prevState.value, isValid: prevState.value.includes('@') };
  }
  return { value: '', isValid: false };
};

const passwordReducer = (prevState, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === 'INPUT_BLUR') {
    return {
      value: prevState.value,
      isValid: prevState.value.trim().length > 6,
    };
  }
  return { value: '', isValid: false };
};

const Login = ({ onLogin }) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(
    emailReducer, // reducer function
    { value: '', isValid: null } // initial state
  );

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  });

  // in useEffect I need only valid values as the dependencies;
  // only if valid states change, useEffect reruns;
  // I use destructuring with aliases to extract the valid values
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    // debounce user input with setTimeout;
    // now validation is not executed on every key stroke
    const timerId = setTimeout(() => {
      // set to true if both conditions are true
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);
    // need clean up function for setTimeout that is executed BEFORE useEffect runs the next time
    // OR BEFORE the component is removed from the DOM (-> is unmounted);
    // save setTimeout above in variable and for next key stroke that's cleared
    // that I have only one ongoing timer at a time
    return () => clearTimeout(timerId);

    // set all changable variables as dependencies, useEffect reruns if one of them changes
  }, [emailIsValid, passwordIsValid]);

  // 1a) using useState state management, NOT useReducer
  // const emailHandler = ({ target }) => setEnteredEmail(target.value);
  // const passwordHandler = ({ target }) => setEnteredPassword(target.value);

  // 1b) use case for useReducer
  const emailHandler = ({ target }) => {
    // setEnteredEmail(target.value);

    // dispatchFn of useReducer to define an action;
    // here I'm using an obj with type key that describes what happpens AND a payload (-> here a value the user entered)
    dispatchEmail({
      type: 'USER_INPUT',
      val: target.value,
    });

    // this NOT needed here, better in useEffect with dependencies of related states
    // update of formIsValid depends on 2 other variables, not the previous state of formIsValid;
    // here update code could in some rare cases run before enteredPasswort state update was processed;
    // that's because of how React scheduldes updates; so finally good use case of useReducer
    // setFormIsValid(target.value.includes('@') && passwordIsValid);
  };

  const passwordHandler = ({ target }) => {
    // setEnteredPassword(target.value);
    dispatchPassword({
      type: 'USER_INPUT',
      val: target.value,
    });

    // this NOT needed here, better in useEffect with dependencies of related states
    // setFormIsValid(emailIsValid && target.value.trim().length > 6);
  };

  // two validate functions included state updates that depends on other states
  // not good practice, because in some scenarios I could update validate state with some outdated state;
  const validateEmailHandler = () => {
    // setEmailIsValid(enteredEmail.includes('@'));
    dispatchEmail({
      type: 'INPUT_BLUR', // action happens when focus is blurred, so I call type 'INPUT_BLUR'
      // value definition not needed here for action definition
    });
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);
    dispatchPassword({ type: 'INPUT_BLUR' });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // onLogin(enteredEmail, enteredPassword);
    onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor='email'>E-Mail</label>
          <input
            type='email'
            id='email'
            value={emailState.value}
            onChange={emailHandler}
            // onBlur is activated when input loses focus
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={passwordState.value}
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
