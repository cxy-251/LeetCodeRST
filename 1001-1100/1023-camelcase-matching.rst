1023. Camelcase Matching
========================

题目信息
--------

:题号: 1023
:难度: Medium
:主题: 字符串、模式匹配、大小写约束
:原题: `LeetCode 1023 <https://leetcode.com/problems/camelcase-matching/>`_
:重点: 查询字符串只能通过向 ``pattern`` 的任意位置插入小写字母得到；模式中的所有字符必须按顺序匹配，额外大写字母会使匹配失败

题目重述
--------

给定字符串数组 ``queries`` 和模式字符串 ``pattern``，它们都由大小写英文字母组成。对于每个查询字符串，判断能否从 ``pattern`` 出发，仅通过在任意位置插入零个或多个小写字母得到该查询。

模式中的字符必须全部按原顺序出现，大小写需要完全一致。查询中没有对应模式字符的额外大写字母不能被忽略。按 ``queries`` 原顺序返回每个查询是否匹配的布尔结果。

``1 <= queries.length <= 100``，每个查询和 ``pattern`` 的长度均在 ``[1, 100]`` 范围内。

自建示例
--------

缺少模式中的小写字母同样不能匹配：

.. code-block:: text

   输入：queries = ["FooBar","FootBall","FrameBuffer","FoBa"], pattern = "FoB"
   输出：[true,true,false,true]
   解释：前三个匹配结果中，FooBar 和 FootBall 可由 FoB 插入小写字母得到；FrameBuffer 没有按顺序出现模式中的小写字母 o；FoBa 只在末尾额外插入了小写 a。
