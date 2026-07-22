0165. Compare Version Numbers
=============================

题目信息
--------

:题号: 0165
:难度: Medium
:主题: 字符串、双指针、数字段解析
:原题: `LeetCode 0165 <https://leetcode.com/problems/compare-version-numbers/>`_
:教学重点: 逐段比较、前导零、缺失段视为零

题目重述
--------

按点号分段比较两个版本号，忽略修订号前导零与末尾零段。

自建示例
--------

.. code-block:: text

   "1.01" 与 "1.001" -> 0
   "1.0" 与 "1.0.0" -> 0
   "0.1" 与 "1.1" -> -1

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
~~~~~~~

两个指针分别读取到下一个点号，将十进制段累积成整数。前导零在数值累积中自然消失。

长度不同如何比较
~~~~~~~~

循环在任一字符串仍有段时继续；已经结束的一侧由 ``nextPart`` 返回 0，因此缺失尾段等价于零。

复杂度来源
~~~~~

每个字符读取一次，时间 ``O(n+m)``、额外空间 ``O(1)``。
