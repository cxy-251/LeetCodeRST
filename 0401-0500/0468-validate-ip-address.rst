0468. Validate IP Address
=========================

题目信息
--------

:题号: 0468
:难度: Medium
:主题: IPv4、IPv6、分隔字段、严格格式校验
:原题: `LeetCode 0468 <https://leetcode.com/problems/validate-ip-address/>`_
:重点: IPv4 恰好四个十进制段且无前导零、IPv6 恰好八个十六进制段、不支持压缩写法、非法时返回 ``Neither``

题目重述
--------

给定字符串 ``queryIP``，判断它是否是合法 IPv4 地址、合法 IPv6 地址，或两者都不是，并分别返回 ``"IPv4"``、``"IPv6"`` 或 ``"Neither"``。

IPv4 必须由四个用句点分隔的十进制段组成。每段只能含数字，数值位于 ``0..255``；除单独的 ``0`` 外不能有前导零，也不能有正负号或空段。

IPv6 必须由八个用冒号分隔的字段组成。每字段长度为 1 至 4，只能使用十六进制字符 ``0..9``、``a..f``、``A..F``；允许前导零，但不接受 ``::`` 等省略写法，也不能有空字段。输入长度位于 ``[1, 20]``，不允许额外空格。

自建示例
--------

合法 IPv4 与 IPv6：

.. code-block:: text

   输入：queryIP = "172.16.0.1"
   输出："IPv4"
   解释：四段均为无前导零的 0..255 十进制整数。

   输入：queryIP = "2001:db8:0:0:1:0:0:1"
   输出："IPv6"
   解释：地址恰好有八个合法十六进制字段。

IPv4 前导零非法：

.. code-block:: text

   输入：queryIP = "01.2.3.4"
   输出："Neither"
   解释：第一段 01 含有不允许的前导零。

分隔符、字符集和数值范围分别校验
----------------------------------

IPv4 和 IPv6 的规则不同，先按出现的分隔符选择对应校验器。IPv4 必须得到恰好四个非空十进制段，单段长度超过 1 时不能以 0 开头，并在逐位构造时检查不超过 255；IPv6 必须得到恰好八个非空字段，每个字段长度为 1 到 4，且每个字符都属于十六进制字符集。

不把字符串直接交给数值转换函数，可以同时控制空段、前导零、非法字符和字段数量，避免转换函数对边界格式作出宽松解释。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       bool isIPv4(const std::string& s) {
           int parts = 0;
           int begin = 0;
           for (int i = 0; i <= static_cast<int>(s.size()); ++i) {
               if (i < static_cast<int>(s.size()) && s[i] != '.') {
                   if (!std::isdigit(static_cast<unsigned char>(s[i]))) {
                       return false;
                   }
                   continue;
               }

               if (i == begin || ++parts > 4) return false;
               if (i - begin > 1 && s[begin] == '0') return false;
               if (i - begin > 3) return false;

               int value = 0;
               for (int j = begin; j < i; ++j) {
                   value = value * 10 + (s[j] - '0');
               }
               if (value > 255) return false;
               begin = i + 1;
           }
           return parts == 4;
       }

       bool isHex(char c) {
           return std::isdigit(static_cast<unsigned char>(c)) ||
                  (c >= 'a' && c <= 'f') ||
                  (c >= 'A' && c <= 'F');
       }

       bool isIPv6(const std::string& s) {
           int fields = 0;
           int begin = 0;
           for (int i = 0; i <= static_cast<int>(s.size()); ++i) {
               if (i < static_cast<int>(s.size()) && s[i] != ':') {
                   if (!isHex(s[i])) return false;
                   continue;
               }
               if (i == begin || i - begin > 4 || ++fields > 8) {
                   return false;
               }
               begin = i + 1;
           }
           return fields == 8;
       }

   public:
       std::string validIPAddress(std::string queryIP) {
           if (queryIP.find('.') != std::string::npos) {
               return isIPv4(queryIP) ? "IPv4" : "Neither";
           }
           if (queryIP.find(':') != std::string::npos) {
               return isIPv6(queryIP) ? "IPv6" : "Neither";
           }
           return "Neither";
       }
   };

代码分析
--------

IPv4 的循环在字符串末尾额外处理最后一段，因此尾部句点会形成空段并被拒绝；IPv6 同理拒绝 ``::`` 和首尾冒号。每个字符只扫描常数次，时间复杂度为 ``O(|queryIP|)``，额外空间复杂度为 ``O(1)``。
