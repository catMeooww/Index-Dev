projectId = "";
projectName = "";
pages = [];
selectorConfig = {bg:'rgb',color:[255,255,255]};
nowPage = 0;

function loadProjectData() {
    url = window.location.href
    url = url.split("?");
    if (url.length == 2) {
        datapage = url[1].split("!");
        projectId = datapage[0];
        if (datapage.length == 2) {
            nowPage = Number(datapage[1]);
        }
        var projectref = firebase.database().ref("/projects/" + projectId + "/projectName");
        var pagesref = firebase.database().ref("/projects/" + projectId + "/content");
        var selectorref = firebase.database().ref("/projects/" + projectId + "/selector");
        readed_name = false;
        readed_pages = false;
        readed_selector = false;
        projectref.on("value", data => {
            projectName = data.val();
            if (!readed_name) {
                readed_name = projectName;
                selectorref.on("value", data => {
                    selectorConfig = data.val();
                    if (!readed_selector){
                        readed_selector = true;
                        pagesref.on("value", data => {
                            pages = data.val();
                            console.log(pages)
                            if (!readed_pages) {
                                readed_pages = pages;
                                if (readed_name != undefined && readed_pages != undefined && readed_selector != undefined) {
                                    showPageList();
                                    showPage();
                                } else {
                                    document.getElementById("editorResult").innerHTML = "Could not find this page";
                                }
                            }
                        });
                    }
                });
            }
        });
    } else {
        window.location = "projects.html";
    }
}

function toPage(p){
    window.location = "page.html?"+projectId+"!"+p;
}

function showPageList() {
    document.getElementById("editorItens").innerHTML = "<b>" + projectName + "</b>";
    for (i = 0; i < pages.length; i++) {
        lPage = pages[i];
        pageStyle = "<button class='pageSelector' onclick='toPage(" + i + ")' style='background-color: rgb(" + lPage.color[0] + "," + lPage.color[1] + "," + lPage.color[2] + ");'>";
        pageName = "| " + lPage.name;
        document.getElementById("editorItens").innerHTML += pageStyle + pageName + "</button>";
    }
}

function showPage() {
    document.getElementById("editorResult").innerHTML = "";

    lPage = pages[nowPage];
    document.getElementById("editorResult").style.backgroundColor = "rgb(" + lPage.bg[0] + "," + lPage.bg[1] + "," + lPage.bg[2] + ")";
    document.getElementById("editorHeader").innerHTML = lPage.header;
    document.getElementById("editorIcon").href = lPage.icon;

    lElements = lPage.elements;
    console.clear();

    if (selectorConfig['bg'] == 'rgb') {
        document.getElementById("editorItens").style.backgroundColor = "rgb(" + selectorConfig['color'][0] + "," + selectorConfig['color'][1] + "," + selectorConfig['color'][2] + ")";
    } else if (selectorConfig['bg'] == 'sync') {
        document.getElementById("editorItens").style.backgroundColor = "rgb(" + lPage.bg[0] + "," + lPage.bg[1] + "," + lPage.bg[2] + ")";
    }

    for (i = 0; i < lElements.length; i++) {
        lElement = lElements[i];
        console.info(i)
        console.log(lElement);
        switch (lElement.type) {
            case "h1": case "h3": case "h5":
                tag = "<" + lElement.type + " id='" + lElement.id + "'>" + lElement.content[0] + "</" + lElement.type + ">";
                break;
            case "P":
                tag = "<p style='text-indent:" + lElement.content[1] + "em;' id='" + lElement.id + "'>" + lElement.content[0] + "</p>";
                break;
            case "BTN":
                tag = "<button id='" + lElement.id + "'>" + lElement.content[0] + "</button>";
                break;
            case "Input":
                tag = "<input id='" + lElement.id + "' placeholder='" + lElement.content[0] + "'>";
                break;
            case "IMG":
                tag = "<img id='" + lElement.id + "' src='" + lElement.content[0] + "'>";
                break;
            case "IFR":
                tag = "<iframe id='" + lElement.id + "' src='" + lElement.content[0] + "'></iframe>";
                break;
        }
        document.getElementById("editorResult").innerHTML += tag;
        document.getElementById("element" + i).style.color = "rgba(" + lElement.color[0] + "," + lElement.color[1] + "," + lElement.color[2] + "," + lElement.color[3] * 0.01 + ")";
        document.getElementById("element" + i).style.backgroundColor = "rgba(" + lElement.bg[0] + "," + lElement.bg[1] + "," + lElement.bg[2] + "," + lElement.bg[3] * 0.01 + ")";
        document.getElementById("element" + i).style.width = lElement.size[0] + "%";
        document.getElementById("element" + i).style.height = lElement.size[1] + "%";
        document.getElementById("element" + i).style.margin = lElement.margin + "%";
        document.getElementById("element" + i).style.border = "outset " + "rgb(" + lElement.color[0] + "," + lElement.color[1] + "," + lElement.color[2] + ") " + lElement.border + "px";
        document.getElementById("element" + i).style.zIndex = lElement.render;
        if (lElement.position == "coordinate") {
            document.getElementById("element" + i).style.position = "relative";
            document.getElementById("element" + i).style.top = lElement.y + "%";
            document.getElementById("element" + i).style.left = lElement.x + "%";
        } else if (lElement.position == "page" && lElement.align != "center") {
            document.getElementById("element" + i).style.position = "static";
            document.getElementById("element" + i).style.float = lElement.align;
            document.getElementById("element" + i).style.textAlign = lElement.align;
        }
    }
}

function menuShow(){
    document.getElementById("menu").style.height = "50px";
    document.getElementById("menu-options").style.visibility = "visible";
}

function menuHide(){
    document.getElementById("menu").style.height = "0px";
    document.getElementById("menu-options").style.visibility = "hidden";
}