import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {

  constructor() {
  super();
    this.state = {
      courses: []
    };
  }

  componentDidMount() {
    this.handleFetch();
  }

  handleFetch = () => {
    axios.get(`http://localhost:5000/api/courses`)
      .then(res => {
        this.setState({
          courses: res.data.courses
        }) 
      })
    .catch(error => {
      console.log('Error fetching and parsing data', error)
    })
  }

  render() {
    return (
    <div>
      {
        this.state.courses.map(course => {
          return (
            <div>
            <ul>
              <h1> {course.title} </h1>
              <p> {course.description} </p>
            </ul>
            
          </div>
          ) 
        })
      }
    </div>
    )
  }
}

export default App;
