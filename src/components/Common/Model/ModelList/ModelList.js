import React from "react";
import { contains } from "../../../../util/Strings";
import PhotoChip from "../../PhotoChip/PhotoChip";
import ModelImageLink from "../ModelImageLink/ModelImageLink";
import ModelThumbnail from "../ModelThumbnail/ModelThumbnail";
import "./ModelList.css";

const ModelList = ({
  models,
  limit,
  click,
  small,
  large,
  grid,
  chip,
  param,
  remove,
  insert,
  field,
}) => {
  const modelList = models?.slice(0, limit);
  const moreLinks = models?.length - limit;
  const label = modelList?.length === 1 ? "Model" : "Models";

  if (chip) {
    return (
      <div>
        {!!models?.length &&
          models.map((person, i) => (
            <PhotoChip
              key={i}
              click={() => click && click(person)}
              remove={() => remove && remove(person)}
              active={param?.length && contains(person.name, param)}
              text={person.name}
              image={person.image}
            />
          ))}
      </div>
    );
  }

  if (grid) {
    const className = [
      "ModelList",
      "flexed",
      "wrap",
      "grid-96",
      "top",
      "no-wrap",
      large ? "large" : "",
    ].join(" ");
    return (
      <div className={className}>
        {models?.map((model, i) => (
          <ModelThumbnail
            field={field}
            large={large}
            click={click}
            model={model}
            key={i}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={["ModelList", small ? "small" : ""].join(" ")}>
      {!small && <span className="model-list-label app-label">{label}</span>}
      {!modelList?.length && (
        <em
          onClick={() => insert && insert()}
          className="app-add-model-link red bold app-link"
        >
          Add model...
        </em>
      )}
      {!!modelList?.length &&
        modelList.map((model, i) => (
          <ModelImageLink
            last={!(i < modelList.length - 1)}
            click={() => click && click(model)}
            {...model}
            key={i}
          />
        ))}
      {moreLinks > 0 && (
        <b className="app-add-model-link">
          +{moreLinks} {small ? "" : "more..."}
        </b>
      )}
    </div>
  );
};

ModelList.defaultProps = {
  limit: 2,
};
export default ModelList;
