import React, { Component } from 'react';

class UserSignIn extends Component {

  constructor() {
    super();
      this.state = {
        email: "",
        password: "",
        loading: true
      };
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

  render() {
    return(
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <div>
            <form>
              <div><input id="emailAddress" name="emailAddress" type="text" onChange={this.handleEmail} className="" placeholder="Email Address" value={this.state.email}/></div>
              <div><input id="password" name="password" type="password" className="" placeholder="Password" value={this.state.password}/></div>
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