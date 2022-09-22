/////////////////////////////////
//		  VISFERENCE
//	  CONFIGURATION FILE
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
//	It defines the machine name the human name and whether each paramater 
//	is eligible for filtering.
// ROLE DEFINITIONS:
// 		"table" -> only SuperList as a column in the table
// 		"category" -> only SuperList as a category in left column
//		"subcategory" -> only SuperList as a subcategory in left column
// 		"area" -> only as AREA field
// 		"table-area" -> SuperList as a column in the table + AREA parameter
// 		"category-area" -> SuperList as a category in left column + AREA parameter
// 
// FILTERS -> this variable is used only for Superlist.
//	It defines the machine names for each category


///////////////////////////////////////////////////////////////////
// AREA CONFIGURATION
//
	var MAX_DISTINC = 20;
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
			{ human: "My ID", areafilter: "0", role:"table"},
		"title": 
			{ human: "My Title", areafilter: "1", role:"table-area"},
		"author": 
			{ human: "Authors", areafilter: "1", role:"table-area"},
		"url": 
			{ human: "PDF<br />Abs", areafilter: "1", role:"table-area"},
		"Identifier":
			{ human: "Identifier", areafilter: "1", role:"hide"},
		"topic1":
			{ human: "SVNs and Kernels", areafilter: "0", role:"table-area"},
		"topic2": 
			{ human: "Theory", areafilter: "1", role:"table-area"},
		"topic3": 
			{ human: "Policies and Games", areafilter: "1", role:"table-area"},
		"topic4": 
			{ human: "Images and Neural Network", areafilter: "1", role:"table-area"},
		"topic5": 
			{ human: "Experiments", areafilter: "1", role:"table-area"},
		"topic6": 
			{ human: "Definitions", areafilter: "1", role:"table-area"},
		"topic7": 
			{ human: "Optimisation", areafilter: "1", role:"table-area"},
		"topic8": 
			{ human: "Probabilistic Models", areafilter: "1", role:"table-area"},
		"topic9": 
			{ human: "Discussion", areafilter: "1", role:"table-area"},
		"topic10": 
			{ human: "Topic and Latent Variable Models", areafilter: "1", role:"table-area"},
		"axis1": 
			{ human: "Complexity", areafilter: "1", role:"category-area"},
		"a1": 
			{ human: "Time", areafilter: "0", role:"subcategory"},
		"a2": 
			{ human: "Space", areafilter: "0", role:"subcategory"},
		"a3": 
			{ human: "Algorithmic", areafilter: "0", role:"subcategory"},
		"axis2": 
			{ human: "Data", areafilter: "1", role:"category-area"},
		"b1": 
			{ human: "Matrices", areafilter: "0", role:"subcategory"},
		"b2": 
			{ human: "Reresentation", areafilter: "0", role:"subcategory"},
		"b3": 
			{ human: "Sequential", areafilter: "0", role:"subcategory"},
		"axis3": 
			{ human: "Modelling", areafilter: "1", role:"category-area"},
		"c1": 
			{ human: "Model selection", areafilter: "0", role:"subcategory"},
		"c2": 
			{ human: "Probability", areafilter: "0", role:"subcategory"},
		"c3": 
			{ human: "Graphs/networks", areafilter: "0", role:"subcategory"},
		"c4": 
			{ human: "Latent variables", areafilter: "0", role:"subcategory"},
		"c5": 
			{ human: "Loss function/utility", areafilter: "0", role:"subcategory"},
		"axis4": 
			{ human: "Algorithmics", areafilter: "1", role:"category-area"},
		"d1": 
			{ human: "Optimisation", areafilter: "0", role:"subcategory"},
		"d2": 
			{ human: "Greedy", areafilter: "0", role:"subcategory"},
		"d3": 
			{ human: "MCMC", areafilter: "0", role:"subcategory"},
		"d4": 
			{ human: "Online", areafilter: "0", role:"subcategory"},
		"axis5": 
			{ human: "Task", areafilter: "1", role:"category-area"},
		"e1": 
			{ human: "Vision and image", areafilter: "0", role:"subcategory"},
		"e2": 
			{ human: "Documents", areafilter: "0", role:"subcategory"},
		"e3": 
			{ human: "Medical", areafilter: "0", role:"subcategory"},
		"axis6": 
			{ human: "Interaction", areafilter: "1", role:"category-area"},			
		"f1": 
			{ human: "Supervised", areafilter: "0", role:"subcategory"},
		"f2": 
			{ human: "Feedback", areafilter: "0", role:"subcategory"},
		"axis7": 
			{ human: "Theory", areafilter: "1", role:"category-area"},
		"g1": 
			{ human: "Proofs", areafilter: "0", role:"subcategory"},
		"g2": 
			{ human: "Information theory", areafilter: "0", role:"subcategory"},
		"g3": 
			{ human: "Complexity", areafilter: "0", role:"subcategory"}
	}
];

var SUPERLIST_CATEGORIES = [
	{
	"axisname":"axis1",
			"values" : 
			[
				{"code": "a1"},
				{"code": "a2"}
			]
	},
	{
	"axisname":"axis2",
			"values" : 
			[
				{"code": "b1"},
				{"code": "b2"},
				{"code": "b3"}
			]
	},
	{
	"axisname":"axis3",
			"values" : 
			[
				{"code": "c1"},
				{"code": "c2"}
				]
	},
	{
	"axisname":"axis4",
			"values" : 
			[
				{"code": "d1"},
				{"code": "d2"},
				{"code": "d3"}
			]
	},
	{
	"axisname":"axis5",
			"values" : 
			[
				{"code": "e1"},
				{"code": "e2"},
				{"code": "e3"}
			]
	},
	{
	"axisname":"axis6",
			"values" : 
			[
				{"code": "f1"},
				{"code": "f2"}
			]
	},
	{
	"axisname":"axis7",
			"values" : 
			[
				{"code": "g1"},
				{"code": "g2"},
				{"code": "g3"}
			]
	}
];

