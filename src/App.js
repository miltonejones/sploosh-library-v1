import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  useHistory,
} from "react-router-dom";
import PageLayout from "./components/Views/PageLayout/PageLayout";
import ConnectedVideoGrid from "./components/Views/ConnectedVideoGrid/ConnectedVideoGrid";
import ConnectedModelGrid from "./components/Views/ConnectedModelGrid/ConnectedModelGrid";
import { orderModel, orderVideo, ViewConfig } from "./services/ViewConfig";

function DisplayThumbView(props) {
  const params = useParams();
  const history = useHistory();
  const config = new ViewConfig(history, params);

  const getPage = config.getPage.bind(config);
  const getSort = config.getSort.bind(config);
  const direct = config.direct.bind(config);
  config.configure();

  return (
    <>
      <PageLayout direct={direct} {...config.params}>
        <AppropriateGrid
          payload={config.params}
          getSort={getSort}
          getPage={getPage}
          direct={direct}
        />
      </PageLayout>
    </>
  );
}

function AppropriateGrid(props) {
  const { payload } = props;
  if (payload.type === "model") {
    return <ConnectedModelGrid orderWith={orderModel} {...props} />;
  }
  return <ConnectedVideoGrid orderWith={orderVideo} {...props} />;
}

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route
            path="/search/:param/:page/:sort/:desc"
            children={<DisplayThumbView />}
          />
          <Route
            path="/domain/:domain/:page/:sort/:desc"
            children={<DisplayThumbView />}
          />
          <Route
            path="/:type/:page/:sort/:desc"
            children={<DisplayThumbView />}
          />
          <Route path="/:type/:page/:sort" children={<DisplayThumbView />} />
          <Route path="/:type/:page" children={<DisplayThumbView />} />
          <Route path="/:type" children={<DisplayThumbView />} />
          <Route path="/" children={<DisplayThumbView />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
