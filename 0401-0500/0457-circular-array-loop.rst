0457. Circular Array Loop
=========================

题目信息
--------

:题号: 0457
:难度: Medium
:主题: 环形数组、带符号步长、同向循环、循环长度
:原题: `LeetCode 0457 <https://leetcode.com/problems/circular-array-loop/>`_
:重点: 下标按数组长度循环、正数向右负数向左、循环内方向必须一致、单节点自环无效

题目重述
--------

给定非零整数数组 ``nums``。从下标 ``i`` 出发，下一下标由 ``i + nums[i]`` 决定，并按数组长度循环回绕。正数表示向右移动，负数表示向左移动。

判断是否存在一个循环，使循环包含的下标数量大于 1，并且循环中所有移动方向一致：所有步长都为正，或所有步长都为负。长度为 1 的自环不算合法循环，即使某个步长回绕后仍落在自身。

``nums.length`` 位于 ``[2, 5000]``，每个元素位于 ``[-1000, 1000]`` 且不为 0。函数只返回是否存在合法循环。

自建示例
--------

整个数组形成正向循环：

.. code-block:: text

   输入：nums = [1, 1, 1]
   输出：true
   解释：下标按 0 -> 1 -> 2 -> 0 循环，长度为 3，且所有步长都为正。

循环路径混合方向：

.. code-block:: text

   输入：nums = [1, -1]
   输出：false
   解释：0 会走到 1，但下标 1 的步长为负，方向与前一步不同，因此不能构成合法同向循环。

限定方向的快慢指针
------------------

固定一个起点，先记录它的方向；沿路径移动时，若下一个位置的步长方向改变，当前路径立即失效。对仍保持同向的路径使用 Floyd 快慢指针：慢指针走一步、快指针走两步，若两者相遇且不是单节点自环，就发现了合法循环。

下标回绕用取模完成，负步长的余数需要加上 ``n`` 才能得到合法下标。每个起点都独立检查，因而不会把上一条路径的方向或循环误用于当前起点。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       int nextIndex(const std::vector<int>& nums, int index) {
           int n = static_cast<int>(nums.size());
           long long next = (static_cast<long long>(index) + nums[index]) % n;
           if (next < 0) next += n;
           return static_cast<int>(next);
       }

   public:
       bool circularArrayLoop(std::vector<int>& nums) {
           int n = static_cast<int>(nums.size());
           for (int start = 0; start < n; ++start) {
               bool positive = nums[start] > 0;
               int slow = start;
               int fast = nextIndex(nums, start);

               while ((nums[slow] > 0) == positive &&
                      (nums[fast] > 0) == positive &&
                      (nums[nextIndex(nums, fast)] > 0) == positive) {
                   if (slow == fast) {
                       if (nextIndex(nums, slow) != slow) return true;
                       break;
                   }
                   slow = nextIndex(nums, slow);
                   fast = nextIndex(nums, nextIndex(nums, fast));
               }
           }
           return false;
       }
   };

代码分析
--------

循环条件同时检查慢指针、快指针及快指针的下一步，保证相遇过程没有跨入相反方向的边。相遇后再排除 ``next(slow) == slow``，因此长度为 1 的自环不会被接受。该实现对每个起点最坏扫描 ``O(n)``，总时间复杂度为 ``O(n^2)``，额外空间复杂度为 ``O(1)``。
