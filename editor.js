projectName = "";
selectorConfig = {bg:'rgb',color:[255,255,255]};
mode = "new";

icon = "preassets/default.png";
pagesBg = [255,255,255];

nowPage = 0;
pages = [];

function startEditor(id = "") {
    if (mode == "new") {
        projectName = document.getElementById("projectName").value;
        if (projectName != "") {
            document.getElementById("initializationEditor").style.visibility = "hidden";
            document.getElementById("titleName").innerHTML = "Editing: " + projectName;
            document.title = "Index Dev - " + projectName;
            addPage('Home');
            addElement('h1',["My Website"]);
        } else {
            document.getElementById("errorEditorData").innerHTML = "Project must have a name!";
            document.getElementById("errorEditorData").style.color = "red";
            document.getElementById("projectName").style.borderColor = "orange";
        }
    } else if (mode == "existing"){
        mode = id;
        var projectref = firebase.database().ref("/projects/" + mode + "/projectName");
        var pagesref = firebase.database().ref("/projects/" + mode + "/content");
        var selectorref = firebase.database().ref("/projects/" + mode + "/selector");
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
                                    showPageEditor();
                                    showPage();
                                    document.getElementById("initializationEditor").style.visibility = "hidden";
                                    document.getElementById("titleName").innerHTML = "Editing: " + projectName;
                                    document.title = "Index Dev - " + projectName;
                                } else {
                                    document.getElementById("editorResult").innerHTML = "Could not find this page";
                                }
                            }
                        });
                    }
                });
            }
        });
    }
}

function listUserProjects(){
    firebase.database().ref("/projects/").on('value', function (snapshot) {
        document.getElementById("editProjects").innerHTML = "";
        snapshot.forEach(function (childSnapshot) {
            childKey = childSnapshot.key; childData = childSnapshot.val();

            firebaseMessageId = childKey;
            projectData = childData;

            projectName = projectData['projectName'];
            whoSent = projectData['creator'];
            isPublic = projectData['isPublic'];

            nameH2 = "<h2>" + projectName + "</h2>";
            bottomLabel = "<label>Published: " + isPublic + "</label><br><br>";
            backgroundColor = "rgba("+Math.floor(Math.random()*200)+","+Math.floor(Math.random()*200)+","+Math.floor(Math.random()*200)+",0.9)";

            projectDiv = "<div style='background-color:"+backgroundColor+";' class='projectList' id='" + firebaseMessageId + "' onclick='startEditor(this.id)'>" + nameH2 + bottomLabel + "</div>";

            if (whoSent == user) {
                document.getElementById("editProjects").innerHTML += projectDiv;
            }
        });
    });
}

function windowEditorPage(p) {
    mode = p;
    if (!testMobile){
        if (logged) {
            if (p == "new") {
                pageTitle = "<h2>Start your Project " + user + "!</h2>";
                pageDetails = "<h3>What is your page's name?</h3>";
                editorInputName = "<input id='projectName'>";
                startButton = "<button class='button' onclick='startEditor()'>Create!</button>";
                errorLine = "<p id='errorEditorData'>Example: My Blog Page</p>";
                document.getElementById("inputEditorData").innerHTML = pageTitle + pageDetails + editorInputName + "<hr>" + startButton + errorLine;
            } else if (p == "existing") {
                pageTitle = "<h2>Continue your Project " + user + "!</h2>";
                pageDetails = "<h3>Edit your pages:</h3>";
                projectListDiv = "<div id='editProjects'></div>";
                document.getElementById("inputEditorData").innerHTML = pageTitle + pageDetails + projectListDiv;
                listUserProjects();
            }
        } else {
            document.getElementById("inputEditorData").innerHTML = "<p>You need to be logged in to create your web page</p>";
        }
    } 
}

//starting
function startNew() {
    windowEditorPage('new')
}
function startExisting() {
    windowEditorPage('existing')
}

//show Functions
function showConfigOptions(){
    document.getElementById("editorItens").innerHTML = "<b>General Options</b>";
    document.getElementById("editorItens").innerHTML += "<button class='elementAdd' onclick='ConfigureProject()'>Project Data</button>";
    document.getElementById("editorItens").innerHTML += "<button class='elementAdd' onclick='ConfigureSelector()'>Page Selector</button>";
    document.getElementById("editorItens").innerHTML += "<hr>";
    document.getElementById("editorItens").innerHTML += "<button class='elementAdd' onclick='publish(false)'>Save Page</button>";
    document.getElementById("editorItens").innerHTML += "<button class='elementAdd' onclick='publish(true)'>Publish Page</button>";
}

