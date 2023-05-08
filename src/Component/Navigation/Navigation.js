import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link} from 'react-router-dom';
import './Navigation.css';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 'auto',
      flexDirection: 'column',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
    link: {
      fontSize: '14px',
      color: 'black',
      padding: '10px',
      position: 'relative',
      fontWeight: 'bolder',
      textDecoration: 'none',
    },
  }));

const Navigation = () => {
    const classes = useStyles();
    const preventDefault = (event) => event.preventDefault();

    return (
        <div className="Navigation">
          
                <Link to = "/" className={classes.link} >
                 Home
                </Link>
                
                <Link to="/live_sessions" className={classes.link}>
                    Live Session Data
                </Link>

                <Link to="/registration" className={classes.link}>
                    Registration
                </Link>

                <Link to="/create_sessions" className={classes.link} >
                   Create Session
                </Link>
              
        </div>
    );
};


Navigation.propTypes = {

};


export default Navigation;
