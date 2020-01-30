import React, { Component } from 'react';

class Courses extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: true,
    } 
    // this.courseRef = React.createRef();
  }

  handleClick = e => {
    debugger
    console.log(e.target)
    console.log(e.target.course)
    
    // let courseID = e.target.courseid
    // console.log(courseID)
    // this.props.fetchCourse(courseID)
  }

  render() {
    console.log(this.props.data);
    return (
    <div className="bounds">
    { this.props.data.map(course => {
      let url = `#/api/courses/${course.id}`
        return (
          <div onClick={this.handleClick} key={course.id}  className="grid-33"><a course={course.id} className="course--module course--link" href={url}>
            <h4 course={course.id} className="course--label"> Course </h4>
            <h3 course={course.id} className="course--title"> {course.title}</h3>
            </a></div>
        ) 
      })
      }
      <div className="grid-33"><a className="course--module course--add--module" href="create-course.html">
            <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 13 13" className="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>New Course</h3>
          </a></div>
    </div>
    )
  }
}

export default Courses;