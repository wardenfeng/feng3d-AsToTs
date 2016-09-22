module feng3d {

	/**
	 * 子几何体组件
	 * @author feng 2015-12-10
	 */
    export class SubGeometryComponent extends Component {
        protected _subGeometry: SubGeometry;

        constructor() {
            super();

            this.addEventListener(ComponentEvent.BE_ADDED_COMPONET, this.onBeAddedComponet);
            this.addEventListener(ComponentEvent.BE_REMOVED_COMPONET, this.onBeRemovedComponet);
        }

        protected get subGeometry(): SubGeometry {
            return this._subGeometry;
        }

        protected set subGeometry(value: SubGeometry) {
            this._subGeometry = value;
        }

		/**
		 * 处理被添加事件
		 * @param event
		 */
        protected onBeAddedComponet(event: ComponentEvent) {
            var addedComponentEventVO: AddedComponentEventVO = event.data;
            this.subGeometry = addedComponentEventVO.container as SubGeometry;
        }

		/**
		 * 处理被移除事件
		 * @param event
		 */
        protected onBeRemovedComponet(event: ComponentEvent) {
            var removedComponentEventVO: RemovedComponentEventVO = event.data;
            this.subGeometry = null;
        }

		/**
		 * Fagal编号中心
		 */
        protected get _(): any {
            return FagalIdCenter.instance;
        }
    }
}
