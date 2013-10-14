/*

	Pathfinding function for isometric game
	Using the A* Pathfind method
	
	item: - The item being tracked, allows us to assign a webworker to them
	s: start  array [x,y]
	e: end array [x,y] 
	m: map array of map tiles
		- 0 = Clear
		- 1 or bigger = block

	TODO: Bind worker to enemy object so the file isn't constantly loaded
*/
var pathfind = function (item, start, end, map, callback) {

	// Ensure Web worker is supported
	if (typeof Worker !== 'undefined') {

		if (typeof item.pathfind !== 'object') {
			item.pathfind = new Worker('com/pathfind/pathfind_worker.js');
		}

		item.pathfind.addEventListener('message', function(e) {
			callback(e.data); // Pass data to callback function
		}, false);

		item.pathfind.postMessage({s: start, e: end, m: map}); // Initiate WebWorker
		return true;	

	} else {
		callback([]); // Return blank array for non supported browsers
		return true;
	}

}