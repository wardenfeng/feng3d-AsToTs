module feng3d
{


	/**
	 *
	 * @author feng 2014-12-18
	 */
	export class SubGeomUtil
	{
		/**
		 * 更新面法线数据
		 * @param _faceNormals
		 * @param vertices
		 * @param _faceWeights
		 * @param _indices
		 * @param _useFaceWeights
		 * @return
		 */
		public static updateFaceNormals(_faceNormals:number[], vertices:number[], _indices:number[]):number[]
		{
			var i:number, j:number, k:number;
			var index:number;
			var len:number = _indices.length;
			var x1:number, x2:number, x3:number;
			var y1:number, y2:number, y3:number;
			var z1:number, z2:number, z3:number;
			var dx1:number, dy1:number, dz1:number;
			var dx2:number, dy2:number, dz2:number;
			var cx:number, cy:number, cz:number;
			var d:number;
			var posStride:number = 3;
			var posOffset:number = 0;

			_faceNormals =_faceNormals || [];
            _faceNormals.length = len;

			while (i < len)
			{
				index = posOffset + _indices[i++] * posStride;
				x1 = vertices[index];
				y1 = vertices[index + 1];
				z1 = vertices[index + 2];
				index = posOffset + _indices[i++] * posStride;
				x2 = vertices[index];
				y2 = vertices[index + 1];
				z2 = vertices[index + 2];
				index = posOffset + _indices[i++] * posStride;
				x3 = vertices[index];
				y3 = vertices[index + 1];
				z3 = vertices[index + 2];
				dx1 = x3 - x1;
				dy1 = y3 - y1;
				dz1 = z3 - z1;
				dx2 = x2 - x1;
				dy2 = y2 - y1;
				dz2 = z2 - z1;
				cx = dz1 * dy2 - dy1 * dz2;
				cy = dx1 * dz2 - dz1 * dx2;
				cz = dy1 * dx2 - dx1 * dy2;
				d = Math.sqrt(cx * cx + cy * cy + cz * cz);
				// length of cross product = 2*triangle area

				d = 1 / d;
				_faceNormals[j++] = cx * d;
				_faceNormals[j++] = cy * d;
				_faceNormals[j++] = cz * d;
			}

			return _faceNormals;
		}

		/**
		 * 更新面切线数据
		 * @param _faceTangents
		 * @param vertices
		 * @param uvs
		 * @param _indices
		 * @return
		 *
		 */
		public static updateFaceTangents(_faceTangents:number[], vertices:number[], uvs:number[], _indices:number[]):number[]
		{
			var i:number;
			var index1:number, index2:number, index3:number;
			var len:number = _indices.length;
			var ui:number, vi:number;
			var v0:number;
			var dv1:number, dv2:number;
			var denom:number;
			var x0:number, y0:number, z0:number;
			var dx1:number, dy1:number, dz1:number;
			var dx2:number, dy2:number, dz2:number;
			var cx:number, cy:number, cz:number;
			var posStride:number = 3;
			var texStride:number = 2;

			_faceTangents =_faceTangents || [];
            _faceTangents.length = _indices.length;

			while (i < len)
			{
				index1 = _indices[i];
				index2 = _indices[i + 1];
				index3 = _indices[i + 2];

				ui = index1 * texStride + 1;
				v0 = uvs[ui];
				ui = index2 * texStride + 1;
				dv1 = uvs[ui] - v0;
				ui = index3 * texStride + 1;
				dv2 = uvs[ui] - v0;

				vi = index1 * posStride;
				x0 = vertices[vi];
				y0 = vertices[vi + 1];
				z0 = vertices[vi + 2];
				vi = index2 * posStride;
				dx1 = vertices[vi] - x0;
				dy1 = vertices[vi + 1] - y0;
				dz1 = vertices[vi + 2] - z0;
				vi = index3 * posStride;
				dx2 = vertices[vi] - x0;
				dy2 = vertices[vi + 1] - y0;
				dz2 = vertices[vi + 2] - z0;

				cx = dv2 * dx1 - dv1 * dx2;
				cy = dv2 * dy1 - dv1 * dy2;
				cz = dv2 * dz1 - dv1 * dz2;
				denom = 1 / Math.sqrt(cx * cx + cy * cy + cz * cz);
				_faceTangents[i++] = denom * cx;
				_faceTangents[i++] = denom * cy;
				_faceTangents[i++] = denom * cz;
			}
			return _faceTangents;
		}

		/**
		 * 计算顶点法线数据
		 * @param target
		 * @param _faceNormals
		 * @param _faceWeights
		 * @param _indices
		 * @param numVertices
		 * @param _useFaceWeights
		 * @return
		 */
		public static updateVertexNormals(target:number[], _faceNormals:number[], _indices:number[], numVertices:number):number[]
		{
			var v1:number;
			var f1:number = 0, f2:number = 1, f3:number = 2;
			var lenV:number = numVertices * 3;
			var normalStride:number = 3;

			target =target || [];
            target.length = lenV;
			v1 = 0;
			while (v1 < lenV)
			{
				target[v1] = 0.0;
				target[v1 + 1] = 0.0;
				target[v1 + 2] = 0.0;
				v1 += normalStride;
			}

			var i:number, k:number;
			var lenI:number = _indices.length;
			var index:number;

			while (i < lenI)
			{
				index = _indices[i++] * normalStride;
				target[index++] += _faceNormals[f1];
				target[index++] += _faceNormals[f2];
				target[index] += _faceNormals[f3];
				index = _indices[i++] * normalStride;
				target[index++] += _faceNormals[f1];
				target[index++] += _faceNormals[f2];
				target[index] += _faceNormals[f3];
				index = _indices[i++] * normalStride;
				target[index++] += _faceNormals[f1];
				target[index++] += _faceNormals[f2];
				target[index] += _faceNormals[f3];
				f1 += 3;
				f2 += 3;
				f3 += 3;
			}

			v1 = 0;
			while (v1 < lenV)
			{
				var vx:number = target[v1];
				var vy:number = target[v1 + 1];
				var vz:number = target[v1 + 2];
				var d:number = 1.0 / Math.sqrt(vx * vx + vy * vy + vz * vz);
				target[v1] = vx * d;
				target[v1 + 1] = vy * d;
				target[v1 + 2] = vz * d;
				v1 += normalStride;
			}

			return target;
		}

		/**
		 * 计算切线数据
		 * @param target
		 * @param _faceTangents
		 * @param _faceWeights
		 * @param _indices
		 * @param numVertices
		 * @param _useFaceWeights
		 * @return
		 */
		public static updateVertexTangents(target:number[], _faceTangents:number[], _indices:number[], numVertices:number):number[]
		{
			var i:number;
			var lenV:number = numVertices * 3;
			var tangentStride:number = 3;

			target =target || [];
            target.length = lenV;

			i = 0;
			while (i < lenV)
			{
				target[i] = 0.0;
				target[i + 1] = 0.0;
				target[i + 2] = 0.0;
				i += tangentStride;
			}

			var k:number;
			var lenI:number = _indices.length;
			var index:number;
			var f1:number = 0, f2:number = 1, f3:number = 2;

			i = 0;

			while (i < lenI)
			{
				index = _indices[i++] * tangentStride;
				target[index++] += _faceTangents[f1];
				target[index++] += _faceTangents[f2];
				target[index] += _faceTangents[f3];
				index = _indices[i++] * tangentStride;
				target[index++] += _faceTangents[f1];
				target[index++] += _faceTangents[f2];
				target[index] += _faceTangents[f3];
				index = _indices[i++] * tangentStride;
				target[index++] += _faceTangents[f1];
				target[index++] += _faceTangents[f2];
				target[index] += _faceTangents[f3];
				f1 += 3;
				f2 += 3;
				f3 += 3;
			}

			i = 0;
			while (i < lenV)
			{
				var vx:number = target[i];
				var vy:number = target[i + 1];
				var vz:number = target[i + 2];
				var d:number = 1.0 / Math.sqrt(vx * vx + vy * vy + vz * vz);
				target[i] = vx * d;
				target[i + 1] = vy * d;
				target[i + 2] = vz * d;
				i += tangentStride;
			}

			return target;
		}
	}
}
