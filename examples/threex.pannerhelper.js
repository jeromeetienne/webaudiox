var THREEx	= THREEx	|| {}

THREEx.PannerHelper	= function(panner){
	THREE.Object3D.call( this );

	// build 
	var coneInnerAngle	= panner.coneInnerAngle/180*Math.PI
	
	var radiusTop	= Math.sin(coneInnerAngle/2);
	var height	= 1;
	var geometry	= new THREE.CylinderGeometry(radiusTop, 0, height, 16, 16, true)
	var material	= new THREE.MeshBasicMaterial()
	material.color.set('blue')
	material.wireframe	= true
	var coneInner	= new THREE.Mesh(geometry, material)	
	coneInner.position.z	= height/2
	coneInner.rotation.x	= Math.PI/2;
	this.add(coneInner)

	// build 
	// var coneOuterAngle	= panner.coneOuterAngle/180*Math.PI
	// var radiusTop	= Math.sin(coneOuterAngle/2);
	// var height	= 1;
	// var geometry	= new THREE.CylinderGeometry(radiusTop, 0, height, 16, 16, true)
	// var material	= new THREE.MeshBasicMaterial()
	// material.color.set('red')
	// material.wireframe	= true
	// var coneOuter	= new THREE.Mesh(geometry, material)	
	// coneOuter.position.z	= height/2
	// coneOuter.rotation.x	= Math.PI/2;
	// this.add(coneOuter)
}

THREEx.PannerHelper.prototype = Object.create( THREE.Object3D.prototype );
