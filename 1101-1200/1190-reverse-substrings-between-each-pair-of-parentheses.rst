1190. Reverse Substrings Between Each Pair of Parentheses
=========================================================

题目信息
--------

:题号: 1190
:难度: Medium
:主题: 字符串、栈、嵌套括号
:原题: `LeetCode 1190 <https://leetcode.com/problems/reverse-substrings-between-each-pair-of-parentheses/>`_
:重点: 从最内层括号开始反转其内部字符串，嵌套反转会影响外层内容；最终删除所有括号

题目重述
--------

给定由小写字母和圆括号组成的字符串 ``s``，括号保证配对且结构合法。

反转每一对括号内部的字符串，处理顺序等价于从最内层括号向外层进行；全部处理完成后删除所有括号，并返回剩余字符串。

``1 <= s.length <= 2000``，``s`` 只包含小写英文字母、``(`` 和 ``)``，并保证括号平衡。

自建示例
--------

内层反转结果继续参与外层反转：

.. code-block:: text

   输入：s = "a(bc(de)f)g"
   输出："afdecbg"
   解释：先把 de 反转为 ed，外层内容变为 bcedf；再反转得到 fdecb，最终连接为 afdecbg。

只有一层括号：

.. code-block:: text

   输入：s = "(ab)"
   输出："ba"
   解释：反转括号内的 ab 并删除括号，得到 ba。