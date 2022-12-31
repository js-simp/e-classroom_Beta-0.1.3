import {React,useEffect, useState} from 'react';
import { Box } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import { ErrorOutlined, DoneOutlineOutlined, FlashOnOutlined } from '@material-ui/icons';
import { DataGrid } from '@material-ui/data-grid';
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import db from '../Firebase/firebase.js';

const columns = [
  { field: 'id', headerName: 'Session ID', width: 150 },
  {
    field: 'TutorId',
    headerName: 'Tutor ID',
    width: 160,
  },
  {
    field: 'StudentId',
    headerName: 'Student ID',
    width: 160,
  },
  {
    field: 'dateTime',
    headerName: 'Date',
    type: 'dateTime',
    width: 180,
  },
  {
    field: 'Status',
    headerName: 'Status',
    renderCell: (params) => (
      (params.value === "Pending") ? ( 
      <Chip
        icon = {<ErrorOutlined/>} 
        label={params.value}
        variant = "outlined"
        color = "warning" />):  
      (params.value === "Live")? ( <Chip
        icon = {<FlashOnOutlined/>} 
        label={params.value}
        variant = "outlined"
        color = "primary" />):
      ( <Chip
        icon = {<DoneOutlineOutlined/>} 
        label={params.value}
        variant = "outlined"
        color = "success" 
        />
      )
    ),
    width: 160
  }
];

function LiveSessions() {
    const [rows, setRows] = useState([]);
    const todayDate = setHours(setMinutes(new Date(), 0), 0);
    const todayEpoch = Math.floor(todayDate.getTime()/ 1000);

    // colllect information about ongoing sessions
    useEffect(() => {
        //query the sessions that are on that particular day
        let sessionInfo = [];
        db.collection("Sessions").where("epochTime", ">=", todayEpoch).onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            let sessData = doc.data();
            let dateTime = doc.data().Date + ', ' + doc.data().Time;
            sessData.id = doc.id;
            sessData.dateTime = dateTime;
            sessionInfo = [...sessionInfo, sessData]
            })
            setRows(sessionInfo);
        })

    },[])

    if(rows.length != 0){
      return (
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
      );
    }
  else{
    return (
      <div>
        <p>No Ongoing Sessions to show!</p>
      </div>
    )
  }
  
}

export default LiveSessions