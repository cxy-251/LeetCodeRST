0936. Stamping The Sequence
===========================

题目信息
--------

:题号: 0936
:难度: Hard
:主题: 字符串构造、覆盖写入、操作序列
:原题: `LeetCode 0936 <https://leetcode.com/problems/stamping-the-sequence/>`_
:重点: 从全为问号的字符串开始，每次用完整 ``stamp`` 覆盖一段等长区间；返回的起点序列按给定顺序执行后必须得到 ``target``，操作次数有上限

题目重述
--------

给定字符串 ``stamp`` 和 ``target``。初始有一个长度与 ``target`` 相同、每个位置都是 ``?`` 的字符串。一次操作选择起点 ``i``，满足 ``0 <= i <= target.length - stamp.length``，然后把区间 ``[i, i + stamp.length)`` 完整覆盖为 ``stamp``；已有字母也可以被新字符覆盖。

请返回一组操作起点下标，使按返回顺序依次盖章后最终字符串恰好等于 ``target``。操作次数不得超过 ``10 * target.length``。若存在多组答案可返回任意一组；若无法完成，返回空数组。

``1 <= stamp.length <= target.length <= 1000``，两个字符串只包含小写英文字母。

自建示例
--------

在两个互不重叠的位置盖章：

.. code-block:: text

   输入：stamp = "ab", target = "abab"
   输出：[0,2]
   解释：初始为 "????"。在下标 0 盖章得到 "ab??"，再在下标 2 盖章得到 "abab"。其他合法序列也可以返回。

目标包含印章无法产生的字符：

.. code-block:: text

   输入：stamp = "ab", target = "ac"
   输出：[]
   解释：任何一次盖章都只能写入 a 和 b，无法在目标的第二个位置产生字符 c，因此不存在操作序列。