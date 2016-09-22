module feng3d
{
	

	
	
	
	
	
	


	

	/**
	 *
	 * @author feng 2014-5-19
	 */
	export class GeomUtil
	{
		/** stage3d单次渲染支持的最大顶点数 */
		public static MAX_VERTEX:number = 65535;

		/**
		 * 根据数据数组创建子网格
		 * @param verts
		 * @param indices
		 * @param uvs
		 * @param normals
		 * @param tangents
		 * @param weights
		 * @param jointIndices
		 * @param triangleOffset
		 * @return
		 */
		public static fromVectors(verts:number[], indices:number[], uvs:number[], weights:number[], jointIndices:number[], triangleOffset:number = 0):SubGeometry[]
		{ 
            var LIMIT_VERTS = 3 * 0xffff; 
            var LIMIT_INDICES:number = 15 * 0xffff;

			var subs:SubGeometry[] = [];

			if (uvs && !uvs.length)
				uvs = null;

			if (weights && !weights.length)
				weights = null;

			if (jointIndices && !jointIndices.length)
				jointIndices = null;

			if ((indices.length >= LIMIT_INDICES) || (verts.length >= LIMIT_VERTS))
			{
				var i:number, len:number, outIndex:number, j:number;
				var splitVerts:number[] = [];
				var splitIndices:number[] = [];
				var splitUvs:number[] = (uvs != null) ? [] : null;
				var splitWeights:number[] = (weights != null) ? [] : null;
				var splitJointIndices:number[] = (jointIndices != null) ? [] : null;

				var mappings:number[] = [];
                mappings.length = verts.length / 3;
				i = mappings.length;
				while (i-- > 0)
					mappings[i] = -1;

				var originalIndex:number;
				var splitIndex:number;
				var o0:number, o1:number, o2:number, s0:number, s1:number, s2:number, su:number, ou:number, sv:number, ov:number;
				// Loop over all triangles
				outIndex = 0;
				len = indices.length;

				for (i = 0; i < len; i += 3)
				{
					splitIndex = splitVerts.length + 6;

					if (((outIndex + 2) >= LIMIT_INDICES) || (splitIndex >= LIMIT_VERTS))
					{
						subs.push(GeomUtil.constructSubGeometry(splitVerts, splitIndices, splitUvs, splitWeights, splitJointIndices, triangleOffset));
						splitVerts = [];
						splitIndices = [];
						splitUvs = (uvs != null) ? [] : null;
						splitWeights = (weights != null) ? [] : null;
						splitJointIndices = (jointIndices != null) ? [] : null;
						splitIndex = 0;
						j = mappings.length;
						while (j-- > 0)
							mappings[j] = -1;

						outIndex = 0;
					}

					// Loop over all vertices in triangle
					for (j = 0; j < 3; j++)
					{

						originalIndex = indices[i + j];

						if (mappings[originalIndex] >= 0)
							splitIndex = mappings[originalIndex];

						else
						{

							o0 = originalIndex * 3 + 0;
							o1 = originalIndex * 3 + 1;
							o2 = originalIndex * 3 + 2;

							// This vertex does not yet exist in the split list and
							// needs to be copied from the long list.
							splitIndex = splitVerts.length / 3;

							s0 = splitIndex * 3 + 0;
							s1 = splitIndex * 3 + 1;
							s2 = splitIndex * 3 + 2;

							splitVerts[s0] = verts[o0];
							splitVerts[s1] = verts[o1];
							splitVerts[s2] = verts[o2];

							if (uvs)
							{
								su = splitIndex * 2 + 0;
								sv = splitIndex * 2 + 1;
								ou = originalIndex * 2 + 0;
								ov = originalIndex * 2 + 1;

								splitUvs[su] = uvs[ou];
								splitUvs[sv] = uvs[ov];
							}

							if (weights)
							{
								splitWeights[s0] = weights[o0];
								splitWeights[s1] = weights[o1];
								splitWeights[s2] = weights[o2];
							}

							if (jointIndices)
							{
								splitJointIndices[s0] = jointIndices[o0];
								splitJointIndices[s1] = jointIndices[o1];
								splitJointIndices[s2] = jointIndices[o2];
							}

							mappings[originalIndex] = splitIndex;
						}

						// Store new index, which may have come from the mapping look-up,
						// or from copying a new set of vertex data from the original vector
						splitIndices[outIndex + j] = splitIndex;
					}

					outIndex += 3;
				}

				if (splitVerts.length > 0)
				{
					// More was added in the last iteration of the loop.
					subs.push(GeomUtil.constructSubGeometry(splitVerts, splitIndices, splitUvs, splitWeights, splitJointIndices, triangleOffset));
				}

			}
			else
				subs.push(GeomUtil.constructSubGeometry(verts, indices, uvs, weights, jointIndices, triangleOffset));

			return subs;
		}

		public static constructSubGeometry(verts:number[], indices:number[], uvs:number[], weights:number[], jointIndices:number[], triangleOffset:number):SubGeometry
		{
			var sub:SubGeometry = new SubGeometry();

			if (weights && jointIndices)
			{
				// If there were weights and joint indices defined, this
				// is a skinned mesh and needs to be built from skinned
				// sub-geometries.
				var skinnedSubGeometry:SkinnedSubGeometry = new SkinnedSubGeometry(weights.length / (verts.length / 3));
				sub.addComponent(skinnedSubGeometry);

				skinnedSubGeometry.updateJointWeightsData(weights);
				skinnedSubGeometry.updateJointIndexData(jointIndices);
			}
			else
				sub = new SubGeometry();

			sub.numVertices = verts.length / 3;
			sub.updateIndexData(indices);
			sub.fromVectors(verts, uvs);
			sub.getOrCreateComponentByClass(AutoDeriveVertexNormals);
			sub.getOrCreateComponentByClass(AutoDeriveVertexTangents);

			return sub;
		}

		/**
		 * 拷贝子网格数据
		 * @param source 源子网格
		 * @param target 目标子网格
		 */
		public static copyDataSubGeom(source:SubGeometry, target:SubGeometry)
		{
			target.numVertices = source.numVertices;
			target.updateVertexPositionData(source.vertexPositionData.concat());
			target.updateUVData(source.UVData.concat());
			target.updateIndexData(source.indices.concat());
		}

		/**
		 * source添加到target中
		 * @param source 源自几何体
		 * @param target 目标子几何体
		 * @return true：添加成功；false：添加失败，应该是顶点个数超出最大值65535
		 */
		public static addSubGeometry(source:SubGeometry, target:SubGeometry):boolean
		{
			if (source.numVertices + target.numVertices > GeomUtil.MAX_VERTEX)
				return false;

			//顶点属性编号列表
			var vaIdList:string[] = source.vaIdList;
			var vaId:string;

			/** 顶点数据字典 */
			var sourceVertexDataDic = {};
			var targetVertexDataDic = {};
            vaIdList.forEach(vaId => {
                
				sourceVertexDataDic[vaId] = source.getVAData(vaId);
				assert(sourceVertexDataDic[vaId].length == source.getVALen(vaId) * source.numVertices);

				targetVertexDataDic[vaId] = target.getVAData(vaId);
				assert(targetVertexDataDic[vaId].length == target.getVALen(vaId) * target.numVertices);
            });
            
			//添加索引数据
			var indices:number[] = VectorUtils.add1(source.indices, target.indices, target.numVertices);
			target.updateIndexData(indices);

			//更改顶点数量
			target.numVertices = source.numVertices + target.numVertices;

			var vertexData:number[];
			//添加顶点数据
            vaIdList.forEach(vaId => {
				//
				vertexData = VectorUtils.add(sourceVertexDataDic[vaId], targetVertexDataDic[vaId]);
				target.setVAData(vaId, vertexData);
                
            });
            
			return true;
		}

	}
}
