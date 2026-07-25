1738. Find Kth Largest XOR Coordinate Value
===========================================

题目信息
--------

:题号: 1738
:难度: Medium
:主题: 二维前缀异或、排序
:原题: `LeetCode 1738 <https://leetcode.com/problems/find-kth-largest-xor-coordinate-value/>`_
:重点: 坐标值为从左上角到该坐标矩形内所有元素的异或

题目重述
--------

计算矩阵每个坐标的前缀矩形异或值，把全部值按降序排列，返回第 ``k`` 大值。

自建示例
--------

.. code-block:: text

   输入：matrix = [[5,2],[1,6]], k = 2
   输出：5
   解释：四个坐标值为 5、7、4、0，第二大为 5。

.. code-block:: text

   输入：matrix = [[9]], k = 1
   输出：9
   解释：只有一个坐标值。