import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, authenticated, ...rest}) => {
  console.log(authenticated);
  console.log(authenticated === true);
  console.log(authenticated.firstName);
  console.log(authenticated.firstName === true)
  
  return (
    <Route 
      {...rest}
      render={(props) => (
        authenticated === true 
        ? <Component {...props} />
        : <Redirect to='/signin' />
      )}
    />
  )
}

export default PrivateRoute;