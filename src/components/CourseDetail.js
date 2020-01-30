import React, { Component } from 'react';

class CourseDetail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: true,
    } 
  }
  render() {
    return(
      <div class="actions--bar">
          <div class="bounds">
            <div class="grid-100"><span><a class="button" href="update-course.html">Update Course</a><a class="button" href="#">Delete Course</a></span><a
                class="button button-secondary" href="index.html">Return to List</a></div>
          </div>
        <div class="bounds course--detail">
          <div class="grid-66">
            <div class="course--header">
              <h4 class="course--label">Course</h4>
              <h3 class="course--title">Build a Basic Bookcase</h3>
              <p>By Joe Smith</p>
            </div>
            <div class="course--description">

            </div>
          </div>
        </div> 
      </div>
    )
  }
}

export default CourseDetail;