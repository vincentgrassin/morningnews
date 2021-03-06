import React, {useState,useEffect} from 'react';
import {connect} from 'react-redux';
import './App.css';
import { Modal,Card, Icon} from 'antd';
import Nav from './Nav';
import {Redirect } from 'react-router-dom';


const { Meta } = Card;

function ScreenMyArticles(props) {

  const [wishListUser,setWishListUser] = useState([])

// AFFICHAGE DE LA WISHLIST au chagement de la page

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

// DELETE de la wishlist (et réassignement de létat wishlist au click
var removeWishList = async (id) =>{ 
 var data = await fetch(`/wishlist-article/${id}/${props.token}`, {
  method: 'DELETE'
  
});
  var dataWishList = await data.json();
  setWishListUser(dataWishList.sendUser.articles)
  }


//CREATION DES CARDS wishlist
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
          <Icon type="delete" key="ellipsis" style = {{cursor:"pointer"}} onClick= {() => removeWishList(obj._id)}/>,
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


//GESTIon de la modal

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



// GESTION DU MESSAGE EMPTY
if(wishListUser.length>0) {
  var isEmpty = false;
}else {
  var isEmpty = true;
}


// GESTION DU FILTRE DE LANGUE (réassigne l'état de la wish list)
var filterLanguage = async (lg) =>{
  var data = await fetch('/wishlist-article', { 
    method: 'POST',
    headers: {'Content-Type':'application/x-www-form-urlencoded'},
    body: `token=${props.token}`
    });
    
  var dataWishList = await data.json();
  var filteredArray = dataWishList.articles.filter(obj => (obj.language == lg))
  setWishListUser(filteredArray)
}


// RETURN GLOBAL DE LA PAGE
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
                <img src = "/images/french.png" style = {{height:"40px",paddingRight:"5px", cursor:"pointer"}} onClick= {() => filterLanguage("fr")}/>
                <img src = "/images/uk2.png" style = {{height:"40px",paddingLeft:"5px", cursor:"pointer"}} onClick= {() => filterLanguage("gb")}/>
            </div>
                
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
}


// ENVOI ET RECUP AUX REDUCERS


// Inutile (le delete passe par la db)
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

// RECUP TOKEN
function mapStateToProps(state) {
  return { 
    wishList: state.wishList,
    token:state.token
  }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(ScreenMyArticles);
