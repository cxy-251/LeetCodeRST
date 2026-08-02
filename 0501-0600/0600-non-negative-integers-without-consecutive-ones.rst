0600. Non-negative Integers without Consecutive Ones
====================================================

题目信息
--------

:题号: 0600
:难度: Hard
:主题: 非负整数、二进制表示、连续一、区间计数
:原题: `LeetCode 0600 <https://leetcode.com/problems/non-negative-integers-without-consecutive-ones/>`_
:重点: 统计区间 [0,n] 且包含两个端点、标准二进制表示中不能出现 11、返回整数个数

题目重述
--------

给定正整数 ``n``，统计闭区间 ``[0, n]`` 中有多少个非负整数的二进制表示不包含连续的两个 ``1``，并返回数量。

判断使用整数的标准二进制表示，不考虑人为添加的前导零。数字 ``0`` 也属于统计范围，其二进制表示不含连续 ``1``，因此始终是一个合法整数。

自建示例
--------

区间中同时存在合法和非法整数：

.. code-block:: text

   输入：n = 5
   输出：5
   解释：0、1、2（二进制 10）、4（二进制 100）和 5（二进制 101）合法；3 的二进制 11 含有连续两个 1。

最小正上界：

.. code-block:: text

   输入：n = 1
   输出：2
   解释：区间中只有 0 和 1，二者都不含连续的 1。

斐波那契计数配合高位数位决策
----------------------------

从高位到低位处理 ``n`` 的二进制表示。``f[i]`` 表示恰好使用不超过 ``i`` 个低位时、且最高位可以自由选择的合法二进制串数量，满足 ``f[i] = f[i-1] + f[i-2]``。当 ``n`` 的某一位为 ``1`` 时，先把该位改成 ``0``，其余低位可以构成 ``f[i]`` 个合法数；如果前一位已经是 ``1``，继续沿着 ``n`` 扫描会首次出现连续 ``1``，此时直接返回。完整扫描没有冲突时，再把 ``n`` 本身计入答案。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int findIntegers(int n) {
           int count[31];
           count[0] = 1;
           count[1] = 2;
           for (int i = 2; i <= 30; ++i) {
               count[i] = count[i - 1] + count[i - 2];
           }

           int answer = 0;
           int previousBit = 0;
           unsigned int value = static_cast<unsigned int>(n);
           for (int bit = 30; bit >= 0; --bit) {
               if ((value & (1u << bit)) == 0) {
                   previousBit = 0;
                   continue;
               }
               answer += count[bit];
               if (previousBit == 1) return answer;
               previousBit = 1;
           }
           return answer + 1;
       }
   };

代码分析
--------

遇到 ``1`` 时统计“当前位置取 ``0``”所跳过的整段合法后缀；连续 ``1`` 表明 ``n`` 的后缀已越过合法边界，不能继续计数。若没有连续 ``1``，最后的 ``+1`` 正好加入 ``n`` 本身。预计算和高位扫描都只涉及固定的 31 位，时间复杂度和额外空间复杂度均为 ``O(1)``。
