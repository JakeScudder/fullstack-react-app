import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Animated } from 'react-animated-css';

class Courses extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: true,
    } 
  }

  handleClick = e => {
    let courseID = e.target.dataset.course
    this.props.fetchCourse(courseID)
  }

  render() {
    return (
      <Animated animationIn="fadeInLeft">
    <div className="bounds"> 
    { this.props.data.map(course => {
      let url = `/courses/${course.id}`
        return (
          <div onClick={this.handleClick} key={course.id}  className="grid-33">
            <Link data-course={course.id} className="course--module course--link" to={url}>
              <h4 data-course={course.id} className="course--label"> Course </h4>
              <h3 data-course={course.id} className="course--title"> {course.title}</h3>
            </Link>
          </div>
        ) 
      })
      }
      <div className="grid-33"><a className="course--module course--add--module" href="/courses/create">
            <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 13 13" className="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>New Course</h3>
          </a></div>
    </div>
    </Animated>
    )
  }
}

export default Courses;