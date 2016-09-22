module feng3d {

	/**
	 * 唯一名称组件
	 * <p>不允许容器内存在两个名称相同的子组件</p>
	 * @author feng 2015-12-2
	 */
    export class UniqueNameComponent extends Component {
        constructor() {
            super();

            this.addEventListener(ComponentEvent.BE_ADDED_COMPONET, this.onBeAddedComponet);
            this.addEventListener(ComponentEvent.BE_REMOVED_COMPONET, this.onBeRemovedComponet);
        }

		/**
		 * 处理被添加事件
		 * @param event
		 */
        protected onBeAddedComponet(event: ComponentEvent) {
            var addedComponentEventVO: AddedComponentEventVO = event.data;
            addedComponentEventVO.container.addEventListener(ComponentEvent.ADDED_COMPONET, this.onAddedComponetContainer);

            this.checkUniqueName(addedComponentEventVO.container);
        }

		/**
		 * 处理被移除事件
		 * @param event
		 */
        protected onBeRemovedComponet(event: ComponentEvent) {
            var removedComponentEventVO: RemovedComponentEventVO = event.data;
            removedComponentEventVO.container.removeEventListener(ComponentEvent.ADDED_COMPONET, this.onAddedComponetContainer);
        }

		/**
		 * 处理添加组件事件
		 * @param event
		 */
        protected onAddedComponetContainer(event: ComponentEvent) {
            var addedComponentEventVO: AddedComponentEventVO = event.data;

            this.checkUniqueName(addedComponentEventVO.container);
        }

		/**
		 * 检查子组件中名称是否唯一
		 * @param container
		 */
        private checkUniqueName(container: Component) {
            var nameDic = {};
            for (var i: number = 0; i < container.numComponents; i++) {
                var component: Component = container.getComponentAt(i);
                if (nameDic[component.componentName]) {
                    this.throwEvent(new Error("存在多个子组件拥有相同的名称"));
                }
                nameDic[component.componentName] = true;
            }
        }
    }
}
