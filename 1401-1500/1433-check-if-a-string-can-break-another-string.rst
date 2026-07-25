1433. Check If a String Can Break Another String
================================================

题目信息
--------

:题号: 1433
:难度: Medium
:主题: 字符串、排序、逐位比较
:原题: `LeetCode 1433 <https://leetcode.com/problems/check-if-a-string-can-break-another-string/>`_
:重点: 可以分别重排两个等长字符串；若某个排列在每个位置的字符都不小于另一个排列，则前者可以击败后者

题目重述
--------

给定长度相同的小写字符串 ``s1`` 和 ``s2``。可以分别任意重排两个字符串。

若存在一种重排，使 ``s1`` 的每个位置字符都不小于 ``s2`` 对应字符，或反方向成立，则返回 ``true``；否则返回 ``false``。字符按字典序比较。

``1 <= s1.length == s2.length <= 10^5``。

自建示例
--------

其中一个字符串可以在全部位置占优：

.. code-block:: text

   输入：s1 = "abc", s2 = "xya"
   输出：true
   解释：排序后分别为 abc 和 axy，第二个字符串在每个位置都不小于第一个。

两个方向都存在失败位置时返回假：

.. code-block:: text

   输入：s1 = "abe", s2 = "acd"
   输出：false
   解释：排序后 b 小于 c，而 d 又小于 e，因此任何一方都无法在全部位置占优。