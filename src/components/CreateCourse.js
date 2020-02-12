import React, { Component } from 'react';

class CreateCourse extends Component {
  constructor(props) {
    super(props);
      this.state = {
        userId: this.props.name.id,
        title: "",
        description: "",
        estimatedTime: "",
        materialsNeeded: "",
      };
    }

  handleCancel = (event) => {
    event.preventDefault();
    this.props.history.push('/');
  }

  //Helper function to handle state of inputs
  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  apiFunction(path, method, body = null, requiresAuth = true, credentials = null) {
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
    return fetch(path, options);
  }

  handleUpdate = async () => {
    debugger
    const {
      userId,
      title,
      description,
      estimatedTime,
      materialsNeeded,
    } = this.state;
    
    let email = this.props.user.email;
    let password = this.props.user.password;
    let url = `http://localhost:5000/api/courses`

    const response = await this.apiFunction(url, 'POST', {userId, title, description, estimatedTime, materialsNeeded}, true, { email, password });
    if (response.status === 201) {
      this.props.history.push('/');
    } else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.handleUpdate();
  }

  render() {
    let firstName = this.props.name.firstName;
    let lastName = this.props.name.lastName;
    let name = `${firstName} ${lastName}`
    return (
      <div className="bounds course--detail">
      <h1>Create Course</h1>
      <div>
        <div>
          <h2 className="validation--errors--label">Validation errors</h2>
          <div className="validation-errors">
            <ul>
              <li>Please provide a value for "Title"</li>
              <li>Please provide a value for "Description"</li>
            </ul>
          </div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." onChange={this.handleChange}
                  value={this.state.title}/></div>
              <p>{name}</p>
            </div>
            <div className="course--description">
              <div><textarea id="description" name="description" className="" placeholder="Course description..." onChange={this.handleChange} value={this.state.description}></textarea></div>
            </div>
          </div>
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                <li className="course--stats--list--item">
                  <h4>Estimated Time</h4>
                  <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                      placeholder="Hours" onChange={this.handleChange} value={this.state.estimatedTime}/></div>
                </li>
                <li className="course--stats--list--item">
                  <h4>Materials Needed</h4>
                  <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." onChange={this.handleChange} value={this.state.materialsNeeded}></textarea></div>
                </li>
              </ul>
            </div>
          </div>
          <div className="grid-100 pad-bottom"><button className="button" type="submit">Create Course</button><button className="button button-secondary" onClick={this.handleCancel}>Cancel</button></div>
        </form>
      </div>
      </div>
    )
  }
}

export default CreateCourse;