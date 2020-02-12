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
import Cookies from 'js-cookie';

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
      authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
      name: Cookies.getJSON('name') || null,
      isAuthenticated: Cookies.getJSON('isAuthenticated') || null,
      course: [],
      courses: [],
      loading: true
    };
  }

  componentDidMount() {
    this.handleFetch();
  }

  handleAuthUser = (email, password, data) => {
    let object = {email, password};
    this.setState({
      authenticatedUser: object,
      isAuthenticated: true,
      name: data,
    })
    console.log(this.state.authenticatedUser);
    Cookies.set('authenticatedUser', JSON.stringify(object), {expires: 1});
    Cookies.set('isAuthenticated' === true, {expires: 1});
    Cookies.set('name', JSON.stringify(data), {expires: 1})
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
    this.setState({ 
      authenticatedUser: null, 
      isAuthenticated: null, 
      name: "" 
    });
    Cookies.remove();
    return <Redirect to="/" />;
  }

  render() {
    return (
      <HashRouter>
        <Header user={this.state.name}/>
          <div>
          { (this.state.loading) 
            ?  <p className="loading" >Loading...</p>
            :  null
          }
            <Switch>
              <Route 
                exact path="/"
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
                path="/courses/:id/update"
                authenticated={this.state.isAuthenticated}
                component={(props) => <UpdateCourse {...props} user={this.state.authenticatedUser} data={this.state.course}/> }
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
