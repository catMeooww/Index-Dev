var testMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);
var menuDb = false;

var user = localStorage.getItem("user");
var password = localStorage.getItem("password");
var logged = false;

const firebaseConfig = {
    apiKey: "AIzaSyCE_feHCjI3Hb2eu4JvOdJKhfi_nCNvsRk",
    authDomain: "index-deving.firebaseapp.com",
    databaseURL: "https://index-deving-default-rtdb.firebaseio.com",
    projectId: "index-deving",
    storageBucket: "index-deving.appspot.com",
    messagingSenderId: "969275640534",
    appId: "1:969275640534:web:b643a8d81c4d903b079777"
};
firebase.initializeApp(firebaseConfig);

//Website
function loadBody(window) {
    if (testMobile) {
        document.getElementById("menu-options").style.visibility = "hidden";
        document.getElementById("menu-db").style.visibility = "visible";
        document.getElementById("menu-options").innerHTML = "<br><br>" + document.getElementById("menu-options").innerHTML.replaceAll("|", "<br>");
        if (window == 'editor'){
            document.getElementById("inputEditorData").innerHTML = "<h3>No Mobile Support</h3><p>We sorry, but there is not support for mobile in the editor.</p>"
        }
        if (window == 'page'){
            document.getElementById("mainEditor").style.display = "block";
            document.getElementById("editorItens").style.width = "100%";
            document.getElementById("editorItens").style.height = "10%";
            document.getElementById("editorItens").style.marginTop = "10%";
            document.getElementById("editorResult").style.width = "100%";
            document.getElementById("editorResult").style.height = "90%";
        }
    }
    coloring = document.getElementsByClassName('coloring');
    for (i = 0; i < coloring.length; i++) {
        r = Math.floor(Math.random() * 230) + 25;
        g = Math.floor(Math.random() * 230) + 25;
        b = Math.floor(Math.random() * 230) + 25;
        coloring.item(i).style.color = "rgb(" + r + "," + g + "," + b + ")";
    };
    loadUserData(window)
}

function loadUserData(window) {
    if (user != undefined && password != undefined) {
        var userref = firebase.database().ref("/users/" + user + "/status");
        var passref = firebase.database().ref("/users/" + user + "/password");
        var isUserCreated;
        var isJoining = false;
        userref.on("value", data => {
            isUserCreated = data.val();
            if (!isJoining) {
                isJoining = true;
                if (isUserCreated == "online" || isUserCreated == "mod") {
                    passref.on("value", data => {
                        canPass = data.val();
                        if (canPass == password) {
                            logged = true;
                            document.getElementById("user-name").innerHTML = user;
                            document.getElementById("user-name").style.color = "lime";
                            console.log("logged: " + logged);
                            if (window == "login"){
                                pageTitle = "<h1>Index Dev Account</h1>";
                                userTitle = "<h3 style='color:green'>Logged as: "+user+"</h3>";
                                unLogButton = "<button class='button' onclick='logout()'>Log-Out</button>";
                                document.getElementById("loginData").innerHTML = pageTitle + userTitle + "<hr>" + unLogButton + "<hr><br><br>";
                            } else if (window == "editor"){
                                windowEditorPage("new");
                            }
                        }
                    })
                }
            }
        });
    }
    console.log("logged: " + logged);
}

function menuOpen() {
    if (testMobile) {
        if (menuDb) {
            menuDb = false;
            document.getElementById("menu-options").style.visibility = "hidden";
            document.getElementById("menu").style.height = "8%";
            document.getElementById("menu-db").innerHTML = "Index Dev";
        } else {
            menuDb = true;
            document.getElementById("menu-options").style.visibility = "visible";
            document.getElementById("menu").style.height = "100%";
            document.getElementById("menu-db").innerHTML = "X";
        }
    }
}

function page(to) {
    if (to == "home") {
        location = "index.html";
    } else if (to == "create") {
        location = "editor.html";
    } else if (to == "explore") {
        location = "projects.html";
    } else if (to == "tutorial") {

    } else if (to == "catmeooww") {
        location = "https://catmeooww.github.io/CatMeooww/catmeoowwProjects.html";
    } else if (to == "account") {
        location = "registration.html";
    }
}

function selectButton(selectors, selected, gofunction) {
    selectorsItem = document.getElementsByClassName('s'+selectors);
    for (i = 0; i < selectorsItem.length; i++) {
        selectorsItem.item(i).className = "selectorsBtn s"+selectors;
    };
    selectorsItem.namedItem(selected).className = "selectorsBtn s"+selectors+" Selected";
    gofunction()
}

