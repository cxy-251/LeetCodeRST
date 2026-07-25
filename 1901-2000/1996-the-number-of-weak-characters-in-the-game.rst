1996. The Number of Weak Characters in the Game
===============================================

题目信息
--------

:题号: 1996
:难度: Medium
:主题: 排序、单调栈、贪心
:原题: `LeetCode 1996 <https://leetcode.com/problems/the-number-of-weak-characters-in-the-game/>`_
:重点: 角色只有在攻击和防御都被另一角色严格超过时才算弱

题目重述
--------

每个角色属性为 ``[attack,defense]``。统计存在另一个角色同时具有更高攻击力和更高防御力的角色数量。

自建示例
--------

.. code-block:: text

   输入：properties = [[5,5],[6,3],[7,6]]
   输出：2
   解释：[7,6] 在两项属性上都严格超过前两个角色。

.. code-block:: text

   输入：properties = [[5,1],[5,2]]
   输出：0
   解释：攻击力相同，不满足严格更高。
