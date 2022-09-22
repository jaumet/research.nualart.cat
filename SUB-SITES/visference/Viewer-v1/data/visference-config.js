/////////////////////////////////
//          VISFERENCE
//      CONFIGURATION FILE
//////////////////////// [Canberra, Jul-Set2013 by Jaume@Nualart.cat]
// Visference, as it is now, are two exploration tools for a collection of items
// First application of Visaference is for academic papers from conferences. therefor its name.
// The two tools are SuperList and AREA 
// SuperList:
//
// AREA: 
//
// Three variable need to be defined:
// FIELDS -> This variable is only used by AREA. 
//    It defines the machine name the human name and whether each paramater 
//    is eligible for filtering.
// ROLE DEFINITIONS:
// 		"table" -> only SuperList as a column in the table
// 		"category" -> only SuperList as a category in left column
//		"subcategory" -> only SuperList as a subcategory in left column
// 		"area" -> only as AREA field
// 		"table-area" -> SuperList as a column in the table + AREA parameter
// 		"category-area" -> SuperList as a category in left column + AREA parameter
// 
// FILTERS -> this variable is used only for Superlist.
//    It defines the machine names for each category


///////////////////////////////////////////////////////////////////
// AREA CONFIGURATION
//
	var MAX_DISTINC = 200;
	var AREAX = 800;
	var AREAY = 600;
	var COLORS_APPROACH = "gradient"; // fix, random, gradient
	var PARAM1 = "axis1";
	var PARAM2 = "axis1";
	var AREA_TITLE = "";

///////////////////////////////////////////////////////////////////
// FIELDS CONFIGURATION:
//
// -> the index are the machine-names for each field (only alphanumeric characters)/ Also used in var DATA
// -> human : human name for the field
// -> filter: 0 no eligible for filtering | 1 eligible for filtering
// -> role: "hide" to hide the parameter in the supertable.

var FIELDS = [
	{
		"id": 
			{ human: "NIPS ID", areafilter: "0", role:"table"},
		"title": 
			{ human: "Title", areafilter: "1", role:"table-area"},
		"author": 
			{ human: "Authors", areafilter: "1", role:"table-area"},
                "bm25": 
			{ human: "BM25", areafilter: "1", role:"table-area"},
                "tpsc": 
			{ human: "Topic Score", areafilter: "1", role:"table-area"},
		"url": 
			{ human: "PDF<br />Abs", areafilter: "1", role:"table-area"},
                "Identifier":
			{ human: "Identifier", areafilter: "1", role:"hide"},
                "topic1":
			{ human: "Topic 1", areafilter: "0", role:"table-area"},
                "topic2": 
			{ human: "Topic 2", areafilter: "1", role:"table-area"},
		"topic3": 
			{ human: "Topic 3", areafilter: "1", role:"table-area"},
		"topic4": 
			{ human: "Topic 4", areafilter: "1", role:"table-area"},
		"topic5": 
			{ human: "Topic 5", areafilter: "1", role:"table-area"},
                "topic6": 
			{ human: "Topic 6", areafilter: "1", role:"table-area"},
                "topic7": 
			{ human: "Topic 7", areafilter: "1", role:"table-area"},
                "topic8": 
			{ human: "Topic 8", areafilter: "1", role:"table-area"},
                "topic9": 
			{ human: "Topic 9", areafilter: "1", role:"table-area"},
                "topic10": 
			{ human: "Topic 10", areafilter: "1", role:"table-area"}
	}
];

