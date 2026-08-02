0384. Shuffle an Array
======================

题目信息
--------

:题号: 0384
:难度: Medium
:主题: 设计、数组排列、均匀随机、重置状态
:原题: `LeetCode 0384 <https://leetcode.com/problems/shuffle-an-array/>`_
:重点: ``reset`` 恢复构造时顺序、``shuffle`` 返回随机排列、所有排列概率相同、对象跨调用保留初始数组

题目重述
--------

使用整数数组 ``nums`` 构造对象，并实现两个操作。``reset()`` 返回数组构造时的原始顺序；``shuffle()`` 返回由相同元素组成的一个随机排列，并要求所有可能排列出现的概率相同。

数组长度位于 ``[1, 50]``，元素位于 ``[-10^6, 10^6]``，且所有元素互不相同；对 ``reset`` 和 ``shuffle`` 的调用总数不超过 ``10^4``。无论此前进行了多少次洗牌，``reset`` 都必须依据构造时的初始顺序，而不是最近一次随机结果。

自建示例
--------

洗牌后恢复原始顺序：

.. code-block:: text

   初始数组：nums = [2,5,9]
   调用：shuffle(), reset()
   输出：shuffle 可以返回 [9,2,5] 等任意排列；reset 返回 [2,5,9]
   解释：三个元素的六种排列应等概率出现，重置结果始终是构造时顺序。

单元素数组：

.. code-block:: text

   初始数组：nums = [-4]
   调用：shuffle(), reset()
   输出：[-4]，[-4]
   解释：只有一种排列，两种操作都返回相同内容。

Fisher–Yates 逐步确定随机位置
------------------------------

从数组末尾向前处理位置 ``i``，在尚未确定的 ``[0, i]`` 中等概率选择一个位置并交换。第 ``i`` 位的每个元素都有 ``1/(i+1)`` 的机会被选中，递推得到所有完整排列等概率。每次洗牌都从原始数组复制一份，避免上一次随机结果影响下一次。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       std::vector<int> original;
       std::mt19937 generator{std::random_device{}()};

   public:
       Solution(std::vector<int>& nums) : original(nums) {}

       std::vector<int> reset() {
           return original;
       }

       std::vector<int> shuffle() {
           std::vector<int> result = original;
           for (int i = static_cast<int>(result.size()) - 1;
                i > 0; --i) {
               std::uniform_int_distribution<int> distribution(0, i);
               int chosen = distribution(generator);
               std::swap(result[i], result[chosen]);
           }
           return result;
       }
   };

代码分析
--------

``reset`` 返回从未修改的 ``original`` 副本；Fisher–Yates 每一步只在尚未固定的前缀中抽样，不会产生排列偏斜。洗牌时间为 ``O(n)``，复制结果的额外空间为 ``O(n)``，重置也需要复制返回值。
