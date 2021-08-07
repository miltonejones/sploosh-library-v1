import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Collapse,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import {
  ExpandMore,
  Favorite,
  Launch,
  LocalOffer,
  MoreVert,
  Sync,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import {
  assignModel,
  getData,
  likeVideo,
  removeModel,
} from "../../services/VideoData";
import { WindowManagerService } from "../../services/WindowManager";
import { cdnQuickFix } from "../Common/ImageLoader/ImageLoader";
import ModelList from "../Common/Model/ModelList/ModelList";
import ModelPopoverSelect from "../Common/ModelPopoverSelect/ModelPopoverSelect";
import "./VideoInfoCard.css";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 585,
    minWidth: 585,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const VideoInfoCard = ({ video, modelClick, wordClick, update }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [tagInfo, setTagInfo] = React.useState(false);
  const [movie, setMovie] = useState({});
  const { domain, title, image, models, tags, favorite } = movie;

  useEffect(() => {
    (!movie?.ID || movie.ID !== video?.ID) && setMovie({ ...video });
  }, [movie.ID, video]);

  const assign = (star) => {
    const id = movie.ID;
    assignModel(star.ID, id).then(refresh);
  };
  const refresh = () => {
    const id = movie.ID;
    getData({ id }, "video").then((v) => {
      setMovie({ ...v });
      update && update();
    });
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const like = () => {
    likeVideo(movie).then(() => refresh());
  };
  const handleTagInfoClick = () => {
    setTagInfo(!tagInfo);
  };
  const remove = (star) => {
    const id = movie.ID;
    if (
      window.confirm(
        `Are you sure you want to remove "${star.name}" from "${video.title}"??`
      )
    ) {
      removeModel(star.ID || star.modelFk, id).then(refresh);
    }
  };

  const picture = cdnQuickFix(image);

  return (
    <div className="VideoInfoCard">
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {domain?.substr(0, 1).toUpperCase()}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVert />
            </IconButton>
          }
          title={domain}
          subheader="September 14, 2016"
        />

        <Collapse in={!(expanded || tagInfo)} timeout="auto" unmountOnExit>
          <CardMedia className={classes.media} image={picture} title={title} />

          <CardContent>
            <Typography
              variant="body2"
              color="textSecondary"
              component="strong"
            >
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="div">
              Starring:{" "}
              <ModelList
                remove={remove}
                click={modelClick}
                chip
                limit={20}
                models={models}
              />
            </Typography>
          </CardContent>
        </Collapse>

        <CardActions disableSpacing>
          <IconButton
            onClick={like}
            color={favorite ? "secondary" : "default"}
            aria-label="add to favorites"
          >
            <Favorite />
          </IconButton>
          <IconButton
            onClick={() => WindowManagerService.jav(movie)}
            aria-label="share"
          >
            <Launch />
          </IconButton>
          <IconButton
            color={tagInfo ? "secondary" : "default"}
            onClick={handleTagInfoClick}
          >
            <LocalOffer />
          </IconButton>
          <IconButton
            className={[
              classes.expand,
              expanded ? classes.expandOpen : "",
            ].join(" ")}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMore />
          </IconButton>
        </CardActions>

        <Collapse in={tagInfo} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="h3">
              Tags
            </Typography>

            <div>
              {!!tags?.length &&
                tags.map((tag, i) => (
                  <Chip
                    onClick={() => wordClick && wordClick(tag.Tag)}
                    style={{ margin: 4 }}
                    key={i}
                    label={tag.Tag}
                  />
                ))}
            </div>
            {!tags?.length && (
              <IconButton onClick={refresh}>
                <Sync />
              </IconButton>
            )}
          </CardContent>
        </Collapse>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="h3">
              Models
            </Typography>
            <ModelPopoverSelect
              text="add model"
              onModelSelect={(m) => assign(m)}
            />
            <ModelList click={modelClick} limit={20} models={models} grid />
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
};

VideoInfoCard.defaultProps = {};
export default VideoInfoCard;
