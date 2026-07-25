1997. First Day Where You Have Been in All the Rooms
===================================================

题目信息
--------

:题号: 1997
:难度: Medium
:主题: 动态规划、前缀状态
:原题: `LeetCode 1997 <https://leetcode.com/problems/first-day-where-you-have-been-in-all-the-rooms/>`_
:重点: 某房间访问奇数次时跳到 ``nextVisit[i]``，偶数次时前往下一房间

题目重述
--------

第 0 天访问房间 0。当天访问房间 ``i`` 后，若它累计被访问奇数次，次日去 ``nextVisit[i]``；若为偶数次，次日去 ``(i+1) mod n``。返回首次访问全部房间的天数并取模。

自建示例
--------

.. code-block:: text

   输入：nextVisit = [0,0]
   输出：2
   解释：访问顺序为房间 0、0、1，第 2 天首次到达全部房间。

.. code-block:: text

   输入：nextVisit = [0,0,1]
   输出：6
   解释：访问顺序为 0、0、1、0、0、1、2。
