//var csv is the CSV file with headers
function csvJSON(/Users/arisatoyosaki/Desktop/RS_sampledata/150505_techappointments.csv){
 
  var lines = csv.split("\n");
 
  var result = [];
 
  var headers = lines[1].split(",");
 
  for(var i=1;i<lines.length;i++){
 
	  var obj = {};
	  var currentline=lines[i].split(",");
 
	  for(var j=0;j<headers.length;j++){
		  obj[headers[j]] = currentline[j];
	  }
 
	  result.push(obj);
 
  }
  
  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}