function showPageEditor() {
    document.getElementById("editorItens").innerHTML = "<b>"+projectName+"</b>";
    for(i = 0; i < pages.length; i++){
        lPage = pages[i];
        pageStyle = "<button class='pageSelector' onclick='toPage("+i+")' style='background-color: rgb("+lPage.color[0]+","+lPage.color[1]+","+lPage.color[2]+");'>";
        pageName = "| " + lPage.name;
        document.getElementById("editorItens").innerHTML += pageStyle+pageName+"</button>";
    }
    document.getElementById("editorItens").innerHTML += "<button class='elementAdd' onclick='addPage()'>+ New Page</button>";
}

function showElementEditor() {
    document.getElementById("editorItens").innerHTML = "<b>Page: "+pages[nowPage].name+"</b>";
    document.getElementById("editorItens").innerHTML += "<button class='elementAdd' onclick='h1()'>Title</button>";
    document.getElementById("editorItens").innerHTML += "<button class='elementAdd' onclick='h3()'>Sub Title</button>";
    document.getElementById("editorItens").innerHTML += "<button class='elementAdd' onclick='h5()'>Small Title</button>";
    document.getElementById("editorItens").innerHTML += "<button class='elementAdd' onclick='Paragraph()'>Paragraph</button>";
    document.getElementById("editorItens").innerHTML += "<button class='elementAdd' onclick='Button()'>Button</button>";
    document.getElementById("editorItens").innerHTML += "<button class='elementAdd' onclick='Entry()'>Text Input</button>";
    document.getElementById("editorItens").innerHTML += "<button class='elementAdd' onclick='BlockImage()'>Image</button>";
    document.getElementById("editorItens").innerHTML += "<button class='elementAdd' onclick='Connection()'>Web Connection</button>";
}
function showCSSEditor() {
    document.getElementById("editorItens").innerHTML = "<b>Page: "+pages[nowPage].name+"</b>";
    thisColor = "rgb("+pages[nowPage].color[0]+","+pages[nowPage].color[1]+","+pages[nowPage].color[2]+")"
    document.getElementById("editorItens").innerHTML += "<button class='pageSelector' onclick='editPage()' style='color:"+thisColor+"'>"+pages[nowPage].name+" | Page Style</button>";
    for(i = 0; i < pages[nowPage].elements.length; i++){
        lElement = pages[nowPage].elements[i];
        elementBtn = "<button class='pageSelector' onclick='editElement("+i+")' style='color:rgb("+lElement.color[0]+","+lElement.color[1]+","+lElement.color[2]+")'>";
        elementName = i+1 + " | " + lElement.type;
        document.getElementById("editorItens").innerHTML += elementBtn+elementName+"</button>";
    }
}
function showScriptEditor() {
    document.getElementById("editorItens").innerHTML = "<b>Page: "+pages[nowPage].name+"</b>";
    for(i = 0; i < pages[nowPage].scripts.length; i++){
        lScript = pages[nowPage].scripts[i];
        if (script.type == "pageLoaded"){
            scriptColor = "green";
        }else if(script.type == "buttonClicked"){
            scriptColor = "orange";
        }else if(script.type == "mouseOver"){
            scriptColor = "blue";
        }
        scriptBtn = "<button class='pageSelector' onclick='editScript("+i+")' style='color:"+scriptColor+"'>";
        scriptName = i+1 + " | " + lScript.type;
        document.getElementById("editorItens").innerHTML += scriptBtn+scriptName+"</button>";
    }
    document.getElementById("editorItens").innerHTML += "<button class='elementAdd' onclick='addScript()'>+ New Event</button>";
}

//Element Buttons
function h1(){
    addElement("h1",['Title']);
}
function h3(){
    addElement("h3",['Sub Title']);
}
function h5(){
    addElement("h5",['Small Title']);
}
function Paragraph(){
    addElement("P",['Simple Paragraph',3]);
}
function Button(){
    addElement("BTN",['Click Here','My Event'],[80,10],2);
}
function Entry(){
    addElement("Input",['Insert Text'],[80,5],2);
}
function BlockImage(){
    addElement("IMG",['preassets/banner.png']);
}
function Connection(){
    addElement("IFR",['https://catmeooww.github.io/CatMeooww/catmeoowwProjects.html'],[80,70],2);
}

