var hosturl = "http://localhost:5002";
var currentfile = "C:/git/python/newfile.py"

templates = {   "PY":"python","CCP":"c","HTM":"html","HTML":"html",
                "CSS":"css","JAVA":"Java","JS":"javascript",
                "MD":"markdown","YML":"yaml","YAML":"YAML","JSON":"JSON",
                "XML":"xml","SVG":"SVG"
};
var editor = null;

var modelist = null;

function init() {
    modelist = ace.require("ace/ext/modelist");
    editor = ace.edit("editor");
//    editor.setTheme("ace/theme/monokai");
//    editor.setTheme("ace/theme/twilight");    
    editor.setTheme("ace/theme/dracula");    
//    editor.session.setMode("ace/mode/javascript");
    editor.session.setMode("ace/mode/python");
    //editor.session.setMode("ace/mode/java");
   editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });    
  document.addEventListener("keydown", function(e) {
  if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)  && e.keyCode == 83) {
    e.preventDefault();
    //alert("Ctrl-S pressed");
    sendSaveFile(currentfile);
    e.stopPropagation();
    return false;
    // Process the event here (such as click on submit button)
  }
}, false);

    showMessage("Updating filelist")
    sendListFile()
}

function showMessage(text){
    obj=document.getElementById("message");
    if(obj){
        obj.innerHTML = text;
        obj.classList.remove("hideslow");
        setTimeout("hideMessage()",1000);
    }
}

function hideMessage(){
    obj=document.getElementById("message");
    if(obj){
        obj.classList.add("hideslow");
    }    
}

function saveMe(){
   alert(editor.getValue());                                
}

function ctrls_press(event) {
    if (!(event.which == 115 && event.ctrlKey) && !(event.which == 19)) return true;
    alert("Ctrl-S pressed");
    event.preventDefault();
    event.stopPropagation();
    return false;
}

function togglefolder(obj){
        if (obj.innerHTML=="folder_open"){
                obj.innerHTML="folder";
        }
        else{
                obj.innerHTML="folder_open";
            }
     }


function openclose(obj){
	obj = obj.parentElement;
        console.log(obj);
        subs = obj.getElementsByTagName("ul");
        sub = subs[0];
        sub.classList.toggle("hide");
       /* 
        for (i=0;i<subs.length;i++) {
                sub = subs[i];
                sub.classList.toggle("hide");
                }
        */
        icon = obj.getElementsByTagName("i")[0];;
        togglefolder(icon);
	//console.log(obj); 
        }
        
function ajax(url,data,callback) {
        var req = false;
        try{
                req = new XMLHttpRequest();
                }
        catch(e) {
                try {
                        req = new ActiveXObject("Msxml2.XMLHTTP");  
                        }
                catch(e) {
                        try{
                                req = new ActiceXObject("Microsoft.XMLHTTP");
                                }
                        catch(e) {
                                // browser does not support AJAX
                                return false;
                                }
                        }
                }
        req.open("POST",url,true);
        req.setRequestHeader("Content-Type","application/json");
        //req.setRequestHeader("Access-Control-Allow-Origin", "*");
        req.onreadystatechange = function() {
                if (req.readyState == 4) callback(req);
                    }
        req.send(data);
        return true;
        }


function recLoad(req){
        if (req.status==200){
                response = JSON.parse(req.responseText);
                currentfile = response["response"];
                shortfilename = response["response"].split(/(\\|\/)/g).pop();
                document.title=shortfilename;
                editor.setValue(response["content"]);
                editor.setValue(editor.getValue(), -1) ;
                
                mode = modelist.getModeForPath(currentfile);//mode
                showMessage("Changing to scheme "+mode.name);
                editor.session.setMode(mode.mode);
                /*
                extension = shortfilename.split(/(\.)/g).pop()
                document.title=shortfilename + " ("+extension+")";
                filetype = templates[extension.toUpperCase()];
                //alert(filetype);
                if (filetype){
                     editor.session.setMode("ace/mode/"+filetype);
                     showMessage("Changing to scheme "+filetype);
                    }
                */    
                }
        else {
            alert("Error Message Code:"+req.status+", "+req.statusText);
                }
        }

function recSave(req){
        if (req.status==200){
                response = JSON.parse(req.responseText);
                showMessage(response["response"]);
                }
        else {
            alert("Error Message Code:"+req.status+", "+req.statusText);
                }
        }


function recList(req){
        if (req.status==200){
                response = JSON.parse(req.responseText);
                fileview = buildFiles(response["response"]);
                var obj = document.getElementById("folderview");
                obj.innerHTML = fileview;
                }
        else {
            alert("Error Message Code:"+req.status+", "+req.statusText);
                }
        }

function sendLoadFile(file){
        data = JSON.stringify({"request":file});
        url = hosturl+"/load";
        if (!ajax(url,data,recLoad))
            log("Something went wrong when communicating with rest-API..");
        }

function sendSaveFile(file){
        data = JSON.stringify({"request":file,"content":editor.getValue()});
        url = hosturl+"/save";
        if (!ajax(url,data,recSave))
            log("Something went wrong when communicating with rest-API..");
        }

function sendListFile(){
        data = JSON.stringify({"request":"C:/git/python"});
        url = hosturl+"/list";
        if (!ajax(url,data,recList))
            log("Something went wrong when communicating with rest-API..");
        }

var teststructure = [{"name":"python","content":[{"name":"programA.py"},{"name":"programB.py"},{"name":"programC.py"}]}];


function buildFiles(filestructureArray){
        var output =""
        for (var i=0;i<filestructureArray.length;i++) {
          var filestructure = filestructureArray[i];       
        if (filestructure["content"]) {
        // folder
             var obj = document.getElementById("foldertemplate");
             if (obj) {
                 var foldername = filestructure["name"];
                 var content = buildFiles(filestructure["content"]);    
                 output += obj.innerHTML.replace("::foldername::",foldername).replace("::content::",content);
             } else alert("error folder");        
             //console.log(output);
        } else {
        // file
             var filepath = filestructure["name"];  
             var filename = filepath.split(/(\\|\/)/g).pop();
             var obj = document.getElementById("filetemplate");
             if (obj)                
                 output += obj.innerHTML.replace("::filepath::",filepath).replace("::filename::",filename);
             else 
                 alert("error file");
             //console.log(output);
         }
        }
            return output;              
 }

function tester(){
        fileview = buildFiles(teststructure);
         var obj = document.getElementById("folderview");
         obj.innerHTML = fileview;
        }