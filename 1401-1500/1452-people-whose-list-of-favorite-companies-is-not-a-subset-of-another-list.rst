1452. People Whose List of Favorite Companies Is Not a Subset of Another List
=============================================================================

题目信息
--------

:题号: 1452
:难度: Medium
:主题: 集合、子集判断、枚举
:原题: `LeetCode 1452 <https://leetcode.com/problems/people-whose-list-of-favorite-companies-is-not-a-subset-of-another-list/>`_
:重点: 返回喜欢公司集合不被任何其他人的集合完全包含的人员下标，并按升序排列

题目重述
--------

给定列表 ``favoriteCompanies``，其中 ``favoriteCompanies[i]`` 是第 ``i`` 个人喜欢的不同公司名称集合。

若第 ``i`` 个人的全部喜欢公司都包含在某个其他人的列表中，则不保留下标 ``i``。请返回其列表不是任何其他列表子集的人员下标，结果按升序排列。

``1 <= favoriteCompanies.length <= 100``，每个列表长度位于 ``[1,500]``，内部公司名称互不相同。

自建示例
--------

较小列表被另一列表完全包含时应排除：

.. code-block:: text

   输入：favoriteCompanies = [["a","b"],["a"],["c"]]
   输出：[0,2]
   解释：下标 1 的集合 {a} 是下标 0 集合的子集；另外两个集合都不被其他集合包含。

只有一个人时其下标必然保留：

.. code-block:: text

   输入：favoriteCompanies = [["solo"]]
   输出：[0]
   解释：不存在其他人的列表可形成包含关系。