//Element Adding
function addPage(name = "page", color = [Math.floor(Math.random()*200)+20,Math.floor(Math.random()*200)+20,Math.floor(Math.random()*200)+20]){
    pages.push({name:name,color:color,bg:pagesBg,header:projectName,icon:icon,elements:[],scripts:[]});
    showPageEditor();
}

function toPage(i){
    nowPage = i;
    showPage();
}

function addElement(type,properties,size = [90,10],border = 0){
    thisID = "element"+pages[nowPage].elements.length;
    pages[nowPage].elements.push({
        'type':type,
        'id':thisID,
        'content': properties,
        'color': [0,0,0,100],
        'bg': [255,255,255,100],
        'size':size,
        'margin':1,
        'border':border,
        'position': 'page',
        'align': 'center',
        'x':0,
        'y':0,
        'render':pages[nowPage].elements.length
    })
    showPage();
}

//Editing Elements
function editPage(){
    lPage = pages[nowPage]
    document.getElementById("styleEditorWindow").style.visibility = "visible";
    document.getElementById("styleEditorLabel").innerHTML = lPage.name;

    pageNameEdit = "<label>Page Name:</label> <input id='PageNameEdit' value='"+lPage.name+"'> <br><br>";
    pageColorEdit = "<label>Page Selector Color:</label> <input type='number' id='pColorR' value='"+lPage.color[0]+"'><input type='number' id='pColorG' value='"+lPage.color[1]+"'><input type='number' id='pColorB' value='"+lPage.color[2]+"'> <br><br>";
    pageBgEdit = "<label>Page Background Color:</label> <input type='number' id='bColorR' value='"+lPage.bg[0]+"'><input type='number' id='bColorG' value='"+lPage.bg[1]+"'><input type='number' id='bColorB' value='"+lPage.bg[2]+"'> <br><br>";
    pageHeaderEdit = "<label>Page Header Name:</label> <input id='PageHeaderEdit' value='"+lPage.header+"'> <br><br>";
    pageIconEdit = "<label>Page Icon:</label> <input id='PageIconEdit' value='"+lPage.icon+"'> <br><br>";
    updateButton = "<button onclick='saveEditPage()' id='styleEditorSave'>Save</button>";
    document.getElementById("styleEditor").innerHTML = pageNameEdit + pageColorEdit + pageBgEdit + pageHeaderEdit + pageIconEdit + updateButton;
}

function saveEditPage(){
    pages[nowPage].name = document.getElementById("PageNameEdit").value;
    pages[nowPage].color = [document.getElementById("pColorR").value,document.getElementById("pColorG").value,document.getElementById("pColorB").value];
    pagesBg = [document.getElementById("bColorR").value,document.getElementById("bColorG").value,document.getElementById("bColorB").value];
    pages[nowPage].bg = pagesBg;
    pages[nowPage].header = document.getElementById("PageHeaderEdit").value;
    icon = document.getElementById("PageIconEdit").value;
    pages[nowPage].icon = icon;
    showCSSEditor();
    showPage();
}

