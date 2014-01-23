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

define([
  'jsiso/particles/Particle',
  'jsiso/utils'
],

function(Particle, utils) {

  return function(ctx, x, y, pcount, loop, xboundRange, yboundRange) {

    return {
      particles: [],

      xshiftOffset: 0,

      yshiftOffset: 0,

      loaded: false,

      xOffset: 0,

      yOffset: 0,

      pause: false,

      composite: 'lighter',

      xRange: utils.range(0, 0),

      yRange: utils.range(0, 0),

      drawdelayRange: utils.range(-1, -1),

      lifeRange: utils.range(1, 1), // 0.000 - 1.000

      fadeRange: utils.range(1, 1), // 0.000 - 1.000

      redRange: utils.range(255, 255), // 0 - 255

      greenRange: utils.range(0, 0), // 0 - 255

      blueRange: utils.range(0, 0), // 0 - 255

      xiRange: utils.range(10, 10),

      yiRange: utils.range(10, 10),

      xgRange: utils.range(0, 0),

      ygRange: utils.range(0, 0),

      slowdownRange: utils.range(1, 1), // 0.000

      radiusRange: utils.range(10, 10),

      Load: function() {
        this.particles = [];
        for (var i = 0; i < pcount; i++) {
          this.particles.push(this.CreateParticle());
        }
        this.loaded = true;
      },

      ShiftTo: function (x, y) {
        this.ShiftBy(x - this.x, y - this.y);
      },

      ShiftBy: function (xoffset, yoffset) {
        this.xshiftOffset += xoffset;
        this.yshiftOffset += yoffset;
        this.x += xoffset;
        this.y += yoffset;
      },

      Draw: function () {
        if (this.loaded && !this.pause) {

          ctx.save();

          ctx.globalCompositeOperation = this.composite;

          for (var i = 0, tmpsize = this.particles.length; i < tmpsize; i++) {

            this.particles[i].x += this.xshiftOffset;

            this.particles[i].y += this.yshiftOffset;

            this.particles[i].Draw(ctx);

            if (loop && !this.particles[i].active) {

              this.particles[i] = this.CreateParticle();

            }

          }

          ctx.restore();

          this.xshiftOffset = 0;

          this.yshiftOffset = 0;

        }

      },

      CreateParticle: function() {

        var p = new Particle();

        p.active = true;

        p.x = this.x + utils.rand(this.xRange.from, this.xRange.to) + this.xOffset;

        p.y = this.y + utils.rand(this.yRange.from, this.yRange.to) + this.yOffset;

        p.drawdelay = utils.rand(this.drawdelayRange.from, this.drawdelayRange.to);

        p.life = utils.rand(this.lifeRange.from * 1000, this.lifeRange.to * 1000) / 1000;

        p.fade = utils.rand(this.fadeRange.from * 1000, this.fadeRange.to * 1000) / 1000;

        p.r = utils.rand(this.redRange.from, this.redRange.to);

        p.b = utils.rand(this.blueRange.from, this.blueRange.to);

        p.g = utils.rand(this.greenRange.from, this.greenRange.to);

        p.xi = utils.rand(this.xiRange.from, this.xiRange.to);

        p.yi = utils.rand(this.yiRange.from, this.yiRange.to);

        p.xg = utils.rand(this.xgRange.from, this.xgRange.to);

        p.yg = utils.rand(this.ygRange.from, this.ygRange.to);

        p.slowdown = utils.rand(this.slowdownRange.from * 1000, this.slowdownRange.to * 1000) / 1000;

        p.radius = utils.rand(this.radiusRange.from, this.radiusRange.to);

        p.minxb = xboundRange.from;

        p.maxxb = xboundRange.to;

        p.minyb = yboundRange.from;

        p.maxyb = yboundRange.to;

        return p;
      }

      };
    };
});