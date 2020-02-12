import React, { Component } from 'react';

class UserSignUp extends Component {

  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      emailAddress: "",
      password: "",
      confirmPassword: "",
      loading: true
    };
  }

  handleCancel = (event) => {
    event.preventDefault();
    window.location.href = "#/courses";
  }

   //I didn't know how to write my own version of this helper function, but it is pretty much identical to the workshop
   apiFunction(path, method = 'GET', body = null, requiresAuth = false, credentials = null ) {
    const options = {
      method, 
      headers: {
        'Content-Type': 'application/json; charset=utf-8', 
      }
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (requiresAuth) {    
      const encodedCredentials = btoa(`${credentials.email}:${credentials.password}`);
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }
    return fetch("http://localhost:5000/api/users", options);
  }

  //Handle input change
  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  handleAuth = (email, password) => {
    this.props.updateState(email, password);
  }
  //Sign in user after signing up
  handleSignIn = async () => {
    let email = this.state.emailAddress;
    let password = this.state.password;
    const response = await this.apiFunction('http://localhost:5000/api/users', 'GET', null, true, {email, password});
    if (response.status === 200) {
      // return response.json().then(data => {
      //   console.log(data);
        this.handleAuth(email, password);
        return;
      // });
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }
  
  //User Sign Up Form
  handleSubmit = async (event) => {
    debugger
    const {firstName, lastName, emailAddress, password} = this.state;
    //create user 
    const user = {
      firstName, lastName, emailAddress, password,
    };
    event.preventDefault();
    const response = await this.apiFunction('http://localhost:5000/api/users', 'POST', user);
    if (response.status === 201) {
      this.handleSignIn();
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

  confirm = () => {
    if (this.state.password === this.state.confirmPassword) {
      return true
    } else {
      return false
    }
  }

  render() {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
    } = this.state;

    return(
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          <div>
            <form onSubmit={this.handleSubmit}>
              <div><input id="firstName" name="firstName" type="text" onChange={this.handleChange} className="" placeholder="First Name" value={firstName}/></div>
              <div><input id="lastName" name="lastName" type="text" onChange={this.handleChange} className="" placeholder="Last Name" value={lastName}/></div>
              <div><input id="emailAddress" name="emailAddress" type="text" onChange={this.handleChange} className="" placeholder="Email Address" value={emailAddress}/></div>
              <div><input id="password" name="password" type="password" onChange={this.handleChange} className="" placeholder="Password" value={password}/></div>
              <div><input id="confirmPassword" name="confirmPassword" type="password" onChange={this.handleChange} className="" placeholder="Confirm Password" value={confirmPassword}/></div>
              <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign Up</button><button className="button button-secondary" onClick={this.handleCancel}>Cancel</button></div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>Already have a user account? <a href="sign-in.html">Click here</a> to sign in!</p>
        </div>
      </div>
    )
  }

}

export default UserSignUp;