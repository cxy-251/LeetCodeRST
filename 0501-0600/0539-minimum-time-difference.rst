0539. Minimum Time Difference
=============================

题目信息
--------

:题号: 0539
:难度: Medium
:主题: 24 小时时间、分钟差、环形边界、重复时刻
:原题: `LeetCode 0539 <https://leetcode.com/problems/minimum-time-difference/>`_
:重点: 时间采用 HH:MM、比较任意两个时刻、跨午夜按环形距离计算、重复时刻差值为 0

题目重述
--------

给定至少两个采用 24 小时制 ``"HH:MM"`` 格式表示的时刻，返回任意两个时刻之间的最小分钟差。

一天按 1440 分钟循环，因此需要同时考虑同一天内的直接差值和跨越午夜的差值。例如 ``23:59`` 与 ``00:01`` 相差 2 分钟。若列表中存在两个相同时刻，答案为 ``0``。

自建示例
--------

最小差值跨越午夜：

.. code-block:: text

   输入：timePoints = ["23:50","00:10","12:00"]
   输出：20
   解释：23:50 到次日 00:10 相差 20 分钟，小于其他时刻对的差值。

存在重复时刻：

.. code-block:: text

   输入：timePoints = ["05:00","18:30","05:00"]
   输出：0
   解释：两次 05:00 表示相同分钟位置。

转换为一天内的分钟并检查环形相邻差
------------------------------------

把 ``HH:MM`` 转为 ``60*HH+MM``，排序后最小的同日差值一定出现在相邻时刻之间；还要比较最后一个时刻绕过午夜到第一个时刻的差值 ``1440-last+first``。转换后重复值会直接产生差值 0。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       int toMinutes(const std::string& time) {
           return std::stoi(time.substr(0, 2)) * 60 +
                  std::stoi(time.substr(3, 2));
       }

   public:
       int findMinDifference(std::vector<std::string>& timePoints) {
           std::vector<int> minutes;
           for (const std::string& time : timePoints) {
               minutes.push_back(toMinutes(time));
           }
           std::sort(minutes.begin(), minutes.end());
           int answer = 1440;
           for (int i = 1; i < static_cast<int>(minutes.size()); ++i) {
               answer = std::min(answer, minutes[i] - minutes[i - 1]);
           }
           answer = std::min(answer,
                             1440 - minutes.back() + minutes.front());
           return answer;
       }
   };

代码分析
--------

圆环上最近的两点要么在排序后的相邻位置，要么是首尾跨午夜的一对；这两类检查覆盖全部可能的最小弧长。时间复杂度为 ``O(n log n)``，额外空间复杂度为 ``O(n)``。
