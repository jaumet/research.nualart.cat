<?
## This is the AreaConfig-sample file: 
## copy this file:
## $: cd /path/to/area/diretory
## $: cd lib/
## $: cp AreaConfig-sample.php AreaConfig.php
## And then edit the new file and set the right data to be able to connect 
## to your database and setup the representation
##$max = count($datas['textvistools']['fields']);

## Default parameters
#$param1_default = "Single_Collection";
#$param2_default = "Single_Collection";

## Sample configuration with documentation
$datas['textvistools'] = array // Name for the data (only letters and/or numbers
(
	'name' => 'Text Visualization Tools', // Human title for the data
	'labelOLD' => 'A visualization of the reviewed cases of a literature review by Jaume Nualart, PhD candidate. University of Canberra. Fac. Arts and Design (2013)', // Human subtitle for the data
	'label' => 'We present a visualization/exploration of 49 cases of text visualization approaches, by Jaume Nualart, Mario Pérez-Montoro and Mitchell Whitelaw (Canberra, Australia. 2013)', // Human subtitle for the data
	'max_representations' => "XXX", // representations you can do with your data using Area
	'description' => '', // Description of the Data (accepts HTML.
	'db'=> array(
		'name'=>'text_vis_tools', // database name
		'user'=>'research_user', // database user
		'passw'=>'uybgfU67TY5', // database password
		'host'=>'localhost' // Host. Ussually is 'localhost'
	),
	
	'table'=> 'tools1', // Table to be represented.
	'pkey'=>'id', // Unique value per entrye (use to be the 'id'
	'fields' => array( // list of fields in the database
		'id' => array( // name of one of the fields
			'label'=>'Entry number', // Human name for the field
			'label_en'=>'Entry number', // Human name for the field
			'hidden'=>'1' 
		),
		'name' => array( // name of one of the fields
			'label'=>'Name', // Human name for the field
			'label_en'=>'Name', // Human name for the field
			'filter'=>'1', // 0 or 1. By defaulf or if 'label' is not set, its value is 0
			'show'=>'1' // 0 or 1
		),
		'name_short' => array( // name of one of the fields
			'label'=>'Nanme (short)', // Human name for the field
			'label_en'=>'Nanme (short)', // Human name for the field
			'filter'=>'1', // 0 or 1. By defaulf or if 'label' is not setted, its value is 0
			'show'=>'1' // 0 or 1
		),
		'author' => array( // name of one of the fields
			'label'=>'Author', // Human name for the field
			'label_en'=>'Author', // Human name for the field
			'filter'=>'1', // 0 or 1. By defaulf or if 'label' is not setted, its value is 0
			'show'=>'1' // 0 or 1
		),
		'year' => array( // name of one of the fields
			'label'=>'Year', // Human name for the field
			'label_en'=>'Year', // Human name for the field
			'filter'=>'1', // 0 or 1. By defaulf or if 'label' is not setted, its value is 0
			'show'=>'1' // 0 or 1
		),
		'url' => array( // name of one of the fields
			'label'=>'URL', // Human name for the field
			'label_en'=>'URL', // Human name for the field
			'filter'=>'1', // 0 or 1. By defaulf or if 'label' is not setted, its value is 0
			'show'=>'1' // 0 or 1
		),
		'data' => array( // name of one of the fields
			'label'=>'Data', // Human name for the field
			'label_en'=>'Data', // Human name for the field
			'filter'=>'1', // 0 or 1. By defaulf or if 'label' is not setted, its value is 0
			'show'=>'1' // 0 or 1
		),
		'discipline' => array( // name of one of the fields
			'label'=>'Discipline', // Human name for the field
			'label_en'=>'Discipline', // Human name for the field
			'filter'=>'1', // 0 or 1. By defaulf or if 'label' is not setted, its value is 0
			'show'=>'1' // 0 or 1
		),
		'method' => array( // name of one of the fields
			'label'=>'Method', // Human name for the field
			'label_en'=>'Method', // Human name for the field
			'filter'=>'1', // 0 or 1. By defaulf or if 'label' is not setted, its value is 0
			'show'=>'1' // 0 or 1
		),
		'description' => array( // name of one of the fields
			'label'=>'Description', // Human name for the field
			'label_en'=>'Description', // Human name for the field
			'filter'=>'1', // 0 or 1. By defaulf or if 'label' is not setted, its value is 0
			'show'=>'1' // 0 or 1
		),
		'Single_Collection' => array( // name of one of the fields
			'label'=>'Classif 1st level', // Human name for the field
			'label_en'=>'Classif 1st level', // Human name for the field
			'filter'=>'1', // 0 or 1. By defaulf or if 'label' is not setted, its value is 0
			'show'=>'1' // 0 or 1
		),
		'SW_SP_CI_CA' => array( // name of one of the fields
			'label'=>'Classif 2nd level', // Human name for the field
			'label_en'=>'Classif 2nd level', // Human name for the field
			'filter'=>'1', // 0 or 1. By defaulf or if 'label' is not setted, its value is 0
			'show'=>'1' // 0 or 1
		),
		'Time' => array( // name of one of the fields
			'label'=>'Classif by time', // Human name for the field
			'label_en'=>'Classif by time', // Human name for the field
			'filter'=>'1', // 0 or 1. By defaulf or if 'label' is not setted, its value is 0
			'show'=>'1' // 0 or 1
		),
		'Search' => array( // name of one of the fields
			'label'=>'Classif by search', // Human name for the field
			'label_en'=>'Classif by search', // Human name for the field
			'filter'=>'1', // 0 or 1. By defaulf or if 'label' is not setted, its value is 0
			'show'=>'1' // 0 or 1
		),
		'Data_size' => array( // name of one of the fields
			'label'=>'Classif by dataset size', // Human name for the field
			'label_en'=>'Classif by dataset size', // Human name for the field
			'filter'=>'1', // 0 or 1. By defaulf or if 'label' is not setted, its value is 0
			'show'=>'1' // 0 or 1
		),
	)
);
?>
