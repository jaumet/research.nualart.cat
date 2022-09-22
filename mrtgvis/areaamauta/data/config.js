
///////////////////////////////////////////////////////////////////
// AREA CONFIGURATION
//
	var MAX_DISTINC = 50;
	var AREAX = 1420;
	var AREAY = 1000;
	var COLORS_APPROACH = "fix"; // fix, random, gradient
	var PARAM1 = "numero";
	var PARAM2 = "tipologia_general";
	var AREA_TITLE = "Amauta explorada";

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
	"numero":
	  { human: "número", areafilter: "0", type:"number", exclude:"0"},
	"mes":
	  { human: "Mes", areafilter: "0", type:"text", exclude:"0"},
		"ano":
		  { human: "año", areafilter: "1", type:"number", exclude:"0"},
	"amauta_libro_y_revitas":
	  { human: "Libro y Revitas", areafilter: "1", type:"text", exclude:"0"},
	"nombre_de_seccion":
	  { human: "Secciones", areafilter: "1", type:"text", exclude:"0"},
	"tipologia_general":
	  { human: "Tipología general", areafilter: "1", type:"text", exclude:"0"},
	"tipologia_particular":
	  { human: "Tipología Particular", areafilter: "1", type:"text", exclude:"0"},
	"autor":
	  { human: "Personas Autoras", areafilter: "1", type:"text", exclude:"0"},
	"sexo":
	  { human: "Género autor/a", areafilter: "1", type:"text", exclude:"0"},
	"titulo":
	  { human: "Título", areafilter: "1", type:"text", exclude:"0"},
	"acompanado_texto_e_imagen":
	  { human: "Individual o acompañado", areafilter: "0", type:"text", exclude:"0"},
	"pag":
	  { human: "Página", areafilter: "0", type:"text", exclude:"0"},
	"ciudad":
	  { human: "Ciudad", areafilter: "1", type:"text", exclude:"0"},
	"pais":
	  { human: "País", areafilter: "1", type:"text", exclude:"0"},
	"region":
	  { human: "Región", areafilter: "0", type:"text", exclude:"0"},
	"nombre_de_imagen":
	  { human: "Título imagen acompañ.", areafilter: "1", type:"text", exclude:"0"},
	"nombre_de_artista":
	  { human: "Autor imagen", areafilter: "1", type:"text", exclude:"0"},
	"pag_acomp":
	  { human: "Página", areafilter: "0", type:"number", exclude:"0"},
	"pais2":
	  { human: "País2", areafilter: "0", type:"text", exclude:"1"},
	"nombre_del_anuncio":
	  { human: "Anuncio", areafilter: "1", type:"text", exclude:"0"},
	"a_cargo_de":
	  { human: "A cargo de", areafilter: "0", type:"text", exclude:"0"},
	"domicilio":
	  { human: "Domicilio", areafilter: "1", type:"text", exclude:"0"},
	"obs":
	  { human: "Observaciones", areafilter: "1", type:"text", exclude:"0"},
  }
];
