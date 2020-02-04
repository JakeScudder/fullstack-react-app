import React, { Component } from 'react';

class UpdateCourse extends Component {

  handleCancel = (event) => {
    event.preventDefault();
    window.location.href = "#/courses";
  }

  
  render() {
    let course = this.props.data
    let firstName;
    let lastName;
    let instructor;
    let time;

    //Why is there a delay between accessing the nested object?
    //i.e. 
    // let firstName = course.User.firstName 
    // This won't work unless the if statement is run
    if (course && course.User) {
      console.log(course);
      firstName = course.User.firstName + " ";
      lastName = course.User.lastName;
      instructor = firstName.concat(lastName);
    }

    if (course.estimatedTime === null) {
      time = "";
    } else {
      time = course.estimatedTime;
    }
    return(
      <div class="bounds course--detail">
        <h1>Update Course</h1>
        <div>
          <form>
            <div class="grid-66">
              <div class="course--header">
                <h4 class="course--label">Course</h4>
                <div><input id="title" name="title" type="text" class="input-title course--title--input" placeholder="Course title..."
                    value={course.title}/></div>
                <p>{instructor}</p>
              </div>
              <div class="course--description">
                <div><textarea id="description" name="description" class="" placeholder="Course description..." value={course.description}></textarea>
                </div>
              </div>
            </div>
            <div class="grid-25 grid-right">
              <div class="course--stats">
                <ul class="course--stats--list">
                  <li class="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div><input id="estimatedTime" name="estimatedTime" type="text" class="course--time--input"
                        placeholder="Hours" value={time}/></div>
                  </li>
                  <li class="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div>
                      <textarea id="materialsNeeded" name="materialsNeeded" class="" placeholder="List materials..." value={course.materialsNeeded}>
                      </textarea>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="grid-100 pad-bottom"><button class="button" type="submit">Update Course</button><button class="button button-secondary" onclick={this.handleCancel}>Cancel</button></div>
          </form>
        </div>
      </div>
    )
  }
}

export default UpdateCourse;