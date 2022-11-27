import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link, Router , BrowserRouter} from 'react-router-dom';
import './Navigation.css';
const useStyles = makeStyles((theme) => ({
   
    root: {
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
}));

const Navigation = () => {
    const classes = useStyles();
    const preventDefault = (event) => event.preventDefault();
    const sty={
        fontSize:"14px", color:"black",padding:"10px",position:"relative",fontWeight:"bolder"
    }
    return (
        <div className="Navigation">
          
                <Link to = "/"  style={sty} >
                 Home
                </Link>
                
                <Link to="/live_sessions" style={sty}>
                    Live Session Data
                </Link>

                <Link to="/registration" style={sty} >
                    Registrationn
                </Link>

                <Link to="/add_lesson"  style={sty} >
                   Add Lesson
                </Link>
              
        </div>
    );
};


Navigation.propTypes = {

};


export default Navigation;
