1585. Check If String Is Transformable With Substring Sort Operations
====================================================================

题目信息
--------

:题号: 1585
:难度: Hard
:主题: 字符串、贪心、位置队列
:原题: `LeetCode 1585 <https://leetcode.com/problems/check-if-string-is-transformable-with-substring-sort-operations/>`_
:重点: 每次可把任意连续子串按升序排序；较大数字可被较小数字越过，但较小数字不能越过仍在前方的更小数字

题目重述
--------

给定长度相同的数字字符串 ``s`` 和 ``t``。一次操作可以选择 ``s`` 的任意非空连续子串，并把该子串中的字符按非递减顺序排序。

可以执行任意次数操作。请判断是否能够把 ``s`` 变成 ``t``。

``1 <= s.length == t.length <= 10^5``，两个字符串只包含数字字符。

自建示例
--------

排序整个字符串可以直接得到目标：

.. code-block:: text

   输入：s = "845", t = "458"
   输出：true
   解释：把整个字符串按升序排序即可。

升序操作不能把较大数字移到较小数字前方：

.. code-block:: text

   输入：s = "12", t = "21"
   输出：false
   解释：任何子串升序排序都无法把已经有序的 12 变成 21。