0054. Spiral Matrix
===================

题目信息
--------

:题号: 0054. 螺旋矩阵
:难度: Medium
:主题: 矩阵、模拟、边界收缩
:原题: `LeetCode 0054 <https://leetcode.com/problems/spiral-matrix/>`_
:重点: 从逐格记录访问状态，推导到用四条边界表示全部未输出位置

题目重述
--------

给定一个 ``m × n`` 整数矩阵 ``matrix``，从左上角开始，按照向右、向下、向左、向上的顺时针螺旋顺序，
返回矩阵中的全部元素。

每个位置必须恰好输出一次。矩阵不一定是方阵。

约束为 ``1 <= m, n <= 10``、``-100 <= matrix[row][column] <= 100``。

自建示例
--------

.. code-block:: text

   输入：
   [[ 1, 2, 3],
    [ 4, 5, 6],
    [ 7, 8, 9],
    [10,11,12]]

   输出：[1,2,3,6,9,12,11,10,7,4,5,8]

输出外圈后，剩余区域是单列 ``[[5],[8]]``，继续从上向下输出。

.. code-block:: text

   输入：[[4,5,6,7]]
   输出：[4,5,6,7]

只有一行时，向右输出后矩形已经为空，不能再反向输出下边。

.. code-block:: text

   输入：[[2],[3],[4]]
   输出：[2,3,4]

只有一列时，首元素属于上边，其余元素属于右边；之后不能再向上重复输出左边。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       std::vector<int> simulateWithVisited(
           const std::vector<std::vector<int>>& matrix
       ) {
           const int rows = static_cast<int>(matrix.size());
           const int columns = static_cast<int>(matrix[0].size());
           const int total = rows * columns;
           const int rowStep[4] = {0, 1, 0, -1};
           const int columnStep[4] = {1, 0, -1, 0};

           std::vector<std::vector<char>> visited(
               rows,
               std::vector<char>(columns, false)
           );
           std::vector<int> result;
           result.reserve(total);

           int row = 0;
           int column = 0;
           int direction = 0;
           for (int count = 0; count < total; ++count) {
               result.push_back(matrix[row][column]);
               visited[row][column] = true;
               if (count + 1 == total) {
                   break;
               }

               int nextRow = row + rowStep[direction];
               int nextColumn = column + columnStep[direction];
               const bool blocked =
                   nextRow < 0 || nextRow >= rows ||
                   nextColumn < 0 || nextColumn >= columns ||
                   visited[nextRow][nextColumn];
               if (blocked) {
                   direction = (direction + 1) % 4;
                   nextRow = row + rowStep[direction];
                   nextColumn = column + columnStep[direction];
               }

               row = nextRow;
               column = nextColumn;
           }
           return result;
       }

       std::vector<int> shrinkBoundaries(
           const std::vector<std::vector<int>>& matrix
       ) {
           int top = 0;
           int bottom = static_cast<int>(matrix.size()) - 1;
           int left = 0;
           int right = static_cast<int>(matrix[0].size()) - 1;

           std::vector<int> result;
           result.reserve(matrix.size() * matrix[0].size());

           while (top <= bottom && left <= right) {
               for (int column = left; column <= right; ++column) {
                   result.push_back(matrix[top][column]);
               }
               ++top;
               if (top > bottom) {
                   break;
               }

               for (int row = top; row <= bottom; ++row) {
                   result.push_back(matrix[row][right]);
               }
               --right;
               if (left > right) {
                   break;
               }

               for (int column = right; column >= left; --column) {
                   result.push_back(matrix[bottom][column]);
               }
               --bottom;
               if (top > bottom) {
                   break;
               }

               for (int row = bottom; row >= top; --row) {
                   result.push_back(matrix[row][left]);
               }
               ++left;
           }
           return result;
       }

   public:
       std::vector<int> spiralOrder(std::vector<std::vector<int>>& matrix) {
           return shrinkBoundaries(matrix);
       }
   };

题解
----

方向模拟基线
~~~~~~~~~~~~

