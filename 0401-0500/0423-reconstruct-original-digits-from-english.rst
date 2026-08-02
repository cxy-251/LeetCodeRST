0423. Reconstruct Original Digits from English
===============================================

题目信息
--------

:题号: 0423
:难度: Medium
:主题: 英文数字单词、字符频次、原始数字、多重集合恢复
:原题: `LeetCode 0423 <https://leetcode.com/problems/reconstruct-original-digits-from-english/>`_
:重点: 输入字母来自若干 ``zero`` 至 ``nine`` 的乱序拼接、数字可以重复、结果按数字升序输出

题目重述
--------

给定只包含小写英文字母的字符串 ``s``。它由若干个英文数字单词 ``"zero"``、``"one"``、…、``"nine"`` 的全部字母混合打乱后得到。恢复原来包含的所有数字，并将这些数字按从小到大的顺序连接成字符串返回。

``s.length`` 位于 ``[1, 10^5]``。同一个数字可以出现多次，输入保证能够由完整的英文数字单词组成，不会有多余或缺失字母。返回结果中的每个字符代表一个恢复出的数字，不需要恢复原单词顺序。

自建示例
--------

恢复两个不同数字：

.. code-block:: text

   输入：s = "fviefuro"
   输出："45"
   解释：这些字母可以拆成 four 和 five；结果必须按数字升序写成 45，与字母原来的排列顺序无关。

同一数字重复出现：

.. code-block:: text

   输入：s = "xisxis"
   输出："66"
   解释：字符串由两个 six 的字母组成，因此数字 6 需要在结果中保留两次。

利用只在一个数字单词中出现的字母
----------------------------------

字母 ``z,w,u,x,g`` 分别只出现在 ``zero,two,four,six,eight`` 中，所以可以先确定数字 0、2、4、6、8 的数量。确定这些数字后，再利用 ``o,h,f,s,i`` 的剩余数量依次求出 1、3、5、7、9；每求出一个数字就从总字符频次中扣除对应单词，剩余频次因此仍有明确含义。

最后按数字从 0 到 9 输出数量次数字字符，字母原来的打乱顺序不会影响结果。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::string originalDigits(std::string s) {
           std::array<int, 26> count{};
           for (char c : s) ++count[c - 'a'];
           std::array<int, 10> number{};
           number[0] = count['z' - 'a'];
           number[2] = count['w' - 'a'];
           number[4] = count['u' - 'a'];
           number[6] = count['x' - 'a'];
           number[8] = count['g' - 'a'];
           number[1] = count['o' - 'a']
                     - number[0] - number[2] - number[4];
           number[3] = count['h' - 'a'] - number[8];
           number[5] = count['f' - 'a'] - number[4];
           number[7] = count['s' - 'a'] - number[6];
           number[9] = count['i' - 'a']
                     - number[5] - number[6] - number[8];

           std::string result;
           for (int digit = 0; digit <= 9; ++digit) {
               result.append(number[digit],
                             static_cast<char>('0' + digit));
           }
           return result;
       }
   };

代码分析
--------

唯一字母先锁定偶数数字，后续扣除已确认单词后再恢复其余数字；输入保证可由完整单词组成，因此计算出的数量非负且恰好消耗全部字符。统计和输出均为线性，时间复杂度为 ``O(|s|)``，额外空间为固定的 ``O(1)``（不计返回字符串）。
