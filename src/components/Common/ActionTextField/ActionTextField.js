import { IconButton, InputAdornment, TextField } from "@material-ui/core";
import { useState } from "react";
import "./ActionTextField.css";

export default function ActionTextField({
  icon,
  text,
  commit,
  description,
  initial,
  multi,
  full,
  button,
  onhttp,
  action,
  empty,
}) {
  const [name, setName] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const handleChange = (event) => {
    updateName(event.target.value);
  };
  const handleUserKeyUp = (e) => {
    const { keyCode, target } = e;
    const { value } = target;
    setDirty(true);
    if (keyCode === 13) {
      finalize(value);
      !!empty && setName("");
    }
  };
  const finalize = (value) => {
    commit(value);
    updateName(value);
    setDirty(false);
  };

  const updateName = (value) => {
    if (value.indexOf("://") > 0) {
      onhttp && onhttp(value);
    }
    setName(value);
  };

  return (
    <div style={{ margin: "0 2px" }}>
      <TextField
        autoFocus
        defaultValue={initial}
        helperText={description}
        multiline={multi}
        placeholder={text}
        label={text}
        value={name}
        fullWidth={full}
        onChange={handleChange}
        classes={{ root: dirty ? "text-field-dirty" : "text-field-clean" }}
        InputProps={{
          "aria-label": "description",
          startAdornment: !!icon && (
            <InputAdornment position="start">
              <IconButton edge="start">{icon}</IconButton>
            </InputAdornment>
          ),
          endAdornment: !!button && (
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  if (!!action) return action();
                  finalize(name);
                }}
                edge="end"
              >
                {button}
              </IconButton>
            </InputAdornment>
          ),
        }}
        onKeyUp={handleUserKeyUp}
      />
    </div>
  );
}
