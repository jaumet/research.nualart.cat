import json
from pprint import pprint

json_data=open('icml13.json')

data = json.load(json_data)
#jdata = json.loads(json_data)
for ii in data.iteritems():
	for i in ii:
		print i[1]

json_data.close()

