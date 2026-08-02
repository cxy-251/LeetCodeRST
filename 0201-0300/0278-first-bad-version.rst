0278. First Bad Version
=======================

题目信息
--------

:题号: 0278
:难度: Easy
:主题: 有序版本、单调布尔接口、边界查找
:原题: `LeetCode 0278 <https://leetcode.com/problems/first-bad-version/>`_
:重点: 版本编号从 1 开始、坏版本一旦出现后续全部为坏、返回最早的坏版本并减少接口调用

题目重述
--------

产品共有 ``n`` 个按发布时间排列的版本，编号为 ``1`` 到 ``n``。其中某个版本是第一个坏版本，从它开始的所有后续版本也都是坏版本。平台提供 ``isBadVersion(version)`` 接口，用于查询指定版本是否为坏版本；实现函数并返回第一个坏版本的编号。

题目保证 ``1 <= firstBad <= n <= 2^31 - 1``，因此至少存在一个坏版本。只能通过给定接口判断版本状态，不能直接访问隐藏的首个坏版本值。应尽量减少对 ``isBadVersion`` 的调用次数，返回值使用一基版本编号。

自建示例
--------

坏版本位于后半段：

.. code-block:: text

   输入：n = 8，isBadVersion(1..5) = false，isBadVersion(6..8) = true
   输出：6
   解释：版本 6 是第一个返回 true 的版本，版本 1 到 5 都是好版本。

只有一个版本：

.. code-block:: text

   输入：n = 1，isBadVersion(1) = true
   输出：1
   解释：题目保证至少有一个坏版本，因此唯一版本就是第一个坏版本。

寻找第一个 true
----------------

把 ``isBadVersion`` 看成单调布尔序列：好版本为 ``false``，从首个坏版本开始全部为 ``true``。
在闭区间 ``[left,right]`` 内二分：

* ``mid`` 为坏版本时，首个坏版本不晚于 ``mid``，保留左半边并令 ``right=mid``；
* ``mid`` 为好版本时，首个坏版本一定在右侧，令 ``left=mid+1``。

循环结束时 ``left==right``，这个位置仍在候选区间内且是首个坏版本。中点计算使用
``left + (right-left)/2``，避免两个一基大编号相加时溢出。

正确性说明
----------

循环不变量是：首个坏版本位于 ``[left,right]``。坏中点不能被排除，因为它自己可能是首个；
好中点及其左侧都不可能是首个，只能排除。区间长度每轮严格减小，终止时唯一候选就是首个坏版本。

C++ 实现
--------

.. code-block:: cpp

   // The judge provides isBadVersion(int version).
   class Solution {
   public:
       int firstBadVersion(int n) {
           long long left = 1;
           long long right = n;
           while (left < right) {
               const long long middle = left + (right - left) / 2;
               if (isBadVersion(static_cast<int>(middle))) {
                   right = middle;
               } else {
                   left = middle + 1;
               }
           }
           return static_cast<int>(left);
       }
   };

代码分析
--------

每轮只调用一次接口并把候选区间缩小约一半，接口调用次数和时间复杂度为 ``O(log n)``，
额外空间为 ``O(1)``。使用 ``long long`` 保存边界，避免在 ``n`` 接近 ``2^31-1`` 时中点表达式溢出；
题目保证至少存在一个坏版本，所以不需要处理“全为好版本”的额外返回值。
