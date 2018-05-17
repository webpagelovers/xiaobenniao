/**
 * 遍历一个vue组件获取其满足特定条件的子
 * @param component
 * @param checkFunc
 * @returns {*}
 */
export default function findVmChildren(component, checkFunc) {
    if (component.$children) {
        for(let childVmChildren of component.$children) {
            if (checkFunc(childVmChildren)) {
                return childVmChildren;
            } else {
                return findVmChildren(childVmChildren, checkFunc);
            }
        }
    }
}