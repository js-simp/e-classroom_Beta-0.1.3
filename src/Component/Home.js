import Tutor from '../Component/Tutors/Home'
import Student from '../Component/Students/Home'
import Test from '../Component/Test/Home'
import Dashboard from '../Component/Admins/Dashboard'
import { KeyboardReturnOutlined } from '@material-ui/icons'
import Classroom from './Classroom/Classroom'

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
  else if(props.role === "test"){
    return(
    <Test feature = {props.feature}/>
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
