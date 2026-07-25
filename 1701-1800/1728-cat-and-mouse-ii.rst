1728. Cat and Mouse II
======================

题目信息
--------

:题号: 1728
:难度: Hard
:主题: 博弈、状态搜索、网格
:原题: `LeetCode 1728 <https://leetcode.com/problems/cat-and-mouse-ii/>`_
:重点: 老鼠先手，双方可原地停留或沿单方向跳不超过各自距离，墙会阻挡

题目重述
--------

网格中 ``M``、``C``、``F`` 分别表示老鼠、猫和食物。老鼠到达食物即胜；猫抓到老鼠或先到食物即胜；超过规定回合仍未结束视为猫胜。判断双方最优时老鼠能否获胜。

自建示例
--------

.. code-block:: text

   输入：grid = ["MF","C#"], catJump = 1, mouseJump = 1
   输出：true
   解释：老鼠第一步向右到达食物。

.. code-block:: text

   输入：grid = ["MCF"], catJump = 1, mouseJump = 1
   输出：false
   解释：猫位于老鼠与食物之间，老鼠无法越过猫。