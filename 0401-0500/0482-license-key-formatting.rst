0482. License Key Formatting
============================

题目信息
--------

:题号: 0482
:难度: Easy
:主题: 字母数字字符串、删除连字符、从右分组、大写格式
:原题: `LeetCode 0482 <https://leetcode.com/problems/license-key-formatting/>`_
:重点: 忽略原有连字符、除首组外每组恰好 ``k`` 个字符、首组可短、所有字母转大写

题目重述
--------

给定由英文字母、数字和连字符组成的许可证字符串 ``s``，以及正整数 ``k``。先删除全部原有连字符并把字母转换为大写，再用连字符把字符重新分组。

除第一组外，每组必须恰好包含 ``k`` 个字符；第一组长度可以小于 ``k``，但必须至少为 1。分组方向等价于从字符串末尾向前每 ``k`` 个字符切一组。``s.length`` 位于 ``[1, 10^5]``，``k`` 位于 ``[1, 10^4]``，输入保证至少包含一个字母或数字。

自建示例
--------

首组比其他组短：

.. code-block:: text

   输入：s = "a-bC-dEf-gh"，k = 3
   输出："AB-CDE-FGH"
   解释：删除连字符得到 abcdefgh，从右侧按三字符分组为 ab、cde、fgh，再统一转成大写。

每个字符单独成组：

.. code-block:: text

   输入：s = "2-z"，k = 1
   输出："2-Z"
   解释：删除原连字符后每个字符组成一组，字母 z 转为大写 Z。

清洗后从右侧切分
----------------

先删除所有原有连字符并统一大小写，得到连续字符序列。分组时从末尾向左每次取 ``k`` 个字符，最后剩下的前缀自然成为首组；若总长度能被 ``k`` 整除，首组长度就是 ``k``，不会产生空组。

从左侧按首组长度输出也可以保持顺序，同时避免反复在字符串头部插入导致线性移动。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::string licenseKeyFormatting(std::string s, int k) {
           std::string clean;
           for (char character : s) {
               if (character == '-') continue;
               clean.push_back(static_cast<char>(std::toupper(
                   static_cast<unsigned char>(character))));
           }

           int firstLength = clean.size() % k;
           if (firstLength == 0) firstLength = k;

           std::string result = clean.substr(0, firstLength);
           for (int begin = firstLength;
                begin < static_cast<int>(clean.size()); begin += k) {
               result.push_back('-');
               result.append(clean, begin, k);
           }
           return result;
       }
   };

代码分析
--------

首组长度由除法余数决定，之后每段固定取 ``k`` 个字符，正好对应从右向左分组的结果；原有连字符从未进入 ``clean``，所以不会影响新边界。清洗和生成各扫描一次，时间复杂度为 ``O(|s|)``，额外空间复杂度为 ``O(|s|)``。
