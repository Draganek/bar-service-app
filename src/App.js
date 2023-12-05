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
import BillDetails from './pages/Bills/BillDetails/BillDetails';
import AddDrink from './pages/Services/Worker/DrinkDatabase/AddDrink/AddDrink';
import EditDrink from './pages/Services/Worker/DrinkDatabase/EditDrink/EditDrink'
import DrinkInfo from './pages/Drinks/DrinkInfo/DrinkInfo';
import Drinks from './pages/Drinks/Drinks';
import Services from './pages/Services/Services';
import Admin from "./pages/Services/Admin/Admin"
import StafRoute from './hoc/StafRoute/StafRoute';
import Bills from './pages/Bills/Bills';
import Profile from './pages/Profile/Profile'
import BillService from './pages/Services/Worker/Approvals/BillService/BillService'

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const menu = <Menu />;
  const footer = <Footer />;

  const content = (

    <ErrorBoundary>
      <Suspense fallback={<p>Ładowanie...</p>}>
        <Switch>

          <StafRoute path="/services/admin" component={Admin} perm={2} />
          <StafRoute path="/services/drinks_database/edytuj/:id" component={EditDrink} perm={1} />
          <StafRoute path="/services/drinks_database/dodaj" component={AddDrink} perm={1} />
          <StafRoute path="/services/bill/:id" component={BillService} perm={1} />
          <StafRoute path="/services" component={Services} perm={1} />
          <AuthenticatedRoute path="/profil" component={Profile} />
          <AuthenticatedRoute path="/bills/:id" component={BillDetails} />
          <AuthenticatedRoute path="/bills" component={Bills} />
          <Route path="/drinks/show/:id" component={DrinkInfo} />
          <Route path="/drinks" component={Drinks} />
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
