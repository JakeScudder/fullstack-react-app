import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

class CourseDetail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      showing: null,
      canUpdateOrDelete: null,
      courseId: this.props.match.params.id,
      course: [],
    } 
  }

  componentDidMount() {
    // setTimeout(this.userMatchCourseOwner, 500);
    this.handleFetchCourse();
  }

  errorHandler(res) {
    if (res.status === 500) {
      let error = new Error();
      error.status = 500;
      throw error;
    }
    return res;
  }

  // Fetch individual Courses
  handleFetchCourse = () => {
    let query = this.state.courseId;
    this.setState({
      loading: true,
    })
    axios.get(`http://localhost:5000/api/courses/${query}`)
      .then(this.errorHandler)
      .then(res => {
          this.setState({
            course: res.data,
            loading: false
          }) 
          setTimeout(this.userMatchCourseOwner, 500);
      })
    .catch(error => {
      if (error.status === 500) {
        this.props.history.push('/error');
      } else {
        console.log('Error fetching and parsing data', error);
        this.props.history.push('/notfound');
      }
    })
  }

  userMatchCourseOwner = () => {
    if (this.props.user && this.state.course) {
      let userId = this.props.user.id
      let courseOwner = this.state.course.userId;
      if (userId === courseOwner) {
        this.setState({
          canUpdateOrDelete: true,
        })
      } 
    } else {
      // this.props.history.push('/notfound')
      return null;
    }
  }

  areYouSure = () => {
   if (!this.state.showing) {
     this.setState({
       showing: true
     })
   } else {
    this.setState({
      showing: false
    })
   }
  }

  //Handles Deletion
  handleDeletion = async () => {
    debugger
    let email = this.props.authUser.email;
    let password = this.props.authUser.password;
    let courseId = this.state.courseId;
    let url = `http://localhost:5000/api/courses/${courseId}`

    const response = await this.apiFunction(url, 'DELETE', null, true, { email, password });
    if (response.status === 204) {
      window.location.href = "/";
    } else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }

  //Api helper function
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
    return fetch(path, options);
  }

  


  render() {
    let course = this.state.course;
    let description
    let materialsNeeded
    let firstName;
    let lastName;
    let instructor;
    let courseUpdateUrl;

    //Why is there a delay between accessing the nested object?
    //i.e. 
    // let firstName = course.User.firstName 
    // This won't work unless the if statement is run
    if (course && course.User) {
      firstName = course.User.firstName + " ";
      lastName = course.User.lastName;
      instructor = firstName.concat(lastName);
      description = course.description;
      materialsNeeded = course.materialsNeeded;
      courseUpdateUrl = `/courses/${course.id}/update`
    }
    if (course) {
      return(
        <div>
          <div className="actions--bar">
            <div className="bounds">
              <div className="grid-100"><span><a className="button" style={{display: this.state.canUpdateOrDelete ? '' : "none"}} href={courseUpdateUrl}>Update Course</a><button className="button" style={{display: this.state.canUpdateOrDelete ? '' : "none"}} onClick={this.areYouSure}>Delete Course</button></span><a
                  className="button button-secondary" href="/courses">Return to List</a></div>
              <div name="delete-confirmation" style={{display: this.state.showing ? 'block' : "none"}}>
                <h3>Are you sure you want to delete this course?</h3>
                <button onClick={this.handleDeletion}>Yes, delete this course</button>
                <button onClick={this.areYouSure}>No, I don't want to delete this</button>
              </div>
            </div>
          </div>
          <div className="bounds course--detail">
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <h3 className="course--title">{course.title}</h3>
                <p>By {instructor}</p>
              </div>
              <div className="course--description">
                <ReactMarkdown source={description} />
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <h3>{course.estimatedTime}</h3>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <ul>
                      <ReactMarkdown source={materialsNeeded}/>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }  
  }
}

export default CourseDetail;