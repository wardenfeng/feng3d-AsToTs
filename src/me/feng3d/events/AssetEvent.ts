module feng3d
{
	
	
	
	/**
	 * Dispatched whenever a ressource (asset) is parsed and created completly.
	 */
	export class AssetEvent extends Event
	{
		public static ASSET_COMPLETE:string = "assetComplete";
		public static ENTITY_COMPLETE:string = "entityComplete";
		public static SKYBOX_COMPLETE:string = "skyboxComplete";
		public static CAMERA_COMPLETE:string = "cameraComplete";
		public static MESH_COMPLETE:string = "meshComplete";
		public static GEOMETRY_COMPLETE:string = "geometryComplete";
		public static SKELETON_COMPLETE:string = "skeletonComplete";
		public static SKELETON_POSE_COMPLETE:string = "skeletonPoseComplete";
		public static CONTAINER_COMPLETE:string = "containerComplete";
		public static TEXTURE_COMPLETE:string = "textureComplete";
		public static TEXTURE_PROJECTOR_COMPLETE:string = "textureProjectorComplete";
		public static MATERIAL_COMPLETE:string = "materialComplete";
		public static ANIMATOR_COMPLETE:string = "animatorComplete";
		public static ANIMATION_SET_COMPLETE:string = "animationSetComplete";
		public static ANIMATION_STATE_COMPLETE:string = "animationStateComplete";
		public static ANIMATION_NODE_COMPLETE:string = "animationNodeComplete";
		public static STATE_TRANSITION_COMPLETE:string = "stateTransitionComplete";
		public static SEGMENT_SET_COMPLETE:string = "segmentSetComplete";
		public static LIGHT_COMPLETE:string = "lightComplete";
		public static LIGHTPICKER_COMPLETE:string = "lightPickerComplete";
		public static EFFECTMETHOD_COMPLETE:string = "effectMethodComplete";
		public static SHADOWMAPMETHOD_COMPLETE:string = "shadowMapMethodComplete";
		
		public static ASSET_RENAME:string = 'assetRename';
		public static ASSET_CONFLICT_RESOLVED:string = 'assetConflictResolved';
		
		public static TEXTURE_SIZE_ERROR:string = 'textureSizeError';
		
		private _asset:IAsset;
		private _prevName:string;
		
		constructor(type:string, asset:IAsset = null, prevName:string = null)
		{
			super(type);
			
			this._asset = asset;
			this._prevName = prevName || (this._asset? this._asset.namedAsset.name : null);
		}
		
		public get asset():IAsset
		{
			return this._asset;
		}
		
		public get assetPrevName():string
		{
			return this._prevName;
		}
	}
}
