0238. Product of Array Except Self
=================================

题目信息
--------

:题号: 0238
:难度: Medium
:主题: 数组、前缀积、后缀积
:原题: `LeetCode 0238 <https://leetcode.com/problems/product-of-array-except-self/>`_
:重点: 每个位置排除自身、禁止除法、零与负数、线性时间、输出数组不计入额外空间

题目重述
--------

给定整数数组 ``nums``，返回一个与它等长的数组 ``answer``，其中 ``answer[i]`` 等于 ``nums`` 中除 ``nums[i]`` 以外所有元素的乘积。每个输出位置都必须排除当前下标对应的那一个元素，而不是排除所有与它数值相同的元素。

数组长度位于 ``[2, 10^5]``，每个元素位于 ``[-30, 30]``，并保证任意前缀积或后缀积都适合 32 位有符号整数。解法必须在 ``O(n)`` 时间内完成且不能使用除法。进阶要求除返回数组外只使用 ``O(1)`` 额外空间；返回数组本身不计入额外空间。

自建示例
--------

数组中含一个零：

.. code-block:: text

   输入：nums = [3, 0, -2, 5]
   输出：[0, -30, 0, 0]
   解释：排除零所在位置时，其余元素乘积为 3*(-2)*5=-30；其他位置的乘积都仍包含零。

重复值按位置排除：

.. code-block:: text

   输入：nums = [2, 2, 3]
   输出：[6, 6, 4]
   解释：前两个位置分别只排除自己的那个 2，另一个 2 仍参与乘积。

前缀乘积与后缀乘积
------------------

``answer[i]`` 可以拆成当前位置左侧所有元素的乘积与右侧所有元素的乘积：

.. math::

   answer[i] = (nums[0]\cdots nums[i-1]) (nums[i+1]\cdots nums[n-1])

第一遍从左到右，把当前位置的左侧乘积写入 ``answer[i]``，再把当前元素乘入滚动的 ``prefix``；
第二遍从右到左，用滚动的 ``suffix`` 乘到已有答案上，再更新 ``suffix``。初始化两个滚动乘积为 1，
正好处理数组两端。整个过程不使用除法，因此零元素和多个零元素都会按乘积定义自然得到正确结果。

正确性说明
----------

第一遍结束后，``answer[i]`` 等于 ``nums[0..i-1]`` 的乘积。第二遍处理 ``i`` 时，
``suffix`` 等于 ``nums[i+1..n-1]`` 的乘积；相乘后正是排除 ``nums[i]`` 的全部元素。
随后把 ``nums[i]`` 加入 ``suffix``，不变量推进到下一个更左位置。两遍覆盖所有下标，故每个输出位置都准确排除自身。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> productExceptSelf(std::vector<int>& nums) {
           const int n = static_cast<int>(nums.size());
           std::vector<int> answer(n, 1);

           long long prefix = 1;
           for (int i = 0; i < n; ++i) {
               answer[i] = static_cast<int>(prefix);
               prefix *= nums[i];
           }

           long long suffix = 1;
           for (int i = n - 1; i >= 0; --i) {
               answer[i] = static_cast<int>(
                   static_cast<long long>(answer[i]) * suffix);
               suffix *= nums[i];
           }
           return answer;
       }
   };

代码分析
--------

两次线性扫描，时间复杂度为 ``O(n)``；除返回数组外只保存两个乘积，额外空间为 ``O(1)``。
``answer`` 先承载左侧乘积，再原地融合右侧乘积，没有建立完整的前缀表或后缀表；使用 ``long long``
进行乘法中间计算，最终按题目返回类型输出。
