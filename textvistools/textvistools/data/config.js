
///////////////////////////////////////////////////////////////////
// AREA CONFIGURATION
//
	var MAX_DISTINC = 30;
	var AREAX = 920;
	var AREAY = 600;
	var COLORS_APPROACH = "fix"; // fix, random, gradient
	var PARAM1 = "year";
	var PARAM2 = "year";
	var AREA_TITLE = "Discover and explore Text visualization tools";

///////////////////////////////////////////////////////////////////
// FIELDS CONFIGURATIONS:
//
// -> the index are the machine-names for each field (only alphanumeric characters)/ Also used in var DATA
// -> human : human name for the field
// -> filter: 0 no eligible for filtering | 1 eligible for filtering
//

	
// NOTE: could be interesting when data is big, to use short index names, f.e. 0, 1, 2, 3, 4...

///////////////////////////////////////////////////////////////////
// DATA
//

var FIELDS = [
	{
  "id": 
  			{ human: "ID", areafilter: "0", type:"number", nodeinfo:"no"},
  "name": 
  			{ human: "Title", areafilter: "1", type:"text", nodeinfo:"yes"},
  "name_short": 
  			{ human: "short title", areafilter: "1", type:"text", nodeinfo:"no"},
  "author": 
  			{ human: "Authos(s)", areafilter: "1", type:"text", nodeinfo:"yes"},
  "year": 
        { human: "Year", areafilter: "1", type:"number", nodeinfo:"yes"},
  "url": 
  			{ human: "Web", areafilter: "0", type:"url", nodeinfo:"yes"},
  "data": 
  			{ human: "Data", areafilter: "1", type:"text", nodeinfo:"yes"},
  "discipline": 
  			{ human: "Discipline", areafilter: "1", type:"text", nodeinfo:"yes"},
  "method":
  			{ human: "Method", areafilter: "1", type:"text", nodeinfo:"yes"},
  "description": 
  			{ human: "Description", areafilter: "1", type:"text", nodeinfo:"yes"},
  "image_name": 
  			{ human: "image_name", areafilter: "0", type:"text", nodeinfo:"yes"},
  "Single_Collection":
  			{ human: "Text: Single or Collection", areafilter: "0", type:"text", nodeinfo:"yes"},
  "SW_SP_CI_CA":
  			{ human: "Text subclasses", areafilter: "0", type:"text", nodeinfo:"yes"},
  "Time":
  			{ human: "Time", areafilter: "0", type:"text", nodeinfo:"yes"},
  "Search":
  			{ human: "Search", areafilter: "0", type:"text", nodeinfo:"yes"},
  "Data_size":
  			{ human: "Data size", areafilter: "0", type:"text", nodeinfo:"yes"}
	}
];
