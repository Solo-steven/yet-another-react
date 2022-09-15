# Stack Reconciler

inspired by React official document [Implement Node](https://zh-hant.reactjs.org/docs/implementation-notes.html), Trying to build a simple stack reconciler to mock basic React functionality.

### Folder Structure

all typescript file is in `/src`  folder. pulic api is in `/src/library`

```
----  /src
 | ---- renderer: function like react's HostConfig file. 
 | ---- reconciler: stack reconciler.
 | ---- library : public API in react-styled.
```

### Implement API

- `createElement` : create virtual element. act like jsx `<>` tag.
- `createContainer`  :  return a container instance, act like createContainer in react18.

  - `render` method : render UI and mount it to host-env root.
- `Component Class` : act like react component class, but there is no life-cycle method we can use.

  - setState function : function as setState in React.Component.
  - render function : rerturn next  UI element.
