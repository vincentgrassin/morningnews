export default function(token = "", action) {

    if(action.type == 'save-token') {
        var newToken = action.token
        console.log("action-savetoken",action);
        return newToken

    } else {
        return token
    }

  }