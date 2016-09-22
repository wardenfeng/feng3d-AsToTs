module feng3d
{
	/**
	 * Fagal函数追加代码事件
	 */
	//[Event(name = "fagalMathEventAppend", type = "me.feng3d.events.FagalMathEvent")]

	/**
	 * Fagal数学运算
	 * @author feng 2015-7-22
	 */
	export class FagalMath extends EventDispatcher
	{
		/**
		 * destination=abs(source1):一个寄存器的绝对值，分量形式
		 */
		public abs(destination:IField, source1:IField)
		{
			var code:string = "this.abs " + destination + ", " + source1;
			this.append(code);
		}

		/**
		 * destination=source1+source2:两个寄存器相加，分量形式
		 */
		public add(destination:IField, source1:IField, source2:IField)
		{
			var code:string = "this.add " + destination + ", " + source1 + ", " + source2;
			this.append(code);
		}

		/**
		 * destination=cos(source1):一个寄存器的余弦值，分量形式
		 */
		public cos(destination:IField, source1:IField)
		{
			var code:string = "this.cos " + destination + ", " + source1;
			this.append(code);
		}

		/**
		 * crs:两个寄存器间的叉积
		 * <p>destination.x=source1.y*source2.z-source1.z*source2.y</p>
		 * <p>destination.y=source1.z*source2.x-source1.x*source2.z</p>
		 * <p>destination.z=source1.x*source2.y-source1.y*source2.x</p>
		 */
		public crs(destination:IField, source1:IField, source2:IField)
		{
			var code:string = "this.crs " + destination + ", " + source1 + ", " + source2;
			this.append(code);
		}

		/**
		 * destination=source1/source2:两个寄存器相除，分量形式
		 */
		public div(destination:IField, source1:IField, source2:IField)
		{
			var code:string = "this.div " + destination + ", " + source1 + ", " + source2;
			this.append(code);
		}

		/**
		 * dp3:两个寄存器间的点积，3分量
		 * <br/>
		 * destination=source1.x*source2.x+source1.y*source2.y+source1.z*source2.z
		 */
		public dp3(destination:IField, source1:IField, source2:IField)
		{
			var code:string = "this.dp3 " + destination + ", " + source1 + ", " + source2;
			this.append(code);
		}

		/**
		 * dp4:两个寄存器间的点积，4分量
		 * <br/>
		 * destination=source1.x*source2.x+source1.y*source2.y+source1.z*source2.z+source1.w+source2.w
		 */
		public dp4(destination:IField, source1:IField, source2:IField)
		{
			var code:string = "this.dp4 " + destination + ", " + source1 + ", " + source2;
			this.append(code);
		}

		/**
		 * destination=2^source1:2的source1次方，分量形式
		 */
		public exp(destination:IField, source1:IField)
		{
			var code:string = "this.exp " + destination + ", " + source1;
			this.append(code);
		}

		/**
		 * destination=source1-(float)floor(source1)一个寄存器的分数部分，分量形式
		 */
		public frc(destination:IField, source1:IField)
		{
			var code:string = "this.frc " + destination + ", " + source1;
			this.append(code);
		}

		/**
		 * 如果寄存器有任意一个分量小于0，则丢弃该像素不进行绘制(只适用于片段着色器)
		 */
		public kil(source1:IField)
		{
			var code:string = "this.kil " + source1;
			this.append(code);
		}

		/**
		 * destination=log(source1)一个寄存器以2为底的对数，分量形式
		 */
		public log(destination:IField, source1:IField)
		{
			var code:string = "this.log " + destination + ", " + source1;
			this.append(code);
		}

		/**
		 * m33:由一个3*3的矩阵对一个3分量的向量进行矩阵乘法
		 * <br/>
		 * destination.x=(source1.x*source2[0].x)+(source1.y*source2[0].y)+(source1.z*source2[0].z)
		 * <br/>
		 * destination.y=(source1.x*source2[1].x)+(source1.y*source2[1].y)+(source1.z*source2[1].z)
		 * <br/>
		 * destination.z=(source1.x*source2[2].x)+(source1.y*source2[2].y)+(source1.z*source2[2].z)

		 */
		public m33(destination:IField, source1:IField, source2:IField)
		{
			var code:string = "this.m33 " + destination + ", " + source1 + ", " + source2;
			this.append(code);
		}

		/**
		 * m34:由一个3*4的矩阵对一个4分量的向量进行矩阵乘法
		 * <br/>
		 * destination.x=(source1.x*source2[0].x)+(source1.y*source2[0].y)+(source1.z*source2[0].z)+(source1.w*source2[0].w)
		 * <br/>
		 * destination.y=(source1.x*source2[1].x)+(source1.y*source2[1].y)+(source1.z*source2[1].z)+(source1.w*source2[1].w)
		 * <br/>destination.z=(source1.x*source2[2].x)+(source1.y*source2[2].y)+(source1.z*source2[2].z)+(source1.w*source2[2].w)

		 */
		public m34(destination:IField, source1:IField, source2:IField)
		{
			var code:string = "this.m34 " + destination + ", " + source1 + ", " + source2;
			this.append(code);
		}

		/**
		 * m44:由一个4*4的矩阵对一个4分量的向量进行矩阵乘法
		 * <br/>
		 * destination.x=(source1.x*source2[0].x)+(source1.y*source2[0].y)+(source1.z*source2[0].z)+(source1.w*source2[0].w)
		 * <br/>
		 * destination.y=(source1.x*source2[1].x)+(source1.y*source2[1].y)+(source1.z*source2[1].z)+(source1.w*source2[1].w)
		 * <br/>
		 * destination.z=(source1.x*source2[2].x)+(source1.y*source2[2].y)+(source1.z*source2[2].z)+(source1.w*source2[2].w)
		 * <br/>
		 * destination.w=(source1.x*source2[3].x)+(source1.y*source2[3].y)+(source1.z*source2[3].z)+(source1.w*source2[3].w)
		 */
		public m44(destination:Register, source1:Register, source2:RegisterMatrix)
		{
			var code:string = "this.m44 " + destination + ", " + source1 + ", " + source2;
			this.append(code);
		}

		/**
		 * max:destination=max(source1 ，source2): 两个寄存器之间的较大值，分量形式
		 */
		public max(destination:IField, source1:IField, source2:IField)
		{
			var code:string = "this.max " + destination + ", " + source1 + ", " + source2;
			this.append(code);
		}

		/**
		 * min:destination=min(source1 ， source2) : 两个寄存器之间的较小值，分量形式
		 */
		public min(destination:IField, source1:IField, source2:IField)
		{
			var code:string = "this.min " + destination + ", " + source1 + ", " + source2;
			this.append(code);
		}

		/**
		 * mov:destination=source :将数据从源寄存器复制到目标寄存器
		 */
		public mov(destination:IField, source1:IField)
		{
			var code:string = "this.mov " + destination + ", " + source1;
			this.append(code);
		}

		/**
		 * destination = source1 * source2:两个寄存器相乘，分量形式
		 */
		public mul(destination:IField, source1:IField, source2:IField)
		{
			var code:string = "this.mul " + destination + ", " + source1 + ", " + source2;
			this.append(code);
		}

		/**
		 * destination=-source1:一个寄存器取反，分量形式
		 */
		public neg(destination:IField, source1:IField)
		{
			var code:string = "this.neg " + destination + ", " + source1;
			this.append(code);
		}

		/**
		 * destination=normalize(source1):将一个寄存器标准化为长度1的单位向量
		 */
		public nrm(destination:IField, source1:IField)
		{
			var code:string = "this.nrm " + destination + ", " + source1;
			this.append(code);
		}

		/**
		 * destination=pow(source1 ，source2):source1的source2次冥，分量形式
		 */
		public pow(destination:IField, source1:IField, source2:IField)
		{
			var code:string = "this.pow " + destination + ", " + source1 + ", " + source2;
			this.append(code);
		}

		/**
		 * destination=1/source1:一个寄存器的倒数，分量形式
		 */
		public rcp(destination:IField, source1:IField)
		{
			var code:string = "this.rcp " + destination + ", " + source1;
			this.append(code);
		}

		/**
		 * destination=1/sqrt(source) 一个寄存器的平方根倒数，分量形式
		 */
		public rsq(destination:IField, source1:IField)
		{
			var code:string = "this.rsq " + destination + ", " + source1;
			this.append(code);
		}

		/**
		 * destination=max(min(source1,1),0):将一个寄存器锁0-1的范围里
		 */
		public sat(destination:IField, source1:IField)
		{
			var code:string = "this.sat " + destination + ", " + source1;
			this.append(code);
		}

		/**
		 * destination= source1==source2 ? 1 : 0
		 */
		public seq(destination:IField, source1:IField, source2:IField)
		{
			var code:string = "this.seq " + destination + ", " + source1 + ", " + source2;
			this.append(code);
		}

		/**
		 * destination = source1>=source2 ? 1 : 0 类似三元操作符 分量形式
		 */
		public sge(destination:IField, source1:IField, source2:IField)
		{
			var code:string = "this.sge " + destination + ", " + source1 + ", " + source2;
			this.append(code);
		}

		/**
		 * destination=sin(source1):一个寄存器的正弦值，分量形式
		 */
		public sin(destination:IField, source1:IField)
		{
			var code:string = "this.sin " + destination + ", " + source1;
			this.append(code);
		}

		/**
		 * destination = source1小于source2 ? 1 : 0
		 */
		public slt(destination:IField, source1:IField, source2:IField)
		{
			var code:string = "this.slt " + destination + ", " + source1 + ", " + source2;
			this.append(code);
		}

		/**
		 * destination=source1!=source2 ? 1:0
		 */
		public sne(destination:IField, source1:IField, source2:IField)
		{
			var code:string = "this.sne " + destination + ", " + source1 + ", " + source2;
			this.append(code);
		}

		/**
		 * destination=sqrt(source):一个寄存器的平方根，分量形式
		 */
		public sqt(destination:IField, source1:IField)
		{
			var code:string = "this.sqt " + destination + ", " + source1;
			this.append(code);
		}

		/**
		 * destination=source1-source2:两个寄存器相减，分量形式
		 */
		public sub(destination:IField, source1:IField, source2:IField)
		{
			var code:string = "this.sub " + destination + ", " + source1 + ", " + source2;
			this.append(code);
		}

		/**
		 * 纹理取样
		 * @param	colorReg	目标寄存器
		 * @param	uvReg		UV坐标
		 * @param	textureReg	纹理寄存器
		 * @param	flags		取样参数
		 */
		public tex(colorReg:Register, uvReg:Register, textureReg:Register)
		{
			var code:string = "this.tex " + colorReg + ", " + uvReg + ", " + textureReg;

			//获取法线纹理采样参数
			var flags = getSampleFlags(textureReg);
			if (flags && flags.length > 0)
			{
				code += " <" + flags.join(",") + ">";
			}
			this.append(code);

			/**
			 * 获取取样参数
			 * @param textureReg 纹理寄存器
			 * @return 取样参数
			 */
			function getSampleFlags(textureReg:Register)
			{
				//抛出 获取取样标记 事件
				var shaderParams:ShaderParams = FagalRE.instance.context3DCache.shaderParams;

				//提取 渲染标记
				var flags = shaderParams.getFlags(textureReg.regId);
				return flags;
			}
		}

		/**
		 * 混合数据
		 * <p>destination = source1 + (source2-source1) x factor</p>
		 * @author feng 2015-7-4
		 */
		public blend(destination:IField, source1:IField, source2:IField, factor:IField)
		{
			this.sub(source2, source2, source1);
			this.mul(source2, source2, factor);
			this.add(destination, source1, source2);
		}

		/**
		 * 添加注释
		 */
		public comment(... remarks)
		{
			if (!Debug.agalDebug)
				return;
			this.append(FagalToken.COMMENT + remarks.join(" "));
		}

		/**
		 * 添加代码
		 */
		public append(code:string)
		{
			this.dispatchEvent(new FagalMathEvent(FagalMathEvent.FAGALMATHEVENT_APPEND, code));
		}
	}
}
