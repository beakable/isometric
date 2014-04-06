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

- Author : Iain M Hamilton - <iain@beakable.com> - http://www.beakable.com
           Edward Smyth

  Twitter: @beakable

*/

/** jsiso/utils simple common functions used throughout JsIso **/

define(function() {

  return {

    roundTo: function (num, dec) {
      return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    },

    rand: function (l, u) {
      return Math.floor((Math.random() * (u - l + 1)) + l);
    },

    remove: function (from, to) {
      var rest = this.slice((to || from) + 1 || this.length);
      this.length = from < 0 ? this.length + from : from;
      return this.push.apply(this, rest);
    },

    range: function(from, to) {
      return {from: from, to: to};
    },

    rotateTwoDArray: function(arrayLayout, direction) {
      var tempArray = [],
          tempLine = [],
          i, j;
      
      if (direction === "left") {
        for (i = 0; i < arrayLayout.length; i++) {
          for (j = arrayLayout.length - 1; j >= 0; j--) {
            tempLine.push(arrayLayout[j][i]);
          }
          tempArray.push(tempLine);
          tempLine = [];
        }
        return tempArray;
      }
      else if (direction === "right") {
        for (i = arrayLayout.length -1; i >= 0; i--) {
          for (j = 0; j < arrayLayout.length; j++) {
            tempLine.push(arrayLayout[j][i]);
          }
          tempArray.push(tempLine);
          tempLine = [];
        }
        return tempArray;
      }
    }

  };

});