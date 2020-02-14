export default function(language = "fr", action) {

    if(action.type == 'language-change') {
        var newLanguage = action.language
        console.log("language",action);
        return newLanguage

    } else {
        return language
    }

  }