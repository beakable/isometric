/*  
Copyright (c) 2014 Iain Hamilton

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

      scale: 1,

      x: x,

      y: y,

      Load: function(x, y) {
        this.particles = [];
        for (var i = 0; i < pcount; i++) {
          this.particles.push(this.CreateParticle(false, false, x, y));
        }
        this.loaded = true;
      },

      ShiftTo: function (x, y) {
        this.ShiftBy(x - this.x, y - this.y);
      },

      Scale: function (scale) {
        this.scale = scale;
      },

      ShiftBy: function (xoffset, yoffset) {
        this.xshiftOffset += xoffset;
        this.yshiftOffset += yoffset;
        this.x += xoffset;
        this.y += yoffset;
      },

      Draw: function (x, y) {
        if (x) { this.x = x; }
        if (y) { this.y = y; }
        if (this.loaded && !this.pause) {
          ctx.save();

          ctx.globalCompositeOperation = this.composite;

          for (var i = 0, tmpsize = this.particles.length; i < tmpsize; i++) {

            this.particles[i].x += this.xshiftOffset;

            this.particles[i].y += this.yshiftOffset;

            this.particles[i].Draw(ctx);

            if (loop && loop !== "false" && !this.particles[i].active) {

              this.particles[i] = this.CreateParticle(this.particles[i], true);

            }

          }

          ctx.restore();

          this.xshiftOffset = 0;
          this.yshiftOffset = 0;

        }

      },

      CreateParticle: function(reload, draw, x , y) {

        var p;
        if (reload) {
          p = reload;
        }
        else {
          p = new Particle();
        }
        if (draw || loop === false || loop === "false") {
          p.active = true;
          if (x) {
            p.x = x + utils.rand(this.xRange.from * this.scale, this.xRange.to * this.scale) + this.xOffset * this.scale;
          }
          else {
            p.x = this.x + utils.rand(this.xRange.from * this.scale, this.xRange.to * this.scale) + this.xOffset * this.scale;
          }
          if (y) {
            p.y = y + utils.rand(this.yRange.from * this.scale, this.yRange.to * this.scale) + this.yOffset * this.scale;
          }
          else {
            p.y = this.y + utils.rand(this.yRange.from * this.scale, this.yRange.to * this.scale) + this.yOffset * this.scale;
          }

          p.drawdelay = 0;

          p.life = utils.rand(this.lifeRange.from * 1000, this.lifeRange.to * 1000) / 1000;

          p.fade = utils.rand(this.fadeRange.from * 1000, this.fadeRange.to * 1000) / 1000;

          p.r = utils.rand(this.redRange.from, this.redRange.to);

          p.b = utils.rand(this.blueRange.from, this.blueRange.to);

          p.g = utils.rand(this.greenRange.from, this.greenRange.to);

          p.xi = utils.rand(this.xiRange.from * this.scale, this.xiRange.to * this.scale);

          p.yi = utils.rand(this.yiRange.from * this.scale, this.yiRange.to * this.scale);

          p.xg = utils.rand(this.xgRange.from * this.scale, this.xgRange.to * this.scale);

          p.yg = utils.rand(this.ygRange.from * this.scale, this.ygRange.to * this.scale);

          p.slowdown = utils.rand(this.slowdownRange.from * 1000, this.slowdownRange.to * 1000) / 1000;

          p.radius = utils.rand(this.radiusRange.from * this.scale, this.radiusRange.to * this.scale);

          p.minxb = xboundRange.from * this.scale;

          p.maxxb = xboundRange.to * this.scale;

          p.minyb = yboundRange.from * this.scale;

          p.maxyb = yboundRange.to * this.scale;
        }
        return p;
      }

      };
    };
});