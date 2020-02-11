import React,{useState,useEffect} from 'react';
import './App.css';
import { Card, Icon} from 'antd';
import Nav from './Nav';
import { Modal, Button } from 'antd';

// import {useParams} from 'react-router-dom'; 



const { Meta } = Card;

function ScreenArticlesBySource(props) {

// METTRE A JOUR  LE DETAIL DES ARTICLES 
  const [sourcesDetails,setSourcesDetails] = useState([]);
  console.log(props.match.params.id)   // autre manière d'accèder la propriété, let idsource = useParams().id


  useEffect( ()=> {
    async function detailNews () {
      var sourceDataAPI = await fetch(`https://newsapi.org/v2/top-headlines?sources=${props.match.params.id}&apiKey=a160ccf8b17f40afb9cfb3119f82d1eb`);
      var sourceData = await sourceDataAPI.json();
      setSourcesDetails(sourceData.articles);
  }
    detailNews();
  },[])

console.log(sourcesDetails)

// GERER LA MODAL

const [isVisible,setIsVisible] = useState(false);
const [title,setTitle] = useState("");
const [contenu,setContenu] = useState("");
const [image,setImage] = useState("");


var showModal = (title,description,image) => {
  setIsVisible(true);
  setTitle(title);
  setContenu(description);
  setImage(image);
};

var  handleOk = (e)  => {
  console.log(e);
  setIsVisible(false)
};

var handleCancel = (e) => {
  console.log(e);
  setIsVisible(false)
};


// CREER LA LISTE DE CARDS INCLUANT LA MODAL

 let articleDetails = sourcesDetails.map((obj,i) => {

      return(
      <div  key = {i} style={{display:'flex',justifyContent:'center'}}>

      <Card
        style={{ 
        width: 300, 
        margin:'15px', 
        display:'flex',
        flexDirection: 'column',
        justifyContent:'space-between' }}
        cover={
        <img
            alt={obj.title}
            src={obj.urlToImage}
            onClick= {() => showModal(obj.title,obj.content,obj.urlToImage)}
            style = {{
              cursor:"pointer",
              height:"170px",
            }}
        />
        }
        actions={[
            <Icon type="like" key="ellipsis"/>,
            <Icon type="read" key="ellipsis2" onClick= {() => showModal(obj.title,obj.description,obj.urlToImage)}/>,
        ]}
      >

  <Meta
    title= {obj.title}
    description={obj.description}
  />

</Card>
</div>
)

 })

// RETURN GLOBAL DU COMPOSANT

  return (
    <div>
         
            <Nav/>

            <div className="Banner"/>

            <div className="Card">
    
              {articleDetails}
            <div>
                <Modal
                  title={title}
                  visible={isVisible}
                  onOk= {() => handleOk()}
                  onCancel= {() => handleCancel()}
                  okButtonProps={{ hidden: true }}
                  cancelButtonProps={{ hidden: true }}
                >
                  <img src = {image} style = {{width :"100%", paddingBottom:"20px",borderBottom:"#D8D4D4 1px solid", marginBottom:"10px"}}/>
                  <p>{contenu}</p>
                </Modal>
            </div>
            </div>     
      
      </div>
  );
}

export default ScreenArticlesBySource;
