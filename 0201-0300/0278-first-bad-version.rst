0278. First Bad Version
=======================

题目信息
--------

:题号: 0278
:难度: Easy
:主题: 二分查找、交互接口
:原题: `LeetCode 0278 <https://leetcode.com/problems/first-bad-version/>`_
:教学重点: 单调谓词、左边界、溢出安全中点

题目重述
--------

有 ``1..n`` 个版本，某一版本开始及其之后全部为坏版本。平台提供 ``bool isBadVersion(int version)``，要求实现 ``int firstBadVersion(int n)``，返回第一个坏版本。``n`` 可达 ``2^31-1``，平台保证至少有一个坏版本；目标是尽量减少 API 调用。

自建示例
--------

.. code-block:: text

   输入：n=8，第一个坏版本为 6
   输出：6
