import {React, useRef, useState} from 'react';
import { Select, FormControl, InputLabel, MenuItem, Box, OutlinedInput } from '@material-ui/core';

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

function SingleSelect(props) {
    const list = props.list;
    const [selection, setSelection] = useState([])

      const handleChange = (event) => {
        setSelection(event.target.value);
        props.selectItem(event.target.value);
      };
    
      return (
        <Box sx={{ minWidth: 120 }}>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selection}
              label={props.label}
              onChange={handleChange}
            >
              {list.map((item) => (
                <MenuItem
                  key={item}
                  value={item}
                >
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      );
}

export default SingleSelect