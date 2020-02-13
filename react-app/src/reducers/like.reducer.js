export default function(wishList = [], action) {
    var newArrayLike;

    switch (action.type) {
        case 'like': 
            let isAlready = wishList.every(obj => obj.title !== action.articleContent.title);
            if(isAlready==true) {
                newArrayLike = [...wishList];
                newArrayLike.push(action.articleContent);
            } else {
                newArrayLike = [...wishList];
            }
            return newArrayLike
            break;
    
        case 'delete': 
            newArrayLike = wishList.filter(obj=>obj.title!==action.title);
            return newArrayLike;
            break;
    
        default:
            return wishList;
      }

  }