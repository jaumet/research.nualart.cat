# -*- coding: utf-8 -*-

from os import listdir
from os.path import isfile, join
import csv
from pprint import pprint

import requests

###########################################

def getLatLng(L):
    latlng = {}
    response = requests.get('https://maps.googleapis.com/maps/api/geocode/json?address='+L.replace(" ","+"))
    resp_json_payload = response.json()
    out = resp_json_payload['results'][0]['geometry']['location']
    latlng["lat"] = out['lat']
    latlng["lng"] = out['lng']
    return latlng

def LaRed_get_csv_give_json():
    '''
    This function simply takes a csv with data about LaRed from the Mariategui archive, and it prints a customized JSON output
    '''
    out = ''
    '''
    /////////////////////////////////////////////////
    // This is the JS variable in JSON format
    // to be loaded with the Mariategui-LaRed"s maps
    /////////////////////////////////////////////////

    '''

    out += '' #'var events = [\n\t'
    print 'var events = [\n\t'
    mypath = './'
    c = 0
    onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
    fields = ['Fecha', 'PaisOrigen', 'ProvinciaOrigen', 'CiudadOrigen', 'Remitente', 'Destinatario', 'PaisDestino', 'ProvinciaDestino', 'CiudadDestino', 'Descripcion', 'TipologiaDocumental', 'Tema1', 'Tema2', 'ActorSecundario', 'LinkPDF', 'LinkRegistro']

    with open('lared_data_test_w_headers.csv.csv','rb') as mycsv:
        for line in csv.reader(mycsv, delimiter=","):
            dictTMP = dict(zip(fields, line))
            dataTMP = '{\n\t'
            #out += '{\n\t'
            #print '{\n\t'
            c += 1
            dataTMP += '"name": "'+str(c)+'-' +dictTMP["PaisOrigen"]+'->' +dictTMP["PaisDestino"]+'",\n\t'
            dataTMP += '"date": "'+dictTMP["Fecha"].replace("-","")+'",\n\t'
            if "Per" in dictTMP["PaisOrigen"] and "Per" in  dictTMP["PaisDestino"]:
                dataTMP += '"map": "peru",\n\t'
                #print '"map": "peru",\n\t'
            else:
                dataTMP += '"map": "world",\n\t'
                #print '"map": "world",\n\t'
            dataTMP += '"data": {\n\t\t'

            #print '"name": "'+str(c)+'-' +dictTMP["PaisDestino"]+'",\n\t'
            #print '"date": "'+dictTMP["Fecha"].replace("-","")+'",\n\t'

            # get the lat /lon from city name
            myLoc = dictTMP["CiudadOrigen"]+" "+dictTMP["ProvinciaOrigen"]+" "+dictTMP["PaisOrigen"]
            #print myLoc
            latlng = getLatLng(myLoc.replace(" ","+"))
            dataTMP += '"latitude": "'+str(latlng["lat"])+'",\n\t\t'
            dataTMP += '"longitude": "'+str(latlng["lng"])+'",\n\t\t'

            #print '"latitude": "'+str(latlng["lat"])+'",\n\t\t'
            #print '"longitude": "'+str(latlng["lng"])+'",\n\t\t'

            dataTMP += '"tooltip": "'+myLoc+' -> '+dictTMP["Tema1"]+'",\n\t\t'
            dataTMP += '"value": ["'+dictTMP["Tema1"]+'", "'+myLoc+'"]\n\t'
            dataTMP += '\n\t}'

            #print '"tooltip": "'+dictTMP["Remitente"].replace("\r"," ").replace("\n"," ")+'",\n\t\t'
            #print '"value": "'+dictTMP["Tema1"]+'",\n\t'
            #print '\n\t},'


            '''
            "name": "ny",
            "date": 19231102,
            "map": "world",
            "data": {
              latitude: 40.717079,
              longitude: -74.00116,
              tooltip: {content: "1st) New York"},
              value: [2, "19231102"]
            '''
            out += dataTMP
            out += '\n},\n\t'
            out = out[:-2]
            print out
            out = ''
        #out += '\n];'
        print '\n];'
        #print out

def LaRed-NETWORK-PLOTS_get_csv_give_json():
    '''
    This function simply takes a csv with data about LaRed from the Mariategui archive, and it prints a customized JSON output
    '''
    out = ''
    '''
    /////////////////////////////////////////////////
    // This function outputs a JS variable as a JSON format
    // to be loaded with the Mariategui-LaRed"s maps
    /////////////////////////////////////////////////

    '''

    out += '' #'var events = [\n\t'
    print 'var events = [\n\t'
    mypath = './'
    c = 0
    onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
    ç
    with open('lared_data_test_w_headers.csv.csv','rb') as mycsv:
        for line in csv.reader(mycsv, delimiter=","):
            dictTMP = dict(zip(fields, line))
            dataTMP = '{\n\t'
            c += 1
            dataTMP += '"name": "'+str(c)+'-' +dictTMP["PaisOrigen"]+'->' +dictTMP["PaisDestino"]+'",\n\t'
            dataTMP += '"date": "'+dictTMP["Fecha"].replace("-","")+'",\n\t'
            if "Per" in dictTMP["PaisOrigen"] and "Per" in  dictTMP["PaisDestino"]:
                dataTMP += '"map": "peru",\n\t'
                #print '"map": "peru",\n\t'
            else:
                dataTMP += '"map": "world",\n\t'
                #print '"map": "world",\n\t'
            dataTMP += '"data": {\n\t\t'

            #print '"name": "'+str(c)+'-' +dictTMP["PaisDestino"]+'",\n\t'
            #print '"date": "'+dictTMP["Fecha"].replace("-","")+'",\n\t'

            # get the lat /lon from city name
            myLoc = dictTMP["CiudadOrigen"]+" "+dictTMP["ProvinciaOrigen"]+" "+dictTMP["PaisOrigen"]
            #print myLoc
            latlng = getLatLng(myLoc.replace(" ","+"))
            dataTMP += '"latitude": "'+str(latlng["lat"])+'",\n\t\t'
            dataTMP += '"longitude": "'+str(latlng["lng"])+'",\n\t\t'

            #print '"latitude": "'+str(latlng["lat"])+'",\n\t\t'
            #print '"longitude": "'+str(latlng["lng"])+'",\n\t\t'

            dataTMP += '"tooltip": "'+myLoc+' -> '+dictTMP["Tema1"]+'",\n\t\t'
            dataTMP += '"value": ["'+dictTMP["Tema1"]+'", "'+myLoc+'"]\n\t'
            dataTMP += '\n\t}'

            #print '"tooltip": "'+dictTMP["Remitente"].replace("\r"," ").replace("\n"," ")+'",\n\t\t'
            #print '"value": "'+dictTMP["Tema1"]+'",\n\t'
            #print '\n\t},'


            '''
            "name": "ny",
            "date": 19231102,
            "map": "world",
            "data": {
              latitude: 40.717079,
              longitude: -74.00116,
              tooltip: {content: "1st) New York"},
              value: [2, "19231102"]
            '''
            out += dataTMP
            out += '\n},\n\t'
            out = out[:-2]
            print out
            out = ''
        #out += '\n];'
        print '\n];'
        #print out


################################333
## calls:
LaRed_get_csv_give_json();
