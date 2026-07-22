0238. Product of Array Except Self
=================================

题目信息
--------

:题号: 0238
:难度: Medium
:主题: 数组、前缀积、后缀积
:原题: `LeetCode 0238 <https://leetcode.com/problems/product-of-array-except-self/>`_
:教学重点: 排除自身、零值处理、空间复用

题目重述
--------

给定整数数组 ``nums``，接口为 ``vector<int> productExceptSelf(vector<int>& nums)``。返回等长数组，其中第 ``i`` 项是除 ``nums[i]`` 外所有元素之积。禁止使用除法，要求线性时间；长度最多约 ``10^5``，平台保证任意前缀或后缀乘积适合 32 位整数。结果顺序与输入下标对应。

自建示例
--------

.. code-block:: text

   输入：[2,0,4]
   输出：[0,8,0]

   输入：[-1,2,-3]
   输出：[-6,3,-2]
