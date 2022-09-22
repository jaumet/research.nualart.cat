
///////////////////////////////////////////////////////////////////
// AREA CONFIGURATION
//
	var MAX_DISTINC = 30;
	var AREAX = 920;
	var AREAY = 600;
	var COLORS_APPROACH = "fix"; // fix, random, gradient
	var PARAM1 = "RESPONSIBLE_ORG_UNIT";
	var PARAM2 = "HIGH_COST_LOW_COST";
	var AREA_TITLE = "Callista deintentified";

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
    "PERSON_ID": 
			{ human: "PERSON ID", areafilter: "0", type:"number", exclude: "1"},
    "RESPONSIBLE_ORG_UNIT": 
			{ human: "RESPONSIBLE ORG UNIT", areafilter: "1", type:"text", exclude: "0"},
    "RESEARCH_ORG_UNIT": 
			{ human: "RESEARCH ORG UNIT", areafilter: "1", type:"text", exclude: "0"},
    "FEE_CAT": 
			{ human: "FEE CAT", areafilter: "1", type:"text", exclude: "0"},
    "COURSE_TITLE": 
			{ human: "COURSE TITLE", areafilter: "1", type:"text", exclude: "0"},
    "TITLE": 
			{ human: "TITLE", areafilter: "1", type:"text", exclude: "0"},
    "CURRENT_EFTSU": 
			{ human: "CURRENT EFTSU", areafilter: "1", type:"number", exclude: "0"},
    "COURSE_CD": 
			{ human: "COURSE CD", areafilter: "1", type:"text", exclude: "0"},
    "HIGH_COST_LOW_COST": 
			{ human: "HIGH COST LOW COST", areafilter: "1", type:"text", exclude: "0"},
    "RES_EFTSU_TO_DATE": 
			{ human: "RES EFTSU TO DATE", areafilter: "1", type:"text", exclude: "0"},
    "RFCD_1_PRCNT": 
			{ human: "RFCD 1 PRCNT", areafilter: "1", type:"text", exclude: "0"},
    "SEO_1_CODE": 
			{ human: "SEO 1 CODE", areafilter: "1", type:"text", exclude: "0"},
    "SEO_1_PRCNT": 
			{ human: "SEO 1 PRCNT", areafilter: "1", type:"text", exclude: "1"},
    "COURSE_ATTEMPT_STATUS": 
			{ human: "COURSE ATTEMPT STATUS", areafilter: "1", type:"text", exclude: "1"},
    "RFCD_1_DESC": 
			{ human: "RFCD 1 DESC", areafilter: "1", type:"text", exclude: "1"},
    "COURSE_TOTAL_EFTSU": 
			{ human: "COURSE TOTAL EFTSU", areafilter: "1", type:"text", exclude: "0"},
    "SEO_1_DESC": 
			{ human: "SEO 1 DESC", areafilter: "0", type:"text", exclude: "0"},
	}
];
