1239. Maximum Length of a Concatenated String with Unique Characters
====================================================================

题目信息
--------

:题号: 1239
:难度: Medium
:主题: 字符串、回溯、位掩码、子序列
:原题: `LeetCode 1239 <https://leetcode.com/problems/maximum-length-of-a-concatenated-string-with-unique-characters/>`_
:重点: 从字符串数组中选择一个子序列并按原顺序连接，最终字符串中的每个字符最多出现一次；允许选择空子序列

题目重述
--------

给定只包含小写英文字母的字符串数组 ``arr``。可以选择其中若干字符串，保持它们在数组中的相对顺序并连接成一个新字符串。

要求连接结果中不存在重复字符。请返回所有合法选择能够得到的最大字符串长度；某个候选字符串自身包含重复字符时不能被选入合法结果。

``1 <= arr.length <= 16``，``1 <= arr[i].length <= 26``。

自建示例
--------

最优结果可以跳过与其他字符冲突的字符串：

.. code-block:: text

   输入：arr = ["ab","cd","aef"]
   输出：5
   解释：选择 "cd" 和 "aef" 得到 "cdaef"，五个字符互不相同；若同时选择 "ab" 会重复 a。

所有字符串自身都含重复字符时只能选择空子序列：

.. code-block:: text

   输入：arr = ["aa","bb"]
   输出：0
   解释：任意非空选择都会在结果中产生重复字符。