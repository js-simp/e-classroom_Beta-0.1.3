import React, { useEffect, useState } from 'react';
import Login from './Authentication/Login'
import Tutor from '../Component/Tutors/Home'
import Student from '../Component/Students/Home'

const Home = () => {
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('UserId');
  console.log(role);
  if(role === "tutor"){
    return (
      <div>
        <Tutor user = {userId}/>
      </div>   
    )
  }
  else if(role === "student"){
    return(
      <div>
        <Student user = {userId}/>
      </div>
    )
  }
  
}
  
export default Home;
