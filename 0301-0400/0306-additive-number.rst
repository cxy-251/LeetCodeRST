0306. Additive Number
=====================

题目信息
--------

:题号: 0306
:难度: Medium
:主题: 数字字符串、序列切分、大整数加法、前导零
:原题: `LeetCode 0306 <https://leetcode.com/problems/additive-number/>`_
:重点: 至少切分为三个数、后项等于前两项之和、数字顺序不变、除单个零外禁止前导零

题目重述
--------

给定只包含十进制数字的非空字符串 ``num``，判断能否在不改变字符顺序的前提下把它完整切分成至少三个非负整数，使第三个数及其后的每个数都等于前面两个数之和。

每个整数必须使用一段连续字符，所有字符都必须被使用。数值 ``0`` 可以由单个字符 ``"0"`` 表示，其他多位整数不能以 ``0`` 开头。``num`` 的长度位于 ``[1, 35]``；切分得到的整数可能超过常见整数类型的范围，因此题目契约不能依赖固定宽度整数一定容纳所有中间值。

自建示例
--------

使用两位数作为序列起点：

.. code-block:: text

   输入：num = "12122436"
   输出：true
   解释：可以完整切分为 12、12、24、36，并且 12+12=24、12+24=36。

前导零使候选切分无效：

.. code-block:: text

   输入：num = "1203"
   输出：false
   解释：切分为 1、2、03 时最后一段具有非法前导零；其他合法切分也无法持续满足相加关系。

枚举前两个数，后面只有一种走法
--------------------------------

加法序列一旦确定前两个数，第三个数就必须是它们的和，第四个数又必须是第二个数与第三个数的和；因此不需要在每一个后续位置继续枚举切分。只枚举第一个数的结束位置和第二个数的结束位置，然后不断计算下一项，并检查它是否恰好匹配当前字符串位置。

不能把每一段直接转成 ``int`` 或 ``long long``：长度 35 的输入可能让前两项或中间和超出固定宽度。将加法改为从末位向前的字符串加法，逐位维护进位，就能比较任意长度的十进制数而不丢失信息。枚举时第一个数和第二个数都必须遵守前导零规则；每个候选至少要留出第三个数。

若下一项与剩余字符串的前缀不同，当前前两个数不可能形成合法序列，可以立刻停止这一组尝试。只有恰好消费完整个字符串，并且实际生成过第三项的候选才返回真。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       std::string addStrings(const std::string& a,
                              const std::string& b) {
           int i = static_cast<int>(a.size()) - 1;
           int j = static_cast<int>(b.size()) - 1;
           int carry = 0;
           std::string result;

           while (i >= 0 || j >= 0 || carry != 0) {
               int digit = carry;
               if (i >= 0) digit += a[i--] - '0';
               if (j >= 0) digit += b[j--] - '0';
               result.push_back(static_cast<char>('0' + digit % 10));
               carry = digit / 10;
           }
           std::reverse(result.begin(), result.end());
           return result;
       }

   public:
       bool isAdditiveNumber(std::string num) {
           int n = static_cast<int>(num.size());
           for (int firstEnd = 1; firstEnd <= n - 2; ++firstEnd) {
               if (num[0] == '0' && firstEnd > 1) break;

               for (int secondEnd = firstEnd + 1;
                    secondEnd <= n - 1; ++secondEnd) {
                   int secondLength = secondEnd - firstEnd;
                   if (num[firstEnd] == '0' && secondLength > 1) break;

                   std::string first = num.substr(0, firstEnd);
                   std::string second = num.substr(firstEnd, secondLength);
                   int pos = secondEnd;
                   int numberCount = 2;

                   while (pos < n) {
                       std::string next = addStrings(first, second);
                       if (num.compare(pos, next.size(), next) != 0) {
                           break;
                       }
                       pos += static_cast<int>(next.size());
                       first = std::move(second);
                       second = std::move(next);
                       ++numberCount;
                   }

                   if (pos == n && numberCount >= 3) return true;
               }
           }
           return false;
       }
   };

代码分析
--------

外层枚举覆盖所有可能的前两段，内层递推不再遗漏任何后续切法，因为加法关系已经唯一决定下一项；前导零检查排除了题目不允许的表示。字符串加法只按数字长度工作，``num.compare`` 同时检查内容和剩余长度。长度只有 35 时，枚举所有起点并重复进行短字符串加法完全可行；额外空间主要是当前序列项和临时结果，按字符串长度计为 ``O(n)``。
