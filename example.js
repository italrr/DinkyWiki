const dinkywiki = DinkyWiki("The Animal Wiki", DinkyWikiTools.WIKI_TYPE.TYPICAL, {
    topbarbackground: '#201229',
    navegationBackground: '#1d0c29',
    bodyBackground: '#0c0c0c',
    textGeneric: "#fff",
    highlight: "#ffffaa"
});

// Start Wiki
setTimeout(function(event){
    console.log("timeout");
    dinkywiki.manualRegisterArticles([
        'home',
        'bear',
        'bird',
        'styling'
    ]);
    dinkywiki.init(document.getElementById("body"));      
    console.log("end");
    // Set `enter` key bind for search
    const tbSearchBar = document.getElementById('tb-search-input');              
    tbSearchBar.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) { // TODO: Fix deprecated code
            onSearch();
        }
    });
}, 1000);

// Handle search
const onSearch = function(){
    const value = document.getElementById('tb-search-input').value;
    if(value.length == 0){
        alert("Empty query");
        return;
    }
    dinkywiki.search(value);
};