import React from 'react';

const Header = (props) => {
  let first;
  let firstFormat;
  let last;
  let name;
  if (props.user && props.user.firstName) {
    first = props.user.firstName;
    firstFormat = `${first} `;
    last = props.user.lastName;
    name = firstFormat.concat(last);
  }
  
  if (props.user) {
    return(
    <div className="header">
      <div className="bounds">
        <h1 className="header--logo"><a className="header--logo" href='/'>Courses</a></h1>
        <nav><a className="signout" href="/signout">Welcome {name}, Sign Out?</a></nav>
      </div>
    </div>
    )  
  } else {
    return (
      <div className="header">
        <div className="bounds">
          <h1 className="header--logo">Courses</h1>
          <nav><a className="signup" href="/signup">Sign Up</a><a className="signin" href="/signin">Sign In</a></nav>
        </div>
      </div>
    ) 
  }
  
}

export default Header;