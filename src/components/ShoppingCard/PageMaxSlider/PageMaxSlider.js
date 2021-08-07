import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles({
  root: {
    width: 160,
  },
});

const marks = [
  {
    value: 1,
    label: "1",
  },
  {
    value: 20,
    label: "5",
  },
  {
    value: 60,
    label: "15",
  },
  {
    value: 100,
    label: "25",
  },
];

function valuetext(value) {
  return `${value} pages`;
}

function valueLabelFormat(value) {
  const mark = marks.filter((m) => m.value === value)[0];
  return mark.label;
  // return marks.findIndex((mark) => mark.value === value) + 1;
}

export default function PageMaxSlider({ change, value }) {
  const classes = useStyles();
  const handleChange = (e, f) => {
    const mark = marks.filter((m) => m.value === f)[0];
    change && change(mark.label);
  };
  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-custom" gutterBottom>
        Max Pages
      </Typography>
      <Slider
        defaultValue={value}
        onChange={handleChange}
        valueLabelFormat={valueLabelFormat}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-restrict"
        step={null}
        valueLabelDisplay="auto"
        marks={marks}
      />
    </div>
  );
}
