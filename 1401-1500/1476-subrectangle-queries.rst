1476. Subrectangle Queries
==========================

题目信息
--------

:题号: 1476
:难度: Medium
:主题: 设计题、矩阵、区间更新
:原题: `LeetCode 1476 <https://leetcode.com/problems/subrectangle-queries/>`_
:重点: 对闭合子矩形中的所有格统一赋值，并支持读取当前单格值；多次更新按调用顺序覆盖

题目重述
--------

实现 ``SubrectangleQueries`` 类，构造时接收整数矩阵 ``rectangle``。

``updateSubrectangle(row1,col1,row2,col2,newValue)`` 把行列边界均包含在内的子矩形全部赋为 ``newValue``；``getValue(row,col)`` 返回当前格值。所有调用共享同一个矩阵状态。

矩阵行列数位于 ``[1,100]``，方法总调用次数不超过 ``500``。

自建示例
--------

更新后的值会被后续查询读取：

.. code-block:: text

   输入：
   ["SubrectangleQueries","getValue","updateSubrectangle","getValue"]
   [[[[1,2],[3,4]]],[0,1],[0,0,1,0,9],[1,0]]
   输出：[null,2,null,9]
   解释：第一列两格被统一改为 9。

单格子矩形也可以更新：

.. code-block:: text

   输入：
   ["SubrectangleQueries","updateSubrectangle","getValue"]
   [[[[5]]],[0,0,0,0,7],[0,0]]
   输出：[null,null,7]
   解释：闭区间只包含唯一格子。