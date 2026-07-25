1678. Goal Parser Interpretation
================================

题目信息
--------

:题号: 1678
:难度: Easy
:主题: 字符串、解析
:原题: `LeetCode 1678 <https://leetcode.com/problems/goal-parser-interpretation/>`_
:重点: ``G`` 解释为 G，``()`` 解释为 o，``(al)`` 解释为 al

题目重述
--------

给定由三种合法记号连续组成的命令字符串，按规则解释并返回连接后的结果。

自建示例
--------

.. code-block:: text

   输入：command = "G()(al)"
   输出："Goal"
   解释：三个记号依次解释为 G、o、al。

.. code-block:: text

   输入：command = "()()"
   输出："oo"
   解释：两个空括号记号各生成一个 o。