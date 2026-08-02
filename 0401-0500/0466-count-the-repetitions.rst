0466. Count The Repetitions
===========================

题目信息
--------

:题号: 0466
:难度: Hard
:主题: 重复字符串、子序列、重复块、最大次数
:原题: `LeetCode 0466 <https://leetcode.com/problems/count-the-repetitions/>`_
:重点: ``[s,n]`` 表示字符串重复拼接、目标通过删除字符形成、字符顺序必须保留、返回完整目标块数量

题目重述
--------

定义 ``[s, n]`` 为把字符串 ``s`` 连续拼接 ``n`` 次。给定 ``s1``、``n1``、``s2``、``n2``，令 ``S1 = [s1, n1]``、``S2 = [s2, n2]``。返回最大的整数 ``m``，使 ``[S2, m]`` 是 ``S1`` 的子序列。

子序列可以从 ``S1`` 中删除任意字符，但保留字符的相对顺序不能改变；不要求字符连续。``s1`` 和 ``s2`` 长度位于 ``[1, 100]``，只包含小写英文字母；``n1`` 和 ``n2`` 位于 ``[1, 10^6]``。返回值表示能够完整匹配多少个 ``S2`` 块，不能把不足一整块的剩余匹配计入。

自建示例
--------

每个源块都贡献一个目标子序列：

.. code-block:: text

   输入：s1 = "abc"，n1 = 3，s2 = "ac"，n2 = 1
   输出：3
   解释：S1 为 abcabcabc，可以从每个 abc 中按顺序选出 ac，因此能够形成三个完整的 S2。

目标含源串中不存在的字符：

.. code-block:: text

   输入：s1 = "ab"，n1 = 5，s2 = "ac"，n2 = 1
   输出：0
   解释：S1 中没有字符 c，连一个完整的 ac 都无法形成。

在每个源块边界寻找相同状态
--------------------------

扫描一个 ``s1`` 块时，顺次匹配 ``s2`` 的字符；每次指针走过 ``s2`` 尾部，就完成一个目标块并从 ``s2[0]`` 重新开始。一个源块扫描结束时，状态只由“下次要匹配 ``s2`` 的哪个位置”和“已经完成了多少个目标块”组成。

状态位置只有 ``|s2|`` 种。若在两个不同的源块边界再次看到同一个位置，之间的源块序列会重复，完成目标块的增量也固定，可以把剩余的 ``s1`` 块按周期整段跳过。最后用能够匹配出的 ``s2`` 块数除以 ``n2``，得到完整 ``[s2,n2]`` 的数量。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int getMaxRepetitions(std::string s1, int n1,
                             std::string s2, int n2) {
           std::vector<int> firstBlock(s2.size(), -1);
           std::vector<long long> firstCompleted(s2.size(), 0);
           int position = 0;
           int block = 0;
           long long completed = 0;

           while (block < n1) {
               for (char character : s1) {
                   if (character != s2[position]) continue;
                   ++position;
                   if (position == static_cast<int>(s2.size())) {
                       position = 0;
                       ++completed;
                   }
               }
               ++block;

               if (firstBlock[position] == -1) {
                   firstBlock[position] = block;
                   firstCompleted[position] = completed;
               } else {
                   int cycleBlocks = block - firstBlock[position];
                   long long cycleCompleted =
                       completed - firstCompleted[position];
                   long long cycles = (n1 - block) / cycleBlocks;
                   block += static_cast<int>(cycles * cycleBlocks);
                   completed += cycles * cycleCompleted;
               }
           }
           return static_cast<int>(completed / n2);
       }
   };

代码分析
--------

只在源块边界记录状态，避免把周期切在一个 ``s1`` 块内部；再次到达同一匹配位置时，周期内的完成数量可整体相加，覆盖 ``n1`` 达到百万级的情况。每个状态首次记录一次，之后至多处理剩余周期外的块，时间复杂度为 ``O(|s1| * |s2|)`` 的状态扫描量，额外空间复杂度为 ``O(|s2|)``。
