import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { About } from './About';
import { Player } from './Player';
import { Survey } from './Survey';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-162027634-1');

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Survey />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/player">
            <Player />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
