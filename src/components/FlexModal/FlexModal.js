import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

export default function FlexModal({ send, open = false, head, text, quiz }) {
  const [data, setData] = useState(quiz);

  useEffect(() => {
    !data && !!quiz && setData(quiz);
  }, [data, quiz]);
  const close = () => {
    setData("");
    send(false);
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => close()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{head}</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>

          {!!quiz && (
            <DialogContentText id="alert-dialog-description">
              <TextField
                value={data}
                onChange={(e) => {
                  setData(e.target.value);
                }}
                id="standard-basic"
                label={head}
              />
            </DialogContentText>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => close()} color="primary">
            Disagree
          </Button>
          <Button onClick={() => send(data || true)} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

FlexModal.defaultProps = {
  head: "Confirm this action!",
};
/**
 * returns confirm/prompt function to caller
 * @param {*} make
 */
const FlexModalConfig = (make) => (text, head, quiz) =>
  new Promise((callback) => {
    make({
      text,
      quiz,
      head,
      open: true,
      send: (what) => {
        callback(what);
        make({});
      },
    });
  });

export { FlexModalConfig };
