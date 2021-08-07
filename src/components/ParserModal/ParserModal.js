import React, { useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { query } from "../../services/ParserService";
import "./ParserModal.css";
import ParserEditCard from "../ParserEditCard/ParserEditCard";
import { SettingsApplicationsOutlined } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ParserModal() {
  const [open, setOpen] = React.useState(false);
  const [parsers, setParsers] = React.useState([]);
  const [parser, setParser] = React.useState({});

  useEffect(() => {
    if (parsers?.length) return;
    query().then((res) => {
      setParsers(res);
    });
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setParser({});
    setOpen(false);
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <SettingsApplicationsOutlined />
      </IconButton>
      {/* <ToolTipButton
        content="Edit Parsers"
        icon={}
        click={handleClickOpen}
      /> */}
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Slide in alert dialog
      </Button> */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Edit Parsers"}
        </DialogTitle>
        <DialogContent>
          {!parser?.domain && (
            <ul className="parser-list">
              {!!parsers?.length &&
                parsers.map((pp, i) => (
                  <li
                    onClick={() => setParser(pp)}
                    className={[
                      "app-link",
                      pp.pageParser?.length ? "strong blue" : "",
                    ].join(" ")}
                    key={i}
                  >
                    {pp.domain}
                  </li>
                ))}
            </ul>
          )}
          {!!parser?.domain && (
            <div>
              <ParserEditCard finish={() => setParser({})} parser={parser} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
