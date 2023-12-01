import withClass from "../../hoc/withClass";

function Layout(props) {
  return (
    <div >
      <div>{props.menu}</div>
      <div>{props.content}</div>
      <div>{props.footer}</div>
    </div>
  );
}

export default withClass(Layout, "layout");
