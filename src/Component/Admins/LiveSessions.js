import {React,useEffect, useState} from 'react';
import { Box } from '@material-ui/core';
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
    field: 'Date',
    headerName: 'Date',
    type: 'date',
    width: 160,
  },
  {
    field: 'Time',
    headerName: 'Time',
    type: 'date',
    width: 110,
  },
];

function LiveSessions() {
    const [rows, setRows] = useState([]);
    const todayDate = setHours(setMinutes(new Date(), 0), 0);
    const todayEpoch = Math.floor(todayDate.getTime()/ 1000);

    // colllect information about ongoing sessions
    useEffect(() => {
      let allSessionsRef = db.collection("Sessions").where("epochTime", ">=", todayEpoch);
            //query the sessions that are on that particular day
            let sessionInfo = [];
            allSessionsRef.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());
                    let sessData = doc.data();
                    sessData.id = doc.id;
                    sessionInfo.push(sessData)
                })
                setRows(sessionInfo);
            }).catch((error) => {
                console.log("Error getting document:", error);
            });

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