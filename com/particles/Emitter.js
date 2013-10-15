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

function Emitter(ctx, x, y, pcount, loop, xboundRange, yboundRange) {

    var context = ctx;

    var particles = [];

    var loop = loop;

    var xboundRange = xboundRange;

    var yboundRange = yboundRange;

    var xshiftOffset = 0;

    var yshiftOffset = 0;



    this.loaded = false;

    this.x = x;

    this.xOffset = 0;

    this.y = y;

    this.yOffset = 0;

    this.pause = false;

    this.pcount = pcount;

    this.composite = 'lighter';



    this.xRange = new Range(0, 0);

    this.yRange = new Range(0, 0);

    this.drawdelayRange = new Range(-1, -1);

    this.lifeRange = new Range(1, 1); // 0.000 - 1.000

    this.fadeRange = new Range(1, 1); // 0.000 - 1.000

    this.redRange = new Range(255, 255); // 0 - 255

    this.greenRange = new Range(0, 0); // 0 - 255

    this.blueRange = new Range(0, 0); // 0 - 255

    this.xiRange = new Range(10, 10);

    this.yiRange = new Range(10, 10);

    this.xgRange = new Range(0, 0);

    this.ygRange = new Range(0, 0);

    this.slowdownRange = new Range(1, 1); // 0.000

    this.radiusRange = new Range(10, 10);



    this.Load = function () {

        particles = [];



        for (var i = 0; i < this.pcount; i++) {

            particles.push(this.CreateParticle());

        }



        this.loaded = true;


    };



    this.ShiftTo = function (x, y) {

        this.ShiftBy(x - this.x, y - this.y);

    };



    this.ShiftBy = function (xoffset, yoffset) {

        xshiftOffset += xoffset;

        yshiftOffset += yoffset;



        this.x += xoffset;

        this.y += yoffset;

    };

    



    this.Draw = function () {

        if (this.loaded && !this.pause) {

            ctx.save();

            ctx.globalCompositeOperation = this.composite;



            for (var i = 0, tmpsize = particles.length; i < tmpsize; i++) {

                particles[i].x += xshiftOffset;

                particles[i].y += yshiftOffset;



                particles[i].Draw(context);



                if (loop && !particles[i].active) {

                    particles[i] = this.CreateParticle();

                }

            }



            ctx.restore();



            xshiftOffset = 0;

            yshiftOffset = 0;

        }

    };



    this.CreateParticle = function () {

        var p = new Particle();

        p.active = true;

        p.x = this.x + Math.rand(this.xRange.from, this.xRange.to) + this.xOffset;

        p.y = this.y + Math.rand(this.yRange.from, this.yRange.to) + this.yOffset;

        p.drawdelay = Math.rand(this.drawdelayRange.from, this.drawdelayRange.to);

        p.life = Math.rand(this.lifeRange.from * 1000, this.lifeRange.to * 1000) / 1000;

        p.fade = Math.rand(this.fadeRange.from * 1000, this.fadeRange.to * 1000) / 1000;

        p.r = Math.rand(this.redRange.from, this.redRange.to);

        p.b = Math.rand(this.blueRange.from, this.blueRange.to);

        p.g = Math.rand(this.greenRange.from, this.greenRange.to);

        p.xi = Math.rand(this.xiRange.from, this.xiRange.to);

        p.yi = Math.rand(this.yiRange.from, this.yiRange.to);

        p.xg = Math.rand(this.xgRange.from, this.xgRange.to);

        p.yg = Math.rand(this.ygRange.from, this.ygRange.to);

        p.slowdown = Math.rand(this.slowdownRange.from * 1000, this.slowdownRange.to * 1000) / 1000;

        p.radius = Math.rand(this.radiusRange.from, this.radiusRange.to);

        p.minxb = xboundRange.from;

        p.maxxb = xboundRange.to;

        p.minyb = yboundRange.from;

        p.maxyb = yboundRange.to;



        return p;

    }

}