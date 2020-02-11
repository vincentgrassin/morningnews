import React,{useState,useEffect} from 'react';
import './App.css';
import ScreenHome from './ScreenHome';
import ScreenArticlesBySource from './ScreenArticlesBySource';
import ScreenMyArticles from './ScreenMyArticles';
import ScreenSource from './ScreenSource';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'; 



function App() {

  const [id, setId]= useState(0)

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={ScreenHome} />
        <Route path={"/screenarticlesbysource/:id"} exact component={ScreenArticlesBySource} />
        <Route path="/screenmyarticles" exact component={ScreenMyArticles} />
        <Route path="/screensource" exact component={ScreenSource} />
      </Switch>
    </Router>
  );
}

export default App;
