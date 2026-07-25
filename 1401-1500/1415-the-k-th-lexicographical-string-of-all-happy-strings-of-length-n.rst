1415. The k-th Lexicographical String of All Happy Strings of Length n
======================================================================

题目信息
--------

:题号: 1415
:难度: Medium
:主题: 字符串、回溯、字典序
:原题: `LeetCode 1415 <https://leetcode.com/problems/the-k-th-lexicographical-string-of-all-happy-strings-of-length-n/>`_
:重点: 快乐字符串只使用 ``a``、``b``、``c`` 且相邻字符不同；返回按字典序排列后的第 ``k`` 个，不足时返回空串

题目重述
--------

长度为 ``n`` 的字符串若只包含 ``a``、``b``、``c``，并且任意相邻字符都不同，则称为快乐字符串。

把所有长度为 ``n`` 的快乐字符串按字典序升序排列，请返回第 ``k`` 个；若合法字符串总数少于 ``k``，返回空字符串。

``1 <= n <= 10``，``1 <= k <= 100``。

自建示例
--------

长度为二的快乐字符串按字典序排列：

.. code-block:: text

   输入：n = 2, k = 5
   输出："ca"
   解释：顺序为 ab、ac、ba、bc、ca、cb，第五个是 ca。

请求序号超过总数时返回空串：

.. code-block:: text

   输入：n = 2, k = 7
   输出：""
   解释：长度为二的快乐字符串只有六个。