import React from 'react';
import './App.css';
import {Menu, Icon} from 'antd';
import { Link } from "react-router-dom";
import {connect} from 'react-redux';


function Nav(props) {

  

  return (
    <nav >
      <Menu style={{textAlign: 'center'}} mode="horizontal" theme="dark">

        <Menu.Item key="mail">
          <div style={{display: "flex", alignItems: "center"}} >
            <Icon type="home" />
            <Link style={{color: "#FFFFFF"}} to="/screensource">Sources</Link>
          </div>

        </Menu.Item>

        <Menu.Item key="test">
          <div style={{display: "flex", alignItems: "center"}} >
            <Icon type="read" />
            <Link style={{color: "#FFFFFF"}} to="/screenmyarticles">My Articles</Link>
          </div>
        </Menu.Item>

        <Menu.Item key="app">
          <Link onClick= {() => props.deleteToken()}>
            <Icon type="logout" />
            Logout
          </Link>
        </Menu.Item>

      </Menu>
    </nav>
  );
}


function mapDispatchToProps(dispatch) {
  return {
    deleteToken: function() { 
      dispatch( {
        type: 'kill-token',
    } ) 
  }
  }
}



export default connect(
  null, 
  mapDispatchToProps
)(Nav);
