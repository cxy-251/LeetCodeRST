0520. Detect Capital
====================

题目信息
--------

:题号: 0520
:难度: Easy
:主题: 英文字母、大小写模式、单词校验
:原题: `LeetCode 0520 <https://leetcode.com/problems/detect-capital/>`_
:重点: 合法模式只有全大写、全小写或仅首字母大写，单字母单词也需按这三类判断

题目重述
--------

给定一个只包含大小写英文字母的非空单词 ``word``，判断它的大小写使用是否正确。正确情况只有三种：所有字母都是大写；所有字母都是小写；仅第一个字母大写，其余字母全部小写。

只要单词不属于上述任一模式就返回 ``false``。长度为 1 的单词无论是大写还是小写，都满足至少一种合法模式。

自建示例
--------

三种大小写模式中的两种：

.. code-block:: text

   输入：word = "NASA"
   输出：true
   解释：所有字母均为大写。

.. code-block:: text

   输入：word = "Chat"
   输出：true
   解释：只有首字母大写，其余字母均为小写。

混合模式不合法：

.. code-block:: text

   输入：word = "cODE"
   输出：false
   解释：首字母小写但后续字母大写，不属于三种允许模式。

统计大写数量判断三种模式
------------------------

全大写对应大写字母数量等于单词长度，全小写对应数量为 0，仅首字母大写对应数量为 1 且首字母确实是大写。三种条件覆盖题目允许的全部形式，长度为 1 时也会自然落入前两类之一。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       bool detectCapitalUse(std::string word) {
           int uppercase = 0;
           for (char character : word) {
               if (std::isupper(static_cast<unsigned char>(character))) {
                   ++uppercase;
               }
           }
           return uppercase == 0 ||
                  uppercase == static_cast<int>(word.size()) ||
                  (uppercase == 1 &&
                   std::isupper(static_cast<unsigned char>(word[0])));
       }
   };

代码分析
--------

大写数量为 1 时再检查位置，排除了 ``aBc`` 这类中间大写；数量为 0 或全长时位置不再影响合法性。每个字符扫描一次，时间复杂度为 ``O(n)``，额外空间复杂度为 ``O(1)``。
