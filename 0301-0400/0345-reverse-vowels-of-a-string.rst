0345. Reverse Vowels of a String
================================

题目信息
--------

:题号: 0345
:难度: Easy
:主题: 字符串、元音位置、大小写、局部反转
:原题: `LeetCode 0345 <https://leetcode.com/problems/reverse-vowels-of-a-string/>`_
:重点: 元音包含大小写 a/e/i/o/u、只反转元音出现顺序、所有非元音字符位置保持不变

题目重述
--------

给定字符串 ``s``，找出其中所有元音字符，并把这些元音按照出现顺序整体反转后放回原来的元音位置；其他字符必须继续留在原下标。元音包括小写和大写的 ``a``、``e``、``i``、``o``、``u``。

``s`` 的长度位于 ``[1, 3 * 10^5]``，由可打印 ASCII 字符组成，因此可能包含字母、数字、空格和标点。相同元音可以出现多次；若字符串中少于两个元音，返回值与输入相同。

自建示例
--------

同时包含大小写元音和标点：

.. code-block:: text

   输入：s = "aA-bE"
   输出："EA-ba"
   解释：元音序列为 a、A、E，反转后为 E、A、a；连字符和字母 b 的位置保持不变。

没有元音：

.. code-block:: text

   输入：s = "rhythm"
   输出："rhythm"
   解释：没有字符需要交换，因此字符串保持原样。

只让两个指针停在元音上
------------------------

维护字符串两端的 ``left``、``right``。左指针跳过非元音，右指针从右向左跳过非元音；当两者都停在元音上时交换，再同时向内移动。非元音从未参与交换，因此其下标位置保持不变，而元音序列被从两端逐对反转。

判断元音时同时接受大小写五种元音，不能只按小写字符判断；两个指针相遇后，所有元音位置都已处理。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       bool isVowel(char c) {
           return std::string("aeiouAEIOU").find(c)
                  != std::string::npos;
       }

   public:
       std::string reverseVowels(std::string s) {
           int left = 0;
           int right = static_cast<int>(s.size()) - 1;
           while (left < right) {
               while (left < right && !isVowel(s[left])) ++left;
               while (left < right && !isVowel(s[right])) --right;
               if (left < right) {
                   std::swap(s[left++], s[right--]);
               }
           }
           return s;
       }
   };

代码分析
--------

每个指针只向内移动，非元音只被检查而不被改写；交换次数等于元音位置数量的一半。使用固定长度的元音集合判断仍是常数成本，时间复杂度为 ``O(n)``，额外空间为 ``O(1)``（不计返回字符串）。
