	
	function pageSequence()
	{
			
		// Set display to 'none'
		var e = document.getElementById(i);
		totalScreens = 1;
		
		while (e != null)
		{
			e.style.display = "none";
			totalScreens++;
			var j = totalScreens + '';
			e = document.getElementById(j);
		}	
		totalScreens--; // Number of screens of text	
		
		// Show first screen
		var f = document.getElementById(i);
		f.style.display = "block";	
		
	}	
		
		
	function doNext()
	{
		var j = parseInt(i);		
		// No more new screens to show
			if ( j == totalScreens) return;

		j++;
		// Hide current, show next screen
		var current = document.getElementById(i);
		current.style.display = "none";
		
		var strJ = j + '';
		var next = document.getElementById(strJ);
		next.style.display = "block";
		i = j;
	}

	function doPrevious()
	{
		var j = parseInt(i);
		// No more screens to show
			if ( j == 1 ) return;
		
		j--;
		
		// Hide current, show next screen
		var current = document.getElementById(i);
		current.style.display = "none";
		
		var strJ = j + '';
		var previous = document.getElementById(strJ);
		previous.style.display = "block";
		i = j;
	}
	
	function showReferences()
	{
		var current = document.getElementById(i);
		current.style.display = "none";
		
		var refs = parseInt(totalScreens);
		var e = document.getElementById(refs);
		e.style.display = "block";
		i = totalScreens;
	}
	
	function showTitlePage()
	{
		// Hide current, show next screen
		var current = document.getElementById(i);
		current.style.display = "none";
		
		// Set i to title page
		i = 1;
		var f = document.getElementById(i);
		f.style.display = "block";		
	}
	
	function doPrintVersion()
	{
	var newWindow = window.open("","base","width=1000,height=500,status=yes,resizable=yes,menubar=yes,scrollbars=yes,toolbar=yes");
    newWindow.document.write('<html><head><title>Print Version</title>');
	newWindow.document.write('<link rel="stylesheet" type="text/css" href="IRPrintStyle.css" media="print"/></head>');
	newWindow.document.write('<body>');
	 for (var i = 1; i < totalScreens + 1; i++)
	 {
	 	var e = document.getElementById(i);
	 	newWindow.document.write(e.innerHTML); 
	 }
	 newWindow.document.write('</body></html>');
	 newWindow.document.close();
	 
	}
	
	function goHome()
	{
	 window.location.href = "../index.html";
	}
	
	function showContents()
	{
		window.location.href = "infres113.html";
	
		}
	
	function showRef(inRef)
	{
		var f = document.getElementById("refDisplay");
		f.style.display = "block";
		f.style.backgroundColor = "#FFFFCE";
		f.style.paddingLeft = "10px";
		f.style.paddingRight = "10px";
		var e = document.getElementById("ref");
		var g = document.getElementById(inRef);
		e.innerHTML = g.innerHTML;
		scrollTo(0,0);
	}
	function doHideRef()
	{
		var e = document.getElementById("refDisplay");
		e.style.display = "none";
	}
	function handleFont()
	{
		
		if (flag)
		{
		 var htmlDoc = document.getElementsByTagName('div');
		 for (var i = 0; i < htmlDoc.length; i++)
		 {
		 htmlDoc[i].style.fontFamily = "times, courier, serif";
		 htmlDoc[i].style.fontSize = "100%";
		 htmlDoc[i].style.fontWeight = "bold";
		 }
		 flag = false;
		}
		else
		{
		 var htmlDoc = document.getElementsByTagName('div');
		 for (var i = 0; i < htmlDoc.length; i++)
		 {
		 htmlDoc[i].style.fontFamily = "arial, verdana, geneva, helvetica, sans-serif"; 
		 htmlDoc[i].style.fontSize = "100%";
		 htmlDoc[i].style.fontWeight = "bold";
		 }
		 flag = true;
		}
	}
	function switchImg(identity, newImg)
	{
	 var e = document.getElementById(identity);
	 e.src = newImg;
	}
	
