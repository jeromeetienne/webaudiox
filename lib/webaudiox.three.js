// @namespace
var WebAudiox	= WebAudiox	|| {}

/**
 * update webaudio context listener with three.Object3D position
 * 
 * @constructor
 * @param  {AudioContext} context  the webaudio api context
 * @param  {THREE.Object3D} object3d the object for the listenre
 */
WebAudiox.ListenerObject3DUpdater	= function(context, object3d){	
	var prevPosition= null
	this.update	= function(delta, now){
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

		////////////////////////////////////////////////////////////////////////
		// set velocity
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

/**
 * update panner position based on a object3d position
 * 
 * @constructor
 * @param  {[type]} panner   the panner node to update
 * @param  {THREE.Object3D} object3d the object from which we take the position
 */
WebAudiox.PannerObject3DUpdater	= function(panner, object3d){
	var prevPosition= null
	this.update	= function(delta, now){
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
		
		////////////////////////////////////////////////////////////////////////
		// set velocity
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

