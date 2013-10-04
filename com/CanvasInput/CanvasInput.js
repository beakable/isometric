// Canvas inputs

function CanvasInput(doc, canvas) {

  function _keyboard_input(e, callback) {
    var keyCode;
    if(e === null) {
      keyCode = window.e.keyCode;
    }
    else {
      keyCode = e.keyCode;
    }
    callback(keyCode);
  }

  function _mobile_input(e, callback) {
    var coords = {};
    coords.x = e.touches[0].pageX - canvas.offsetLeft;
    coords.y = e.touches[0].pageY - canvas.offsetTop;
    callback(coords);
  }

  function _mouse_input(e, callback) {
    var coords = {};
    coords.x = e.pageX - canvas.offsetLeft;
    coords.y = e.pageY - canvas.offsetTop;
    callback(coords);
  }

  return {
    keyboard: function(callback) {
      doc.onkeydown = function(event) {
        _keyboard_input(event, callback);
      };
    },

    mobile: function(callback) {
      doc.addEventListener('touchstart', function(event) {
        event.preventDefault();
        _mobile_input(event, callback);
      }, false);
    },

    mouse_action: function(callback) {
      doc.addEventListener('mousedown', function(event) {
        event.preventDefault();
        _mouse_input(event, callback);
      }, false);
    },

    mouse_move: function(callback) {
      doc.addEventListener('mousemove', function(event) {
        event.preventDefault();
        _mouse_input(event, callback);
      }, false);
    }
  };
}