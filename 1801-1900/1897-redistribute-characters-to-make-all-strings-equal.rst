1897. Redistribute Characters to Make All Strings Equal
======================================================

题目信息
--------

:题号: 1897
:难度: Easy
:主题: 字符串、计数
:原题: `LeetCode 1897 <https://leetcode.com/problems/redistribute-characters-to-make-all-strings-equal/>`_
:重点: 任意移动字符后，每种字符总数必须能被字符串数量整除

题目重述
--------

可以在字符串数组之间任意移动字符。判断能否通过重新分配，使所有字符串完全相同。

自建示例
--------

.. code-block:: text

   输入：words = ["ab","ba"]
   输出：true
   解释：总共有两个 a 和两个 b，可以让两个字符串都变为 "ab"。

.. code-block:: text

   输入：words = ["a","bb"]
   输出：false
   解释：字符 a 的总数 1 不能平均分给两个字符串。
