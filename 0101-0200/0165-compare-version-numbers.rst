0165. Compare Version Numbers
=============================

题目信息
--------

:题号: 0165
:难度: Medium
:主题: 字符串、双指针、数字段解析
:原题: `LeetCode 0165 <https://leetcode.com/problems/compare-version-numbers/>`_
:重点: 点号分段、前导零忽略、缺失修订号视为零、三值返回

题目重述
--------

给定两个合法版本字符串 ``version1`` 和 ``version2``。每个版本由一个或多个只含数字的修订号组成，相邻修订号之间用点号分隔。按从左到右的顺序，把对应修订号解释为十进制整数后逐段比较；修订号中的前导零不影响数值。

若一侧已经没有更多修订号，则其后缺失的修订号都视为 ``0``。``version1`` 较小时返回 ``-1``，较大时返回 ``1``，两者等价时返回 ``0``。两个字符串长度均在 ``1..500`` 范围内，每个修订号都能用 32 位整数表示。

自建示例
--------

.. code-block:: text

   输入：version1 = "3.10", version2 = "3.9.8"
   输出：1
   解释：第一段同为 3，第二段 10 大于 9，因此无需比较后续修订号。

.. code-block:: text

   输入：version1 = "4.02.0.0", version2 = "4.2"
   输出：0
   解释：前导零被忽略，02 等于 2；第一个版本多出的两个尾段都是 0。

C++ 实现
--------

.. code-block:: cpp

   #include <string>

   class Solution {
   private:
       long long nextPart(const std::string& version, int& index) {
           long long value = 0;
           while (index < static_cast<int>(version.size()) && version[index] != '.') {
               value = value * 10 + (version[index] - '0');
               ++index;
           }
           if (index < static_cast<int>(version.size())) ++index;
           return value;
       }

   public:
       int compareVersion(std::string version1, std::string version2) {
           int first = 0;
           int second = 0;
           while (first < static_cast<int>(version1.size()) ||
                  second < static_cast<int>(version2.size())) {
               long long left = nextPart(version1, first);
               long long right = nextPart(version2, second);
               if (left < right) return -1;
               if (left > right) return 1;
           }
           return 0;
       }
   };

题解
----

修订号如何解析
~~~~~~~~~~~~~~

两个指针分别读取到下一个点号，将十进制段累积成整数。前导零在数值累积中自然消失。

长度不同如何比较
~~~~~~~~~~~~~~~~

循环在任一字符串仍有段时继续；已经结束的一侧由 ``nextPart`` 返回 0，因此缺失尾段等价于零。

复杂度来源
~~~~~~~~~~

每个字符读取一次，时间 ``O(n+m)``、额外空间 ``O(1)``。