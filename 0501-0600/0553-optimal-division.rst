0553. Optimal Division
======================

题目信息
--------

:题号: 0553
:难度: Medium
:主题: 正整数数组、连续除法、括号、最大结果表达式
:原题: `LeetCode 0553 <https://leetcode.com/problems/optimal-division/>`_
:重点: 数字顺序不能改变、只能插入除号与括号、返回使结果最大的表达式字符串、避免多余括号

题目重述
--------

给定正整数数组 ``nums``，必须保持数字原顺序，并在相邻数字之间插入除号 ``/``。可以添加括号来改变运算结合方式，目标是使整个表达式的数值最大。

返回一个达到最大值的表达式字符串。不能改变数字顺序或省略数字；返回结果不应包含无意义的冗余括号。若数组只有一个数字，直接返回该数字的十进制字符串。

自建示例
--------

括号改变连续除法结果：

.. code-block:: text

   输入：nums = [8,4,2]
   输出："8/(4/2)"
   解释：该表达式结果为 4，而按从左到右计算 (8/4)/2 只得到 1。

只有一个数字：

.. code-block:: text

   输入：nums = [5]
   输出："5"
   解释：没有可插入的除号，也不需要括号。

把后续除法整体放进分母
----------------------

所有数字为正数时，表达式 ``a / b / c`` 的连续左结合会继续除以 ``c``，而把后缀写成 ``a / (b / c / ...)`` 等价于让 ``c`` 及其后数字乘到整体结果的分子中，从而最大化结果。因而最优结构是第一项单独放在分子，第二项到末项全部放入一对括号中。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::string optimalDivision(std::vector<int>& nums) {
           if (nums.size() == 1) return std::to_string(nums[0]);
           if (nums.size() == 2) {
               return std::to_string(nums[0]) + "/" +
                      std::to_string(nums[1]);
           }

           std::string result = std::to_string(nums[0]) + "/(";
           for (int i = 1; i < static_cast<int>(nums.size()); ++i) {
               if (i > 1) result += "/";
               result += std::to_string(nums[i]);
           }
           result += ")";
           return result;
       }
   };

代码分析
--------

括号内保持从左到右的除法结合，整个后缀成为分母的最小可行值；正数条件保证反转后每个后续因子都只会增大结果。长度 1、2 的表达式不需要括号，构造时间复杂度为 ``O(n)``，额外空间为输出长度。
