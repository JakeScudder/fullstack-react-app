import React, { Component } from 'react';
import axios from 'axios';

class UpdateCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId: this.props.courseId,
      title: "",
      description: "",
      estimatedTime: "",
      materialsNeeded: "",
      formatMessage: null,
    };
  }

  componentDidMount() {
    this.handleFetchCourse();
  }

  checkPermissions = () => {
    debugger
    console.log(this.props.name)
    console.log(this.state.course)
    if (this.props.name&& this.state.course) {
      let userId = this.props.name.id
      let courseOwner = this.state.course.userId;
      if (userId !== courseOwner) {
        this.props.history.push('/forbidden');
      } 
    } 
  }

  handleCancel = (event) => {
    event.preventDefault();
    this.props.history.push('/courses');
  }

   // Fetch individual Courses
   handleFetchCourse = () => {
    // let query = this.state.courseId;
    let query = this.props.match.params.id;
    this.setState({
      loading: true,
    })
    console.log(this.props.match.params.id);
    axios.get(`http://localhost:5000/api/courses/${query}`)
      .then(res => {
          this.setState({
            course: res.data,
            title: res.data.title,
            description: res.data.description,
            estimatedTime: res.data.estimatedTime,
            materialsNeeded: res.data.materialsNeeded,
            loading: false
          }) 
          this.checkPermissions(); 
        }
        
      )
    .catch(error => {
      console.log('Error fetching and parsing data', error);
      this.props.history.push('/notfound');
    })
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
    return fetch(path, options);
  }

  handleUpdate = async () => {
    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
    } = this.state;
    
    let email = this.props.user.email;
    let password = this.props.user.password;
    let courseId = this.state.id;
    let url = `http://localhost:5000/api/courses/${courseId}`
    console.log(url);

    const response = await this.apiFunction(url, 'PUT', {title, description, estimatedTime, materialsNeeded}, true, { email, password });
    if (response.status === 204) {
      this.props.history.push('/');
    } else if (response.status === 400) {
      response.json().then(data => ({
        data: data,
        status: response.status
      })
      ).then(res => {
        console.log(res.data.errors);
        let errors = res.data.errors;
        this.setState({
          formatMessage: errors
        }) 
      });
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
    let course = this.state.course
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
          <div>
          { (this.state.formatMessage)
          ?
              <h2 className="validation--errors--label">Validation errors</h2>
              : null
          }
              <div className="validation-errors">
                <ul>
                  { (this.state.formatMessage) 
                  ?  <li>
                      { this.state.formatMessage.map(error => {
                      return <li>{error}</li>
                      })}
                    </li>
                  :  null
                  } 
                </ul>
              </div>
            </div>
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
                        placeholder="Hours" onChange={this.handleChange} value={this.state.estimatedTime}/></div>
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