function editElement(id){
    lElement = pages[nowPage].elements[id];
    document.getElementById("styleEditorWindow").style.visibility = "visible";
    document.getElementById("styleEditorLabel").innerHTML = id + 1 + " | " + lElement.type;

    elementContentEdit = "<label>Content:</label> <textarea id='elementContentEdit'>"+lElement.content[0]+"</textarea> <br><br>";
    elementColorEdit = "<label>Text Color:</label> <input type='number' id='tColorR' value='"+lElement.color[0]+"'><input type='number' id='tColorG' value='"+lElement.color[1]+"'><input type='number' id='tColorB' value='"+lElement.color[2]+"'><input type='number' id='tColorA' value='"+lElement.color[3]+"'> <br><br>";
    elementBgEdit = "<label>Background Color:</label> <input type='number' id='bColorR' value='"+lElement.bg[0]+"'><input type='number' id='bColorG' value='"+lElement.bg[1]+"'><input type='number' id='bColorB' value='"+lElement.bg[2]+"'><input type='number' id='bColorA' value='"+lElement.bg[3]+"'> <br><br>";
    elementSizeEdit = "<label>Element Size:</label> <input type='number' id='elementWidthEdit' value='"+lElement.size[0]+"'><input type='number' id='elementHeightEdit' value='"+lElement.size[1]+"'> <br><br>";
    elementMarginEdit = "<label>Element Spaced:</label> <input type='number' id='elementMarginEdit' value='"+lElement.margin+"'><br><br>";
    elementBorderEdit = "<label>Border Size:</label> <input type='number' id='elementBorderEdit' value='"+lElement.border+"'> <br><br>";
    elementRenderEdit = "<label>Render:</label> <input type='number' id='elementRenderEdit' value='"+lElement.render+"'> <br><br>";
    if (lElement.position == "page"){
        elementPositionEdit = "<button onclick='editPosPage()' id='1' class='selectorsBtn s3 Selected'>Page</button><button onclick='editPosCoord()' id='2' class='selectorsBtn s3'>Coordinate</button>";
        elementPositionNow = "<label>Position:</label> <label id='elementPositionEdit'></label><br><br>";
        elementPositionDiv = "<div id='elementPosition'></div>";
        document.getElementById('styleEditor').innerHTML = elementContentEdit + elementColorEdit + elementBgEdit + elementSizeEdit + elementMarginEdit + elementBorderEdit + elementRenderEdit + elementPositionNow + elementPositionEdit + elementPositionDiv;
        editPosPage();
    }else{
        elementPositionEdit = "<button onclick='editPosPage()' id='1' class='selectorsBtn s3'>Page</button><button onclick='editPosCoord()' id='2' class='selectorsBtn s3 Selected'>Coordinate</button>";
        elementPositionNow = "<label>Position:</label> <label id='elementPositionEdit'></label><br><br>";
        elementPositionDiv = "<div id='elementPosition'></div>";
        document.getElementById('styleEditor').innerHTML = elementContentEdit + elementColorEdit + elementBgEdit + elementSizeEdit + elementMarginEdit + elementBorderEdit + elementRenderEdit + elementPositionNow + elementPositionEdit + elementPositionDiv;
        editPosCoord();
    }

    switch (lElement.type){
        case "h1": case "h3": case "h5": case "IMG": case "Input": case "IFR":
            document.getElementById("styleEditor").innerHTML += "<button onclick='saveDefault("+id+")' id='styleEditorSave'>Save</button>";
            break;
        case "BTN":
            document.getElementById("styleEditor").innerHTML += "<br><br><label>On Click:</label> <input id='elementEventEdit' value='"+lElement.content[1]+"'>";
            document.getElementById("styleEditor").innerHTML += "<button onclick='saveBTN("+id+")' id='styleEditorSave'>Save</button>";
            break;
        case "P":
            document.getElementById("styleEditor").innerHTML += "<br><br><label>Paragraph Space:</label> <input type='number' id='elementSpacedEdit' value='"+lElement.content[1]+"'>";
            document.getElementById("styleEditor").innerHTML += "<button onclick='saveParagraph("+id+")' id='styleEditorSave'>Save</button>";
    }
}

function editPosPage(){
    document.getElementById('elementPositionEdit').innerHTML = "page";
    document.getElementsByClassName("s3").item(0).className = "selectorsBtn s3 Selected";
    document.getElementsByClassName("s3").item(1).className = "selectorsBtn s3";
    elementPositionLabel = "<label id='elementAlignEdit'>"+lElement.align+"</label><br><br>";
    elementFloatLeft = "<button class='selectorsBtn' onclick='setPosLeft()'>Left</button>";
    elementFloatCenter = "<button class='selectorsBtn' onclick='setPosCenter()'>Center</button>";
    elementFloatRight = "<button class='selectorsBtn' onclick='setPosRight()'>Right</button>";
    document.getElementById("elementPosition").innerHTML = "<br><br>" + elementPositionLabel + elementFloatLeft + elementFloatCenter + elementFloatRight;
}

function editPosCoord(){
    document.getElementById('elementPositionEdit').innerHTML = "coordinate";
    document.getElementsByClassName("s3").item(0).className = "selectorsBtn s3";
    document.getElementsByClassName("s3").item(1).className = "selectorsBtn s3 Selected";
    elementXEdit = "<label>Position X:</label> <input type='number' id='elementXEdit' value='"+lElement.x+"'>";
    elementYEdit = "<label>Position Y:</label> <input type='number' id='elementYEdit' value='"+lElement.y+"'>";
    document.getElementById("elementPosition").innerHTML = "<br><br>" + elementXEdit + elementYEdit;
}

