import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class UserSignUp extends Component {

  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      emailAddress: "",
      password: "",
      confirmPassword: "",
      passwordError: null,
      formatMessage: null,
      loading: true
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
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

  handleAuth = (email, password, data) => {
    this.props.updateState(email, password, data);
  }
  //Sign in user after signing up
  handleSignIn = async () => {
    let email = this.state.emailAddress;
    let password = this.state.password;
    const response = await this.apiFunction('http://localhost:5000/api/users', 'GET', null, true, {email, password});
    if (response.status === 200) {
      return response.json().then(data => {
        this.handleAuth(email, password, data);
        return <Redirect to="/courses"/>;
      });
    }
    else if (response.status === 401) {
      return null;
    } else if (response.status === 500) {
      this.props.history.push('/error')
    }
    else {
      throw new Error();
    }
  }
  
  //User Sign Up Form
  handleSignUp = async (event) => {
    const {firstName, lastName, emailAddress, password} = this.state;
    //create user 
    const user = {
      firstName, lastName, emailAddress, password,
    };
    const response = await this.apiFunction('http://localhost:5000/api/users', 'POST', user);
    if (response.status === 201) {
      this.handleSignIn();
      this.props.history.push('/');
      return null;
    }
    else if (response.status === 400) {
      response.json().then(data => ({
        data: data,
        status: response.status
      })
      ).then(res => {
          console.log(res.data.errors);
          let errors = res.data.errors;
          if(this.mounted) {
            this.setState({
              formatMessage: errors
            }) 
          }
        });
        return null; 
    } else if (response.status === 500) {
      this.props.history.push('/error')
    }
    else {
      throw new Error();
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({formatMessage: null})
    this.confirm()
      
    
  }

  handleCancel = (event) => {
    event.preventDefault();
    window.location.href = "/";
  }

  confirm = () => {
    if (this.state.password === this.state.confirmPassword && this.state.password !== "") {
      this.setState({passwordError: null})
      this.handleSignUp();
      return null;
    } else {
      console.log("Passwords do not match")
      this.setState({
        passwordError: "The passwords do not match, please try again."
      })
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
            <div>
            { (this.state.formatMessage || this.state.passwordError)
            ?
              <h2 className="validation--errors--label">Validation errors</h2>
              : null
            }
                <div className="validation-errors">
                  <ul>
                    { (this.state.formatMessage) 
                    ?  <div>
                        { this.state.formatMessage.map((error, index) => {
                        return <li key={index}>{error}</li>
                        })}
                      </div>
                    :  null
                    }
                    { (this.state.passwordError)
                    ? <div>
                      <li>{this.state.passwordError}</li>
                    </div>
                    : null
                    } 
                  </ul>
                </div>
              </div>
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