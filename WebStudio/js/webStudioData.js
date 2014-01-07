var data = {"nodes" : [],
			"paths" : []}
			
function lookup(item, array) {
	for(var i = 0; i < array.length; ++i)
		if(array[i].id === item)
			return i;
}

function forEach(array, action) {
	for(var i = 0; i < array.length; ++i) 
		action(array[i]);
}

function print(item) {
	console.log(item.id);
}

