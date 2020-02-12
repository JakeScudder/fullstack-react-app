import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class UpdateCourse extends Component {
  constructor(props) {
    super(props);
      this.state = {
        title: props.data.title,
        description: props.data.description,
        estimatedTime: props.data.estimatedTime,
        materialsNeeded: props.materialsNeeded,
      };
    }

  handleCancel = (event) => {
    event.preventDefault();
    return <Redirect to="/courses"/>;
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

  apiFunction(path, method = 'PUT', body = null, requiresAuth = true, credentials = null) {
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
    return fetch("http://localhost:5000/api/courses/:id", options);
  }

  handleUpdate = async () => {
    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
    } = this.state;

    let user = this.props.user

    const response = await this.apiFunction("http://localhost:5000/api/courses/:id", 'PUT', {title, description, estimatedTime, materialsNeeded}, true, { user });
    if (response.status === 204) {
      return <Redirect to="/" />
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
    let course = this.props.data
    let firstName;
    let lastName;
    let instructor;

    //Why is there a delay between accessing the nested object?
    //i.e. 
    // let firstName = course.User.firstName 
    // This won't work unless the if statement is run
    if (course && course.User) {
      firstName = course.User.firstName + " ";
      lastName = course.User.lastName;
      instructor = firstName.concat(lastName);
    }

    return(
      <div className="bounds course--detail">
        <h1>Update Course</h1>
        <div>
          <form onSubmit={this.handleSubmit} >
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." onChange={this.handleChange} value={this.state.title}/></div>
                <p>{instructor}</p>
              </div>
              <div className="course--description">
                <div><textarea id="description" name="description" className="" placeholder="Course description..." onChange={this.handleChange} value={this.state.description}></textarea>
                </div>
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                        placeholder="Hours" onChange={this.handleChange} value={this.state.time}/></div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div>
                      <textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." onChange={this.handleChange} value={this.state.materialsNeeded}>
                      </textarea>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid-100 pad-bottom"><button className="button" type="submit">Update Course</button><button className="button button-secondary" onClick={this.handleCancel}>Cancel</button></div>
          </form>
        </div>
      </div>
    )
  }
}

export default UpdateCourse;