AFRAME.registerSystem('main', {
    schema: {},  // System schema. Parses into `this.data`.
    init: function () {
        // Called on scene initialization.

        //do stuff here after scene initializes

        this.el.addEventListener('loaded',function(){

            console.log('Loaded')

            this.el.addEventListener('enter-vr', function () {
                console.log('Entered vr');
                var cameraEl = document.querySelector('a-camera');
                cameraEl.setAttribute('user-height', 0);
            })
        }.bind(this))
    },
    tick: function () {

        //console.log('Tick');

        //do stuff here every tick
    }
    // Other handlers and methods.     
});