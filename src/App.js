import "./App.css";
import Menu from "./components/Layout/Menu/Menu";
import Footer from "./components/Layout/Footer/Footer";
import Layout from './components/Layout/Layout';

function App() {
  const menu = <Menu />;
  const footer = <Footer />;

  const content = (

    <div>To jest pierwszy content</div>
  );

  return <Layout menu={menu} content={content} footer={footer} />;
}

export default App;
