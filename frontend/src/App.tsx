import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { About } from './About';
import { Survey } from './Survey';

const App = () => {
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
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
