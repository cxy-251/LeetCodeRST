1528. Shuffle String
====================

题目信息
--------

:题号: 1528
:难度: Easy
:主题: 字符串、下标映射、排列
:原题: `LeetCode 1528 <https://leetcode.com/problems/shuffle-string/>`_
:重点: 原字符串位置 ``i`` 的字符应移动到结果位置 ``indices[i]``；``indices`` 是完整排列

题目重述
--------

给定字符串 ``s`` 和与其等长的整数数组 ``indices``。``indices`` 包含 ``0`` 到 ``s.length-1`` 的每个下标恰好一次。

请构造新字符串，使原字符串中的字符 ``s[i]`` 被放到结果字符串的下标 ``indices[i]`` 处。

``1 <= s.length <= 100``，``s`` 只包含小写英文字母。

自建示例
--------

每个字符按目标下标重新放置：

.. code-block:: text

   输入：s = "abc", indices = [2,0,1]
   输出："bca"
   解释：a、b、c 分别移动到位置 2、0、1。

恒等排列保持字符串不变：

.. code-block:: text

   输入：s = "xy", indices = [0,1]
   输出："xy"
   解释：两个字符的目标位置与原位置相同。