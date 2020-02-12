import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class CourseDetail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: true,
    } 
  }


  render() {
    let course = this.props.data;
    let firstName;
    let lastName;
    let instructor;
    let list;
    let courseUpdateUrl = `/courses/${course.id}/update`

    const formatMaterials = () => {
      if (course.materialsNeeded) {
        let materialsFormat = course.materialsNeeded.replace(/\*/, "")
        materialsFormat = materialsFormat.split(/\*/g);
        list = materialsFormat.map((item, index) => 
          <li key={index}>{item}</li>
        )
        console.log(list);
        return list;
      }
      list = <li>Not Specified</li>;
      return list;
    }
    //Why is there a delay between accessing the nested object?
    //i.e. 
    // let firstName = course.User.firstName 
    // This won't work unless the if statement is run
    if (course && course.User) {
      console.log(course);
      firstName = course.User.firstName + " ";
      lastName = course.User.lastName;
      instructor = firstName.concat(lastName);
      formatMaterials();
    }

    console.log(courseUpdateUrl);

    return(
      <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100"><span><Link className="button" exact to={courseUpdateUrl}>Update Course</Link><a className="button" href="#/to-be-deleted">Delete Course</a></span><a
                className="button button-secondary" href="/">Return to List</a></div>
          </div>
        <div className="bounds course--detail">
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{course.title}</h3>
              <p>By {instructor}</p>
            </div>
            <div className="course--description">
              <p>{course.description}</p>
            </div>
            <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                <li className="course--stats--list--item">
                  <h4>Estimated Time</h4>
                  <h3>{course.estimatedTime}</h3>
                </li>
                <li className="course--stats--list--item">
                  <h4>Materials Needed</h4>
                  <ul>
                    {list}
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          </div>
        </div> 
      </div>
    )
  }
}

export default CourseDetail;