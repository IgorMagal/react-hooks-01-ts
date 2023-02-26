import "./App.css";
import Auth from "./components/Auth";
import Ingredients from "./components/Ingredients/Ingredients";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";

const App = () => {
  const authCtx = useContext(AuthContext);
  return <>{authCtx.isAuth ? <Ingredients /> : <Auth />}</>;
};

export default App;
