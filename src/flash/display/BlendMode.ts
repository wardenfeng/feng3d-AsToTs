module feng3d {
    export class BlendMode {
        // [静态] 将显示对象的原色值添加到它的背景颜色中，上限值为 0xFF。
        public static ADD = "add"

        // [静态] 将显示对象的每个像素的 Alpha 值应用于背景。
        public static ALPHA = "alpha"

        // [静态] 在显示对象原色和背景颜色中选择相对较暗的颜色（具有较小值的颜色）。
        public static DARKEN = "darken"
        // [静态] 将显示对象的原色与背景颜色进行比较，然后从较亮的原色值中减去较暗的原色值。
        public static DIFFERENCE = "difference"
        // [静态] 根据显示对象的 Alpha 值擦除背景。
        public static ERASE = "erase"
        // [静态] 根据显示对象的暗度调整每个像素的颜色。
        public static HARDLIGHT = "hardlight"
        // [静态] 反转背景。
        public static INVERT = "invert"
        // [静态] 强制为该显示对象创建一个透明度组。
        public static LAYER = "layer"
        // [静态] 在显示对象原色和背景颜色中选择相对较亮的颜色（具有较大值的颜色）。
        public static LIGHTEN = "lighten"
        // [静态] 将显示对象的原色值与背景颜色的原色值相乘，然后除以 0xFF 进行标准化，从而得到较暗的颜色。
        public static MULTIPLY = "multiply"
        // [静态] 该显示对象出现在背景前面。
        public static NORMAL = "normal"
        // [静态] 根据背景的暗度调整每个像素的颜色。
        public static OVERLAY = "overlay"
        // [静态] 将显示对象颜色的补色（反色）与背景颜色的补色相乘，会产生漂白效果。
        public static SCREEN = "screen"
        // [静态] 使用着色器来定义对象之间的混合。
        public static SHADER = "shader"
        // [静态] 从背景颜色的值中减去显示对象原色的值，下限值为 0。
        public static SUBTRACT = "subtract"
    }
}