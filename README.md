HTML5 Canvas Tile Engine
=========


![JSiso](http://jsiso.com/jsiso.png)


This repo contains an MIT Licensed Isometric HTML5 tile engine Copyright © 2014 of Iain Hamilton.

For a list of examples and further details checkout: http://jsiso.com

![noniso](https://cloud.githubusercontent.com/assets/1159739/4778380/9ee88a06-5be7-11e4-9237-45c3020bdc84.jpg)


Currently contained features are:
- Implements AMD through RequireJS
- Easily build complex isometric 2D.5 layouts or flat 2D layouts
- Tiled Editor format support
- Unlimited layer stacking
- Isometric heightmaps
- Auto scaling of image dimensions
- Spritesheet and individual one by one tile image loading
- RGBA tile values
- Zooming
- Rotating
- Simple Collision
- AI Pathfinding using Web Workers
- Custom built Particle Engine
- Easy fake lighting
- Player vision limiting
- Simple player device interaction
- Apply the same code accross tile formats



Setup Instructions:
-------------

1: In each of the samples .html you'll see: ```<script data-main="../../config.js" src="../../requirejs/require.js"></script>```. If you move JsIso and RequireJs location this will require updating.

2: config.js contains the requirejs baseUrl set as "/isometric/" by default. Make sure this reflects your base path to the folder containing JsIso & RequireJS.

3: That should be everything.


Particles
![particles](https://f.cloud.github.com/assets/1159739/1322878/ca65cd72-3453-11e3-97f6-c6b0243787b0.png)


Pathfinding (All cuboids apart from blue are AI)
Pathfinding calculations are handled via webworkers.
![ai](https://f.cloud.github.com/assets/1159739/1286661/31621fbc-2fdb-11e3-9e7a-39436670d4ba.png)


Fog of view and lighting toggled on (blue cuboid represents player)
![lighting](https://f.cloud.github.com/assets/1159739/1278363/757498b4-2f0f-11e3-97af-5e5042679270.png)


Basic dynamic lighting
![with-lighting](https://f.cloud.github.com/assets/1159739/1277738/28d797b8-2edd-11e3-95f8-4e6177eb81bd.png)

Lighting toggled off
![no-lighting](https://f.cloud.github.com/assets/1159739/1277736/0fb64586-2edd-11e3-8a73-43645830401c.png)



Height Maps, Rotation, Auto Shadows, Zoom
![new-screen](https://f.cloud.github.com/assets/1159739/1273886/fd76d006-2d5c-11e3-8dde-f9d83eba639b.png)


Previous tile map zoomed out
![new-screen2](https://f.cloud.github.com/assets/1159739/1273894/d760ad64-2d5d-11e3-9bf2-77319cce1fc6.png)



Early Screenshot 1
![screen1](https://f.cloud.github.com/assets/1159739/1267397/a8c33f7a-2cb9-11e3-8d82-2b5ec4c5f2aa.png)

Early Screenshot 2 
![screen2](https://f.cloud.github.com/assets/1159739/1267395/94e0ea16-2cb9-11e3-9726-86f312bca9f9.png)




