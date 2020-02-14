import React, {useState,useEffect} from 'react';
import './App.css';
import {Input,Button} from 'antd';
import {Redirect } from 'react-router-dom';
import {connect} from 'react-redux';



function ScreenHome(props) {

  const [isLogged,setIsLogged] = useState(false);
  //state sign up
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [userName,setUserName] = useState("");
  const [messageSignUp,setMessageSignUp] = useState("");
  //state sign in
  const [emailSignIn,setEmailSignIn] = useState("");
  const [passwordSignIn,setPasswordSignIn] = useState("");
  const [messageSignIn,setMessageSignIn] = useState("");

//gestion sign up >>>> envoi au back les champs de signup (récupéré par button) et met à jour les états (islogin, message et token)
  var handleSignUp = async () =>{


    if((email=="")||(password=="")||(userName=="")) {
      setMessageSignUp("Champs requis !")
    }

    else {
      let regexMail = new RegExp(/^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}.[a-z]{2,4}$/);
      var regexTest = regexMail.test(email);

      if(regexTest==true) {
        let data = await fetch("/sign-up",{
          method: 'POST',
          headers: {'Content-Type':'application/x-www-form-urlencoded'},
          body: `email=${email}&password=${password}&username=${userName}`
        });
  
        let dataJson = await data.json();
        props.saveToken(dataJson.tokenUser); //enregistre le token dans le store
        setMessageSignUp(dataJson.message); // recupere message de log
        setIsLogged(dataJson.result);

      }
      else {
        setMessageSignUp("Veuillez renseigner une adresse mail valide")
      }

    }
  }

//gestion sign in >>>> envoi au back les champs de signin (récupéré par button) et met à jour les états (islogin, message et token)
  var handleSignIn = async () =>{
    if((emailSignIn=="")||(passwordSignIn=="")) {
      setMessageSignIn("Champs requis !")
    }
    else {
      let data = await fetch("/sign-in",{
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `email=${emailSignIn}&password=${passwordSignIn}`
      });

      let dataJson = await data.json();
      props.saveToken(dataJson.tokenUser);
      setMessageSignIn(dataJson.message)
      setIsLogged(dataJson.result);
    }
  }



  // RETURN GLOBAL DE LA PAGE

  if(isLogged == true) {
    return(
      <Redirect to='/screensource' />
    )
  }
  else {
    return (

      <div className="Login-page" >

            {/* SIGN-IN */}

            <div className="Sign">
                    {isLogged? <div></div>: <div style = {{color:"white"}}>{messageSignIn}</div>}
                    <Input className="Login-input" placeholder="arthur@lacapsule.com" 
                    onChange={(e) => setEmailSignIn(e.target.value)} 
                    value={emailSignIn}/>
                    <Input.Password className="Login-input" placeholder="password" 
                    onChange={(e) => setPasswordSignIn(e.target.value)} 
                    value={passwordSignIn} />
              

              <Button style={{width:'80px'}} type="primary" onClick={()=> handleSignIn() }>Sign-in</Button>

            </div>

            {/* SIGN-UP */}

            <div className="Sign">
                  {isLogged? <div></div>: <div style = {{color:"white"}}>{messageSignUp}</div>}

                    <Input className="Login-input" placeholder="email" 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email}/>
                    
                    <Input className="Login-input" placeholder="username" 
                    onChange={(e) => setUserName(e.target.value)} 
                    value={userName}/>

                    <Input.Password className="Login-input" placeholder="password"
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password} />
              

              <Button style={{width:'80px'}} type="primary" onClick={()=> handleSignUp() }>Sign-up</Button>

            </div>

        </div>
    );
  }
}



//envoi action & data aux reducers
function mapDispatchToProps(dispatch) {
  return {
    saveToken: function(token) { 
      dispatch( {
        type: 'save-token',
        token:token,
    } ) 
  }

  }
}

//recup varible du store 
function mapStateToProps(state) {
  return { 
    token: state.token,
  }
}

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(ScreenHome);
