import React,{useState,useEffect} from 'react';
import {connect} from 'react-redux';
import './App.css';
import { Input, Card, Icon} from 'antd';
import Nav from './Nav';
import { Modal, Button } from 'antd';
// import {useParams} from 'react-router-dom'; 

const { Meta } = Card;



function ScreenArticlesBySource(props) {


// METTRE A JOUR  LE DETAIL DES ARTICLES + search
  const [search,setSearch] = useState("");
  const [sourcesDetails,setSourcesDetails] = useState([]);
  // console.log(props.match.params.id)   // autre manière d'accèder la propriété, let idsource = useParams().id


  useEffect( ()=> {
    async function detailNews () {
      var sourceDataAPI = await fetch(`https://newsapi.org/v2/top-headlines?sources=${props.match.params.id}&apiKey=a160ccf8b17f40afb9cfb3119f82d1eb`);
      var sourceData = await sourceDataAPI.json();
      //Search work 
      let filteredData = sourceData.articles.filter(obj =>(obj.title.includes(search))||(obj.description.includes(search))); // la recherche est inclue dans title ou description
      setSourcesDetails(filteredData);
      // sans la recherche : setSourcesDetails(sourceData.articles);
  }
    detailNews();
  },[search]) //actu au search (si on ne met pas de search - un tableau vierge suffirait)




// GERER LA MODAL

const [isVisible,setIsVisible] = useState(false);
const [title,setTitle] = useState("");
const [contenu,setContenu] = useState("");
const [image,setImage] = useState("");
const [url,setUrl] = useState("");



var showModal = (title,description,image,url) => {
  setIsVisible(true);
  setTitle(title);
  setContenu(description);
  setImage(image);
  setUrl(url);
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

      var isInWishLIist = false; 
      for(let j=0;j<props.wishList.length;j++){
        if(props.wishList[j].title==obj.title){
          isInWishLIist = true
        }
      }
      var styleLike;
      if(isInWishLIist == true) {
        var styleLike = {
          // cursor:"pointer",
          color:"red"
      }} else {
            styleLike = {
              cursor:"pointer",
            }
        }
      
      return(
      <div  key = {i} style={{display:'flex',justifyContent:'center'}}>

      <Card
        className = "card-item"
        style={{ 
        width: 300, 
        margin:'15px', 
        display:'flex',
        flexDirection: 'column',
      }}
        cover={
        <img
            alt={obj.title}
            src={obj.urlToImage}
            onClick= {() => showModal(obj.title,obj.description,obj.urlToImage)}
            style = {{
              cursor:"pointer",
              height:"165px",
            }}
        />
        }
        actions={[
            <Icon type="like" key="ellipsis" style = {styleLike}  onClick= {() => props.LikeFunction(obj.title,obj.description,obj.urlToImage,obj.url,isInWishLIist)}/>,
            <Icon type="read" key="ellipsis2" style = {{cursor:"pointer"}}  onClick= {() => showModal(obj.title,obj.description,obj.urlToImage,obj.url)}/>,
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
            <div style = {{display:'flex', flexDirection:"column",justifyContent:'center',marginTop:"20px", alignItems:"center",borderBottom:"#D8D4D4 1px solid"}}>
                <h1 > Dernières news : {props.match.params.id}</h1>
                <Input placeholder="search" style={{width:"50%", marginBottom:"20px"}}  onChange={(e) => setSearch(e.target.value)}/>
            </div>
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
                  <a href = {url}>En savoir plus</a>

                  
                </Modal>
            </div>
            </div>     
      
      </div>
  );
}


function mapDispatchToProps(dispatch) {
  return {
    LikeFunction: function(title,description,image,url,bool) { 
        let articleContent = {
          title:title,
          description: description,
          image:image,
          url:url
          };
        console.log(bool);
        if(bool == false) {
          dispatch( {
            type: 'like',
            articleContent : articleContent
          } )          
        } 
        else {
          dispatch( {
            type: 'delete',
            title:title,
          } ) 
        }
    } 

  }
}

function mapStateToProps(state) {
  return { 
    wishList: state.wishList,
  }
}


export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(ScreenArticlesBySource);