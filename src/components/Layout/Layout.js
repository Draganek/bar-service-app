import withClass from "../../hoc/withClass";

function Layout(props) {
  return (
    <div >
      <div className="container">{props.menu}</div>
      <div className="container">{props.content}</div>
      <div>{props.footer}</div>
    </div>
  );
}

export default withClass(Layout, "layout");
