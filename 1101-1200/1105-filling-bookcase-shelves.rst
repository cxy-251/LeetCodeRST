1105. Filling Bookcase Shelves
==============================

题目信息
--------

:题号: 1105
:难度: Medium
:主题: 动态规划、顺序分段、书架高度
:原题: `LeetCode 1105 <https://leetcode.com/problems/filling-bookcase-shelves/>`_
:重点: 书必须保持原顺序；每层总厚度不超过 ``shelfWidth``，该层高度等于其中最高书的高度

题目重述
--------

给定书籍数组 ``books``，其中 ``books[i] = [thickness_i, height_i]``，以及每层书架宽度 ``shelfWidth``。必须按输入顺序把全部书放到若干层书架上，同一层放置一段连续书籍。

每层书的总厚度不能超过 ``shelfWidth``，该层贡献的高度为本层所有书的最大高度。请返回放完全部书后书架总高度的最小值。

``1 <= books.length <= 1000``，``1 <= thickness_i <= shelfWidth <= 1000``，``1 <= height_i <= 1000``。

自建示例
--------

把前两本书放在同一层更低：

.. code-block:: text

   输入：books = [[1,3],[2,4],[2,2]], shelfWidth = 3
   输出：6
   解释：前两本书总厚度为 3，放在第一层高度为 4；第三本单独一层高度为 2，总高度为 6。

只有一本书：

.. code-block:: text

   输入：books = [[3,7]], shelfWidth = 3
   输出：7
   解释：唯一书籍必须单独占一层，书架高度等于该书高度 7。