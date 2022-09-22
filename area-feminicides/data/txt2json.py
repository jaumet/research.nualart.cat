import re

'''
var DATA = [
{"paperid": "509", "subject": "XXXX"},

<strong>abstracting</strong>
<a href="3-4/paper47.html">Human creation of abstracts with selected computer assistance tools</a>

INSERT INTO "violencies" ("id", "data", "tipus_violencies_1", "tipus_violencies_2", "tipus_violencies_3", "mes", "mitja", "nom_victima", "edat", "edat_grups", "ciutat", "comunitat_autonoma", "parentiu_agresor", "armes", "fets", "any") VALUES

(1, '02/01/2000', 'DOMESTICA', 'FEMINICIDI', '', 1, 'EL PAIS', 'R.M.S.', 39, '35-39', 'LA CORUnA', 'GALICIA', 'marit', 'Blanca', 'A.M.Q., va assassinar a punyalades a la seva dona, va cremar el dormitori conjugal i va acabar amb la seva vida penjant-se. Els fets van ocorrer despres d''un sopar de "reconciliacio" el dia de Nit de cap d''any.', 2000),

[{"paperid": 509, "lang": "English", "title": ["Degree of Internet corporate reporting: a research framework"], "numref": 47, "issueurl": "http://informationr.net/ir/17-1/infres171.html", "citation": " Poon, P-L. &amp; Yu, Y.T. (2012). Degree of Internet corporate reporting: a research framework. Information Research, 17(1) paper 509. [Available at http://InformationR.net/ir/17-1/paper509.html]", "volume": 17, "authors": ["Pak-Lok Poon School of Accounting and Finance,The Hong Kong Polytechnic University, Hung Hom, Hong Kong Yuen Tak Yu Department of Computer Science,City University of Hong Kong,Kowloon Tong, Hong Kong"], "link": "http://informationr.net/ir/17-1/paper509.html", "year": 2012, "issue": 1, "numrefgrp": "40-50", "subject": "['online company reports']"}]

'''

f = open("__violenciesjuliol2011sql.txt",'r')
fields = ["id", "data", "tipus_violencies_1", "tipus_violencies_2", "tipus_violencies_3", "mes", "mitja", "nom_victima", "edat", "edat_grups", "ciutat", "comunitat_autonoma", "parentiu_agresor", "armes", "fets", "any"]
myjson = '['
myline = []
for line in f:
  #line = line[1:]
  #line = line[:-2]
  myline = line.split(",")
  myjson += "{"
  for n in range(0,13):
    myjson += "\""+fields[n]+"\": "+myline[n]+", "
  myjson += "\""+fields[14]+"\": "+" ".join(myline[15:-1])+", "
  myjson += "\""+fields[15]+"\": "+" ".join(myline[-1:])
  myjson += "},\n"
myjson += "]"

print myjson
'''
		# replacements
		subjects = re.sub(r'\<strong\>(.*)?\<\/strong\>.*?\n', r'\1', line)
		##subjects = re.sub(r'\<\/a><a\ .*\>$', '', line)
	elif re.match(r'\<a href\=\"', line):
		paperid = re.sub(r'\<a href\=\"\d+\-\d+\/paper(\d+)?\.html.*?\n', r'\1', line)
	if not re.match(r'\D', paperid) and paperid != '' and not re.match(r'\<a\ href', subject):
		#print "@@@@@@@@@@@@@@@"+line
		#print "paperid: "+paperid
		#print "subject: "+subjects	
		count = count + 1
		myjson += '{"paperid": "'+paperid+'", "subject": "'+subjects+'"},\n'
		paperid = ''
	#else:
		#print "!!!!!!!!!!!!!!!!  "+line
		#print "paperid: "+paperid
		#print "subject: "+subjects
myjson = myjson[:-2]
myjson += ']'
print myjson
'''
