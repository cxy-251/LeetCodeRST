0556. Next Greater Element III
==============================

题目信息
--------

:题号: 0556
:难度: Medium
:主题: 十进制数字、相同数字重排、下一个更大值、32 位范围
:原题: `LeetCode 0556 <https://leetcode.com/problems/next-greater-element-iii/>`_
:重点: 必须使用原数的全部数字且次数不变、返回最小的更大整数、无答案或溢出时返回 -1

题目重述
--------

给定正整数 ``n``，重新排列它的十进制数字，寻找一个严格大于 ``n`` 的 32 位有符号整数。所有数字必须全部使用，并且每个数字的出现次数保持不变。

在所有满足条件的整数中返回最小者。若无法通过重排得到更大的整数，或者最小可行结果超过 ``2^31 - 1``，返回 ``-1``。结果不能因为重排产生无效的前导零。

自建示例
--------

存在下一个更大排列：

.. code-block:: text

   输入：n = 218765
   输出：251678
   解释：251678 使用相同数字，并且是所有大于 218765 的重排结果中最小的一个。

数字已按降序排列：

.. code-block:: text

   输入：n = 987
   输出：-1
   解释：任意其他排列都会小于 987，因此不存在更大结果。

对数字串执行下一排列
--------------------

要得到刚好更大的排列，从右向左找第一个下降位置 ``pivot``，再从末尾找到刚好大于 ``digits[pivot]`` 的数字交换，最后把后缀升序排列。若不存在下降位置，原数字已是最大排列；用 ``long long`` 解析结果后再检查 32 位上界。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int nextGreaterElement(int n) {
           std::string digits = std::to_string(n);
           int pivot = static_cast<int>(digits.size()) - 2;
           while (pivot >= 0 && digits[pivot] >= digits[pivot + 1]) {
               --pivot;
           }
           if (pivot < 0) return -1;

           int greater = static_cast<int>(digits.size()) - 1;
           while (digits[greater] <= digits[pivot]) --greater;
           std::swap(digits[pivot], digits[greater]);
           std::reverse(digits.begin() + pivot + 1, digits.end());

           long long value = std::stoll(digits);
           return value > INT_MAX ? -1 : static_cast<int>(value);
       }
   };

代码分析
--------

后缀原本按非递增排列，交换后将它升序能使结果在所有更大排列中最小；没有枢轴则不存在更大排列。所有数字只重排不增删，时间复杂度为 ``O(d)``，额外空间复杂度为 ``O(d)``，其中 ``d`` 为位数。
