var scripts =  document.getElementsByTagName('script');
var torefreshs = ["scripts-base.js", "sidebar.js", "index.js"] ; // list of js to be refresh
var key = Math.round(Math.random() * 1000); // change this key every time you want force a refresh
for(let i = 0; i < scripts.length; i++) {
    if (scripts[i].src.includes("/scripts/")) {
        let filename = scripts[i].src.split("/scripts/")[1]
        if (torefreshs.includes(filename)) {
            scripts[i].src = scripts[i].src + "?k=" + key
        }
    }
}