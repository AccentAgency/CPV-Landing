import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './Components/Global/Inicio';
import Dashboard from './Components/Global/Dashboard';
import Login from './Components/Global/Login';

function App() {
  return (
    <Router>
      <Route path='/' exact component={Home}></Route>
      <Route path={'/DashboardAdmin'} exact component={Dashboard}></Route>
      <Route path={'/Login'} exact component={Login}></Route>
    </Router>
  );
}



export default App;
