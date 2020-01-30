import React, { Component } from 'react';

class CourseDetail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: true,
    } 
  }

  
  render() {
    console.log(this.props.data)
    return(
      <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100"><span><a className="button" href="/update-course.html">Update Course</a><a className="button" href="#/to-be-deleted">Delete Course</a></span><a
                className="button button-secondary" href="#/api/courses">Return to List</a></div>
          </div>
        <div className="bounds course--detail">
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">Build a Basic Bookcase</h3>
              <p>By Joe Smith</p>
            </div>
            <div className="course--description">

            </div>
          </div>
        </div> 
      </div>
    )
  }
}

export default CourseDetail;