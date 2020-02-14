export default function(token = null, action) {

    if(action.type == 'save-token') {
        var newToken = action.token
        console.log("action-savetoken",action);
        return newToken

    } else if (action.type == "kill-token"){
        var newToken = null;
        console.log("kill-token",action);

        return newToken
    }
    
    else{
        return token
    }

  }