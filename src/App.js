import React, { useReducer, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';
import Menu from './components/Layout/Menu/Menu';
import Layout from './components/Layout/Layout';
import Footer from './components/Layout/Footer/Footer';
import AuthContext from './context/authContext';
import ReducerContext from './context/reducerContext';
import { reducer, initialState } from './reducer';
import Home from './pages/Home/Home';
import NotFound from './pages/404/404';
import Login from './pages/Auth/Login/Login';
import ErrorBoundary from './hoc/ErrorBoundary';
import Register from './pages/Auth/Register/Register';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const menu = <Menu />;
  const footer = <Footer />;

  const content = (

    <ErrorBoundary>
        <Switch>
          <Route path="/zaloguj" component={Login} />
          <Route path="/rejestracja" component={Register} />
          <Route path="/" exact component={Home} />
          <Route component={NotFound} />
        </Switch>
    </ErrorBoundary>
  );

  return (
    <Router>
      <AuthContext.Provider value={{
        user: state.user,
        login: (user) => dispatch({ type: 'login', user }),
        logout: () => dispatch({ type: 'logout' })
      }}>
          <ReducerContext.Provider value={{
            state: state,
            dispatch: dispatch
          }}>

            <Layout
              menu={menu}
              content={content}
              footer={footer}
            />
          </ReducerContext.Provider>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
