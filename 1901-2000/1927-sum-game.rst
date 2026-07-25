1927. Sum Game
==============

题目信息
--------

:题号: 1927
:难度: Medium
:主题: 贪心、博弈、数学
:原题: `LeetCode 1927 <https://leetcode.com/problems/sum-game/>`_
:重点: Alice 与 Bob 轮流替换问号，最终两半数字和不同则 Alice 获胜

题目重述
--------

偶数长度字符串由数字和问号组成。Alice、Bob 轮流把一个问号替换为数字；全部替换后，左右两半数字和不同则 Alice 获胜，否则 Bob 获胜。判断 Alice 是否有必胜策略。

自建示例
--------

.. code-block:: text

   输入：num = "5023"
   输出：false
   解释：没有问号，左右两半的和都为 5，Bob 获胜。

.. code-block:: text

   输入：num = "25??"
   输出：true
   解释：Alice 可以控制一个问号，使 Bob 无法保证右半和等于 7。
