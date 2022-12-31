import {React, useRef, useState} from 'react';
import {useTheme} from '@material-ui/core/styles';
import { Select,Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput } from '@material-ui/core';

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

function MultipleSelect(props) {
    
    const lessons = props.lessons;
    const [selection, setSelection] = useState([])

      const handleChange = (event) => {
        const {
          target: { value },
        } = event;
        props.selectLesson(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
        setSelection(
          typeof value === 'string' ? value.split(',') : value,
        );
      };
    
      return (
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-name-label">Lessons</InputLabel>
            <Select
              labelId="lesson-multiple-select"
              id="lesson-titles"
              multiple
              value={selection}
              onChange={handleChange}
              input={<OutlinedInput label="LessonName" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {lessons.map((lesson) => (
                <MenuItem
                  key={lesson}
                  value={lesson}
                >
                  {lesson}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
      );
}

export default MultipleSelect
