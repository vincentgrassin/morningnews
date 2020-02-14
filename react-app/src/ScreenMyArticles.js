import React, {useState,useEffect} from 'react';
import {connect} from 'react-redux';
import './App.css';
import { Modal,Card, Icon} from 'antd';
import Nav from './Nav'

const { Meta } = Card;

function ScreenMyArticles(props) {


 console.log("wl",props.wishList)

  var wishListUser = [
    {
    title:"Test1",
    description:"descriptionoooo",
    img:"img",
    url:"http://url"},
    {
    title:"Test2",
    description:"descriptionoooo",
    img:"img",
    url:"http://url"},
  ]

// appel à la liste des article en WL

useEffect(() => {
  async function getWishList () {
    var data = await fetch("/wishlist-article");
    var dataWishList = await data.json();
    console.log("dataWL",dataWishList)
  
  }
  getWishList(); 
},[])


// delete de la wishlist à la liste des article en WL
var removeWishList = async (title) =>{ 
  await fetch(`/wishlist-movie/${title}`, {
  method: 'DELETE'
});

}


// Génère la liste de mes articles 
  let articleWishLIst = wishListUser.map((obj,i) => {

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
          alt=""
          src= {obj.img}
          style = {{
            cursor:"pointer",
            height:"165px",
          }}
          onClick= {() => showModal(obj.title,obj.description,obj.img,obj.url)}
      />
      }
      actions={[
          <Icon type="delete" key="ellipsis" style = {{cursor:"pointer"}} onClick= {() => props.deleteFunction(obj.title)}/>,
          <Icon type="read" key="ellipsis2" style = {{cursor:"pointer"}} onClick= {() => showModal(obj.title,obj.description,obj.img,obj.url)}/>,
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


//Gestion de la modal

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
  console.log(title,description,image,url)
};

var  handleOk = (e)  => {
  console.log(e);
  setIsVisible(false)
};

var handleCancel = (e) => {
  console.log(e);
  setIsVisible(false)
};



// Gestion du message pas d'articles
if(wishListUser.length>0) {
  var isEmpty = false;
}else {
  var isEmpty = true;
}


// RETURN GLOBAL DE LA PAGE

  return (
    <div>

            <Nav/>

            <div className="Banner"/>
                
            {isEmpty? 
              <div style = {{display:"flex", flexDirection:"column", justifyContent:"center", marginTop:'30px',alignItems:"center"}}>
                <div style = {{color:"black",fontSize:"24px"}}>Pas d'articles en favoris</div>
                <img src = "/images/empty-box.png" style = {{height:"100px"}}/>
              </div>
              :
              <div style = {{display:"flex", justifyContent:"center", marginTop:'30px',}}>
                <div style = {{color:"black",fontSize:"24px"}}>Mes articles favoris</div> 
              </div>}
            <div className="Card">
    
              {articleWishLIst}                  

             </div>
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
  );
}


// ENVOI ET RECUP AUX REDUCERS

function mapDispatchToProps(dispatch) {
  return {
    deleteFunction: function(title) { 
      dispatch( {
        type: 'delete',
        title:title,
    } ) 
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
)(ScreenMyArticles);
