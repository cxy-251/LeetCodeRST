0551. Student Attendance Record I
=================================

题目信息
--------

:题号: 0551
:难度: Easy
:主题: 出勤字符串、缺席次数、连续迟到、资格判定
:原题: `LeetCode 0551 <https://leetcode.com/problems/student-attendance-record-i/>`_
:重点: A 总数必须少于 2、不能出现连续三个 L、P 不影响限制、判断给定记录是否可获奖

题目重述
--------

给定一个学生的出勤记录字符串 ``s``，其中 ``'A'`` 表示缺席、``'L'`` 表示迟到、``'P'`` 表示正常出勤。若该记录中缺席总次数少于 ``2``，并且从未出现连续 ``3`` 天或更多天迟到，则学生可以获得出勤奖励。

判断给定记录是否满足这两个条件并返回布尔值。迟到次数可以很多，只要任意连续段长度不超过 ``2``；缺席字符不要求连续，所有 ``A`` 都要计入总数。

自建示例
--------

满足两个条件：

.. code-block:: text

   输入：s = "PLALP"
   输出：true
   解释：记录中只有一次缺席，也没有连续三个迟到。

连续迟到过多：

.. code-block:: text

   输入：s = "LALLL"
   输出：false
   解释：虽然只有一次缺席，但末尾出现连续三个 L。

同时维护缺席总数和迟到后缀
--------------------------

扫描记录时累计 ``A`` 的总数，并用 ``late`` 表示当前连续 ``L`` 的长度；遇到 ``P`` 或 ``A`` 就把连续迟到长度清零。任意时刻缺席达到 2 或连续迟到达到 3，都可以立即判定不合格。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       bool checkRecord(std::string s) {
           int absent = 0;
           int late = 0;
           for (char character : s) {
               if (character == 'A') {
                   if (++absent >= 2) return false;
                   late = 0;
               } else if (character == 'L') {
                   if (++late >= 3) return false;
               } else {
                   late = 0;
               }
           }
           return true;
       }
   };

代码分析
--------

缺席限制依赖全局计数，迟到限制只依赖当前连续后缀；两个状态合起来完整覆盖合法性条件。每个字符只处理一次，时间复杂度为 ``O(n)``，额外空间复杂度为 ``O(1)``。
