import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Collapse, Divider } from "@material-ui/core";

import {
  doTestParserURL,
  saveParser,
  searchSites,
} from "../../services/ParserService";
import ToolTipButton from "../Common/ToolTipButton/ToolTipButton";
import ActionTextField from "../Common/ActionTextField/ActionTextField";
import Thumbnail from "../Common/Thumbnail/Thumbnail";
import { threadResponse } from "../../util/Observers";
import {
  SettingsApplications,
  SettingsEthernet,
  Tune,
  VideocamSharp,
} from "@material-ui/icons";

const useStyles = makeStyles({
  root: {
    minWidth: 475,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function ParserEditCard({ parser, finish }) {
  const classes = useStyles();
  const [thread, setThread] = useState({});
  const [index, setIndex] = useState(0);
  const [specimen, setSpecimen] = useState("");
  // const [results, setResults] = useState([]);
  // const bull = <span className={classes.bullet}>•</span>;

  const saveSpecimen = (text) => {
    localStorage["spec-text"] = text;
    setSpecimen(text);
  };
  const testParser = (v) => {
    searchSites([parser], v, 1, !0).then((res) => {
      console.log(res);
    });
  };

  useEffect(() => {
    const sub = threadResponse.subscribe((t) => {
      setThread(t);
    });
    setSpecimen(localStorage["spec-text"] || "");
    return () => sub.unsubscribe();
  }, []);

  const setParserSettingsField = (name, value) => {
    parser.pageMatrix[name] = value;
  };

  const testPageParser = (value) => {
    const regex = new RegExp(value?.trim());
    if (regex) {
    }
  };

  const setParserField = (field, value) => {
    parser[field] = value;
  };

  const setParserInfoField = (field, value) => {
    parser.fields[field] = value;
    console.log({ parser });
  };

  const setParserRegPropField = (field, value) => {
    parser.fields.embed.regexProp[field] = value;
  };
  const setParserEmbedField = (field, value) => {
    parser.fields.embed[field] = value;
  };

  const commitParser = () => {
    saveParser(parser).then(() => setIndex(index));
  };

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <div class="flexed top right">
          <div class="vertical-button-column">
            <ToolTipButton
              click={() => setIndex(0)}
              active={index === 0}
              icon={<Tune />}
            />
            <ToolTipButton
              click={() => setIndex(1)}
              active={index === 1}
              content="Video Info Settings"
              icon={<VideocamSharp />}
            />
            <ToolTipButton
              click={() => setIndex(2)}
              active={index === 2}
              icon={<SettingsEthernet />}
            />
            <ToolTipButton
              click={() => setIndex(3)}
              active={index === 3}
              content="Page Parser Settings"
              icon={<SettingsApplications />}
            />
          </div>
          <Divider orientation="vertical" />
          <div class="parser-edit-content" style={{ width: "85%" }}>
            <GeneralSiteSettingsForm
              open={index === 0}
              testParser={testParser}
              setParserField={setParserField}
              parser={parser}
              thread={thread}
            />
            <VideoInfoSettingsForm
              open={index === 1}
              setParserInfoField={setParserInfoField}
              parser={parser}
            />
            <TagSettingsForm
              open={index === 2}
              setParserRegPropField={setParserRegPropField}
              parser={parser}
              setParserEmbedField={setParserEmbedField}
            />
            <ParserSettingsForm
              open={index === 3}
              specimen={specimen}
              parser={parser}
              setParserSettingsField={setParserSettingsField}
              saveSpecimen={saveSpecimen}
              testPageParser={testPageParser}
            />
          </div>
        </div>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => finish()}>
          Close
        </Button>
        <Button size="small" onClick={() => commitParser()}>
          Save
        </Button>
      </CardActions>
    </Card>
  );
}

const GeneralSiteSettingsForm = (props) => {
  const { open, setParserField, testParser, parser, thread } = props;
  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Typography id="discrete-slider-custom" component="h3" gutterBottom>
        General Site Settings
      </Typography>
      <ActionTextField
        full
        commit={(v) => setParserField("domain", v)}
        text="DOMAIN"
        description="unqualified domain name for this site"
        initial={parser.domain}
      />
      <ActionTextField
        full
        commit={(v) => setParserField("searchURL", v)}
        text="SEARCH URL"
        description="address used to perform text-only searches using page regex"
        initial={parser.searchURL}
      />
      <ActionTextField
        full
        commit={(v) => setParserField("pageRegex", v)}
        text="PAGE REGEX"
        description="find more pages when searching"
        initial={parser.pageRegex}
      />
      <ActionTextField
        full
        commit={(v) => setParserField("spaceChar", v)}
        text="SPACE CHAR"
        description="replace spaces with this character when searching"
        initial={parser.spaceChar}
      />

      <ActionTextField
        full
        commit={(v) => testParser(v)}
        text="TEST"
        description="perform a test search with these settings"
      />
      {!!thread?.response && (
        <div>
          [{thread?.response?.length} videos found] [
          {thread?.pages?.filter((p) => !!p).length} pages detected]
        </div>
      )}
    </Collapse>
  );
};

