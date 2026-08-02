0275. H-Index II
================

题目信息
--------

:题号: 0275
:难度: Medium
:主题: 有序数组、H 指数、二分查找
:原题: `LeetCode 0275 <https://leetcode.com/problems/h-index-ii/>`_
:重点: 引用次数已按非递减顺序排列、``h`` 是最大可行阈值、进阶要求对数时间

题目重述
--------

给定整数数组 ``citations``，其中 ``citations[i]`` 表示第 ``i`` 篇论文的引用次数，并且数组已经按非递减顺序排列。返回最大的整数 ``h``，使至少有 ``h`` 篇论文各自被引用不少于 ``h`` 次，其余论文各自被引用不多于 ``h`` 次。

数组长度位于 ``[1, 10^5]``，引用次数位于 ``[0, 1000]``。答案位于 ``[0, citations.length]``，输入的有序性是本题与普通 H 指数题的重要区别。题目要求利用这一性质，把运行时间控制在 ``O(log n)``；函数不需要修改数组。

自建示例
--------

有序数组中存在中间阈值：

.. code-block:: text

   输入：citations = [0, 1, 4, 5, 6]
   输出：3
   解释：末尾三篇论文的引用次数都不少于 3；若取 h = 4，则只有三篇论文达到至少 4 次，因此最大值为 3。

没有正的 H 指数：

.. code-block:: text

   输入：citations = [0]
   输出：0
   解释：唯一论文没有被引用，无法满足 h = 1，所以结果为 0。

把 H 指数转为有序下标条件
-------------------------

设论文数为 ``n``，考虑排序后下标 ``i``。从 ``i`` 到末尾共有 ``n-i`` 篇论文，
而它们的引用次数都不小于 ``citations[i]``。如果：

.. code-block:: text

   citations[i] >= n - i

那么末尾这 ``n-i`` 篇论文就证明 ``h=n-i`` 可行。随着 ``i`` 向右移动，左侧引用次数不下降，
右侧所需的论文数量下降，所以这个条件一旦成立就不会再次失败；用二分查找第一个成立的下标，
返回对应的 ``n-i``。若没有下标成立，答案为 0。

正确性说明
----------

第一个满足条件的 ``i`` 给出最大的 ``n-i``，且后缀中的每篇论文都至少有该数量的引用，
因此这个值可行。任何更大的 ``h`` 对应更靠左的下标；这些下标都不满足条件，说明达到该阈值的论文数不足，
所以不可能有更大的可行 H 指数。二分搜索的单调性和定义完全一致。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int hIndex(std::vector<int>& citations) {
           const int n = static_cast<int>(citations.size());
           int left = 0;
           int right = n - 1;
           int answer = 0;

           while (left <= right) {
               const int middle = left + (right - left) / 2;
               const int possible = n - middle;
               if (citations[middle] >= possible) {
                   answer = possible;
                   right = middle - 1;
               } else {
                   left = middle + 1;
               }
           }
           return answer;
       }
   };

代码分析
--------

每轮排除一半下标，时间复杂度为 ``O(log n)``，只使用固定数量的变量，额外空间为 ``O(1)``。
输入已按非递减顺序排列，代码不复制、不排序；二分查找返回的是论文数量阈值，不是某篇论文的引用次数。
