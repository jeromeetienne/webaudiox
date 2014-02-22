// @namespace
var WebAudiox	= WebAudiox	|| {}

//////////////////////////////////////////////////////////////////////////////////
//		for Listener							//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Set Position of the listener based on THREE.Vector3  
 * 
 * @param  {AudioContext} context  the webaudio api context
 * @param {THREE.Vector3} position the position to use
 */
WebAudiox.ListenerSetPosition	= function(context, position){
	context.listener.setPosition(position.x, position.y, position.z)
}

/**
 * Set Position and Orientation of the listener based on object3d  
 * 
 * @param {[type]} panner   the panner node
 * @param {THREE.Object3D} object3d the object3d to use
 */
WebAudiox.ListenerSetObject3D	= function(context, object3d){
	// ensure object3d.matrixWorld is up to date
	object3d.updateMatrixWorld()
	// get matrixWorld
	var matrixWorld	= object3d.matrixWorld
	////////////////////////////////////////////////////////////////////////
	// set position
	var position	= new THREE.Vector3().getPositionFromMatrix(matrixWorld)
	context.listener.setPosition(position.x, position.y, position.z)

	////////////////////////////////////////////////////////////////////////
	// set orientation
	var mOrientation= matrixWorld.clone();
	// zero the translation
	mOrientation.setPosition({x : 0, y: 0, z: 0});
	// Compute Front vector: Multiply the 0,0,1 vector by the world matrix and normalize the result.
	var vFront= new THREE.Vector3(0,0,1);
	vFront.applyMatrix4(mOrientation)
	vFront.normalize();
	// Compute UP vector: Multiply the 0,-1,0 vector by the world matrix and normalize the result.
	var vUp= new THREE.Vector3(0,-1, 0);
	vUp.applyMatrix4(mOrientation)
	vUp.normalize();
	// Set panner orientation
	context.listener.setOrientation(vFront.x, vFront.y, vFront.z, vUp.x, vUp.y, vUp.z);
}

/**
 * update webaudio context listener with three.Object3D position
 * 
 * @constructor
 * @param  {AudioContext} context  the webaudio api context
 * @param  {THREE.Object3D} object3d the object for the listenre
 */
WebAudiox.ListenerObject3DUpdater	= function(context, object3d){	
	var prevPosition= null
	this.update	= function(delta){
		// update the position/orientation
		WebAudiox.ListenerSetObject3D(context, object3d)

		////////////////////////////////////////////////////////////////////////
		// set velocity
		var matrixWorld	= object3d.matrixWorld
		if( prevPosition === null ){
			prevPosition	= new THREE.Vector3().getPositionFromMatrix(matrixWorld);
		}else{
			var position	= new THREE.Vector3().getPositionFromMatrix(matrixWorld);
			var velocity	= position.clone().sub(prevPosition).divideScalar(delta);
			prevPosition.copy(position)
			context.listener.setVelocity(velocity.x, velocity.y, velocity.z);
		}
	}
}


//////////////////////////////////////////////////////////////////////////////////
//		for Panner							//
//////////////////////////////////////////////////////////////////////////////////


/**
 * Set Position of the panner node based on THREE.Vector3  
 * 
 * @param {[type]} panner   the panner node
 * @param {THREE.Vector3} position the position to use
 */
WebAudiox.PannerSetPosition	= function(panner, position){
	panner.setPosition(position.x, position.y, position.z)
}

/**
 * Set Position and Orientation of the panner node based on object3d  
 * 
 * @param {[type]} panner   the panner node
 * @param {THREE.Object3D} object3d the object3d to use
 */
WebAudiox.PannerSetObject3D	= function(panner, object3d){
	// ensure object3d.matrixWorld is up to date
	object3d.updateMatrixWorld()
	// get matrixWorld
	var matrixWorld	= object3d.matrixWorld
	
	////////////////////////////////////////////////////////////////////////
	// set position
	var position	= new THREE.Vector3().getPositionFromMatrix(matrixWorld)
	panner.setPosition(position.x, position.y, position.z)

	////////////////////////////////////////////////////////////////////////
	// set orientation
	var vOrientation= new THREE.Vector3(0,0,1);
	var mOrientation= matrixWorld.clone();
	// zero the translation
	mOrientation.setPosition({x : 0, y: 0, z: 0});
	// Multiply the 0,0,1 vector by the world matrix and normalize the result.
	vOrientation.applyMatrix4(mOrientation)
	vOrientation.normalize();
	// Set panner orientation
	panner.setOrientation(vOrientation.x, vOrientation.y, vOrientation.z);
}

/**
 * update panner position based on a object3d position
 * 
 * @constructor
 * @param  {[type]} panner   the panner node to update
 * @param  {THREE.Object3D} object3d the object from which we take the position
 */
WebAudiox.PannerObject3DUpdater	= function(panner, object3d){
	var prevPosition= null
	// set the initial position
	WebAudiox.PannerSetObject3D(panner, object3d)
	// the update function
	this.update	= function(delta){
		// update the position/orientation
		WebAudiox.PannerSetObject3D(panner, object3d)

		////////////////////////////////////////////////////////////////////////
		// set velocity
		var matrixWorld	= object3d.matrixWorld
		if( prevPosition === null ){
			prevPosition	= new THREE.Vector3().getPositionFromMatrix(matrixWorld);
		}else{
			var position	= new THREE.Vector3().getPositionFromMatrix(matrixWorld);
			var velocity	= position.clone().sub(prevPosition).divideScalar(delta);
			prevPosition.copy( position )
			panner.setVelocity(velocity.x, velocity.y, velocity.z);
		}
	}
}

