import React,{useState,useEffect} from 'react';
import {connect} from 'react-redux';
import './App.css';
import { List, Avatar} from 'antd';
import Nav from './Nav';
import { Link,Redirect } from "react-router-dom";



function ScreenSource(props) {

  const [sources,setSources] = useState([]);
  const [language,setLanguage] = useState(props.language);


// CHARGEMENT DES SOURCES - à l'initialisaiton du selon la valeur de language dernièremennt enregistrée en DB
useEffect( ()=> {
  async function getLanguage() {
  var data = await fetch('/langue', { 
    method: 'POST',
    headers: {'Content-Type':'application/x-www-form-urlencoded'},
    body: `token=${props.token}`
  });
  var dataJson = await data.json();
  LanguageChange(dataJson.langue); 
}
  getLanguage();
},[])

var LanguageChange = (lg) =>{
  setLanguage(lg) // le fait de changer cet état va actionner le use effect qui charge les sources via l'api (cf ligne 36)
  props.Language(lg)
}



// CHARGEMENT DES SOURCES - à chaque changement de language (remarque le changement de language n'est pas enregistré en db (seulement au logout))
useEffect( ()=> {
    async function apiNews () {var sourceDataAPI = await fetch(`https://newsapi.org/v2/sources?apiKey=a160ccf8b17f40afb9cfb3119f82d1eb&country=${language}`);
    var sourceData = await sourceDataAPI.json();  
    setSources(sourceData.sources);
  }
    apiNews();
  },[language])



// CREATION des éléments sources
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





//RETURN GLOBAL DE LA PAGE

  if(props.token === null) {
    return(
      <Redirect to='/' />
    )

  } 
  else {

    return (
    <div>
        <Nav/>
       
       <div className="Banner"/>
       <div className ="flags">
          <img src = "/images/french.png" style = {{height:"40px",paddingRight:"5px", cursor:"pointer"}} onClick= {() => LanguageChange("fr")}/>
          <img src = "/images/uk2.png" style = {{height:"40px",paddingLeft:"5px", cursor:"pointer"}} onClick= {() => LanguageChange("gb")}/>

       </div>

       <div className="HomeThemes">
          
              <List
                  itemLayout="horizontal"
                  dataSource={dataSource}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title={<Link to={`/screenarticlesbysource/${item.id}/${props.language}`}>{item.title}</Link>}
                        description={item.description}
                      />
                    </List.Item>
                  )}
                />


          </div>
                 
      </div>
  );
  }
}




// ENVOI dans le store le langage au click
function mapDispatchToProps(dispatch) {
  return {
    Language: function(language) { 
      dispatch( {
        type: 'language-change',
        language:language,
    } ) 
  }
  }
}


// RECUP le token et le language stocké dans le store pour actualisation au click
function mapStateToProps(state) {
  return { 
    language: state.language,
    token:state.token,
  }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(ScreenSource);




// export default ScreenSource;
