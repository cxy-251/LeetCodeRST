0433. Minimum Genetic Mutation
==============================

题目信息
--------

:题号: 0433
:难度: Medium
:主题: 八位基因、单字符突变、基因库、最少步数
:原题: `LeetCode 0433 <https://leetcode.com/problems/minimum-genetic-mutation/>`_
:重点: 每步恰好修改一个字符、修改后基因必须在 ``bank`` 中、字符仅限 ``A/C/G/T``、不可达返回 ``-1``

题目重述
--------

基因字符串长度固定为 8，只包含字符 ``A``、``C``、``G``、``T``。一次突变必须恰好改变一个位置的字符。给定起始基因 ``startGene``、目标基因 ``endGene`` 和合法基因库 ``bank``，返回从起点变到终点所需的最少突变次数。

除起始基因外，每次突变后得到的基因都必须存在于 ``bank`` 中；起始基因本身不要求在库中。若无法到达目标，返回 ``-1``。``bank.length`` 位于 ``[0, 10]``，其中基因互不相同；若起点和终点相同，最少突变次数为 0。

自建示例
--------

需要连续四次合法突变：

.. code-block:: text

   输入：startGene = "AAAAAAAA"
         endGene = "AAAACCCC"
         bank = ["AAAAAAAC", "AAAAAACC", "AAAAACCC", "AAAACCCC"]
   输出：4
   解释：可以按基因库给出的顺序每次把一个 A 改为 C，四个中间或最终基因都在 bank 中。

终点不在合法路径中：

.. code-block:: text

   输入：startGene = "AACCGGTT"
         endGene = "AACCGGTA"
         bank = []
   输出：-1
   解释：终点与起点只差一个字符，但突变后的基因不在 bank 中，因此该突变不合法。