最直接的方法保存当前位置、当前方向和访问表。方向按右、下、左、上的顺序循环；每输出一个位置，就尝试沿当前方向
前进一步。下一格越界或已经访问时，顺时针转向一次。

矩阵边界本身不足以判断是否转向。走完外圈后，下一格可能仍在矩阵范围内，却已经属于输出过的外圈。因此
``simulateWithVisited`` 使用 ``m × n`` 访问表区分已输出位置和内部未输出位置。

循环固定执行 ``m × n`` 次。最后一个元素输出后直接结束，不再计算下一坐标，保证每次写入结果的坐标都真实有效。
这个方法完整模拟运动过程，时间为 ``O(mn)``，额外空间为 ``O(mn)``。

未访问矩形
~~~~~~~~~~

访问表记录了逐格状态，但螺旋遍历产生的未访问区域始终具有更强的结构：它是一个矩形。用四条边界表示该矩形：

.. code-block:: text

   行范围：[top, bottom]
   列范围：[left, right]

每轮开始时保持以下不变量：

* 边界围成的闭矩形恰好包含全部尚未输出的位置；
* 矩形外的位置已经按螺旋顺序输出；
* 已输出位置不会再次进入后续边界。

因此一轮只需依次输出当前矩形的上边、右边、下边和左边，再把四条边界向内收缩。剩余区域仍是矩形，下一轮可复用
相同过程。

边界收缩不变量
~~~~~~~~~~~~~~

上边一定存在，因此先输出 ``matrix[top][left..right]``，随后执行 ``top++``。右边从新的 ``top`` 开始，避免重复
右上角；下边从新的 ``right`` 开始，避免重复右下角；左边使用新的 ``bottom`` 和 ``top``，避免重复左侧角点。

每删除一条边后，都必须立即检查剩余矩形是否仍非空：

.. code-block:: text

   输出上边，top++      ；若 top > bottom，结束
   输出右边，right--    ；若 left > right，结束
   输出下边，bottom--   ；若 top > bottom，结束
   输出左边，left++

这些检查统一处理退化矩形。只有一行时，上边输出全部剩余元素，``top > bottom`` 后结束；只有一列时，上边输出顶部，
右边输出其余元素，``left > right`` 后结束。这样不会把同一行或同一列反向输出第二次。

每条边输出后立即离开未访问矩形，所以任何位置至多输出一次。只要矩形非空，上边就至少包含一个位置，算法会继续缩小
未访问区域；当行区间或列区间为空时，全部位置都已输出。因此每个位置恰好出现一次，输出顺序也与顺时针外层剥离
一致。

状态演化
~~~~~~~~

对 ``4 × 3`` 示例，第一轮边界变化如下：

.. list-table::
   :header-rows: 1

   * - 阶段
     - 输出
     - 剩余矩形
   * - 上边
     - ``1,2,3``
     - 行 ``[1,3]``，列 ``[0,2]``
   * - 右边
     - ``6,9,12``
     - 行 ``[1,3]``，列 ``[0,1]``
   * - 下边
     - ``11,10``
     - 行 ``[1,2]``，列 ``[0,1]``
   * - 左边
     - ``7,4``
     - 行 ``[1,2]``，列 ``[1,1]``

第二轮只剩一列。上边输出 ``5``，右边输出 ``8``；随后列区间为空，遍历结束。

代码演进
~~~~~~~~

``simulateWithVisited`` 逐格模拟方向变化，访问表直接阻止重复进入已输出位置，适合作为定义对应的基线。

``shrinkBoundaries`` 利用未访问区域始终为矩形的结构，把 ``mn`` 个访问标记压缩成四条边界。公开入口采用该方法，
因为它保持相同的线性时间，并把额外空间降为常量。

复杂度分析
~~~~~~~~~~

矩阵共有 ``mn`` 个位置，两种方法都恰好输出每个位置一次，时间复杂度为 ``O(mn)``。

方向模拟使用 ``O(mn)`` 的访问表。边界收缩除返回数组外只维护四条边界和循环变量，额外空间为 ``O(1)``。
