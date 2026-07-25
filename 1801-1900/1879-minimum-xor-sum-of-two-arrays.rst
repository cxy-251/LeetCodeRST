1879. Minimum XOR Sum of Two Arrays
==================================

题目信息
--------

:题号: 1879
:难度: Hard
:主题: 状态压缩、动态规划
:原题: `LeetCode 1879 <https://leetcode.com/problems/minimum-xor-sum-of-two-arrays/>`_
:重点: 重排第二个数组后最小化对应元素异或值之和

题目重述
--------

可以任意重排 ``nums2``。返回 ``nums1[i] XOR nums2[i]`` 对所有下标求和后的最小值。

自建示例
--------

.. code-block:: text

   输入：nums1 = [1,2], nums2 = [2,3]
   输出：2
   解释：把 nums2 排为 [3,2]，异或和为 (1 XOR 3) + (2 XOR 2) = 2。

.. code-block:: text

   输入：nums1 = [5], nums2 = [1]
   输出：4
   解释：单个对应元素的异或值为 4。
