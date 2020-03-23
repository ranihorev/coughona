import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Survey } from './Survey';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/">
            <Survey />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
