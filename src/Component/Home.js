import Tutor from '../Component/Tutors/Home'
import Student from '../Component/Students/Home'
import Dashboard from '../Component/Admins/Dashboard'

const Home = (props) => {
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
  else {
    return(
      <div>
        <Dashboard/>
      </div>
    )
  }
  
}
  
export default Home;
