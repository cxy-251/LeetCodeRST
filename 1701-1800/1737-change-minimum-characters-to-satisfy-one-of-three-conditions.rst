1737. Change Minimum Characters to Satisfy One of Three Conditions
=================================================================

题目信息
--------

:题号: 1737
:难度: Medium
:主题: 字符频次、前缀和
:原题: `LeetCode 1737 <https://leetcode.com/problems/change-minimum-characters-to-satisfy-one-of-three-conditions/>`_
:重点: 满足 a 全小于 b、b 全小于 a，或两字符串全部由同一字符组成之一

题目重述
--------

每次可把任一字符改为其他小写字母。返回使两个字符串满足三种指定条件中至少一种所需的最少修改次数。

自建示例
--------

.. code-block:: text

   输入：a = "aba", b = "caa"
   输出：2
   解释：通过两次修改可满足某一严格字母顺序条件。

.. code-block:: text

   输入：a = "a", b = "a"
   输出：0
   解释：两字符串已经全部由同一字符组成。