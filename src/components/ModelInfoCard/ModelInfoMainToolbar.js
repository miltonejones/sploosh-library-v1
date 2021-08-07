import {
  CheckCircleOutline,
  Error,
  ExpandMore,
  Favorite,
  PersonOutline,
  Search,
  Shop,
  StarBorder,
} from "@material-ui/icons";
import { WindowManagerService } from "../../services/WindowManager";

const ModelInfoCardMode = {
  NORMAL: 0,
  FAVORITE: 1,
  COSTAR: 2,
  SELECT: 3,
  EDIT: 4,
  ASSIGN: 5,
};

const DrawButtons = (model, unattributed, mode, assignUnattributed) => {
  const favorites = model?.related?.filter((f) => !!f.favorite);
  const costars = model?.costars?.length;
  return [
    {
      icon: <Error />,
      count: unattributed?.length,
      when: () => !!unattributed?.length,
      mode: "ASSIGN",
    },
    {
      icon: <StarBorder />,
      when: () => mode === ModelInfoCardMode.ASSIGN,
      mode: "ASSIGN",
      click: assignUnattributed,
    },
    {
      icon: <PersonOutline />,
      count: costars,
      when: () => !!costars,
      mode: "COSTAR",
    },
    {
      icon: <Favorite />,
      count: favorites?.length,
      when: () => !!favorites?.length,
      mode: "FAVORITE",
    },
    {
      icon: <CheckCircleOutline />,
      mode: "SELECT",
    },
    {
      icon: <Search />,
      click: () =>
        window.open(WindowManagerService.googlePhotoLink(model.name)),
    },
    {
      icon: <Shop />,
      shop: !0,
    },
    {
      icon: <ExpandMore />,
      mode: "EDIT",
    },
  ];
};

export { ModelInfoCardMode, DrawButtons };