function setPosLeft(){
    document.getElementById('elementAlignEdit').innerHTML = 'left';
}
function setPosCenter(){
    document.getElementById('elementAlignEdit').innerHTML = 'center';
}
function setPosRight(){
    document.getElementById('elementAlignEdit').innerHTML = 'right';
}

function saveDefault(id){
    pages[nowPage].elements[id].content = [document.getElementById('elementContentEdit').value];
    pages[nowPage].elements[id].color = [document.getElementById('tColorR').value,document.getElementById('tColorG').value,document.getElementById('tColorB').value,document.getElementById('tColorA').value];
    pages[nowPage].elements[id].bg = [document.getElementById('bColorR').value,document.getElementById('bColorG').value,document.getElementById('bColorB').value,document.getElementById('bColorA').value];
    pages[nowPage].elements[id].size = [document.getElementById('elementWidthEdit').value,document.getElementById('elementHeightEdit').value];
    pages[nowPage].elements[id].margin = document.getElementById('elementMarginEdit').value;
    pages[nowPage].elements[id].border = document.getElementById('elementBorderEdit').value;
    pages[nowPage].elements[id].position = document.getElementById('elementPositionEdit').innerHTML;
    pages[nowPage].elements[id].render = document.getElementById('elementRenderEdit').value;
    if (document.getElementById('elementPositionEdit').innerHTML == 'page'){
        pages[nowPage].elements[id].align = document.getElementById('elementAlignEdit').innerHTML;
    }else{
        pages[nowPage].elements[id].x = document.getElementById('elementXEdit').value;
        pages[nowPage].elements[id].y = document.getElementById('elementYEdit').value;
    }
    showCSSEditor();
    showPage();
}

function saveBTN(id){
    pages[nowPage].elements[id].content = [document.getElementById('elementContentEdit').value,document.getElementById('elementEventEdit').value];
    pages[nowPage].elements[id].color = [document.getElementById('tColorR').value,document.getElementById('tColorG').value,document.getElementById('tColorB').value,document.getElementById('tColorA').value];
    pages[nowPage].elements[id].bg = [document.getElementById('bColorR').value,document.getElementById('bColorG').value,document.getElementById('bColorB').value,document.getElementById('bColorA').value];
    pages[nowPage].elements[id].size = [document.getElementById('elementWidthEdit').value,document.getElementById('elementHeightEdit').value];
    pages[nowPage].elements[id].margin = document.getElementById('elementMarginEdit').value;
    pages[nowPage].elements[id].border = document.getElementById('elementBorderEdit').value;
    pages[nowPage].elements[id].position = document.getElementById('elementPositionEdit').innerHTML;
    pages[nowPage].elements[id].render = document.getElementById('elementRenderEdit').value;
    if (document.getElementById('elementPositionEdit').innerHTML == 'page'){
        pages[nowPage].elements[id].align = document.getElementById('elementAlignEdit').innerHTML;
    }else{
        pages[nowPage].elements[id].x = document.getElementById('elementXEdit').value;
        pages[nowPage].elements[id].y = document.getElementById('elementYEdit').value;
    }
    showCSSEditor();
    showPage();
}

function saveParagraph(id){
    pages[nowPage].elements[id].content = [document.getElementById('elementContentEdit').value,document.getElementById('elementSpacedEdit').value];
    pages[nowPage].elements[id].color = [document.getElementById('tColorR').value,document.getElementById('tColorG').value,document.getElementById('tColorB').value,document.getElementById('tColorA').value];
    pages[nowPage].elements[id].bg = [document.getElementById('bColorR').value,document.getElementById('bColorG').value,document.getElementById('bColorB').value,document.getElementById('bColorA').value];
    pages[nowPage].elements[id].size = [document.getElementById('elementWidthEdit').value,document.getElementById('elementHeightEdit').value];
    pages[nowPage].elements[id].margin = document.getElementById('elementMarginEdit').value;
    pages[nowPage].elements[id].border = document.getElementById('elementBorderEdit').value;
    pages[nowPage].elements[id].position = document.getElementById('elementPositionEdit').innerHTML;
    pages[nowPage].elements[id].render = document.getElementById('elementRenderEdit').value;
    if (document.getElementById('elementPositionEdit').innerHTML == 'page'){
        pages[nowPage].elements[id].align = document.getElementById('elementAlignEdit').innerHTML;
    }else{
        pages[nowPage].elements[id].x = document.getElementById('elementXEdit').value;
        pages[nowPage].elements[id].y = document.getElementById('elementYEdit').value;
    }
    showCSSEditor();
    showPage();
}

