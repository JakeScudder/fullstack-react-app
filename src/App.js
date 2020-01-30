import React, { Component } from 'react';
import axios from 'axios';
import {
  HashRouter,
  Route,
  Switch
} from 'react-router-dom';

import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';

class App extends Component {

  constructor() {
  super();
    this.state = {
      courses: [],
      loading: true
    };
  }

  componentDidMount() {
    this.handleFetch();
  }

  handleFetch = () => {
    this.setState({
      loading: true
    })
    axios.get(`http://localhost:5000/api/courses`)
      .then(res => {
        this.setState({
          courses: res.data.courses,
          loading: false
        }) 
      })
    .catch(error => {
      console.log('Error fetching and parsing data', error)
    })
  }

  render() {
    if (!this.state.loading) {
      console.log(this.state.courses);
    }
    return (
      <HashRouter>
        <div>
        { (this.state.loading) 
          ?  <p className="loading" >Loading...</p>
          :  null
        }
        <Switch>
          <Route 
            exact path="/"
            render={(props) => <Courses {...props} data={this.state.courses} /> }
          />
          <Route 
            exact path="/courses/:id"
            render={(props) => <CourseDetail {...props} data={this.state.courses} /> }
          />
        </Switch>
        </div>
      </HashRouter>  
    )
  }
}

export default App;
