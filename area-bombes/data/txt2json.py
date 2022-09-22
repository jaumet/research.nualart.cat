import re

f = open("Bombardeos-Barcelona-170409.csv",'r')
fields = ["localId","dayOfDeath","monthOfDeath","yearOfDeath","numId","gender","identified","name","surnameFirst","surnameSecond","yearsOldAtDeath","menor","placeOfDeathStreet","placeOfDeathMunicipio","causeOfDeath","Nombre_investigacion","Autoria_investigacion","URL_investigacion","notes"]
myjson = '['
myline = []
for line in f:
  #line = line[1:]
  #line = line[:-2]
  myline = line.split("|")
  myjson += "{"
  for n in range(0,18):
    myjson += "\""+fields[n]+"\": "+myline[n]+", "
  #myjson += "\""+fields[14]+"\": "+" ".join(myline[15:-1])+", "
  #myjson += "\""+fields[15]+"\": "+" ".join(myline[-1:])
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
