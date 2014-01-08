var data = {"nodes" : [],
			"paths" : []}
			
function lookup(item, property, array) {
	for(var i = 0; i < array.length; ++i)
		if(array[i][property] === item)
			return i;
}

function forEach(array, action) {
	for(var i = 0; i < array.length; ++i) 
		action(array[i]);
}

function forEachIn(object, action) {
	for(var property in object) {
		if(object.hasOwnProperty(property))
			action(property, object[property]);
	}
}

function print(item) {
	console.log(item.id);
}

