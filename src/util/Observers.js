class Observer {
  subscribe(fn) {
    this.fn = fn;
    return this;
  }
  unsubscribe() {
    this.fn = null;
  }
  next(value) {
    this.fn && this.fn(value);
  }
}

const threadResponse = new Observer();
const importResponse = new Observer();

const indexDbResponse = new Observer();
const ConnectedVideoGridUnload = new Observer();
const AppSidebarExpand = new Observer();
const VideoWindowOpened = new Observer();
const ServerConnected = new Observer();
const SearchParamChanged = new Observer();

export {
  ConnectedVideoGridUnload,
  AppSidebarExpand,
  VideoWindowOpened,
  ServerConnected,
  threadResponse,
  importResponse,
  SearchParamChanged,
  indexDbResponse,
};
