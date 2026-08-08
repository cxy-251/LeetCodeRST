0059. Spiral Matrix II
======================

题目信息
--------

:题号: 0059. 螺旋矩阵 II
:难度: Medium
:主题: 矩阵、模拟、边界收缩
:原题: `LeetCode 0059 <https://leetcode.com/problems/spiral-matrix-ii/>`_
:重点: 从逐格转向写入，推导到用四条边界描述尚未填充的矩形

题目重述
--------

给定正整数 ``n``，构造一个 ``n × n`` 矩阵，把整数 ``1`` 到 ``n²`` 按照从左上角开始、
顺时针向内旋转的螺旋顺序依次写入，并返回该矩阵。

约束为 ``1 <= n <= 20``。

自建示例
--------

.. code-block:: text

   输入：n = 4
   输出：
   [[ 1, 2, 3, 4],
    [12,13,14, 5],
    [11,16,15, 6],
    [10, 9, 8, 7]]

先写完外圈的 ``1..12``，再在内部 ``2 × 2`` 矩形中写入 ``13..16``。

.. code-block:: text

   输入：n = 3
   输出：
   [[1,2,3],
    [8,9,4],
    [7,6,5]]

奇数阶矩阵最终只剩中心位置，最后写入 ``9``。

.. code-block:: text

   输入：n = 1
   输出：[[1]]

起始位置同时也是唯一位置。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       std::vector<std::vector<int>> simulateDirections(int n) {
           std::vector<std::vector<int>> matrix(n, std::vector<int>(n, 0));
           const int rowStep[4] = {0, 1, 0, -1};
           const int columnStep[4] = {1, 0, -1, 0};
           const int total = n * n;

           int row = 0;
           int column = 0;
           int direction = 0;

           for (int value = 1; value <= total; ++value) {
               matrix[row][column] = value;
               if (value == total) break;

               int nextRow = row + rowStep[direction];
               int nextColumn = column + columnStep[direction];
               bool blocked = nextRow < 0 || nextRow >= n ||
                              nextColumn < 0 || nextColumn >= n ||
                              matrix[nextRow][nextColumn] != 0;

               if (blocked) {
                   direction = (direction + 1) % 4;
                   nextRow = row + rowStep[direction];
                   nextColumn = column + columnStep[direction];
               }

               row = nextRow;
               column = nextColumn;
           }
           return matrix;
       }

       std::vector<std::vector<int>> shrinkBoundaries(int n) {
           std::vector<std::vector<int>> matrix(n, std::vector<int>(n, 0));
           int top = 0;
           int bottom = n - 1;
           int left = 0;
           int right = n - 1;
           int value = 1;

           while (top <= bottom && left <= right) {
               for (int column = left; column <= right; ++column) {
                   matrix[top][column] = value++;
               }
               ++top;
               if (top > bottom) break;

               for (int row = top; row <= bottom; ++row) {
                   matrix[row][right] = value++;
               }
               --right;
               if (left > right) break;

               for (int column = right; column >= left; --column) {
                   matrix[bottom][column] = value++;
               }
               --bottom;
               if (top > bottom) break;

               for (int row = bottom; row >= top; --row) {
                   matrix[row][left] = value++;
               }
               ++left;
           }
           return matrix;
       }

   public:
       std::vector<std::vector<int>> generateMatrix(int n) {
           return shrinkBoundaries(n);
       }
   };

题解
----

逐格方向模拟
~~~~~~~~~~~~

最直接的方法真实模拟当前位置和移动方向。每次把 ``value`` 写入当前格，再尝试沿右、下、左、上的
当前方向前进一步。下一格越界或已经写入时，方向顺时针旋转一次。

矩阵初始化为 0，而合法写入值是 ``1..n²``，所以 ``matrix[nextRow][nextColumn] == 0`` 恰好表示
下一格尚未使用。返回矩阵本身兼作访问标记，不需要额外的 ``visited`` 数组。

``simulateDirections`` 在写入 ``n²`` 后立即结束，避免为了下一轮而计算不存在的坐标。该方法已经是
``O(n²)`` 时间和 ``O(1)`` 额外空间，但每个位置仍要维护方向并判断是否转向。

未写区域压缩
~~~~~~~~~~~~

完成一圈后，尚未写入的位置不会零散分布，而是严格形成一个更小的矩形。初始未写区域为：

.. code-block:: text

   行范围：[0, n-1]
   列范围：[0, n-1]

写完外圈后，剩余范围变为：

.. code-block:: text

   行范围：[1, n-2]
   列范围：[1, n-2]

因此可以用 ``top``、``bottom``、``left``、``right`` 四条边界代替当前位置、方向和访问判断。

未写矩形不变量
~~~~~~~~~~~~~~

每轮开始时保持：

.. code-block:: text

   [top, bottom] × [left, right]

恰好是全部尚未写入的位置；矩形外部已经按螺旋顺序写入连续整数 ``1..value-1``。

当前矩形的外圈按以下顺序写入：

.. code-block:: text

   上边：left  -> right，随后 top++
   右边：top   -> bottom，随后 right--
   下边：right -> left，随后 bottom--
   左边：bottom -> top，随后 left++

每条边写完后立即收缩对应边界，所以刚写入的位置永久离开未写区域。四段首尾相接，组成当前矩形的
顺时针外圈；下一轮只处理它内部的矩形。

写完一条边后，行范围或列范围可能已经为空。此时必须立即结束本轮，防止单行、单列或奇数阶中心点
被再次覆盖。由于 ``value`` 每写一个位置才增加一次，而每个位置只离开未写区域一次，最终恰好写入
``1..n²``，没有遗漏或重复。

状态演化
~~~~~~~~

对 ``n = 4``，第一轮从 ``value = 1`` 开始：

.. list-table::
   :header-rows: 1

   * - 阶段
     - 写入值
     - 写入后剩余矩形
   * - 上边
     - ``1,2,3,4``
     - 行 ``[1,3]``，列 ``[0,3]``
   * - 右边
     - ``5,6,7``
     - 行 ``[1,3]``，列 ``[0,2]``
   * - 下边
     - ``8,9,10``
     - 行 ``[1,2]``，列 ``[0,2]``
   * - 左边
     - ``11,12``
     - 行 ``[1,2]``，列 ``[1,2]``

第二轮只处理内部 ``2 × 2`` 矩形，依次写入 ``13,14,15,16``。

边界统一处理
~~~~~~~~~~~~

``n = 1`` 时，上边循环写入唯一位置，随后 ``top > bottom``，直接结束。

奇数阶矩阵最终退化为一个中心点，处理方式与 ``n = 1`` 完全相同。偶数阶矩阵最终退化为一个
``2 × 2`` 矩形，四段循环正好写完最后一圈。算法不需要单独判断中心位置或矩阵奇偶性。

复杂度分析
~~~~~~~~~~

返回矩阵包含 ``n²`` 个位置，任何算法都至少需要 ``Ω(n²)`` 时间完成写入。两种方法都恰好访问每个
位置一次，时间复杂度为 ``O(n²)``。

不计必须返回的矩阵，两种方法都只维护常数个变量，额外空间为 ``O(1)``。公开入口调用
``shrinkBoundaries``，直接利用未写区域始终为矩形的结构。
