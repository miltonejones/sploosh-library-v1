import React from "react";
import { WINDOW_REGIONS } from "../../../../Constants";
import "./RegionMenu.css";

const RegionMenu = ({ width, height, open, click }) => {
  const areas = [];
  WINDOW_REGIONS.map((region) => {
    const ratioX = width / 1600;
    areas.push({
      width: region.width * ratioX - 4,
      height: region.height * ratioX - 4,
      x: region.x * ratioX + 2,
      y: region.y * ratioX + 2,
      src: region.src ? `url(${region.src})` : "",
      title: region.video?.title,
    });
    areas.map((area) => {
      return (area.css = {
        position: "absolute",
        width: `${area.width}px`,
        height: `${area.height}px`,
        left: `${area.x}px`,
        top: `${area.y}px`,
        backgroundImage: area.src,
        backgroundSize: "contain",
        border: "solid 2px rebeccapurple",
        outline: "solid 1px white",
      });
    });
    return areas;
  });
  let className = ["app-region-menu", open ? "open" : ""].join(" ");

  return (
    <div
      className={className}
      style={{ height, width, border: "solid 1px red" }}
    >
      {areas.map((area, i) => (
        <div
          key={i}
          onClick={() => click && click(i)}
          title={area.title}
          style={area.css}
        ></div>
      ))}
    </div>
  );
};

RegionMenu.defaultProps = { width: 180, height: 110 };
export default RegionMenu;
