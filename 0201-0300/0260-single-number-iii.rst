0260. Single Number III
=======================

题目信息
--------

:题号: 0260
:难度: Medium
:主题: 数组、位运算、异或、分组
:原题: `LeetCode 0260 <https://leetcode.com/problems/single-number-iii/>`_
:重点: 恰有两个不同值只出现一次、其他值都出现两次、返回顺序不限、线性时间与常数额外空间

题目重述
--------

给定整数数组 ``nums``，其中恰好有两个不同的元素各出现一次，其余每个元素都恰好出现两次。返回这两个只出现一次的元素。

数组长度位于 ``[2, 3 * 10^4]``，元素值位于 32 位有符号整数范围 ``[-2^31, 2^31 - 1]``。两个答案可以按任意顺序返回。题目要求整体时间复杂度为 ``O(n)``，并且除返回结果外只使用常数级额外空间；函数不需要改变输入数组。

自建示例
--------

唯一值位于数组中间和末尾：

.. code-block:: text

   输入：nums = [4, 1, 4, 6, 1, 9]
   输出：[6, 9]
   解释：4 和 1 都各出现两次，只有 6 和 9 各出现一次；返回 [9, 6] 也合法。

包含负数与零：

.. code-block:: text

   输入：nums = [-7, 0, 5, -7, 8, 5]
   输出：[0, 8]
   解释：-7 和 5 成对出现，剩余的 0 与 8 就是两个唯一元素。

先得到两个答案的异或
--------------------

把所有元素异或在一起。每个成对出现的值会因为 ``x ^ x = 0`` 抵消，最后得到：

.. code-block:: text

   mixed = unique_a ^ unique_b

两个唯一值不同，所以 ``mixed`` 至少有一个置位。取 ``mixed`` 的最低置位 ``bit``，
则两个唯一值在这一位上必然一个为 0、一个为 1。按这一位把原数组分成两组：每组中的成对元素仍在同组抵消，
两个唯一值则分别落在不同组，各组异或结果就是两个答案。

取最低置位时使用无符号位模式，避免唯一值或异或结果恰好包含有符号 ``int`` 的最高位时对 ``-INT_MIN`` 做有符号溢出运算。

正确性说明
----------

``mixed`` 的每个二进制位表示两个唯一值是否在该位不同。选中的 ``bit`` 能把它们分开；
任一重复值与自身的位模式相同，因此一定进入同一组并抵消。两个分组的异或结果只剩各自的唯一值，
返回顺序不影响题目合同。

C++ 实现
--------

.. code-block:: cpp

   #include <cstdint>

   class Solution {
   public:
       std::vector<int> singleNumber(std::vector<int>& nums) {
           std::uint32_t mixed = 0;
           for (int value : nums) {
               mixed ^= static_cast<std::uint32_t>(value);
           }

           const std::uint32_t bit = mixed & (~mixed + 1u);
           std::uint32_t first = 0;
           std::uint32_t second = 0;
           for (int value : nums) {
               const std::uint32_t bits = static_cast<std::uint32_t>(value);
               if ((bits & bit) != 0) first ^= bits;
               else second ^= bits;
           }

           return {
               static_cast<int>(first),
               static_cast<int>(second)
           };
       }
   };

代码分析
--------

两次扫描，每个元素只做常数次异或和判断，时间复杂度为 ``O(n)``；只保存三个无符号位状态，
除返回数组外额外空间为 ``O(1)``。``std::uint32_t`` 表达题目 32 位整数的位模式，
不需要排序、哈希表或修改输入数组。
