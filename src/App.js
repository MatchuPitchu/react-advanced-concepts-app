import { Fragment, useContext } from 'react';
import AuthContext from './context/auth-context';

import Login from './components/Login/Login';
import Home from './components/Home/Home';
import MainHeader from './components/MainHeader/MainHeader';

const App = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Fragment>
      <MainHeader />
      <main>
        {!isLoggedIn && <Login />}
        {isLoggedIn && <Home />}
      </main>
    </Fragment>
  );
};

export default App;
