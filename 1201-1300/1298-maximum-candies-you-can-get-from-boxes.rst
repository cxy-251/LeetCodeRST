1298. Maximum Candies You Can Get from Boxes
============================================

题目信息
--------

:题号: 1298
:难度: Hard
:主题: 图搜索、状态管理、箱子与钥匙
:原题: `LeetCode 1298 <https://leetcode.com/problems/maximum-candies-you-can-get-from-boxes/>`_
:重点: 只能打开已拥有且处于开启状态或已取得钥匙的箱子；打开箱子后可获得糖果、钥匙和新箱子，每个箱子最多处理一次

题目重述
--------

有若干编号箱子。``status[i]`` 表示箱子 ``i`` 初始是否开启，``candies[i]`` 是其中糖果数，``keys[i]`` 是打开后获得的钥匙，``containedBoxes[i]`` 是其中包含的其他箱子。``initialBoxes`` 给出最初拥有的箱子。

只能打开已经拥有且当前可开启的箱子。打开后收集其全部糖果，并获得其中的钥匙和箱子。请返回最终能够收集的最大糖果总数。

``1 <= status.length <= 1000``，各数组长度一致，箱子编号合法且每个箱子至多获得一次。

自建示例
--------

获得钥匙后可以打开先前关闭的箱子：

.. code-block:: text

   输入：status = [1,0,0], candies = [5,7,9], keys = [[1],[],[]], containedBoxes = [[1,2],[],[]], initialBoxes = [0]
   输出：12
   解释：打开箱子 0 后得到箱子 1、2 和钥匙 1；箱子 1 可打开并获得 7 颗糖果，箱子 2 始终关闭。

只拥有关闭箱子且没有钥匙时得到零：

.. code-block:: text

   输入：status = [0], candies = [8], keys = [[]], containedBoxes = [[]], initialBoxes = [0]
   输出：0
   解释：虽然拥有箱子 0，但无法打开它。