const VideoInfoSettingsForm = (props) => {
  const { open, setParserInfoField, parser } = props;
  const [video, setVideo] = useState({});
  const testByURI = (URI) => {
    doTestParserURL(URI, parser).then(setVideo);
  };
  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Collapse in={!video?.title} timeout="auto" unmountOnExit>
        <Typography id="discrete-slider-custom" component="h3" gutterBottom>
          Video Info Settings
        </Typography>
        {["title", "image", "model", "tags", "desc"].map((field) => (
          <ActionTextField
            full
            commit={(v) => setParserInfoField(field, v)}
            text={field.toUpperCase()}
            initial={parser?.fields?.[field]}
          />
        ))}

        <ActionTextField
          full
          commit={(v) => testByURI(v)}
          text="Enter test URL"
        />
      </Collapse>

      <ul className="parser-test-response">
        {Object.keys(video).map((key) => (
          <li key={key}>
            <label>{key}</label> {video[key]}
          </li>
        ))}
      </ul>

      {video?.title && (
        <>
          <Thumbnail video={video} />

          <CardActions>
            <Button size="small" onClick={() => setVideo({})}>
              Hide Specimen
            </Button>
          </CardActions>
        </>
      )}
    </Collapse>
  );
};

const TagSettingsForm = (props) => {
  const { open, setParserEmbedField, parser, setParserRegPropField } = props;
  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Typography id="discrete-slider-custom" component="h3" gutterBottom>
        Embed Tag Settings
      </Typography>
      {["width", "height", "src"].map((field) => (
        <ActionTextField
          full
          commit={(v) => setParserRegPropField(field, v)}
          text={field.toUpperCase()}
          initial={parser?.fields?.embed?.regexProp?.[field]}
        />
      ))}

      <ActionTextField
        full
        commit={(v) => setParserEmbedField("regexTag", v)}
        text="EMBED TAG"
        initial={parser?.fields?.embed?.regexTag}
      />
    </Collapse>
  );
};

const ParserSettingsForm = (props) => {
  const [show, setShow] = useState(false);
  const {
    open,
    specimen,
    saveSpecimen,
    parser,
    testPageParser,
    setParserSettingsField,
  } = props;
  const fields = ["fieldText", "pagePattern", "prefix"];

  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Typography id="discrete-slider-custom" component="h3" gutterBottom>
        Page Parser Settings
      </Typography>

      <ActionTextField
        full
        multi
        button="save"
        commit={(v) => testPageParser(v)}
        text="PAGE PARSER"
        initial={parser?.pageParser}
      />

      {fields.map((field) => (
        <ActionTextField
          full
          key={field}
          commit={(v) => setParserSettingsField(field, v)}
          text={field}
          initial={parser?.pageMatrix?.[field]}
        />
      ))}

      {show && (
        <ActionTextField
          full
          multi
          commit={saveSpecimen}
          text="PAGE PARSER SPECIMEN"
          initial={specimen}
        />
      )}

      <CardActions>
        <Button size="small" onClick={() => setShow(!show)}>
          {show ? "Hide" : "Show"} Specimen
        </Button>
      </CardActions>
    </Collapse>
  );
};
