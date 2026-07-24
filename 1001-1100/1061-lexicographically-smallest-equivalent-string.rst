1061. Lexicographically Smallest Equivalent String
==================================================

题目信息
--------

:题号: 1061
:难度: Medium
:主题: 字符等价关系、传递闭包、字典序最小化
:原题: `LeetCode 1061 <https://leetcode.com/problems/lexicographically-smallest-equivalent-string/>`_
:重点: ``s1[i]`` 与 ``s2[i]`` 建立的等价关系具有自反、对称和传递性；``baseStr`` 每个字符可独立替换为任意等价字符

题目重述
--------

给定长度相同的小写字符串 ``s1`` 和 ``s2``。对于每个下标 ``i``，规定字符 ``s1[i]`` 与 ``s2[i]`` 等价。字符与自身等价，等价关系可以双向使用，并且具有传递性。

另给定字符串 ``baseStr``。可以把其中每个字符替换为与它等价的任意小写字母。请返回所有可得到字符串中字典序最小的一个；各位置的替换选择互不影响。

``1 <= s1.length == s2.length <= 1000``，``1 <= baseStr.length <= 1000``，所有字符串只包含小写英文字母。

自建示例
--------

传递关系把多个字符合并为同一等价类：

.. code-block:: text

   输入：s1 = "abc", s2 = "bcd", baseStr = "dad"
   输出："aaa"
   解释：a、b、c、d 通过三组关系全部等价，因此 baseStr 中的 d 和 a 都可以替换为该等价类中字典序最小的 a。
