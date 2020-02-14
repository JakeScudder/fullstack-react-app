import React from 'react';

const DeleteConfirmation = (props) => {
  let title = props.course.title;
  return (
    <div>
      <h3>Are you sure you want to delete {title} </h3>
    </div>
  )
}

export default DeleteConfirmation;