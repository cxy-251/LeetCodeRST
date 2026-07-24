1282. Group the People Given the Group Size They Belong To
==========================================================

题目信息
--------

:题号: 1282
:难度: Medium
:主题: 数组、分组、哈希表
:原题: `LeetCode 1282 <https://leetcode.com/problems/group-the-people-given-the-group-size-they-belong-to/>`_
:重点: 每个人必须恰好属于一个组，且所在组人数必须等于 ``groupSizes[i]``；任意合法分组均可

题目重述
--------

有 ``n`` 个人，编号为 ``0`` 到 ``n - 1``。``groupSizes[i]`` 表示第 ``i`` 个人所在小组必须具有的人数。

请把所有人划分为若干组，使每个人恰好出现一次，并且每个组的实际人数等于组内每名成员要求的组大小。返回任意一种合法分组。

``1 <= groupSizes.length <= 500``，``1 <= groupSizes[i] <= groupSizes.length``，题目保证至少存在一种合法分组。

自建示例
--------

不同组大小可以同时出现：

.. code-block:: text

   输入：groupSizes = [2,1,2]
   输出：[[1],[0,2]]
   解释：编号 1 独自组成一人组，编号 0 和 2 组成两人组。

只有一个人时形成单人组：

.. code-block:: text

   输入：groupSizes = [1]
   输出：[[0]]
   解释：唯一成员要求的组大小为 1。