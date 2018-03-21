import React from 'react';
import { Route } from 'react-router-dom';
import Home from './components/home';
import About from './components/about';

const App = () => (
  <div>
    <main>
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={About} />
    </main>
  </div>
);

export default App;
