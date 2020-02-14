import React,{useState,useEffect} from 'react';
import {connect} from 'react-redux';
import './App.css';
import { Input, Card, Icon} from 'antd';
import Nav from './Nav';
import { Modal, Button } from 'antd';
import { Link,Redirect } from "react-router-dom";

// import {useParams} from 'react-router-dom'; 
// console.log(props.match.params.id)   // autre manière d'accèder la propriété, let idsource = useParams().id

const { Meta } = Card;



function ScreenArticlesBySource(props) {


// METTRE A JOUR  LE DETAIL DES ARTICLES + search
  const [search,setSearch] = useState("");
  const [sourcesDetails,setSourcesDetails] = useState([]);
  const [completeData,setCompleteData] = useState([]); // sauve une version complète des articles extraits de l'api


  // AFFICHAGE  du contenu de chaque source à l'initialisation
  useEffect( ()=> {
    async function detailNews () {
      var sourceDataAPI = await fetch(`https://newsapi.org/v2/top-headlines?sources=${props.match.params.id}&apiKey=a160ccf8b17f40afb9cfb3119f82d1eb`);
      var sourceData = await sourceDataAPI.json();
      setCompleteData(sourceData.articles); // sauvegarde le résultat de l'API pour la recherche (revenir en arrière dans la recherche)
      setSourcesDetails(sourceData.articles); // initialisation de la liste

  }
    detailNews();
  },[])


    // AJOUT d'un articke en wish list (envoi des infos à la db) manque un bool pour bien gérer la séléction des pouces 
  async function AddtoWishList (token,title,description,image,url,bool,language) {

    console.log(bool)
    await fetch('/add-article', { 
    method: 'POST',
    headers: {'Content-Type':'application/x-www-form-urlencoded'},
    body: `title=${title}&description=${description}&img=${image}&url=${url}&token=${token}&language=${language}`
  });
  
 }

 


  // OUTIL DE RESEARCH - a chaque click filtre un tableau de data conservé et réassigne la valeur de l'état
  useEffect( ()=> { //au search on réassigne a source détail un tableau filtré à partir du tableau qui sauvegarde les résultats de l'api
    async function Search () {
        let filteredData = completeData.filter(obj =>(obj.title.includes(search))||(obj.description.includes(search))); // la recherche est inclue dans title ou description
        setSourcesDetails(filteredData);
  }
    Search();
  },[search])



// GESTION de la modal

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



  // RECUPERATION DE LA WISHLIST pour affichage des pouces clickés rouge
  const [wishListUser,setWishListUser] = useState([])
  useEffect(() => {
    async function getWishList () {
      var data = await fetch('/wishlist-article', { 
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `token=${props.token}`
      });
      
      var dataWishList = await data.json();
     setWishListUser(dataWishList.articles)
    
    }
    getWishList(); 
  },[])
  

// CREER LA LISTE DE CARDS INCLUANT LA MODAL

 let articleDetails = sourcesDetails.map((obj,i) => {
      var isInWishLIist = false; 
      for(let j=0;j<wishListUser.length;j++){
        if(wishListUser[j].title==obj.title){
          isInWishLIist = true
        }
      }
      var styleLike;
      if(isInWishLIist == true) {
        var styleLike = {
          cursor:"pointer",
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
            onClick= {() => showModal(obj.title,obj.description,obj.urlToImage,obj.url)}
            style = {{
              cursor:"pointer",
              height:"165px",
            }}
        />
        }
        actions={[
            <Icon type="like" key="ellipsis" style = {styleLike}  onClick= {() => AddtoWishList(props.token,obj.title,obj.description,obj.urlToImage,obj.url,isInWishLIist,props.match.params.language)}/>,
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
}



// INUTILE envoi au store des informations (à supprimer car géré uniquement en db maintenant)
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

// Recup info
function mapStateToProps(state) {
  return { 
    wishList: state.wishList,
    token:state.token
  }
}


export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(ScreenArticlesBySource);