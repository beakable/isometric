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