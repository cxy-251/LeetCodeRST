0299. Bulls and Cows
====================

题目信息
--------

:题号: 0299
:难度: Medium
:主题: 数字字符串、位置匹配、重复数字计数
:原题: `LeetCode 0299 <https://leetcode.com/problems/bulls-and-cows/>`_
:重点: 数字和位置都相同计为 bull、数字相同但位置不同计为 cow、每个字符位置最多参与一次匹配

题目重述
--------

给定两个等长的数字字符串 ``secret`` 和 ``guess``。逐位比较时，数字相同且位置也相同的字符称为 bull；排除所有 bull 后，如果 ``guess`` 中某个数字还能与 ``secret`` 中不同位置的同值数字配对，则该配对称为 cow。

每个字符位置最多只能被匹配一次，因此重复数字的 cow 数量取决于双方未同位匹配部分中该数字出现次数的较小值。返回格式固定为 ``"xAyB"``，其中 ``x`` 是 bull 数量，``y`` 是 cow 数量。

两个字符串长度相同且位于 ``[1, 1000]``，只包含字符 ``'0'`` 到 ``'9'``，允许出现重复数字。函数不需要返回哪些位置构成匹配。

自建示例
--------

除一个同位数字外，其余数字都在错误位置：

.. code-block:: text

   输入：secret = "2210"，guess = "1202"
   输出："1A3B"
   解释：第二位的 2 是一个 bull；排除它后，剩余的 2、1、0 都能在 guess 的不同位置找到一次匹配，因此有三个 cows。

重复猜测不能超过秘密中的剩余数量：

.. code-block:: text

   输入：secret = "3305"，guess = "3333"
   输出："2A0B"
   解释：前两个 3 在相同位置形成两个 bulls；secret 的其余位置没有 3，所以后两个猜测 3 不能再形成 cow。

先匹配位置，再匹配剩余频次
------------------------

第一遍只处理同位置同数字的字符，计入 ``bulls``，这些位置不能再次参与 cow。
对其余位置分别统计 ``secret`` 与 ``guess`` 中每个数字的出现次数；数字 ``d`` 能形成的 cow 数量就是
两边剩余频次的较小值，十个数字的这些最小值相加。

分两步是关键。若先把所有相同数字都按频次配对，会把本应计为 bull 的位置也算进 cow，
或者在重复数字场景中超额匹配。

正确性说明
----------

同位相等的位置显然是 bulls，先排除它们后，剩余两串中的任意匹配都必须位置不同。
固定数字 ``d``，秘密串剩余部分最多提供 ``secret_count[d]`` 个，猜测串最多需要
``guess_count[d]`` 个，且每次匹配只消耗双方一个位置，因此可配对数量恰为两者最小值。
十个数字互不冲突，求和得到准确 cows。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::string getHint(const std::string& secret,
                           const std::string& guess) {
           int bulls = 0;
           int secret_count[10] = {};
           int guess_count[10] = {};

           for (int i = 0; i < static_cast<int>(secret.size()); ++i) {
               if (secret[i] == guess[i]) {
                   ++bulls;
               } else {
                   ++secret_count[secret[i] - '0'];
                   ++guess_count[guess[i] - '0'];
               }
           }

           int cows = 0;
           for (int digit = 0; digit < 10; ++digit) {
               cows += std::min(secret_count[digit], guess_count[digit]);
           }
           return std::to_string(bulls) + "A" +
                  std::to_string(cows) + "B";
       }
   };

代码分析
--------

扫描字符串并检查 10 个频次桶，时间复杂度为 ``O(n)``，额外空间为 ``O(1)``。
字符串长度由题目保证相同；输出按固定 ``xAyB`` 格式拼接，不依赖匹配位置的具体顺序。
