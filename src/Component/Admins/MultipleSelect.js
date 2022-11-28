import React from 'react';
import {useTheme} from '@material-ui/core/styles';
import { Select, FormControl, InputLabel, MenuItem, OutlinedInput } from '@material-ui/core';

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
    const [lessonName, setLessonName] = React.useState([]);
    
      const handleChange = (event) => {
        const {
          target: { value },
        } = event;
        setLessonName(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };
    
      return (
        <div>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-name-label">Lessons</InputLabel>
            <Select
              labelId="lesson-multiple-select"
              id="lesson-titles"
              multiple
              value={lessonName}
              onChange={handleChange}
              input={<OutlinedInput label="LessonName" />}
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
        </div>
      );
}

export default MultipleSelect
