0093. Restore IP Addresses
==========================

题目信息
--------

:题号: 0093
:难度: Medium
:主题: 字符串、回溯、固定分段、长度剪枝
:原题: `LeetCode 0093 <https://leetcode.com/problems/restore-ip-addresses/>`_
:重点: 从枚举三个分隔点，推导到按段搜索并利用剩余长度提前剪枝

题目重述
--------

给定只包含数字的字符串 ``s``，在不改变字符顺序、不删除字符的前提下插入三个点，返回所有可能的
合法 IPv4 地址。

每个地址必须恰好包含四段。每段长度为 1 到 3，数值位于 ``0..255``；单独的 ``0`` 合法，长度大于
1 的段不能以 ``0`` 开头。四段必须完整使用原字符串中的全部字符，答案顺序不限。

约束为 ``1 <= s.length <= 20``。

自建示例
--------

.. code-block:: text

   输入：s = "11211"
   输出：["1.1.2.11", "1.1.21.1", "1.12.1.1", "11.2.1.1"]

字符串长度为 5，因此四段中恰有一段长度为 2。四种放置方式得到的段都合法。

.. code-block:: text

   输入：s = "00101"
   输出：["0.0.10.1"]

``00``、``01`` 都有前导零，只有 ``0 | 0 | 10 | 1`` 合法。

.. code-block:: text

   输入：s = "1234567890123"
   输出：[]

四段最多容纳 12 个字符，长度为 13 时不可能构成 IPv4 地址。

C++ 实现
--------

.. code-block:: cpp

   #include <array>
   #include <string>
   #include <vector>

   class Solution {
   private:
       bool validSegment(const std::string& s, int start, int length) {
           if (length > 1 && s[start] == '0') {
               return false;
           }

           int value = 0;
           for (int offset = 0; offset < length; ++offset) {
               value = value * 10 + s[start + offset] - '0';
           }
           return value <= 255;
       }

       std::string buildAddress(const std::array<std::string, 4>& parts) {
           return parts[0] + "." + parts[1] + "." + parts[2] + "." + parts[3];
       }

       std::vector<std::string> enumerateLengths(const std::string& s) {
           std::vector<std::string> result;
           int n = static_cast<int>(s.size());

           for (int first = 1; first <= 3; ++first) {
               for (int second = 1; second <= 3; ++second) {
                   for (int third = 1; third <= 3; ++third) {
                       int fourth = n - first - second - third;
                       if (fourth < 1 || fourth > 3) {
                           continue;
                       }

                       int second_start = first;
                       int third_start = first + second;
                       int fourth_start = first + second + third;

                       if (!validSegment(s, 0, first) ||
                           !validSegment(s, second_start, second) ||
                           !validSegment(s, third_start, third) ||
                           !validSegment(s, fourth_start, fourth)) {
                           continue;
                       }

                       result.push_back(
                           s.substr(0, first) + "." +
                           s.substr(second_start, second) + "." +
                           s.substr(third_start, third) + "." +
                           s.substr(fourth_start, fourth));
                   }
               }
           }
           return result;
       }

       void basicDfs(const std::string& s, int index, int depth,
                     std::array<std::string, 4>& parts,
                     std::vector<std::string>& result) {
           if (depth == 4) {
               if (index == static_cast<int>(s.size())) {
                   result.push_back(buildAddress(parts));
               }
               return;
           }

           for (int length = 1;
                length <= 3 && index + length <= static_cast<int>(s.size());
                ++length) {
               if (!validSegment(s, index, length)) {
                   continue;
               }

               parts[depth] = s.substr(index, length);
               basicDfs(s, index + length, depth + 1, parts, result);
           }
       }

       void prunedDfs(const std::string& s, int index, int depth,
                      std::array<std::string, 4>& parts,
                      std::vector<std::string>& result) {
           int segments_left = 4 - depth;
           int chars_left = static_cast<int>(s.size()) - index;

           if (chars_left < segments_left || chars_left > 3 * segments_left) {
               return;
           }
           if (depth == 4) {
               result.push_back(buildAddress(parts));
               return;
           }

           int value = 0;
           for (int length = 1;
                length <= 3 && index + length <= static_cast<int>(s.size());
                ++length) {
               if (length > 1 && s[index] == '0') {
                   break;
               }

               value = value * 10 + s[index + length - 1] - '0';
               if (value > 255) {
                   break;
               }

               parts[depth] = s.substr(index, length);
               prunedDfs(s, index + length, depth + 1, parts, result);
           }
       }

   public:
       std::vector<std::string> restoreIpAddresses(std::string s) {
           std::vector<std::string> result;
           std::array<std::string, 4> parts;
           prunedDfs(s, 0, 0, parts, result);
           return result;
       }
   };

题解
----

分隔点枚举
~~~~~~~~~~

地址由四段组成，任意答案都可唯一表示为四个段长 ``a,b,c,d``。每个段长只能取 1、2、3，因此先枚举
前三段长度，第四段由总长度确定：

.. code-block:: text

   d = n - a - b - c

只有 ``1 <= d <= 3`` 时才继续验证四段。该方法直接展示了问题的有限搜索空间，但每组段长都要重复
计算起点、截取子串和验证四段。

合法段判定
~~~~~~~~~~

每段同时受两个条件限制。长度大于 1 且首字符为 ``0`` 时，段具有前导零；否则按十进制累积数值，
最终必须不超过 255。

.. code-block:: text

   value = value * 10 + digit

段长最多为 3，不需要通用整数解析，也不存在溢出风险。

回溯状态
~~~~~~~~

``dfs(index, depth)`` 表示前 ``index`` 个字符已经组成 ``depth`` 个合法段。下一步只需从当前位置选择
1 到 3 个字符作为新段：

.. code-block:: text

   index  -> 下一段起点
   depth  -> 已完成段数
   parts  -> 已选择的段

字符顺序固定，下一段起点由上一段终点唯一决定，因此不需要访问标记。深度达到 4 时，只有
``index == s.size()`` 才能提交答案。

剩余长度剪枝
~~~~~~~~~~~~

设剩余段数为 ``segments_left``，剩余字符数为 ``chars_left``。每段至少使用 1 个字符、至多使用 3 个
字符，因此可行状态必须满足：

.. code-block:: text

   segments_left <= chars_left <= 3 * segments_left

该条件在递归入口统一检查。字符串少于 4 位或多于 12 位时，根状态立即失败；搜索过程中字符过多或
过少的分支也会提前停止。

增量构造
~~~~~~~~

剪枝版本在枚举段长时同步累积数值。当前段首字符为 ``0`` 时，只允许长度 1；尝试更长段必然产生
前导零，因此直接结束本层循环。数值超过 255 后，追加更多数字只会使数值更大，同样可以结束循环。

.. code-block:: text

   首字符为 0：只保留 "0"
   当前值 > 255：更长候选全部非法

这样无需对每个候选重新从头扫描字符。

路径唯一性
~~~~~~~~~~

任意合法地址都有唯一的四段长度序列，回溯会沿该序列选择四次，因此不会遗漏。两条不同路径首次
选择不同段长时，对应的点位置已经不同，所以不会生成同一地址。每段在加入路径前已验证，深度 4
又由剩余长度条件保证没有未消费字符，因此提交的字符串一定合法。

复杂度
~~~~~~

IPv4 固定为四段，每层最多尝试三个长度，搜索树规模至多 ``O(3^4)``，可视为常数；构造输出仍需
与答案数量成正比。递归深度和路径均固定为 4，除返回结果外额外空间为 ``O(1)``。
