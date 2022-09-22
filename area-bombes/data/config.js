
///////////////////////////////////////////////////////////////////
// AREA CONFIGURATION
//
	var MAX_DISTINC = 30;
	var AREAX = 910;
	var AREAY = 700;
	var COLORS_APPROACH = "fix"; // fix, random, gradient
	var PARAM1 = "monthOfDeath";
	var PARAM2 = "yearOfDeath";
	var AREA_TITLE = "AREA Bombardeixos";
                                              
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
  "localId": 
		{ human: "localId", areafilter: "0", type:"number"},
  "dayOfDeath": 
		{ human: "dayOfDeath", areafilter: "0", type:"number"},
  "monthOfDeath": 
		{ human: "monthOfDeath", areafilter: "0", type:"number"},
  "yearOfDeath": 
		{ human: "yearOfDeath", areafilter: "0", type:"number"},
  "numId": 
		{ human: "numId", areafilter: "0", type:"number"},
  "gender": 
		{ human: "gender", areafilter: "0", type:"number"},
  "identified": 
		{ human: "identified", areafilter: "0", type:"number"},
  "name": 
		{ human: "", areafilter: "0", type:"number"},
  "surnameFirst": 
		{ human: "surnameFirst", areafilter: "0", type:"number"},
  "surnameSecond": 
		{ human: "surnameSecond", areafilter: "0", type:"number"},
  "yearsOldAtDeath": 
		{ human: "yearsOldAtDeath", areafilter: "0", type:"number"},
  "menor": 
		{ human: "menor", areafilter: "0", type:"number"},
  "placeOfDeathStreet": 
		{ human: "placeOfDeathStreet", areafilter: "0", type:"number"},
  "placeOfDeathMunicipio": 
		{ human: "placeOfDeathMunicipio", areafilter: "0", type:"number"},
  "causeOfDeath": 
		{ human: "causeOfDeath", areafilter: "0", type:"number"},
  "Nombre_investigacion": 
		{ human: "Nombre_investigacion", areafilter: "0", type:"number"},
  "Autoria_investigacion": 
		{ human: "Autoria_investigacion", areafilter: "0", type:"number"},
  "URL_investigacion": 
		{ human: "URL_investigacion", areafilter: "0", type:"number"},
  "notes": 
		{ human: "notes", areafilter: "0", type:"number"}
	}
];



