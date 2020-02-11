import React from 'react';
import './App.css';
import {Menu, Icon} from 'antd';
import { Link } from "react-router-dom";


function Nav() {

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
          <Icon type="logout" />
          Logout
        </Menu.Item>

      </Menu>
    </nav>
  );
}

export default Nav;
