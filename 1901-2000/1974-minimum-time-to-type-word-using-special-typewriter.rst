1974. Minimum Time to Type Word Using Special Typewriter
=======================================================

题目信息
--------

:题号: 1974
:难度: Easy
:主题: 贪心、字符串、环形距离
:原题: `LeetCode 1974 <https://leetcode.com/problems/minimum-time-to-type-word-using-special-typewriter/>`_
:重点: 指针在环形字母表上双向移动，初始位于 a，输入字符也耗时一秒

题目重述
--------

打字机字母按圆环排列。每秒可顺时针或逆时针移动一格，或输入当前字符。返回从 ``a`` 开始输入整个单词的最少秒数。

自建示例
--------

.. code-block:: text

   输入：word = "b"
   输出：2
   解释：从 a 移到 b 一秒，输入 b 一秒。

.. code-block:: text

   输入：word = "za"
   输出：4
   解释：a 到 z 和 z 到 a 都只需移动一格，每个字符还需一秒输入。
