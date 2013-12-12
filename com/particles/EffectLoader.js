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

function EffectLoader(name) {}


EffectLoader.Get = function (name, ctx, xBoundRange, yBoundRange) {

    var effect = null;



    if (name) {
        switch (String(name)) {

            case 'fire':
                var fire = new Emitter(ctx, 0, 0, 20, true, xBoundRange, yBoundRange);

                fire.xRange = new Range(-22, 18);

                fire.yRange = new Range(0, 0);

                fire.lifeRange = new Range(0.8, 1);

                fire.fadeRange = new Range(0.02, 0.08);

                fire.redRange = new Range(175, 255);

                fire.greenRange = new Range(0, 150);

                fire.blueRange = new Range(0, 0);

                fire.xiRange = new Range(-10, 10);

                fire.yiRange = new Range(0, 0);

                fire.xgRange = new Range(-10, 10);

                fire.ygRange = new Range(10, 10);

                fire.slowdownRange = new Range(0.5, 1);

                fire.radiusRange = new Range(20, 30);

                fire.composite = 'lighter';

                fire.xOffset = 43;

                fire.yOffset = 30;

                effect = new Effect(fire);

                break;

  				case 'well':

                var well = new Emitter(ctx, 0, 0, 20, true, xBoundRange, yBoundRange);

                well.xRange = new Range(-22, 18);

                well.yRange = new Range(0, 0);

                well.lifeRange = new Range(0.8, 1);

                well.fadeRange = new Range(0.02, 0.08);

                well.redRange = new Range(10, 20);

                well.greenRange = new Range(10, 30);

                well.blueRange = new Range(120, 120);

                well.xiRange = new Range(-10, 10);

                well.yiRange = new Range(0, 0);

                well.xgRange = new Range(-4, 4);

                well.ygRange = new Range(-10, -10);

                well.slowdownRange = new Range(0.5, 1);

                well.radiusRange = new Range(3, 5);

                well.composite = 'lighter';
				
				well.xOffset = 46;

				well.yOffset = 54;
				
				
				var wellB = new Emitter(ctx, 0, 0, 20, true, xBoundRange, yBoundRange);

                wellB.xRange = new Range(-22, 18);

                wellB.yRange = new Range(0, 0);

                wellB.lifeRange = new Range(0.8, 1);

                wellB.fadeRange = new Range(0.02, 0.08);

                wellB.redRange = new Range(10, 20);

                wellB.greenRange = new Range(10, 30);

                wellB.blueRange = new Range(120, 120);

                wellB.xiRange = new Range(-10, 10);

                wellB.yiRange = new Range(0, 0);

                wellB.xgRange = new Range(-4, 4);

                wellB.ygRange = new Range(-	10, -10);

                wellB.slowdownRange = new Range(0.5, 1);

                wellB.radiusRange = new Range(3, 5);

                wellB.composite = 'lighter';
				
				wellB.xOffset = 31;

				wellB.yOffset = 99;
				

                effect = new Effect(well);
				
				effect.AddEmitter(wellB);

                break;
				
				case 'wcandle':

                  var wallcandle = new Emitter(ctx, 0, 0, 20, true, xBoundRange, yBoundRange);

                    wallcandle.xRange = new Range(0, 0);

                    wallcandle.yRange = new Range(1, 1);

                    wallcandle.lifeRange = new Range(0.8, 1);

                    wallcandle.fadeRange = new Range(0.02, 0.08);

                    wallcandle.redRange = new Range(175, 255);

                    wallcandle.greenRange = new Range(0, 150);

                    wallcandle.blueRange = new Range(0, 0);

                    wallcandle.xiRange = new Range(0, 0);

                    wallcandle.yiRange = new Range(0, 0);

                    wallcandle.xgRange = new Range(0, 0);

                    wallcandle.ygRange = new Range(1, 1);

                    wallcandle.slowdownRange = new Range(0.5, 1);

                    wallcandle.radiusRange = new Range(1, 7);

                    wallcandle.composite = 'lighter';
					
					wallcandle.xOffset = 45;

                    wallcandle.yOffset = 55;

             	    effect = new Effect(wallcandle);
					
				

                break;

            case 'candleFire':
                var candles = []

                var candlePositions = [[44, 17], [60, 12], [77, 29]];



                for (var i = 0; i < 3; i++) {

                     var candle = new Emitter(ctx, 0, 0, 20, true, xBoundRange, yBoundRange);

                    candle.xRange = new Range(0, 0);

                    candle.yRange = new Range(1, 1);

                    candle.lifeRange = new Range(0.8, 1);

                    candle.fadeRange = new Range(0.02, 0.08);

                    candle.redRange = new Range(175, 255);

                    candle.greenRange = new Range(0, 150);

                    candle.blueRange = new Range(0, 0);

                    candle.xiRange = new Range(0, 0);

                    candle.yiRange = new Range(0, 0);

                    candle.xgRange = new Range(0, 0);

                    candle.ygRange = new Range(1, 1);

                    candle.slowdownRange = new Range(0.5, 1);

                    candle.radiusRange = new Range(1, 7);

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

                rain.xRange = new Range(0, 420);

                rain.yRange = new Range(-100, 10);

                rain.lifeRange = new Range(0.8, 1.4);

                rain.fadeRange = new Range(0.01, 0.08);

                rain.redRange = new Range(0, 150);

                rain.greenRange = new Range(0, 150);

                rain.blueRange = new Range(175, 200);

                rain.xiRange = new Range(0, 420);

                rain.yiRange = new Range(-10, -10);

                rain.xgRange = new Range(0, 50);

                rain.ygRange = new Range(-40, -50);


                rain.slowdownRange = new Range(0.5, 1);

                rain.radiusRange = new Range(7, 10);

                rain.composite = 'lighter';


                effect = new Effect(rain);

                break;

        }

    }



    return effect;

};