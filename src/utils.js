export function getCookie (cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function toTitleCase (input) {
    if (!input) return ''
    let words = input.split(' ');  
    let ans = [];  
    words.forEach(element => {  
        ans.push(element[0].toUpperCase() + element.slice(1, element.length).toLowerCase());  
    });  
    return ans.join(' '); 
}
