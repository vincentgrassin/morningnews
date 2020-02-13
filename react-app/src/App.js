import React,{useState,useEffect} from 'react';
import './App.css';
import ScreenHome from './ScreenHome';
import ScreenArticlesBySource from './ScreenArticlesBySource';
import ScreenMyArticles from './ScreenMyArticles';
import ScreenSource from './ScreenSource';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'; 
import wishList from './reducers/like.reducer';
import token from './reducers/token.reducer';

import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';
const store = createStore(combineReducers({wishList,token}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

function App() {

  const [id, setId]= useState(0)

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" exact component={ScreenHome} />
          <Route path={"/screenarticlesbysource/:id"} exact component={ScreenArticlesBySource} />
          <Route path="/screenmyarticles" exact component={ScreenMyArticles} />
          <Route path="/screensource" exact component={ScreenSource} />
        </Switch>
      </Router>
    </Provider>

  );
}

export default App;
