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

/***

  jsiso/pathdind/pathfind

  Using the A* Pathfind method
  
  item: - The item being tracked, allows us to assign a webworker to them
  s: start  array [x,y]
  e: end array [x,y] 
  m: map array of map tiles
    - 0 = Clear
    - 1 or bigger = block

***/
define(['module'], function(self) {

  var workers = [];

  return function (id, start, end, map, diagonal, force) {

    if (workers[id] === undefined) {
      workers[id] = (new Worker(self.uri.replace("pathfind.js", "worker.js?") + Math.random()));
    }

    return new Promise(function(resolve, reject) {

      if (start[0] != end[0] || start[1] != end[1]) {

        var pathfind = {
          worker: workers[id], // Fix to get web worker path from any location
          end: end,
          path: undefined,
          active: false
        };

        // Event Listener
        pathfind.worker.addEventListener('message', function(e) {
          if (typeof e.data[0] !== 'function') {
            pathfind.active = false;
            pathfind.path = e.data;
            resolve(e.data); // Pass data to resolve function
          }
        }, false);

        var pathfindWorker = function (p) {
            if (!p.active) {
              p.end = end;
              p.active = true;
              p.worker.postMessage({s: start, e: end, m: map, d: diagonal}); // Initiate WebWorker  
            }
          };

        // Check if end location is same as previous loop
        if ((force !== undefined && !force) && pathfind.end[0] == end[0] && pathfind.end[1] == end[1] && pathfind.path !== undefined) {

          // Loop through current path
          for (var i = 0, len = pathfind.path.length; i < len; i++) {
            if (pathfind.path[i].x == start[0] && pathfind.path[i].y == start[1]) {
              pathfind.path.splice(0, i);
              resolve(pathfind.path);
              return true;
            }
          }

          // If location not located
          pathfindWorker(pathfind);

        }
        else {
          pathfind.end = end;
          pathfind.path = undefined;

          // Perform Search
          pathfindWorker(pathfind);
        }

      } else {
        workers[id].terminate();
        workers[id] = undefined;
        return false; // No need for pathfind required
      }
    });
  };
});