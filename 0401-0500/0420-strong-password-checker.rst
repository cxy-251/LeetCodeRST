0420. Strong Password Checker
=============================

题目信息
--------

:题号: 0420
:难度: Hard
:主题: 密码规则、插入删除替换、字符类别、连续重复
:原题: `LeetCode 0420 <https://leetcode.com/problems/strong-password-checker/>`_
:重点: 长度必须为 6 至 20、同时包含小写/大写/数字、不能有三个连续相同字符、返回最少编辑次数

题目重述
--------

给定字符串 ``password``，每次操作可以插入一个字符、删除一个字符或把一个字符替换为另一个字符。返回把它变成强密码所需的最少操作次数。

强密码必须同时满足：长度位于 ``[6, 20]``；至少包含一个小写英文字母、一个大写英文字母和一个数字；不能出现三个或更多连续相同字符。输入长度位于 ``[1, 50]``，字符只可能是字母、数字、句点 ``.`` 或感叹号 ``!``。一次编辑可以同时改善多个规则缺陷，但仍只计作一次操作。

自建示例
--------

只缺少长度：

.. code-block:: text

   输入：password = "Aa1b"
   输出：2
   解释：三种字符类别已经齐全且没有三连字符，但长度只有 4；插入两个适当字符即可达到长度 6，因此最少需要 2 次操作。

字符类别齐全但存在长重复段：

.. code-block:: text

   输入：password = "aaaaaA1"
   输出：1
   解释：长度和字符类别均合格，只需把五个连续 a 中的一个替换成其他字符，即可打断所有三个连续相同字符的情况。

先分离长度、类别和重复段三种缺陷
----------------------------------

统计是否缺少小写、大写、数字三类字符，并把每段连续相同字符长度为 ``len`` 的替换需求记为 ``len / 3``。当长度小于 6 时，插入操作既能补长度，也可能顺便补类别或打断重复，最优次数是 ``max(6-n, missing)``；长度在 6 到 20 之间时，只需在缺少类别和重复段替换之间取较大值。

长度超过 20 时必须先删除 ``n-20`` 个字符。删除应优先作用于 ``len % 3 == 0`` 的重复段：删 1 个就能减少 1 次替换；其次处理余数为 1 的段，删 2 个减少 1 次；剩余删除每 3 个再减少 1 次替换。删除完成后，剩余替换次数与缺少类别数可以由同一批替换操作共同承担，因此还要取二者最大值。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int strongPasswordChecker(std::string password) {
           int n = static_cast<int>(password.size());
           bool lower = false;
           bool upper = false;
           bool digit = false;
           for (char c : password) {
               lower |= c >= 'a' && c <= 'z';
               upper |= c >= 'A' && c <= 'Z';
               digit |= c >= '0' && c <= '9';
           }
           int missing = !lower + !upper + !digit;

           std::vector<int> runs;
           for (int i = 0; i < n;) {
               int j = i;
               while (j < n && password[j] == password[i]) ++j;
               if (j - i >= 3) runs.push_back(j - i);
               i = j;
           }

           int replacements = 0;
           for (int length : runs) replacements += length / 3;
           if (n < 6) return std::max(6 - n, missing);
           if (n <= 20) return std::max(missing, replacements);

           int deletions = n - 20;
           for (int remainder = 0; remainder < 3; ++remainder) {
               for (int& length : runs) {
                   if (deletions == 0 || length % 3 != remainder) {
                       continue;
                   }
                   int need = remainder == 0 ? 1
                           : (remainder == 1 ? 2 : 3);
                   int use = std::min(deletions, need);
                   int before = length / 3;
                   length -= use;
                   deletions -= use;
                   replacements -= before - length / 3;
               }
           }
           replacements -= deletions / 3;
           return (n - 20) + std::max(missing, replacements);
       }
   };

代码分析
--------

删除顺序按“每个删除能节省多少次替换”排序，优先消除最便宜的一次替换；未用于降低替换数的剩余删除仍然必须执行，但不会改变替换需求。短密码分支单独处理插入与类别缺失的重叠收益。设密码长度为 ``n``，扫描和重复段处理为 ``O(n)``，额外空间为 ``O(n)``。
