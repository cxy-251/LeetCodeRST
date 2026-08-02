0396. Rotate Function
=====================

题目信息
--------

:题号: 0396
:难度: Medium
:主题: 数组循环旋转、加权得分、全部旋转、最大值
:原题: `LeetCode 0396 <https://leetcode.com/problems/rotate-function/>`_
:重点: ``B_k`` 是向右循环旋转 k 位、下标权重从 0 到 n-1、比较 n 种旋转得分、返回最大值

题目重述
--------

给定长度为 ``n`` 的整数数组 ``nums``。对每个 ``k``（``0 <= k < n``），令 ``B_k`` 为把 ``nums`` 向右循环旋转 ``k`` 个位置后得到的数组，并定义：

.. code-block:: text

   F(k) = 0 * B_k[0] + 1 * B_k[1] + ... + (n - 1) * B_k[n - 1]

返回所有 ``F(k)`` 中的最大值。数组长度位于 ``[1, 10^5]``，元素位于 ``[-100, 100]``，题目保证答案适合 32 位有符号整数。循环旋转会把越过末尾的元素移到数组开头。

自建示例
--------

多个旋转取得同一最大值：

.. code-block:: text

   输入：nums = [2,1,3]
   输出：7
   解释：F(0)=0*2+1*1+2*3=7；向右旋转一次得到 [3,2,1]，得分 4；再旋转得到 [1,3,2]，得分 7，因此最大值为 7。

单元素数组：

.. code-block:: text

   输入：nums = [-5]
   输出：0
   解释：唯一元素的下标权重为 0，唯一旋转的得分为 0。

相邻旋转的得分只差一项
------------------------

先计算不旋转时的 ``F(0)`` 和数组总和。向右旋转一次时，除原来最后一个元素外的每个元素下标都增加 1，最后一个元素从权重 ``n-1`` 变成 0。因此
``F(k+1) = F(k) + total - n * moved``，其中 ``moved`` 是本轮从末尾移到开头的元素。

按这个关系依次生成所有旋转得分，不需要真的复制或旋转数组。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int maxRotateFunction(std::vector<int>& nums) {
           int n = static_cast<int>(nums.size());
           long long total = 0;
           long long current = 0;
           for (int i = 0; i < n; ++i) {
               total += nums[i];
               current += 1LL * i * nums[i];
           }

           long long answer = current;
           for (int k = 1; k < n; ++k) {
               current += total - 1LL * n * nums[n - k];
               answer = std::max(answer, current);
           }
           return static_cast<int>(answer);
       }
   };

代码分析
--------

递推中的 ``nums[n-k]`` 正是本轮从数组末尾移到开头的元素，符号和权重变化由推导直接给出；负数也自然参与求和。初始化和每轮更新都为常数操作，时间复杂度为 ``O(n)``，额外空间为 ``O(1)``。
