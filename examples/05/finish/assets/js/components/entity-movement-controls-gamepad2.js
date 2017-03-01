//port of https://schteppe.github.io/cannon.js/examples/threejs_fps.html
AFRAME.registerComponent('entity-movement-controls-gamepad2', {
    init: function () {

        console.log('Initializing movement controls...')

        var self = this;
        var data = this.data;

        this.velocityFactor = 0.2;
        this.rotationFactor = 0.002;
        this.jumpVelocity = 20;

        var thisObject3D = this.el.object3D;

        //this.pitchObject = new THREE.Object3D();

        //adding stuff to Object3D seems to remove collada model

        //this.pitchObject.add( thisObject3D );

        //this.yawObject = new THREE.Object3D();
        //this.yawObject.position.y = 2;
        //this.yawObject.add( this.pitchObject );

        this.pitchObject = thisObject3D;
        this.yawObject = thisObject3D;

        this.quat = new THREE.Quaternion();

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.walking = false;
        this.rotating = false;

        var canJump = false;

        var contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
        var upAxis = new CANNON.Vec3(0,1,0);

        this.thisEntity = this.el;
        this.thisEntityBody = this.el.body;

        this.thisEntity.addEventListener("collide",function(e){
            var contact = e.detail.contact;

            // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
            // We do not yet know which one is which! Let's check.
            if(contact.bi.id == self.thisEntityBody.id)  // bi is the player body, flip the contact normal
                contact.ni.negate(contactNormal);
            else
                contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

            // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
            if(contactNormal.dot(upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
                canJump = true;
        });

        //this.velocity = this.thisEntityBody.velocity;

        var PI_2 = Math.PI / 2;

        /*var onMouseMove = function ( event ) {

            if ( self.thisEntity.isPlaying === false ) return;

            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            self.yawObject.rotation.y -= movementX * 0.002;
            self.pitchObject.rotation.x -= movementY * 0.002;

            self.pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, self.pitchObject.rotation.x ) );
        };*/

        var onKeyDown = function ( event ) {

            console.log(event.keyCode);

            switch ( event.keyCode ) {

                case 73: // i - up
                    self.moveForward = true;
                    self.walking = true;
                    break;

                case 74: // j - left
                    //self.moveLeft = true;
                    //self.walking = true;
                    self.rotateLeft = true;
                    self.rotating = true;
                    break;

                case 75: // s - down
                    self.moveBackward = true;
                    self.walking = true;
                    break;

                case 76: // l - right
                    //self.moveRight = true;
                    //self.walking = true;
                    self.rotateRight = true;
                    self.rotating = true;
                    break;

                case 32: // space
                    if ( self.canJump === true ){
                        velocity.y = self.jumpVelocity;
                    }
                    self.walking = false;
                    self.canJump = false;
                    break;
            }

        };

        var onKeyUp = function ( event ) {

            switch( event.keyCode ) {

                case 73: // i - up
                    self.moveForward = false;
                    self.walking = false;
                    break;

                case 74: // j - left
                    //self.moveLeft = false;
                    //self.walking = false;
                    self.rotateLeft = false;
                    self.rotating = false;
                    break;

                case 75: // s - down
                    self.moveBackward = false;
                    self.walking = false;
                    break;

                case 76: // l - right
                    //self.moveRight = false;
                    //self.walking = false;
                    self.rotateRight = false;
                    self.rotating = false;
                    break;

            }

        };

        //document.addEventListener( 'mousemove', onMouseMove, false );
        document.addEventListener( 'keydown', onKeyDown, false );
        document.addEventListener( 'keyup', onKeyUp, false );

        this.thisEntity.isPlaying = false;

        /*this.getDirection = function(targetVec){
            targetVec.set(0,0,-1);
            this.quat.multiplyVector3(targetVec);
        };*/

        // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
        this.inputVelocity = new THREE.Vector3();
        this.euler = new THREE.Euler();



    },

    tick: function (t, dt) {

        var delta = dt;

        if ( this.thisEntity.isPlaying === false ) return;

        //delta *= 0.1;

        //reset input velocity - important as this overrides any other physics applying to
        this.inputVelocity.set(0,this.thisEntityBody.velocity.y,0); //need to preserve this.thisEntityBody.velocity.y here so gravity continues to work as expected

        //console.log('FWD: '+this.moveForward+' REV: '+this.moveBackward+' LEFT: '+this.moveLeft+' RIGHT: '+this.moveRight);

        if ( this.moveForward ){
            this.inputVelocity.z = this.velocityFactor * delta;
            //this.thisEntityBody.velocity.set(0,0,5);
        }
        if ( this.moveBackward ){
            this.inputVelocity.z = -this.velocityFactor * delta;
            //this.thisEntityBody.velocity.set(0,0,5);
        }

        /*if ( this.moveLeft ){
            this.inputVelocity.x = -this.velocityFactor * delta;
            //this.thisEntityBody.velocity.set(0,0,5);
        }
        if ( this.moveRight ){
            this.inputVelocity.x = this.velocityFactor * delta;
            //this.thisEntityBody.velocity.set(0,0,5);
        }*/

        if ( this.rotateLeft ){
            this.yawObject.rotation.y += this.rotationFactor * delta;
            //self.pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, self.pitchObject.rotation.x ) );
        }
        if ( this.rotateRight ){
            this.yawObject.rotation.y -= this.rotationFactor * delta;
            //self.pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, self.pitchObject.rotation.x ) );
        }

        //example showing how to move object: https://github.com/schteppe/cannon.js/blob/master/demos/bodyTypes.html

        // Convert velocity to world coordinates

        this.euler.x = this.pitchObject.rotation.x;
        this.euler.y = this.yawObject.rotation.y;
        this.euler.order = "XYZ";
        this.quat.setFromEuler(this.euler);
        this.inputVelocity.applyQuaternion(this.quat);

        //this.inputVelocity.add(this.thisEntityBody.world.gravity.scale(delta));

        //quat.multiplyVector3(inputVelocity);

        // Add to the object
        //this.thisEntityBody.velocity.x += this.inputVelocity.x;
        //this.thisEntityBody.velocity.z += this.inputVelocity.z;



        this.yawObject.position.copy(this.thisEntityBody.position);

        //this.thisEntityBody.velocity.set(new THREE.Vector3(this.inputVelocity.x,this.inputVelocity.y,this.inputVelocity.z));
        this.thisEntityBody.velocity.copy(this.inputVelocity);

        //this.el.setAttribute('position',this.yawObject.position.x+' '+this.yawObject.position.y+' '+this.yawObject.position.z);

        //console.log('Velocity: ',this.thisEntityBody.velocity, 'quat', this.quat);

        //console.log(this.yawObject.position);

        this.render(delta);

        //console.log('Movement controls initialized');
    },

    render: function(delta)
    {
        //console.log('Walking: ',this.walking);

        if(typeof this.thisEntity.children[0] !== 'undefined'){
            this.animationMixer = this.thisEntity.children[0].components['collada-animation-mixer'];

            if(typeof this.animationMixer !== 'undefined'){
                var animation = this.animationMixer.animation;

                if(typeof animation !== 'undefined' ){
                    if (this.walking || this.rotating) // exists / is loaded
                    {
                        //animation.timeScale = delta;
                        this.animationMixer.playAnim();
                    }else{
                        this.animationMixer.stopAnim();
                    }
                }
            }
        }


    },

    schema: {

    },

    multiple: false
});