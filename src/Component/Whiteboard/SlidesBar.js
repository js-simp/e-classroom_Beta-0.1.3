import {React, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';



function SlidesBar(props) {
  
    const useStyles = makeStyles((theme) => ({
      popover: {
        pointerEvents: 'none',
      },
      paper: {
        // left: 50,
        top: "45% !important",
        // padding: theme.spacing(1)
      }
    }));

    const classes = useStyles();
    const [anchorInfo, setAnchorInfo] = useState({anchorEl: null, openedPopoverId: null});

    const handlePopoverOpen = (event, popoverId) => {
      setAnchorInfo({anchorEl: event.currentTarget, openedPopoverId: popoverId});
      console.log(event.currentTarget)
    };

    const handlePopoverClose = () => {
      setAnchorInfo({anchorEl: null, openedPopoverId: null});
    };

  // const open = Boolean(anchorEl);
    //-----------------------slide selected with popover from material ui--------------------------------
    return(
      <div className = 'slides-container'>
         {
          props.slidesArr.map((user, index) => {
              return(
            <>
            <button  id = {`${index}${props.lessonTitle}`} className = {(props.selected.active === index && props.selected.title === props.lessonTitle) ? 'active' : ''} 
            onClick={() => { props.getSlide(props.lessonTitle ,index) }}
            onMouseEnter={(e) => {handlePopoverOpen(e,`${index}${props.lessonTitle}`)}}
            onMouseLeave={handlePopoverClose}
            style={{ display: "inline", height: "30px", width: "30px", border: "2px solid black" }}>
             <p style={{fontSize:"15px", margin: "0 auto", padding: "10px 0px 10px 0px"}}>{index + 1}</p>
            </button>
            <Popover
              id="mouse-over-popover"
              className={classes.popover}
              classes={{
                paper: classes.paper,
              }}
              open={anchorInfo.openedPopoverId === `${index}${props.lessonTitle}`}
              anchorEl={anchorInfo.anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
            >
              <img id = {`${props.lessonTitle}${index}`} src = {user} alt = "" 
              style={
                { display: "inline", 
                width: "300px", 
                border: "none", 
                height: "auto" }}>
                </img>
          </Popover>
            </>
            
              )
          })
        }
        </div>
    )
}

export default SlidesBar
