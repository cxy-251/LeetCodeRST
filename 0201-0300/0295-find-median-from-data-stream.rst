0295. Find Median from Data Stream
=================================

题目信息
--------

:题号: 0295
:难度: Hard
:主题: 数据流、对象设计、中位数、跨调用状态
:原题: `LeetCode 0295 <https://leetcode.com/problems/find-median-from-data-stream/>`_
:重点: 新数据持续加入、奇偶数量对应不同中位数定义、查询必须覆盖此前全部元素

题目重述
--------

实现 ``MedianFinder`` 类，用于持续接收整数并查询当前数据集合的中位数：

* ``MedianFinder()`` 创建一个尚未加入数据的对象；
* ``addNum(num)`` 把整数 ``num`` 加入当前数据流；
* ``findMedian()`` 返回截至当前已经加入的全部整数的中位数。

把已有元素按非递减顺序排列后，元素数量为奇数时，中位数是正中间的元素；数量为偶数时，中位数是中间两个元素的算术平均值，因此返回类型为浮点数。``num`` 位于 ``[-10^5, 10^5]``，题目保证调用 ``findMedian`` 前至少加入过一个元素。``addNum`` 与 ``findMedian`` 的总调用次数不超过 ``5 * 10^4``，对象必须在不同调用之间保留此前全部数据的逻辑状态。

自建示例
--------

数据量从偶数变为奇数：

.. code-block:: text

   操作：addNum(5), addNum(1), findMedian(), addNum(9), findMedian()
   输出：3.0, 5.0
   解释：前两项排序后为 [1,5]，中位数是 (1+5)/2=3；加入 9 后为 [1,5,9]，中位数是 5。

继续加入负数：

.. code-block:: text

   操作：addNum(5), addNum(1), addNum(9), addNum(-3), findMedian()
   输出：3.0
   解释：四个数排序后为 [-3,1,5,9]，中间两个数是 1 和 5，平均值为 3。

用两个堆维护排序中线
--------------------

把数据分成两个部分：最大堆 ``lower`` 保存较小的一半，最小堆 ``upper`` 保存较大的一半，保持：

* ``lower`` 的元素数量等于或比 ``upper`` 多 1；
* ``lower.top() <= upper.top()``（两堆都非空时）。

加入新数时，若它不大于 ``lower`` 堆顶就放入下半堆，否则放入上半堆；随后通过跨堆移动堆顶恢复大小平衡。
奇数个元素时中位数是 ``lower.top()``，偶数个元素时是两个堆顶的平均值。

正确性说明
----------

两个堆的顺序关系保证下半部分每个值都不大于上半部分每个值，大小平衡保证中间位置只可能落在
``lower.top`` 或两堆顶之间。加入元素后先按值放置，再至多移动一个元素纠正数量差，两个不变量始终成立，
所以查询得到排序序列的定义中位数。

C++ 实现
--------

.. code-block:: cpp

   class MedianFinder {
       std::priority_queue<int> lower;
       std::priority_queue<int, std::vector<int>, std::greater<int>> upper;

   public:
       MedianFinder() = default;

       void addNum(int num) {
           if (lower.empty() || num <= lower.top()) lower.push(num);
           else upper.push(num);

           if (lower.size() > upper.size() + 1) {
               upper.push(lower.top());
               lower.pop();
           } else if (upper.size() > lower.size()) {
               lower.push(upper.top());
               upper.pop();
           }
       }

       double findMedian() {
           if (lower.size() > upper.size()) return lower.top();
           return (static_cast<long long>(lower.top()) + upper.top()) / 2.0;
       }
   };

代码分析
--------

每次加入元素最多执行常数次堆操作，时间复杂度为 ``O(log n)``；查询只读取堆顶，时间为 ``O(1)``。
两个堆合计保存全部数据，额外空间为 ``O(n)``；求偶数中位数时先在 ``long long`` 中相加再除以 ``2.0``，
保证平均值保留小数且不受整数除法影响。
