"""
@author: raw
"""

from flask import Flask, request, render_template, jsonify
import socket,json,os

#import hashlib

app = Flask(__name__)

host = socket.gethostname()

@app.route("/")
@app.route("/home")
def home():
    return render_template("index.html")

@app.route('/load', methods=['POST','GET'])
def editorLoad():
    print("Received input")
    print(request.data)
    msgObj = json.loads(request.data)
    file = open(msgObj["request"], "r") 
    filecontent=file.read() 
    return jsonify({"response":msgObj["request"],"content":filecontent})

def createStructure(dirv):
    fileList = os.walk(dirv)
    root,dirs,files = next(fileList)
    subfiles = subFiles(root,files)
    return [{"name":dirv,"content":subStructure(root,dirs,files,fileList)+subfiles}]

def subStructure(root,dirs,files,fileList):
    output = []
    for dirName in dirs:
        root,dirs,files = next(fileList)
        subfiles = subFiles(root,files)
        print(root)
        for filename in files:
            print(filename)
        if len(dirs)>0:
            output.append({"name":dirName,"content":subStructure(root,dirs,files,fileList)+subfiles})
        else:
            output.append({"name":dirName,"content":subfiles})
    return output

def subFiles(root,files):
    output = []
    for filename in files:
        output.append({"name":root.replace("\\","/")+"/"+filename})
    return output  
             

@app.route('/list', methods=['POST','GET'])
def editorList():
    print("Received input")
    print(request.data)
    msgObj = json.loads(request.data)
    fileStructure = createStructure(msgObj["request"]) 
    print(fileStructure)
    return jsonify({"response":fileStructure})

@app.route('/save', methods=['POST','GET'])
def editorSave():
    print("Received input")
    print(request.data)
    msgObj = json.loads(request.data)
    file = open(msgObj["request"], "w") 
    file.write(msgObj["content"]) 
    return jsonify({"response":"File was saved ok!"})

"""
import os

for root, dirs, files in os.walk("."):  
    for filename in files:
        print(filename)
"""


if __name__ == '__main__':
    app.run(debug=True,port=5002)
    #app.run(host='0.0.0.0',debug=True,port=80)
