1268. Search Suggestions System
===============================

题目信息
--------

:题号: 1268
:难度: Medium
:主题: 字符串、前缀、排序、搜索建议
:原题: `LeetCode 1268 <https://leetcode.com/problems/search-suggestions-system/>`_
:重点: 对 ``searchWord`` 的每个非空前缀，返回至多三个以该前缀开头且字典序最小的商品名称

题目重述
--------

给定互不相同的小写商品名称数组 ``products`` 和搜索词 ``searchWord``。用户从左到右逐个输入字符；每输入一个字符，就形成一个新的前缀。

对于每个前缀，返回至多三个以该前缀开头的商品名称，并按字典序升序排列。若匹配商品不足三个则全部返回，没有匹配时返回空数组。

``1 <= products.length <= 1000``，所有字符串只包含小写英文字母，商品名称互不相同。

自建示例
--------

随着前缀增长，候选集合可能变为空：

.. code-block:: text

   输入：products = ["car","card","care","dog"], searchWord = "cat"
   输出：[["car","card","care"],["car","card","care"],[]]
   解释：前缀 c 和 ca 的前三个建议相同，前缀 cat 没有匹配商品。

首字符没有匹配时后续前缀也都为空：

.. code-block:: text

   输入：products = ["alpha","beta"], searchWord = "z"
   输出：[[]]
   解释：没有商品名称以 z 开头。