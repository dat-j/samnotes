import StorageKeys from "./storage-keys";
import jwt_decode from 'jwt-decode';

export function checkJWT(){
    let isExpried=true
    let token = localStorage.getItem(StorageKeys.TOKEN) || "";
    if (Boolean(token)) {
        let decodedToken = jwt_decode(token);
        let currentDate = new Date();

        // JWT exp is in seconds
        if (decodedToken.exp * 10000 < currentDate.getTime()) {
            
            isExpried=true
            localStorage.removeItem(StorageKeys.TOKEN);
            localStorage.removeItem(StorageKeys.USER);
            
        } else {
            isExpried =false
        }
    }
    return isExpried
}


export function convertColor(object_color){
    return `rgba(${object_color.r},${object_color.g},${object_color.b},${object_color.a})`
}
export function reName(n) {
    const x = n.split(" ");
    const rs = x[0][0].toUpperCase() + x[x.length - 1][0].toUpperCase();
    return rs;
};