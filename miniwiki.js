
const MINIWIKI_VERSION = [ 0, 0, 0 ];
const MINIWIKI_RELEASED_DATE = "Jan. 1st, 2024";


const MiniWikiTools = {
    WIKI_TYPE: {
        TYPICAL: "TYPICAL"          // TYPICAL: It uses a left bar for navigation and main content on the right
    },
    clearElement: function(element){
        element.innerHTML = "";
    },
    cleanNewLine: function(input){
        let result = "";

        for(let i = 0; i < input.length; ++i){
            const c = input.charAt(i);
            if(c == "\n"){
                continue;
            }
            result += c;
        }

        return result;
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
        history: [],
        currentArticle: null,
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

            me.loadHistory();

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

            const refreshNav = function(skipPush = false){
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
    
                const artId = urlParams.get("article");
                const refAt = urlParams.get("at");
    
                if(artId){
                    const article = me.getArticleByLink(artId);
                    me.navigateTo(article.link, skipPush);
                }else{
                    // There should be a home article
                    me.navigateTo("home", skipPush);
                }
            };

            refreshNav();

            window.addEventListener("popstate", (event) => {
                const urlParams = new URLSearchParams(window.location.search);
                me.navigateTo(urlParams.get("article"), true);
            });
                     

        },
        navigateTo: function(link, skipPush = false){
            const me = this;
            if(!me.articles.hasOwnProperty(link)){
                console.error(`Article ${link} does not exist`);
                // TODO: navigate to a 404 window
                return;
            }
            const article = me.articles[link];
            me.currentArticle = article;
            const url = location.protocol + '//' + location.host + location.pathname;           
            document.title = `${article.title} - ${me.title}`;
            me.addHistory(link);
            if(!skipPush){
                history.pushState(history.state, "", `${url}?article=${link}`);
            }
            me.renderTo(me.mainBody, article, false);
            me.refreshNavBar();
        },
        addHistory: function(entry){
            const me = this;
            if(me.history.includes(entry)){
                me.history.splice(me.history.indexOf(entry), 1);
            }
            me.history.push(entry);
            localStorage.setItem("history", JSON.stringify(me.history));
        },
        loadHistory: function(){
            const me = this;
            const list = localStorage.getItem("history");
            me.history = list ? JSON.parse(list) : [];
        },
        refreshNavBar: function(){
            const me = this;
            const target =  me.navMenu;
            MiniWikiTools.clearElement(target);

            target.style.display = "flex";
            target.style.flexDirection = "column";
            target.style.fontSize = "1.5rem";
            target.style.fontWeight = "normal";

            let html = "";
            console.log(me.currentArticle.sections);
            // Table of contents
            if(Object.keys(me.currentArticle.sections).length > 0){
                let list = "";
                const url = location.protocol + '//' + location.host + location.pathname;    
                let n = 0;
                for(let i in me.currentArticle.sections){
                    const sec = i;
                    const title = me.currentArticle.sections[i];
                    let subtitles = "";
                    for(let j = 0; j < title.length; ++j){
                        const subtitle = me.currentArticle.sections[i][j];
                        subtitles += `
                            <div style="width: 100%; font-size:0.8em;">
                                <div style="margin-left: 1rem; display:inline-block;">
                                    ${me.generateLink(`${j+1}. ${subtitle}`, me.currentArticle.link, `${sec.replace(' ', '_')}#${subtitle.replace(' ', '_')}`)}

                                    
                                </div>
                            </div>
                        `;
                    }
                    list += `<div style="margin-bottom:0.25rem;">
                        <div style="font-weight:bold;">${n+1}. ${sec}</div>
                        ${subtitles}
                        </div>
                    `;
                    ++n;
                }
                html +=  
                        `<div>
                            <div style="font-weight: bold; width: 100%; text-align:center; margin-top:2rem;">
                                <div>TABLE OF CONTENTS</div>
                            </div>
                            <div style="display: flex; flex-direction:row; margin-top: 2rem;">
                                <div style="flex:1"></div>
                                <div style="width:50%;">
                                    ${list}
                                </div>
                                <div style="flex:1"></div>
                            </div>
                        </div>`
                    
            }

            // hierarchy

            // history


            target.innerHTML = html;
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
                head: null,
                sections: [],
                html: null,
                subArticles: {}
            };
            article.html = me.parseToHTML(article.contents, article);
            me.articles[link] = article            
            if(head){
                const headArticle = me.getArticleByLink(head);
                if(headArticle){
                    article.head = headArticle;
                    headArticle.subArticles[link] = article;
                }
            }            
        },
        fetchMediaParams: function(input){
            const me = this;
            const params = {};
            const items = me.splitAroundFragmet(input, ' ');
            for(let i = 0; i < items.length; ++i){
                const item = items[i];
                const subitems = me.splitAroundFragmet(item, ":");
                const id = subitems[0];
                const value = me.parseLiteralParam(subitems[1]);
                params[id] = value;
            }
            return params;
        },
        splitAroundFragmet: function(input, find){
            // will ignore things '
            const output = [];
            let inStr = false;
            let str = "";
            for(let i = 0; i < input.length; ++i){
                const c = input.charAt(i);
                if(c == "'"){
                    inStr = !inStr;
                }
                if(c == find && !inStr || i == (input.length-1)){
                    if(i == (input.length-1)){
                        str += c;
                    }
                    output.push(str);
                    str = "";
                }else{
                    str += c;
                }
            }
            return output;
        },
        findNextFragment: function(input, find, from){
            // will ignore things '
            let inStr = false;
            for(let i = from; i < input.length; ++i){
                if(input.charAt(i) == "'"){
                    inStr = !inStr;
                }
                if(inStr){
                    continue;
                }
                if(input.charAt(i) == find){
                    return i;
                }
            }
            return -1;
        },
        parseLiteralParam: function(input){
            let result = input;
            if(result.charAt(0) == "'" && result.charAt(result.length-1) == "'"){
                result = input.substring(1, input.length-1);
            }
            if(result.charAt(result.length-1) !=  "%" && !isNaN(result)){
                result += "rem";
            }
            return result;
        },
        generateDefaultParams: function(params, asStyle, useDefault = null){
            let result = "";

            const genType = function(name, val){
                return asStyle ? `${name}:${val};` : `${name}="${val}"`
            };

            if(params.hasOwnProperty("width")){
                result = `${result} ${genType("width", params["width"])}`;
            }
            if(params.hasOwnProperty("height")){
                result = `${result} ${genType("height", params["height"])}`;
            }            
            if(useDefault){
                for(let i in useDefault){
                    if(!params.hasOwnProperty(i)){
                        result = `${result} ${genType(i, useDefault[i])}`;
                    }
                }
            }
            return result
        },
        findParam: function(params, name, backup){
            return params.hasOwnProperty(name) ? params[name] : backup;
        },
        generateLink: function(label, link, at){
            const url = location.protocol + '//' + location.host + location.pathname;
            return `<a href="${url}?article=${link}${at ? `&at=${at}` : ''}" onClick="(function(){ miniwiki.navigateTo('${link}'); return false; })();return false;" >${label}</a>`;
        },
        parseToHTML: function(_input, root, defaultBlock = "width:100%; display:flex; flex-direction:row;"){
            const me = this;
            let str = "";
            let j = 0;
            let lastStyleAt = 0;
            let lastChar = "";
            const input = MiniWikiTools.cleanNewLine(_input);
            if(root){
                root.sections = {};
            }
            let currentTitle = "";
            let currentSubTitle = "";            
            for(let i = 0; i < input.length; ++i){
                const c = input.charAt(i);
                // Literals
                if(c == "/" && i < input.length-1){
                    const nc = input.charAt(i+1);
                    if(nc == "["){
                        str += "[";
                        i += 1;
                        continue;
                    }else
                    if(nc == "]"){
                        str += "]";
                        i += 1;
                        continue;
                    }
                }else
                // Helpers
                if(c == "%"){
                    const closed = me.findNextFragment(input, "%", i+1);
                    const media = input.substring(i+1, closed);
                    const empty = media.indexOf(" ");
                    const token = media.substring(0, empty);
                    const params = me.fetchMediaParams(media.substring(empty+1));
                    switch(token){
                        case "hierarchy": {
                            const list = [];
                            const fetch = function(origin){
                                list.push({
                                    title: origin.title,
                                    link: origin.link
                                });
                                if(origin.head){
                                    fetch(origin.head)
                                }
                            };
                            fetch(root);
                            list.reverse();
                            let html = `<div style="font-size:1.5rem; text-shadow: 0.09rem 0.09rem black;">⤑`;
                            for(let i = 0; i < list.length; ++i){
                                html += `
                                    <div style="margin-right:0.1rem; display:inline-block;" >
                                        ${me.generateLink(list[i].title, list[i].link, null)}
                                    </div>
                                `;
                                if(i < list.length-1){
                                    html += `
                                        <div style="font-weight:bold; display:inline-block;"> → </div>
                                    `;
                                }
                            }
                            str += `${html}</div>`;
                        } break;
                        case "link": {
                            str += me.generateLink(params.label, params.id);
                        } break;
                        case "subtitle":
                        case "title": {
                            let fs = "3";
                            if(token == "subtitle"){
                                fs = "2";
                                currentSubTitle = params.label;
                            }else{
                                currentSubTitle = params.label;
                                currentTitle = params.label;
                            }
                            str += `<div style="${token == "subtitle" ? 'font-weight:bold;' : `border-bottom: 0.25rem solid ${me.theme.textGeneric};`}">
                                <div style="font-size: ${fs}rem;">${params.label}</div>
                            </div>`;
                            if(root){
                                if(!root.sections.hasOwnProperty(currentTitle)){
                                    root.sections[currentTitle] = [];
                                }
                                root.sections[currentTitle].push(currentSubTitle);
                            }
                        } break;                        
                        case "url": {
                            str += `<a href="${params.url}">${params.label}</a>`;
                        } break;
                        case "card-video":
                        case "card-img": {
                            const defaultParams = {
                                width: "100%"
                            };
                            const style = me.generateDefaultParams(params, true, defaultParams);
                            str += `
                                <div style="${style} background-color:${me.theme.topbarbackground};
                                    border-left: 1rem solid ${me.theme.topbarbackground};
                                    border-top: 1rem solid ${me.theme.topbarbackground};
                                    border-right: 1rem solid ${me.theme.topbarbackground};
                                    border-radius:0%;">
                                    ${
                                        token == "card-img" ?
                                        `<img style="width: 100%;" src="./${params.src}" />` :
                                        `<video paused onloadstart="this.volume=0.5; this.pause()" autoplay="false" controls style="width: 100%;" src="./${params.src}" ></video>`
                                    }
                                    <div style="width: 100%; text-align:${me.findParam(params, "title-align", "center")}; margin-top:0.1rem; margin-bottom:0.1rem;">
                                        ${me.parseToHTML(params.title, null, `width:100%; display:inline-block;`)}
                                    </div>
                                </div>`;
                        } break;                        
                        case "img": {
                            str += `<img ${me.generateDefaultParams(params, false)} src="./${params.src}"></img>`;
                        } break;
                        case "video": {
                            str += `    
                                <video onloadstart="this.volume=0.5; this.pause()" autoplay="false" paused controls ${me.generateDefaultParams(params, false)} src="./${params.src}"></video>
                            `;
                        } break;
                        case "embed": {
                        } break;                        
                    }
                    i = closed;
                }else
                // Styling
                if(c == "!"){
                    const empty = input.indexOf(' ', i);
                    const end = input.indexOf(']', i);
                    const eq = input.indexOf('=', i);
                    const l = Math.min(empty, end);
                    let token = input.substring(i+1, l);
                    let param = null;
                    if(eq != -1 && eq < l){
                        token = input.substring(i+1, eq);
                        param = input.substring(eq+1, l);
                    }
                    switch(token){
                        case 'i': {
                            const toAdd = " font-style: italic;";
                            str = str.substring(0, lastStyleAt+1) + toAdd + str.substring(lastStyleAt);
                            lastStyleAt += toAdd.length;
                        } break;
                        case 'n': {
                            const toAdd = " font-style: normal;";
                            str = str.substring(0, lastStyleAt+1) + toAdd + str.substring(lastStyleAt);
                            lastStyleAt += toAdd.length;
                        } break; 
                        case 'b': {
                            const toAdd = " font-weight: bold;";
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
                        case 'tn': {
                            let amount = 1;
                            if(param){
                                amount = param;
                            }                            
                            const toAdd = ` font-size: ${amount}rem;`;
                            str = str.substring(0, lastStyleAt+1) + toAdd + str.substring(lastStyleAt);
                            lastStyleAt += toAdd.length;
                        } break;                         
                        case 'ul': {
                            const toAdd = " border-bottom: 0.15rem solid white;";
                            str = str.substring(0, lastStyleAt+1) + toAdd + str.substring(lastStyleAt);
                            lastStyleAt += toAdd.length;
                        } break;   
                        case 's': {
                            let amount = 1;
                            if(param){
                                amount = param;
                            }
                            const toAdd = ` margin-top: ${amount}rem;`;
                            str = str.substring(0, lastStyleAt+1) + toAdd + str.substring(lastStyleAt);
                            lastStyleAt += toAdd.length;
                        } break;  
                        case 'c': {                  
                            const toAdd = ` color: ${param};`;
                            str = str.substring(0, lastStyleAt+1) + toAdd + str.substring(lastStyleAt);
                            lastStyleAt += toAdd.length;
                        } break;            
                        case 'f': {       
                            let amount = 1;
                            if(param){
                                amount = param;
                            }                                       
                            const toAdd = ` flex:${amount};`;
                            str = str.substring(0, lastStyleAt+1) + toAdd + str.substring(lastStyleAt);
                            lastStyleAt += toAdd.length;
                        } break;
                        case 'j': {                                
                            const toAdd = ` text-align: justify;`;
                            str = str.substring(0, lastStyleAt+1) + toAdd + str.substring(lastStyleAt);
                            lastStyleAt += toAdd.length;
                        } break;    
                        case 'm': {      
                            let amount = 1;
                            if(param){
                                amount = param;
                            }                   
                            const toAdd = ` margin-right: ${amount}rem; margin-left: ${amount}rem; width:unset;`;
                            str = str.substring(0, lastStyleAt+1) + toAdd + str.substring(lastStyleAt);
                            lastStyleAt += toAdd.length;
                        } break;                                                                                                                                                                                                                                         
                       
                    }
                    i = l-1;
                    continue;
                }else
                if(c == "["){
                    str += `<div style="${j == 0 ? `${defaultBlock}` : ""}">`;
                    ++j;
                    lastStyleAt = str.length - 3;
                }else
                if(c == "]"){
                    str += `</div>`
                    --j;
                }else
                if(c == " " && lastChar == " "){
                    continue;
                }else{
                    str += c;
                    lastChar = c;
                }
            }
            return str;
        },
        renderTo: function(target, article, usePreHTML = false){
            const me = this;
            MiniWikiTools.clearElement(target);
            target.style.display = "flex";
            target.style.flexDirection = "column";
            target.style.paddingRight = "2rem";
            target.style.paddingLeft = "2rem";
            target.style.paddingTop = "2rem";
            target.innerHTML = usePreHTML ? article.html : me.parseToHTML(article.contents, article);
        }
    };
    return obj;
};