//Login
loginState = 0;
function loginAccountMode() {
    document.getElementById("logButton").onclick = LogAccount;
    document.getElementById("logButton").innerHTML = "Log-In";
    loginState = 0;
}

function createAccountMode() {
    document.getElementById("logButton").onclick = createAccount;
    document.getElementById("logButton").innerHTML = "Create Account";
    loginState = 1;
}

function LogAccount() {
    userinput = document.getElementById("login-username").value;
    passwordinput = document.getElementById("login-userpassword").value;
    if (userinput != "" && passwordinput != "") {
        var userref = firebase.database().ref("/users/" + userinput + "/status");
        var passref = firebase.database().ref("/users/" + userinput + "/password");
        var isUserCreated;
        var isJoining = false;
        userref.on("value", data => {
            isUserCreated = data.val();
            if (!isJoining) {
                isJoining = true;
                if (isUserCreated == "online" || isUserCreated == "mod") {
                    passref.on("value", data => {
                        canPass = data.val();
                        if (canPass == passwordinput) {
                            localStorage.setItem("user", userinput);
                            localStorage.setItem("password", passwordinput);
                            location.reload();
                        } else {
                            document.getElementById("login-error").innerHTML = "Incorrect Password";
                            document.getElementById("login-userpassword").style.borderColor = "red";
                        }
                    })
                } else if(isUserCreated == "disabled"){
                    document.getElementById("login-error").innerHTML = "This account got disabled";
                    document.getElementById("login-username").style.borderColor = "red";
                } else {
                    document.getElementById("login-error").innerHTML = "Incorrect Username";
                    document.getElementById("login-username").style.borderColor = "red";
                }
            }
        });
    } else {
        document.getElementById("login-error").innerHTML = "All the inputs need a value";
        document.getElementById("login-username").style.borderColor = "yellow";
        document.getElementById("login-userpassword").style.borderColor = "yellow";
    }
}

function createAccount() {
    userinput = document.getElementById("login-username").value;
    passwordinput = document.getElementById("login-userpassword").value;
    if (userinput != "" && passwordinput != "") {
        var userref = firebase.database().ref("/users/" + userinput + "/status");
        var isUserCreated;
        var isJoining = false;
        userref.on("value", data => {
            isUserCreated = data.val();
            if (!isJoining) {
                isJoining = true;
                if (isUserCreated == null) {
                    firebase.database().ref("/users/").child(userinput).update({
                        password: passwordinput,
                        status: "online"
                    });
                    document.getElementById("login-error").innerHTML = "Account Sucessfuly Created";
                } else {
                    document.getElementById("login-error").innerHTML = "This username already exists";
                    document.getElementById("login-username").style.borderColor = "red";
                }
            }
        });
    } else {
        document.getElementById("login-error").innerHTML = "All the inputs need a value";
        document.getElementById("login-username").style.borderColor = "yellow";
        document.getElementById("login-userpassword").style.borderColor = "yellow";
    }
}

function logout(){
    localStorage.removeItem("user");
    localStorage.removeItem("password");
    location.reload();
}

searching = "";

function listProjects(){
    firebase.database().ref("/projects/").on('value', function (snapshot) {
        document.getElementById("output").innerHTML = "";
        snapshot.forEach(function (childSnapshot) {
            childKey = childSnapshot.key; childData = childSnapshot.val();

            firebaseMessageId = childKey;
            projectData = childData;

            projectName = projectData['projectName'];
            whoSent = projectData['creator'];
            isPublic = projectData['isPublic'];

            nameH2 = "<h2>" + projectName + "</h2>";
            bottomLabel = "<label>Creator: " + whoSent + "</label><br><br>";
            backgroundColor = "rgba("+Math.floor(Math.random()*200)+","+Math.floor(Math.random()*200)+","+Math.floor(Math.random()*200)+",0.9)";

            projectDiv = "<div style='background-color:"+backgroundColor+";' class='projectList' id='" + firebaseMessageId + "' onclick='openPage(this.id)'>" + nameH2 + bottomLabel + "</div>";

            if (isPublic == true && projectName.toUpperCase().indexOf(searching.toUpperCase()) != -1) {
                document.getElementById("output").innerHTML += projectDiv;
            }
        });
    });
}

function setSearch(){
    searching = document.getElementById("searcher").value;
    listProjects();
}

function openPage(id){
    window.location = "page.html?"+id+"!0";
}