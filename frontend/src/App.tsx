import React from 'react';
import ReactGA from 'react-ga';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { About } from './About';
import { Player } from './Player';
import { Survey } from './Survey';

ReactGA.initialize('UA-162027634-1');

const App: React.FC = () => {
  const { i18n } = useTranslation();
  return (
    <div className="App" dir={i18n.dir(i18n.language)}>
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
