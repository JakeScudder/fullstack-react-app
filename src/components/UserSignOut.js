import React from 'react';
import { Redirect } from 'react-router-dom';

const UserSignOut = (props) => {
  props.logOut();
  return (
    <Redirect to="/courses" />
  );
}

export default UserSignOut;


