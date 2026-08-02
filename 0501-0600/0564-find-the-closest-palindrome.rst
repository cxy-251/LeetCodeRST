0564. Find the Closest Palindrome
================================

题目信息
--------

:题号: 0564
:难度: Hard
:主题: 十进制字符串、回文整数、最近距离、并列规则
:原题: `LeetCode 0564 <https://leetcode.com/problems/find-the-closest-palindrome/>`_
:重点: 不能返回原数本身、比较绝对差、距离相同取较小整数、结果仍以字符串返回

题目重述
--------

给定一个表示正整数的字符串 ``n``，寻找与该整数绝对差最小的另一个回文整数，并以字符串形式返回。

候选回文数不能等于 ``n`` 本身。若两个不同回文数与 ``n`` 的距离相同，返回数值较小的那个。输入不含前导零，数值位于 ``[1, 10^18 - 1]``；回文整数的十进制表示从左到右与从右到左相同。

自建示例
--------

较大的回文更接近：

.. code-block:: text

   输入：n = "128"
   输出："131"
   解释：131 与 128 相差 3，而较近的较小回文 121 相差 7。

距离并列时选择较小值：

.. code-block:: text

   输入：n = "10"
   输出："9"
   解释：回文 9 和 11 都与 10 相差 1，按规则返回较小的 9。

只需比较前缀变化产生的邻近候选
------------------------------

回文数的高半段决定低半段。保留 ``n`` 的前半部分，分别将它减 1、保持不变、加 1 后镜像，就得到最接近的同位数回文候选；另外加入 ``99...9`` 和 ``100...001``，覆盖位数减少或增加的边界。用集合去重，并排除等于原数的候选。

比较时先看与原数的绝对差，差值相等则取数值更小者。所有候选都用整数比较，最后再转回字符串。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       long long makePalindrome(long long prefix, int length) {
           std::string left = std::to_string(prefix);
           std::string result = left;
           int begin = static_cast<int>(left.size()) -
                       (length % 2 == 1 ? 2 : 1);
           for (int i = begin; i >= 0; --i) result.push_back(left[i]);
           return std::stoll(result);
       }

   public:
       std::string nearestPalindromic(std::string n) {
           int length = static_cast<int>(n.size());
           long long value = std::stoll(n);
           long long power = 1;
           for (int i = 0; i < length; ++i) power *= 10;

           std::set<long long> candidates;
           candidates.insert(power + 1);
           candidates.insert(power / 10 - 1);
           int halfLength = (length + 1) / 2;
           long long prefix = std::stoll(n.substr(0, halfLength));
           for (long long delta = -1; delta <= 1; ++delta) {
               candidates.insert(makePalindrome(prefix + delta, length));
           }

           long long answer = -1;
           for (long long candidate : candidates) {
               if (candidate == value || candidate < 0) continue;
               if (answer == -1 ||
                   std::llabs(candidate - value) <
                       std::llabs(answer - value) ||
                   (std::llabs(candidate - value) ==
                        std::llabs(answer - value) &&
                    candidate < answer)) {
                   answer = candidate;
               }
           }
           return std::to_string(answer);
       }
   };

代码分析
--------

同位数回文只会随前缀的相邻变化跨过原数附近，两个位数边界候选补足了前缀借位或进位导致的长度变化；因此候选集合覆盖最近回文。排除原数后按距离和数值双重规则选择，候选数量为常数，时间复杂度为 ``O(|n|)``，额外空间复杂度为 ``O(|n|)``。
