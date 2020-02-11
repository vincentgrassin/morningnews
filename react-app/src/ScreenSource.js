import React,{useState,useEffect} from 'react';
import './App.css';
import { List, Avatar} from 'antd';
import Nav from './Nav';
import { Link } from "react-router-dom";



function ScreenSource() {

  const [sources,setSources] = useState([]);
  useEffect( ()=> {
    async function apiNews () {var sourceDataAPI = await fetch(`https://newsapi.org/v2/sources?apiKey=a160ccf8b17f40afb9cfb3119f82d1eb&country=fr&language=fr`);
    var sourceData = await sourceDataAPI.json();  
    setSources(sourceData.sources);
  }
    apiNews();
  },[])

  let dataSource = sources.map(obj => {
    return(
      {
        title:obj.name,
        url:obj.url,
        description:obj.description,
        id: obj.id
      }
   );
  })


  return (
    <div>
        <Nav/>
       
       <div className="Banner"/>

       <div className="HomeThemes">
          
              <List
                  itemLayout="horizontal"
                  dataSource={dataSource}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title={<Link to={`/screenarticlesbysource/${item.id}`}>{item.title}</Link>}
                        description={item.description}
                      />
                    </List.Item>
                  )}
                />


          </div>
                 
      </div>
  );
}

export default ScreenSource;
