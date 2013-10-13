function $(id) {
  return document.getElementById(id);
}

Math.roundTo = function (num, dec) {
  return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
};

Math.rand = function (l, u) {
  return Math.floor((Math.random() * (u - l + 1)) + l);
};



Array.prototype.remove = function (from, to) {

    var rest = this.slice((to || from) + 1 || this.length);

    this.length = from < 0 ? this.length + from : from;

    return this.push.apply(this, rest);

};