import React, { useEffect, useState } from 'react';
import Tutor from '../Component/Tutors/Home'
import Student from '../Component/Students/Home'

const Home = (props) => {
  // const role = localStorage.getItem('role');
  // const userId = localStorage.getItem('UserId');
  // console.log(role);
  if(props.role === "tutor"){
    return (
      <div>
        <Tutor user = {props.userId}/>
      </div>   
    )
  }
  else if(props.role === "student"){
    return(
      <div>
        <Student user = {props.userId}/>
      </div>
    )
  }
  
}
  
export default Home;
