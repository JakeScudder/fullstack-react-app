import React, { Component } from 'react';
import axios from 'axios';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

//Auth Route
import PrivateRoute from './PrivateRoute';
import Cookies from 'js-cookie';
// import { withRouter } from 'react-router-dom'

//Components
import Header from './components/Header';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError';


class App extends Component {

  constructor(props) {
  super(props);
    this.state = {
      authUser: Cookies.getJSON('authUser') || null,
      name: Cookies.getJSON('name') || null,
      isAuth: Cookies.getJSON('isAuth') || null,
      courseId: "",
      courses: [],
      loading: true
    };
  }

  componentDidMount() {
    this.handleFetchCourses();
  }

  //Authorize User
  handleAuthUser = (email, password, data) => {
    let object = {email, password};
    this.setState({
      authUser: object,
      isAuth: true,
      name: data,
    })
    // console.log(this.state.authUser);
    Cookies.set('authUser', JSON.stringify(object), {expires: 1});
    Cookies.set('isAuth', true, {expires: 1});
    Cookies.set('name', JSON.stringify(data), {expires: 1})
  }

  errorHandler(res) {
    if (res.status === 500) {
      let error = new Error();
      error.status = 500;
      throw error;
    }
    return res;
  }

  //Fetch all Courses
  handleFetchCourses = () => {
    this.setState({
      loading: true
    })
    axios.get(`http://localhost:5000/api/courses`)
      .then(this.errorHandler)
      .then(res => {
          this.setState({
            courses: res.data.courses,
            loading: false
          }) 
        }
      )
      .catch(error => {
        if (error.status === 500) {
          this.props.history.push('/error');
        } else {
          console.log('Error fetching and parsing data', error);
          this.props.history.push('/notfound');
        }
      })
  }

  setCourseID = (query) => {
    this.setState({
      courseId: query,
    })
  }




  signOut = () => {
    this.setState({ 
      authUser: null, 
      isAuth: null, 
      name: "" 
    });
    Cookies.remove('authUser');
    Cookies.remove('isAuth');
    Cookies.remove('name');
    return <Redirect to="/" />;
  }

  render() {
    return (
      <BrowserRouter>
        <Header user={this.state.name}/>
          <div>
          { (this.state.loading) 
            ?  <p className="loading" >Loading...</p>
            :  null
          }
            <Switch>
              <Route 
                exact path="/courses"
                render={(props) => <Courses fetchCourses={this.handleFetchCourses} fetchCourse={this.setCourseID} {...props} data={this.state.courses} /> }
              />
              <PrivateRoute 
                authenticated={this.state.isAuth}
                exact path="/courses/create"
                component={(props) => <CreateCourse user={this.state.authUser} name={this.state.name}{...props} /> }
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
                render={(props) => <CourseDetail {...props} authUser={this.state.authUser} user={this.state.name} courseId={this.state.courseId} /> }
              />
              <PrivateRoute 
                exact path="/courses/:id/update"
                authenticated={this.state.isAuth}
                component={(props) => <UpdateCourse {...props} user={this.state.authUser} name={this.state.name} courseId={this.state.courseId}/> }
              />
              <Redirect from="/" to="/courses" exact /> 
              <Route path="/signout" render={(props) => <UserSignOut {...props} logOut={this.signOut} />}
              />
              <Route 
                 path="/forbidden" component={(props) => <Forbidden {...props} courseId={this.state.courseId} />}
              />
              <Route 
                 path="/error" component={(props) => <UnhandledError {...props} courseId={this.state.courseId} />}
              />
              <Route 
                 component={(props) => <NotFound {...props} courseId={this.state.courseId} />}
              />
            </Switch>
          </div>
      </BrowserRouter>  
    )
  }
}

export default App;
