module feng3d {



	/**
	 * 可渲染合并排序
	 * <p>为了提升渲染性能，排序EntityCollector中潜在显示对象。</p>
	 * <p>排序方式优先使用材质，其次是离摄像机的距离。不透明对象从前往后移，当对象需要混合的从后往前移，确保能够正确渲染。</p>
	 * @author feng 2015-3-9
	 */
    export class RenderableMergeSort implements IEntitySorter {
		/**
		 * 创建一个可渲染合并排序对象
		 */
        constructor() {
        }

		/**
		 * @inheritDoc
		 */
        public sort(collector: EntityCollector) {
            collector.opaqueRenderableHead = this.mergeSortByMaterial(collector.opaqueRenderableHead);
            collector.blendedRenderableHead = this.mergeSortByDepth(collector.blendedRenderableHead);
        }

		/**
		 * 合并按深度排序
		 * @param head			可渲染链表（头元素）
		 * @return				排好序的可渲染链表（头元素）
		 */
        private mergeSortByDepth(head: RenderableListItem): RenderableListItem {
            var headB: RenderableListItem;
            var fast: RenderableListItem, slow: RenderableListItem;

            if (!head || !head.next)
                return head;

            // split in two sublists
            slow = head;
            fast = head.next;

            while (fast) {
                fast = fast.next;
                if (fast) {
                    slow = slow.next;
                    fast = fast.next;
                }
            }

            headB = slow.next;
            slow.next = null;

            // recurse
            head = this.mergeSortByDepth(head);
            headB = this.mergeSortByDepth(headB);

            // merge sublists while respecting order
            var result: RenderableListItem;
            var curr: RenderableListItem;
            var l: RenderableListItem;

            if (!head)
                return headB;
            if (!headB)
                return head;

            while (head && headB && head != null && headB != null) {
                if (head.zIndex < headB.zIndex) {
                    l = head;
                    head = head.next;
                }
                else {
                    l = headB;
                    headB = headB.next;
                }

                if (!result)
                    result = l;
                else
                    curr.next = l;

                curr = l;
            }

            if (head)
                curr.next = head;
            else if (headB)
                curr.next = headB;

            return result;
        }

		/**
		 * 合并按材质排序
		 * @param head			可渲染链表（头元素）
		 * @return				排好序的可渲染链表（头元素）
		 */
        private mergeSortByMaterial(head: RenderableListItem): RenderableListItem {
            var headB: RenderableListItem;
            var fast: RenderableListItem, slow: RenderableListItem;

            if (!head || !head.next)
                return head;

            // split in two sublists
            slow = head;
            fast = head.next;

            while (fast) {
                fast = fast.next;
                if (fast) {
                    slow = slow.next;
                    fast = fast.next;
                }
            }

            headB = slow.next;
            slow.next = null;

            // recurse
            head = this.mergeSortByMaterial(head);
            headB = this.mergeSortByMaterial(headB);

            // merge sublists while respecting order
            var result: RenderableListItem;
            var curr: RenderableListItem;
            var l: RenderableListItem;
            var cmp: number;

            if (!head)
                return headB;
            if (!headB)
                return head;

            while (head && headB && head != null && headB != null) {

                // first this.sort per render order id (reduces program3D switches),
                // then on material id (reduces setting props),
                // then on zIndex (reduces overdraw)
                var aid: number = head.renderOrderId;
                var bid: number = headB.renderOrderId;

                if (aid == bid) {
                    var ma: number = head.materialId;
                    var mb: number = headB.materialId;

                    if (ma == mb) {
                        if (head.zIndex < headB.zIndex)
                            cmp = 1;
                        else
                            cmp = -1;
                    }
                    else if (ma > mb)
                        cmp = 1;
                    else
                        cmp = -1;
                }
                else if (aid > bid)
                    cmp = 1;
                else
                    cmp = -1;

                if (cmp < 0) {
                    l = head;
                    head = head.next;
                }
                else {
                    l = headB;
                    headB = headB.next;
                }

                if (!result) {
                    result = l;
                    curr = l;
                }
                else {
                    curr.next = l;
                    curr = l;
                }
            }

            if (head)
                curr.next = head;
            else if (headB)
                curr.next = headB;

            return result;
        }
    }
}
