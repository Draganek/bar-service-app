import React, { useReducer, lazy, Suspense } from 'react';
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
import AuthenticatedRoute from './hoc/AuthenticatedRoute/AuthenticatedRoute';

const Profile = lazy(() => import('./pages/Profile/Profile'));

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const menu = <Menu />;
  const footer = <Footer />;

  const content = (

    <ErrorBoundary>
      <Suspense fallback={<p>Ładowanie...</p>}>
        <Switch>
        <AuthenticatedRoute path="/profil" component={Profile} />
          <Route path="/zaloguj" component={Login} />
          <Route path="/rejestracja" component={Register} />
          <Route path="/" exact component={Home} />
          <Route component={NotFound} />
        </Switch>
        </Suspense>
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
