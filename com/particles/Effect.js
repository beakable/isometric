function Effect(emitter) {

    var emitters = [emitter];



    this.pause = false;



    this.AddEmitter = function (emitter) {

        emitters.push(emitter);

    };



this.Draw = function (x, y) {
        if (!this.pause) {
            for (var i = 0, tmpTotal = emitters.length; i < tmpTotal; i++) {
                if (!emitters[i].loaded) {
                    emitters[i].x = x;
                    emitters[i].y = y;
                    emitters[i].Load();
                }

                emitters[i].ShiftTo(x, y);
                emitters[i].Draw();


            }

        }

    };

}