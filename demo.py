# -*- coding: utf-8 -*-
"""
Created on Thu Nov  8 17:58:30 2018

@author: raw
"""
import os

def getfilestructure(dir):
    output = []
    for root, dirs, files in os.walk(dir):
        print(root,dirs,len(files))
        content = []
        for filename in files:
            pass

def fillConcent(files):
    for filename in files:
        content = []
        print(root+filename)
            
getfilestructure("C:/git/python/editor/templates")


def createStructure(dir):
    fileList = os.walk(dir)
    root,dirs,files = next(fileList)
    return [{"name":dir,"content":subStructure(root,dirs,files,fileList)}]

def subStructure(root,dirs,files,fileList):
    output = []
    for dirName in dirs:
        root,dirs,files = next(fileList)
        if len(dirs)>0:
            output.append({"name":dirName,"content":subStructure(root,dirs,files,fileList)})
        else:
            output.append({"name":dirName})
    return output+subFiles(root,files)

def subFiles(root,files):
    output = []
    for filename in files:
        output.append({"name":str(root)+"/"+filename})
    return output  

print(createStructure("C:/git/python/editor"))
        
        
        