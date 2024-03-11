
const MINIWIKI_VERSION = [ 0, 0, 0 ];
const MINIWIKI_RELEASED_DATE = "Jan. 1st, 2024";


const MiniWikiTools = {
    WIKI_TYPE: {
        TYPICAL: "TYPICAL"          // TYPICAL: It uses a left bar for navigation and main content on the right
    },
    clearElement: function(element){
        element.innerHTML = "";
    }
};

const MiniWiki = function(title, type, theme){
    const obj = {
        title,
        body: null,
        type,
        theme,
        navMenu: null,
        mainBody: null,
        articles: {},
        registerArticles: function(list){
            return new Promise(function(resolve){
                let loaded = 0;
                let total = list.length;
                const head = document.getElementById('head');
                for(let i = 0; i < list.length; ++i){
                    const script = document.createElement('script');
                    script.onload = function(){
                        ++loaded;
                        if(loaded == total){
                            resolve();
                        }
                    };
                    script.setAttribute("src", `./articles/${list[i]}.js`);
                    head.appendChild(script);
                }

            });
        },
        init: function(body){
            const me = this;
            me.body = body;
            console.log(`MiniWiki v${MINIWIKI_VERSION[0]}.${MINIWIKI_VERSION[1]}.${MINIWIKI_VERSION[2]}`);
            
            const tbTitle = document.getElementById("tb-title");
            tbTitle.innerHTML = title;
            document.title = title;

            switch(type){
                default:
                case MiniWikiTools.WIKI_TYPE.TYPICAL: {
                    const main = document.createElement('div');
                    main.style.backgroundColor = "white";
                    main.style.display = "flex";
                    main.style.flexDirection = "row";
                    main.style.width = "100%";
                    main.style.height = "100vh";

                    const leftBar = document.createElement('div');
                    leftBar.style.display = "flex";
                    leftBar.style.flexDirection = "row"; 
                    leftBar.style.backgroundColor = theme.navegationBackground;                  
                    leftBar.style.width = "20%";
                    leftBar.style.height = "100%";
                    main.appendChild(leftBar);
                    me.navMenu = leftBar;

                    const mainBody = document.createElement('div');
                    mainBody.style.display = "flex";
                    mainBody.style.flexDirection = "row"; 
                    mainBody.style.backgroundColor = theme.bodyBackground;                  
                    mainBody.style.flex = "1";
                    mainBody.style.height = "100%";
                    main.appendChild(mainBody);      
                    me.mainBody = mainBody;          

                    body.appendChild(main);
                    body.style.backgroundColor = theme.topbarbackground;
                    body.style.color = theme.textGeneric;
                    body.style.opacity = 1;
                } break;
            }

            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);

            const artId = urlParams.get("article");
            const refAt = urlParams.get("at");

            if(artId){
                const article = me.getArticleByLink(artId);
                // TODO: go to 404 if it doesn't exist
                me.navigateTo(artId);
            }else{
                // There should be a home article
                me.navigateTo("home");
            }
            
        },
        navigateTo: function(link){
            const me = this;
            if(!me.articles.hasOwnProperty(link)){
                console.error(`Article ${link} does not exist`);
                // TODO: navigate to a 404 window
                return;
            }
            const article = me.articles[link];
            me.renderTo(me.mainBody, article);
        },
        getArticleByLink(link){
            const me = this;
            if(me.articles.hasOwnProperty(link)){
                return me.articles[link]
            }
            return null;
        },
        registerArticle: function(title, contents, keywords, head, useStaticLink = null){
            const me = this;
            let link = title.split(' ').join('_').toLowerCase(); // TODO: Add more clean up
            if(useStaticLink){
                link = useStaticLink;
            }
            const article = {
                title,
                contents,
                keywords,
                link,
                subArticles: {}
            };
            me.articles[link] = article            
            if(head){
                const headArticle = me.getArticleByLink(head);
                if(headArticle){
                    headArticle.subArticles[link] = article;
                }
            }            
        },
        renderTo: function(target, article){
            const me = this;
            MiniWikiTools.clearElement(target);
            
            target.style.display = "flex";
            target.style.flexDirection = "column";

            let str = "";
            let j = 0;
            let lastStyleAt = 0;
            for(let i = 0; i < article.contents.length; ++i){
                const c = article.contents.charAt(i);
                if(c == "!"){
                    const empty = article.contents.indexOf(' ', i);
                    const end = article.contents.indexOf(']', i);
                    const l = Math.min(empty, end);
                    const token = article.contents.substring(i+1, l);
                    switch(token){
                        case 'i': {
                            const toAdd = " font-style: italic; ";
                            str = str.substring(0, lastStyleAt+1) + toAdd + str.substring(lastStyleAt);
                            lastStyleAt += toAdd.length;
                        } break;
                        case 'n': {
                            const toAdd = " font-style: normal; ";
                            str = str.substring(0, lastStyleAt+1) + toAdd + str.substring(lastStyleAt);
                            lastStyleAt += toAdd.length;
                        } break; 
                        case 'b': {
                            const toAdd = " font-weight: bold; ";
                            str = str.substring(0, lastStyleAt+1) + toAdd + str.substring(lastStyleAt);
                            lastStyleAt += toAdd.length;
                        } break;     
                        case 't1': {
                            const toAdd = "  font-size: 5rem;";
                            str = str.substring(0, lastStyleAt+1) + toAdd + str.substring(lastStyleAt);
                            lastStyleAt += toAdd.length;
                        } break;    
                        case 't2': {
                            const toAdd = "  font-size: 3rem;";
                            str = str.substring(0, lastStyleAt+1) + toAdd + str.substring(lastStyleAt);
                            lastStyleAt += toAdd.length;
                        } break;        
                        case 't3': {
                            const toAdd = " font-size: 2rem;";
                            str = str.substring(0, lastStyleAt+1) + toAdd + str.substring(lastStyleAt);
                            lastStyleAt += toAdd.length;
                        } break; 
                        case 'ul': {
                            const toAdd = " border-bottom: 0.15rem solid white;";
                            str = str.substring(0, lastStyleAt+1) + toAdd + str.substring(lastStyleAt);
                            lastStyleAt += toAdd.length;
                        } break;   
                        case 'sep': {
                            const toAdd = " margin-top: 1rem;";
                            str = str.substring(0, lastStyleAt+1) + toAdd + str.substring(lastStyleAt);
                            lastStyleAt += toAdd.length;
                        } break;                                                                                                                                                           
                       
                    }
                    i = l-1;
                    continue;
                }else
                if(c == "["){
                    str += `<div style="${j == 0 ? "width:100%; display:flex; flex-direction:row;" : "flex:1;"}">`;
                    ++j;
                    lastStyleAt = str.length - 3;
                }else
                if(c == "]"){
                    str += `</div>`
                    --j;
                }else{
                    str += c;
                }
            }

            target.innerHTML = str;


        }
    };
    return obj;
};