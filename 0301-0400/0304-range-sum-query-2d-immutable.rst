0304. Range Sum Query 2D - Immutable
====================================

题目信息
--------

:题号: 0304
:难度: Medium
:主题: 矩阵、矩形区域和、只读对象、多次查询
:原题: `LeetCode 0304 <https://leetcode.com/problems/range-sum-query-2d-immutable/>`_
:重点: 矩形包含四条边界、坐标从零开始、构造后矩阵不更新、每次查询要求常数时间

题目重述
--------

实现 ``NumMatrix`` 类。构造函数接收整数矩阵 ``matrix``；之后可以多次调用 ``sumRegion(row1, col1, row2, col2)``，返回左上角 ``(row1, col1)`` 到右下角 ``(row2, col2)`` 所围闭合矩形中的元素总和，边界上的格子也必须计入。

矩阵行数和列数均位于 ``[1, 200]``，元素位于 ``[-10^5, 10^5]``。查询坐标满足 ``0 <= row1 <= row2 < rows`` 和 ``0 <= col1 <= col2 < columns``，调用次数不超过 ``10^4``。矩阵在构造后不会更新，并要求每次 ``sumRegion`` 查询在 ``O(1)`` 时间内完成。

自建示例
--------

查询跨越多行多列的矩形：

.. code-block:: text

   输入：NumMatrix([
          [2, -1, 4],
          [0,  3, 5],
          [7,  1, -2]
        ])
        sumRegion(0, 1, 2, 2)
   输出：10
   解释：所选区域包含 -1、4、3、5、1、-2，总和为 10。

查询单个格子：

.. code-block:: text

   输入：在上述对象上调用 sumRegion(2, 0, 2, 0)
   输出：7
   解释：两个角坐标相同，矩形只包含第 2 行第 0 列的元素 7。

二维前缀和与容斥
----------------

定义 ``prefix[r][c]`` 为左上角 ``(0, 0)`` 到 ``(r-1, c-1)`` 的矩形和，多出的第 0 行和第 0 列全部设为零。构造时使用二维前缀公式：当前矩形包含上方和左方区域，但左上角区域被重复计算，因此要减去一次，再加回当前格子。

查询闭矩形 ``[row1, row2] × [col1, col2]`` 时，先取 ``(0, 0)`` 到右下角的大矩形，减去上方和左方两个越界区域，再把左上角被减掉两次的区域加回来。前缀表多一行一列后，边界对应的下标都能直接写成 ``row + 1``、``col + 1``，无需为第一行或第一列写特殊分支。

C++ 实现
--------

.. code-block:: cpp

   class NumMatrix {
       std::vector<std::vector<long long>> prefix;

   public:
       NumMatrix(std::vector<std::vector<int>>& matrix) {
           int rows = static_cast<int>(matrix.size());
           int cols = static_cast<int>(matrix[0].size());
           prefix.assign(rows + 1, std::vector<long long>(cols + 1, 0));

           for (int r = 1; r <= rows; ++r) {
               for (int c = 1; c <= cols; ++c) {
                   prefix[r][c] = matrix[r - 1][c - 1]
                                + prefix[r - 1][c]
                                + prefix[r][c - 1]
                                - prefix[r - 1][c - 1];
               }
           }
       }

       int sumRegion(int row1, int col1, int row2, int col2) {
           long long total = prefix[row2 + 1][col2 + 1]
                           - prefix[row1][col2 + 1]
                           - prefix[row2 + 1][col1]
                           + prefix[row1][col1];
           return static_cast<int>(total);
       }
   };

代码分析
--------

``prefix`` 的每一个单元都代表固定的左上角区域，因此查询只需四次取值和三次加减，边界格子也不会漏算或重复计算。矩阵只读时，预处理的 ``O(rows * cols)`` 成本可以由多次查询共同承担；每次查询为 ``O(1)``，额外空间为 ``O(rows * cols)``。
