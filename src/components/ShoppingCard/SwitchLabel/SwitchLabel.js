import { FormControlLabel, Switch } from "@material-ui/core";

export default function SwitchLabel({
  label,
  isChecked,
  click,
  minWidth,
  maxWidth,
  whiteSpace,
}) {
  return (
    <FormControlLabel
      style={{ minWidth, whiteSpace, maxWidth }}
      control={<Switch checked={isChecked} onChange={click} color="primary" />}
      classes={{ root: "no-wrap" }}
      label={label}
    />
  );
}
SwitchLabel.defaultProps = {
  minWidth: 170,
  maxWidth: 170,
  whiteSpace: "nowrap",
};
