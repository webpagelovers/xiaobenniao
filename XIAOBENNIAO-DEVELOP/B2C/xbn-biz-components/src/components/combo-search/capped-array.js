import indexOf from 'lodash.indexof';

/**
 * 只最新n个元素的数组，同时做了去重处理
 */
export class CappedArray {

    constructor(src, cap) {
        this.array = src;
        this.cap = cap;
    }

    push(el, checkDup) {
        //去重
        if (checkDup && indexOf(this.array, el)>-1) {
            return;
        }
        this.array.push(el);
        if (this.array.length > this.cap) {
            this.array.reverse().length = this.cap;
            this.array.reverse();
        }
    }

    getArray() {
        return this.array;
    }

}