function closeWin(){
    document.getElementById("styleEditorWindow").style.visibility = "hidden";
    document.getElementById("styleEditor").innerHTML = "";
}

//General Page
function ConfigureProject(){
    document.getElementById("styleEditorWindow").style.visibility = "visible";
    document.getElementById("styleEditorLabel").innerHTML = projectName;

    projectNameEdit = "<label>Project Name:</label> <input id='ProjectNameEdit' value='"+projectName+"'> <br><br>";
    projectCreator = "<label>Creator: "+user+"</label><br><br>";
    updateButton = "<button onclick='saveEditProject()' id='styleEditorSave'>Save</button>";
    document.getElementById("styleEditor").innerHTML = projectNameEdit + projectCreator + updateButton;
}
function saveEditProject(){
    projectName = document.getElementById('ProjectNameEdit').value;
    document.getElementById("titleName").innerHTML = "Editing: " + projectName;
    document.title = "Index Dev - " + projectName;
}

function ConfigureSelector(){
    document.getElementById("styleEditorWindow").style.visibility = "visible";
    document.getElementById("styleEditorLabel").innerHTML = "Page Selector";

    selectorSize = "<label>Pages Created: "+pages.length+"</label><br><br>";
    updateButton = "<button onclick='saveEditSelector()' id='styleEditorSave'>Save</button>";
    if (selectorConfig['bg'] == 'rgb') {
        selectorBgEdit = "<button onclick='editRGBSelector()' id='1' class='selectorsBtn s3 Selected'>RGB Color</button><button onclick='editSyncSelector()' id='2' class='selectorsBtn s3'>Sync to page</button>";
        selectorColorType = "<label id='selectorColorNow'>RGB</label>";
        selectorColorDiv = "<div id='selectorColorEdit'></div>";
        document.getElementById("styleEditor").innerHTML = selectorSize + selectorColorType + selectorBgEdit + selectorColorDiv + updateButton;
        editRGBSelector();
    } else {
        selectorBgEdit = "<button onclick='editRGBSelector()' id='1' class='selectorsBtn s3'>RGB Color</button><button onclick='editSyncSelector()' id='2' class='selectorsBtn s3 Selected'>Sync to page</button>";
        selectorColorType = "<label id='selectorColorNow'>Sync</label>";
        selectorColorDiv = "<div id='selectorColorEdit'></div>";
        document.getElementById("styleEditor").innerHTML = selectorSize + selectorColorType + selectorBgEdit + selectorColorDiv + updateButton;
        editSyncSelector();
    }
}

function editRGBSelector(){
    document.getElementById("selectorColorNow").innerHTML = "RGB";
    document.getElementsByClassName("s3").item(0).className = "selectorsBtn s3 Selected";
    document.getElementsByClassName("s3").item(1).className = "selectorsBtn s3";
    selectorColorEdit = "<label>Text Color:</label> <input type='number' id='bColorR' value='"+selectorConfig.color[0]+"'><input type='number' id='bColorG' value='"+selectorConfig.color[1]+"'><input type='number' id='bColorB' value='"+selectorConfig.color[2]+"'> <br><br>";
    document.getElementById("selectorColorEdit").innerHTML = "<br><br>" + selectorColorEdit;
}

function editSyncSelector(){
    document.getElementById("selectorColorNow").innerHTML = "Sync";
    document.getElementsByClassName("s3").item(0).className = "selectorsBtn s3";
    document.getElementsByClassName("s3").item(1).className = "selectorsBtn s3 Selected";
    selectorColorEdit = "Synchronized with selected page BG Color";
    document.getElementById("selectorColorEdit").innerHTML = "<br><br>" + selectorColorEdit;
}

function saveEditSelector(){
    selectorBgType = document.getElementById("selectorColorNow").innerHTML;
    if (selectorBgType == "RGB"){
        selectorConfig['bg'] = 'rgb';
        selectorConfig['color'] = [document.getElementById('bColorR').value,document.getElementById('bColorG').value,document.getElementById('bColorB').value];
    }else{
        selectorConfig['bg'] = 'sync';
    }
    showPage();
}

