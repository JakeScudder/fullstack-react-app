import React, { Component } from 'react';

// import { Redirect } from 'react-router-dom';

class UserSignIn extends Component {

  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      loading: true
    };
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

  handleCancel = (event) => {
    event.preventDefault();
    window.location.href = "#/courses";
  }

  handleEmail = (e) => {
    this.setState({
      email: e.target.value
    }) 
  }

  handlePassword = (e) => {
    this.setState({
      password: e.target.value
    }) 
  }

  handleAuth = (data) => {
    this.props.updateState(data);
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.handleSignIn();
  }

  handleSignIn = async () => {
    let email = this.state.email;
    let password = this.state.password;
    const response = await this.apiFunction('http://localhost:5000/api/users', 'GET', null, true, {email, password});
    if (response.status === 200) {
      return response.json().then(data => {
        console.log(data);
        this.handleAuth(data);
        return window.location.href = "#/courses";
      });
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }

  render() {
    return(
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <div>
            <form onSubmit={this.handleSubmit}>
              <div><input id="emailAddress" name="emailAddress" type="text" onChange={this.handleEmail} className="" placeholder="Email Address" value={this.state.email}/></div>
              <div><input id="password" name="password" type="password" className="" onChange={this.handlePassword}placeholder="Password" value={this.state.password}/></div>
              <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign In</button><button className="button button-secondary" onClick={this.handleCancel}>Cancel</button></div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>Don't have a user account? <a href="#/signup">Click here</a> to sign up!</p>
        </div>
      </div>
    )
  }

}

export default UserSignIn;