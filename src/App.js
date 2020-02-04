import React, { Component } from 'react';
import axios from 'axios';
import {
  HashRouter,
  Route,
  Switch
} from 'react-router-dom';

//Components
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';


class App extends Component {

  constructor() {
  super();
    this.state = {
      course: [],
      courses: [],
      loading: true
    };
  }

  componentDidMount() {
    this.handleFetch();
  }

  handleFetch = (query = "") => {
    console.log(query);
    this.setState({
      loading: true
    })
    axios.get(`http://localhost:5000/api/courses/${query}`)
      .then(res => {
        if (query > 0) {
          console.log("query exists")
          this.setState({
            course: res.data,
            loading: false
          }) 
        } else {
          this.setState({
            courses: res.data.courses,
            loading: false
          }) 
        }
      })
    .catch(error => {
      console.log('Error fetching and parsing data', error)
    })
  }

  render() {
    return (
      <HashRouter>
        <div>
        { (this.state.loading) 
          ?  <p className="loading" >Loading...</p>
          :  null
        }
        <Switch>
          <Route 
            exact path="/courses"
            render={(props) => <Courses fetchCourse={this.handleFetch} {...props} data={this.state.courses} /> }
          />
          <Route 
            exact path="/courses/create"
            render={(props) => <CreateCourse {...props} /> }
          />
          
          <Route 
            exact path="/signin"
            render={(props) => <UserSignIn {...props} /> }
          />
          <Route 
            exact path="/signup"
            render={(props) => <UserSignUp {...props} /> }
          />
          <Route 
            exact path="/courses/:id"
            render={(props) => <CourseDetail {...props}  data={this.state.course} /> }
          />
          <Route 
            exact path="/courses/:id/update"
            render={(props) => <UpdateCourse {...props} /> }
          />
        </Switch>
        </div>
      </HashRouter>  
    )
  }
}

export default App;
