function Clock(ele) {
  var currentSeconds = 0;
  var element = ele;

  function _timeInSeconds(secs)
  {
      var time = new Date(1970,0,1);
      time.setSeconds(secs);
      var displayTime = time.toTimeString().substr(0,8);
      if(secs > 86399) {
        currentSeconds = 0;
        time = new Date(1970,0,1);
      }
      return displayTime;
  }

  return {
    set: function(seconds) {
      currentSeconds = seconds;
      element.innerHTML = _timeInSeconds(seconds);
    },

    run: function(arg, speed, increaseBy) {
      return setInterval(function(){
        arg();
        currentSeconds += increaseBy;
        element.innerHTML = _timeInSeconds(currentSeconds);
      }, 1000);
    },
    get: function() {
      return currentSeconds;
    }
  };
}





