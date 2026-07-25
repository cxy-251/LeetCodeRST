1865. Finding Pairs With a Certain Sum
======================================

题目信息
--------

:题号: 1865
:难度: Medium
:主题: 设计、哈希表、数组
:原题: `LeetCode 1865 <https://leetcode.com/problems/finding-pairs-with-a-certain-sum/>`_
:重点: 支持修改第二个数组并快速统计跨数组和为目标值的下标对

题目重述
--------

实现 ``FindSumPairs``。``add(index,val)`` 给 ``nums2[index]`` 增加 ``val``；``count(tot)`` 返回满足 ``nums1[i] + nums2[j] = tot`` 的下标对数量。

自建示例
--------

.. code-block:: text

   输入：nums1 = [1,2], nums2 = [2,3]；count(4)；add(0,1)；count(4)
   输出：[null,2,null,2]
   解释：修改前有 (1,3)、(2,2)，修改后两个 3 都可与 1 配对。

.. code-block:: text

   输入：nums1 = [5], nums2 = [1]；count(10)
   输出：[null,0]
   解释：不存在和为 10 的数对。
