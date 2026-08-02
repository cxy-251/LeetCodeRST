0402. Remove K Digits
=====================

题目信息
--------

:题号: 0402
:难度: Medium
:主题: 十进制字符串、删除字符、最小数值、前导零
:原题: `LeetCode 0402 <https://leetcode.com/problems/remove-k-digits/>`_
:重点: 必须恰好删除 ``k`` 位、剩余数字保持原顺序、结果去除前导零、空结果表示为 ``0``

题目重述
--------

给定表示非负整数的十进制字符串 ``num`` 和整数 ``k``，从字符串中恰好删除 ``k`` 个数字字符，使剩余字符按原有相对顺序组成的整数尽可能小，并返回该整数的字符串表示。

``num`` 的长度位于 ``[1, 10^5]``，只包含数字，除字符串 ``"0"`` 外不会以 ``0`` 开头；``k`` 位于 ``[0, num.length]``。结果不能含无意义的前导零；若删除后没有字符，或者剩余数值为零，必须返回 ``"0"``。

自建示例
--------

删除较大的高位数字：

.. code-block:: text

   输入：num = "7650281"，k = 3
   输出："281"
   解释：删除 7、6、5 后得到 0281，去除前导零后为 281；不存在更小的合法结果。

剩余字符全部表示零：

.. code-block:: text

   输入：num = "10020"，k = 2
   输出："0"
   解释：删除 1 和 2 后剩下 000，规范化结果必须写成单个字符 "0"。

单调栈保留尽可能小的高位
--------------------------

从左到右构造结果。若当前数字比栈顶小，栈顶作为更高位就会使结果变大；只要还有删除额度，就弹出这样的栈顶，再放入当前数字。弹栈停止后，栈内前缀已经是当前扫描范围能得到的最小前缀。

扫描结束仍有删除额度时，只能从末尾删除，因为前面的字符已经按贪心确定；最后去掉所有前导零，空串或全零结果统一写为 ``"0"``。这保证恰好删除 ``k`` 位，而不是只删除有利于变小的位。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::string removeKdigits(std::string num, int k) {
           std::string stack;
           for (char digit : num) {
               while (k > 0 && !stack.empty()
                      && stack.back() > digit) {
                   stack.pop_back();
                   --k;
               }
               stack.push_back(digit);
           }

           while (k > 0 && !stack.empty()) {
               stack.pop_back();
               --k;
           }

           int first = 0;
           while (first < static_cast<int>(stack.size())
                  && stack[first] == '0') {
               ++first;
           }
           std::string result = stack.substr(first);
           return result.empty() ? "0" : result;
       }
   };

代码分析
--------

在相邻的下降处优先删除左侧较大的数字，是数值比较中最重要的高位决策；每个字符最多入栈、出栈一次，删除额度始终准确递减。先完成删除、再规范化前导零，避免把零误当成可以少删的字符。时间复杂度为 ``O(n)``，额外空间为 ``O(n)``。
