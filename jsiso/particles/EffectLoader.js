/*  
Copyright (c) 2013 Iain Hamilton

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
  'jsiso/particles/Emitter',
  'jsiso/particles/Effect',
  'jsiso/utils'
],

function(Emitter, Effect, utils) {

  function _get(name, ctx, xBoundRange, yBoundRange) {

    switch (String(name)) {

      case 'fire':

        var fire = new Emitter(ctx, 0, 0, 20, true, xBoundRange, yBoundRange);

        fire.xRange = utils.range(-22, 18);

        fire.yRange = utils.range(0, 0);

        fire.lifeRange = utils.range(0.8, 1);

        fire.fadeRange = utils.range(0.02, 0.08);

        fire.redRange = utils.range(175, 255);

        fire.greenRange = utils.range(0, 150);

        fire.blueRange = utils.range(0, 0);

        fire.xiRange = utils.range(-10, 10);

        fire.yiRange = utils.range(0, 0);

        fire.xgRange = utils.range(-10, 10);

        fire.ygRange = utils.range(10, 10);

        fire.slowdownRange = utils.range(0.5, 1);

        fire.radiusRange = utils.range(20, 30);

        fire.composite = 'lighter';

        fire.xOffset = 43;

        fire.yOffset = 30;

        effect = new Effect(fire);

      break;

      case 'well':

        var well = new Emitter(ctx, 0, 0, 20, true, xBoundRange, yBoundRange);

        well.xRange = utils.range(-22, 18);

        well.yRange = utils.range(0, 0);

        well.lifeRange = utils.range(0.8, 1);

        well.fadeRange = utils.range(0.02, 0.08);

        well.redRange = utils.range(10, 20);

        well.greenRange = utils.range(10, 30);

        well.blueRange = utils.range(120, 120);

        well.xiRange = utils.range(-10, 10);

        well.yiRange = utils.range(0, 0);

        well.xgRange = utils.range(-4, 4);

        well.ygRange = utils.range(-10, -10);

        well.slowdownRange = utils.range(0.5, 1);

        well.radiusRange = utils.range(3, 5);

        well.composite = 'lighter';

        well.xOffset = 46;

        well.yOffset = 54;

        var wellB = new Emitter(ctx, 0, 0, 20, true, xBoundRange, yBoundRange);

        wellB.xRange = utils.range(-22, 18);

        wellB.yRange = utils.range(0, 0);

        wellB.lifeRange = utils.range(0.8, 1);

        wellB.fadeRange = utils.range(0.02, 0.08);

        wellB.redRange = utils.range(10, 20);

        wellB.greenRange = utils.range(10, 30);

        wellB.blueRange = utils.range(120, 120);

        wellB.xiRange = utils.range(-10, 10);

        wellB.yiRange = utils.range(0, 0);

        wellB.xgRange = utils.range(-4, 4);

        wellB.ygRange = utils.range(- 10, -10);

        wellB.slowdownRange = utils.range(0.5, 1);

        wellB.radiusRange = utils.range(3, 5);

        wellB.composite = 'lighter';

        wellB.xOffset = 31;

        wellB.yOffset = 99;

        effect = new Effect(well);

        effect.AddEmitter(wellB);

      break;

      case 'wcandle':

        var wallcandle = new Emitter(ctx, 0, 0, 20, true, xBoundRange, yBoundRange);

        wallcandle.xRange = utils.range(0, 0);

        wallcandle.yRange = utils.range(1, 1);

        wallcandle.lifeRange = utils.range(0.8, 1);

        wallcandle.fadeRange = utils.range(0.02, 0.08);

        wallcandle.redRange = utils.range(175, 255);

        wallcandle.greenRange = utils.range(0, 150);

        wallcandle.blueRange = utils.range(0, 0);

        wallcandle.xiRange = utils.range(0, 0);

        wallcandle.yiRange = utils.range(0, 0);

        wallcandle.xgRange = utils.range(0, 0);

        wallcandle.ygRange = utils.range(1, 1);

        wallcandle.slowdownRange = utils.range(0.5, 1);

        wallcandle.radiusRange = utils.range(1, 7);

        wallcandle.composite = 'lighter';

        wallcandle.xOffset = 45;

        wallcandle.yOffset = 55;

        effect = new Effect(wallcandle);

      break;

      case 'candleFire':

        var candles = [];

        var candlePositions = [[44, 17], [60, 12], [77, 29]];

        for (var i = 0; i < 3; i++) {

          var candle = new Emitter(ctx, 0, 0, 20, true, xBoundRange, yBoundRange);

          candle.xRange = utils.range(0, 0);

          candle.yRange = utils.range(1, 1);

          candle.lifeRange = utils.range(0.8, 1);

          candle.fadeRange = utils.range(0.02, 0.08);

          candle.redRange = utils.range(175, 255);

          candle.greenRange = utils.range(0, 150);

          candle.blueRange = utils.range(0, 0);

          candle.xiRange = utils.range(0, 0);

          candle.yiRange = utils.range(0, 0);

          candle.xgRange = utils.range(0, 0);

          candle.ygRange = utils.range(1, 1);

          candle.slowdownRange = utils.range(0.5, 1);

          candle.radiusRange = utils.range(1, 7);

          candle.composite = 'lighter';

          candle.xOffset = candlePositions[i][0];

          candle.yOffset = candlePositions[i][1];

          candles.push(candle);

        }

        effect = new Effect(candles[0]);

        effect.AddEmitter(candles[1]);

        effect.AddEmitter(candles[2]);

      break;

      case 'rain':

        var rain = new Emitter(ctx, 0, 0, 100, true, xBoundRange, yBoundRange);

        rain.xRange = utils.range(0, 420);

        rain.yRange = utils.range(-100, 10);

        rain.lifeRange = utils.range(0.8, 1.4);

        rain.fadeRange = utils.range(0.01, 0.08);

        rain.redRange = utils.range(0, 150);

        rain.greenRange = utils.range(0, 150);

        rain.blueRange = utils.range(175, 200);

        rain.xiRange = utils.range(0, 420);

        rain.yiRange = utils.range(-10, -10);

        rain.xgRange = utils.range(0, 50);

        rain.ygRange = utils.range(-40, -50);

        rain.slowdownRange = utils.range(0.5, 1);

        rain.radiusRange = utils.range(7, 10);

        rain.composite = 'lighter';

        effect = new Effect(rain);

      break;

    }
    return effect || {};
  }

  return function() {

    return {
      getEffect: function(name, ctx, xBoundRange, yBoundRange) {
        return _get(name, ctx, xBoundRange, yBoundRange);
      }
    };

  };
});