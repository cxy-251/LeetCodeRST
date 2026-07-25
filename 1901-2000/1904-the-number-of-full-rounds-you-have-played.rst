1904. The Number of Full Rounds You Have Played
===============================================

题目信息
--------

:题号: 1904
:难度: Medium
:主题: 时间计算、数学
:原题: `LeetCode 1904 <https://leetcode.com/problems/the-number-of-full-rounds-you-have-played/>`_
:重点: 每轮从整刻钟开始并持续 15 分钟，结束时间可能跨越午夜

题目重述
--------

游戏每 15 分钟开始一轮。给定登录和退出时间，返回完整参与的轮数；退出时间早于登录时间时表示跨越午夜。

自建示例
--------

.. code-block:: text

   输入：loginTime = "12:01", logoutTime = "13:00"
   输出：3
   解释：完整参与 12:15、12:30、12:45 开始的三轮。

.. code-block:: text

   输入：loginTime = "23:50", logoutTime = "00:20"
   输出：1
   解释：跨午夜后只完整参与 00:00 至 00:15 的一轮。
