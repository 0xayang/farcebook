import './App.css';
import Economy from './Economy'
import InheritanceGame from './InheritanceGame'
import Smithy from './Smithy'
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/smithy">Smithy</Link>
            </li>
            <li>
              <Link to="/economy">Economy</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/home">
            <InheritanceGame></InheritanceGame>
          </Route>
          <Route path="/smithy">
            <Smithy></Smithy>
          </Route>
          <Route path="/economy">
            <Economy></Economy>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
