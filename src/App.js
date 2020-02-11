import React, { Component } from 'react';
import axios from 'axios';
import {
  HashRouter,
  Route,
  Switch,
  Redirect, 
} from 'react-router-dom';

//Auth Route
import PrivateRoute from './PrivateRoute';

//Components
import Header from './components/Header';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';


class App extends Component {

  constructor() {
  super();
    this.state = {
      authenticatedUser: "",
      isAuthenticated: null,
      course: [],
      courses: [],
      loading: true
    };
  }

  componentDidMount() {
    this.handleFetch();
  }

  handleAuthUser = (user) => {
    this.setState({
      authenticatedUser: user,
      isAuthenticated: true
    })
  }

  handleFetch = (query = "") => {
    this.setState({
      loading: true
    })
    axios.get(`http://localhost:5000/api/courses/${query}`)
      .then(res => {
        if (query > 0) {
          // console.log("query exists")
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

  signOut = () => {
    this.setState({ authenticatedUser: null, isAuthenticated: null });
  }

  render() {
    return (
      <HashRouter>
        <Header user={this.state.authenticatedUser}/>
          <div>
          { (this.state.loading) 
            ?  <p className="loading" >Loading...</p>
            :  null
          }
            <Switch>
              <Redirect exact from="/" to="/courses"/>
              <Route 
                exact path="/courses"
                render={(props) => <Courses fetchCourse={this.handleFetch} {...props} data={this.state.courses} /> }
              />
              <PrivateRoute 
                authenticated={this.state.isAuthenticated}
                exact path="/courses/create"
                component={(props) => <CreateCourse {...props} /> }
              />
              
              <Route 
                exact path="/signin"
                render={(props) => <UserSignIn updateState={this.handleAuthUser} {...props} /> }
              />
              <Route 
                exact path="/signup"
                render={(props) => <UserSignUp {...props} updateState={this.handleAuthUser}/> }
              />
              <Route 
                exact path="/courses/:id"
                render={(props) => <CourseDetail {...props}  data={this.state.course} /> }
              />
              <PrivateRoute 
                exact path="/courses/:id/update"
                authenticated={this.state.isAuthenticated}
                component={(props) => <UpdateCourse {...props} authenticated={this.state.isAuthenticated} data={this.state.course}/> }
              />
              <Route path="/signout" render={(props) => <UserSignOut {...props} logOut={this.signOut} />}
              />
            </Switch>
          </div>
      </HashRouter>  
    )
  }
}

export default App;