//Load Preview
function showPage(){
    document.getElementById("editorResult").innerHTML = "";

    lPage = pages[nowPage];
    document.getElementById("editorResult").style.backgroundColor = "rgb("+lPage.bg[0]+","+lPage.bg[1]+","+lPage.bg[2]+")";
    document.getElementById("editorHeader").innerHTML = lPage.header;
    document.getElementById("editorIcon").src = lPage.icon;

    lElements = lPage.elements;
    console.clear();

    if (selectorConfig['bg'] == 'rgb'){
        document.getElementById("editorItens").style.backgroundColor = "rgb("+selectorConfig['color'][0]+","+selectorConfig['color'][1]+","+selectorConfig['color'][2]+")";
    }else if (selectorConfig['bg'] == 'sync'){
        document.getElementById("editorItens").style.backgroundColor = "rgb("+lPage.bg[0]+","+lPage.bg[1]+","+lPage.bg[2]+")";
    }

    for(i = 0; i < lElements.length; i++){
        lElement = lElements[i];
        console.info(i)
        console.log(lElement);
        switch (lElement.type){
            case "h1": case "h3": case "h5":
                tag = "<"+lElement.type+" id='"+lElement.id+"'>"+lElement.content[0]+"</"+lElement.type+">";
                break;
            case "P":
                tag = "<p style='text-indent:"+lElement.content[1]+"em;' id='"+lElement.id+"'>"+lElement.content[0]+"</p>";
                break;
            case "BTN":
                tag = "<button id='"+lElement.id+"'>"+lElement.content[0]+"</button>";
                break;
            case "Input":
                tag = "<input id='"+lElement.id+"' placeholder='"+lElement.content[0]+"'>";
                break;
            case "IMG":
                tag = "<img id='"+lElement.id+"' src='"+lElement.content[0]+"'>";
                break;
            case "IFR":
                tag = "<iframe id='"+lElement.id+"' src='"+lElement.content[0]+"'></iframe>";
                break;
        }
        document.getElementById("editorResult").innerHTML += tag;
        document.getElementById("element"+i).style.color = "rgba("+lElement.color[0]+","+lElement.color[1]+","+lElement.color[2]+","+lElement.color[3]*0.01+")";
        document.getElementById("element"+i).style.backgroundColor = "rgba("+lElement.bg[0]+","+lElement.bg[1]+","+lElement.bg[2]+","+lElement.bg[3]*0.01+")";
        document.getElementById("element"+i).style.width = lElement.size[0] + "%";
        document.getElementById("element"+i).style.height = lElement.size[1] + "%";
        document.getElementById("element"+i).style.margin = lElement.margin + "%";
        document.getElementById("element"+i).style.border = "outset " + "rgb("+lElement.color[0]+","+lElement.color[1]+","+lElement.color[2]+") " + lElement.border + "px";
        document.getElementById("element"+i).style.zIndex = lElement.render;
        if (lElement.position == "coordinate"){
            document.getElementById("element"+i).style.position = "relative";
            document.getElementById("element"+i).style.top = lElement.y + "%";
            document.getElementById("element"+i).style.left = lElement.x + "%";
        } else if(lElement.position == "page" && lElement.align != "center"){
            document.getElementById("element"+i).style.position = "static";
            document.getElementById("element"+i).style.float = lElement.align;
            document.getElementById("element"+i).style.textAlign = lElement.align;
        }
    }
}

function publish(public){
    document.getElementById("finishedEditorWindow").style.visibility = 'visible';
    finalName = "<p>Project: "+projectName+"</p>";
    finalCreator = "<p>By: "+user+"</p>";
    finalPages = "<p>Pages: "+pages.length+"</p>";
    finalPublicity = "<p>Is Public: "+public+"</p>";
    document.getElementById("finalResults").innerHTML = finalName + finalCreator + finalPages + finalPublicity;
    if (mode == "new"){
        firebase.database().ref("/projects/").push({
            projectName:projectName,
            selector:selectorConfig,
            creator:user,
            content:pages,
            isPublic:public
        });
    } else {
        firebase.database().ref("/projects/"+mode).update({
            projectName:projectName,
            selector:selectorConfig,
            creator:user,
            content:pages,
            isPublic:public
        });
    }
}