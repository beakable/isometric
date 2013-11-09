/*  
Copyright (c) 2013 Iain Hamilton & Edward Smyth

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. 
*/

/*

	Pathfinding function for isometric game
	Using the A* Pathfind method
	
	item: - The item being tracked, allows us to assign a webworker to them
	s: start  array [x,y]
	e: end array [x,y] 
	m: map array of map tiles
		- 0 = Clear
		- 1 or bigger = block
*/
var pathfind = function (item, start, end, map, diagonal, callback, force) {

	if (start[0] != end[0] || start[1] != end[1]) {

		// Ensure Web worker is supported
		if (typeof Worker !== 'undefined') {

			if (typeof item.pathfind !== 'object') {

				item.pathfind = {
					worker: new Worker('/com/pathfind/pathfind_worker.js?' + Math.random()),
					end: end,
					path: undefined,
					active: false
				};

				// Event Listener
				item.pathfind.worker.addEventListener('message', function(e) {

					if (typeof e.data[0] !== 'function') {

						item.pathfind.active = false;
						item.pathfind.path = e.data;

						callback(e.data); // Pass data to callback function
					}
				}, false);			
			}

			var pathfindWorker = function (p) {
					if (!p.active) {
						p.end = end;
						p.active = true;
						p.worker.postMessage({s: start, e: end, m: map, d: diagonal}); // Initiate WebWorker	
					}			
				};

			// Check if end location is same as previous loop
			if ((force !== undefined && !force) && item.pathfind.end[0] == end[0] && item.pathfind.end[1] == end[1] && item.pathfind.path !== undefined) {

				// Loop through current path
				for (var i = 0, len = item.pathfind.path.length; i < len; i++) {
					if (item.pathfind.path[i].x == start[0] && item.pathfind.path[i].y == start[1]) {
						item.pathfind.path.splice(0, i);
						callback(item.pathfind.path);
						return true;
					}
				}

				// If location not located
				pathfindWorker(item.pathfind);

			} else {

				item.pathfind.end = end;
				item.pathfind.path = undefined;

				// Perform Search
				pathfindWorker(item.pathfind);
			}


		} else {
			callback([]); // Return blank array for non supported browsers
			return true;
		}

	} else {
		return false; // No need for pathfind required
	}
}