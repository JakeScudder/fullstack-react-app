import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function PrivateRoute ({ component: Component, authenticated, ...rest}) {
  const check = () => {
    if(authenticated) {
      console.log("User is Authenticated")
    }
    return null;
  }

  check();

  return (
    <Route {...rest} render={props => (
      authenticated === true ? 
      <Component {...props} />
      : <Redirect to={{
        pathname: '/signin',
        state: { from: props.location },
      }}/>
    )} />
  );
};

export default PrivateRoute;