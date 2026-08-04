0054. Spiral Matrix
===================

题目信息
--------

:题号: 0054
:难度: Medium
:主题: 矩阵、模拟、边界收缩
:原题: `LeetCode 0054 <https://leetcode.com/problems/spiral-matrix/>`_
:重点: 从方向模拟与访问标记，推导到用四条边界表示尚未输出的矩形

题目重述
--------

给定一个 ``m × n`` 整数矩阵 ``matrix``，从左上角开始，按照向右、向下、向左、向上的顺时针
螺旋顺序返回矩阵中的所有元素。

每个位置必须恰好输出一次。矩阵不一定是方阵，约束为 ``1 <= m, n <= 10``，
``-100 <= matrix[row][col] <= 100``。

自建示例
--------

.. code-block:: text

   输入：
   [[ 1, 2, 3],
    [ 4, 5, 6],
    [ 7, 8, 9],
    [10,11,12]]

   输出：[1,2,3,6,9,12,11,10,7,4,5,8]

外圈输出后，尚未访问的区域是单列 ``[[5],[8]]``，继续从上向下输出。

.. code-block:: text

   输入：[[4,5,6,7]]
   输出：[4,5,6,7]

只有一行时，上边已经包含全部元素，不能再反向输出一次下边。

.. code-block:: text

   输入：[[2],[3],[4]]
   输出：[2,3,4]

只有一列时，右边已经包含除首元素外的其余元素，不能再向上输出一次左边。

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
           const int row_step[4] = {0, 1, 0, -1};
           const int column_step[4] = {1, 0, -1, 0};
           std::vector<std::vector<char>> visited(
               rows,
               std::vector<char>(columns, false)
           );
           std::vector<int> result;
           result.reserve(rows * columns);

           int row = 0;
           int column = 0;
           int direction = 0;
           for (int count = 0; count < rows * columns; ++count) {
               result.push_back(matrix[row][column]);
               visited[row][column] = true;

               int next_row = row + row_step[direction];
               int next_column = column + column_step[direction];
               bool blocked = next_row < 0 || next_row >= rows ||
                              next_column < 0 || next_column >= columns ||
                              visited[next_row][next_column];
               if (blocked) {
                   direction = (direction + 1) % 4;
                   next_row = row + row_step[direction];
                   next_column = column + column_step[direction];
               }
               row = next_row;
               column = next_column;
           }
           return result;
       }

       void peelRecursively(
           const std::vector<std::vector<int>>& matrix,
           int top,
           int bottom,
           int left,
           int right,
           std::vector<int>& result
       ) {
           if (top > bottom || left > right) return;

           for (int column = left; column <= right; ++column) {
               result.push_back(matrix[top][column]);
           }
           for (int row = top + 1; row <= bottom; ++row) {
               result.push_back(matrix[row][right]);
           }
           if (top < bottom) {
               for (int column = right - 1; column >= left; --column) {
                   result.push_back(matrix[bottom][column]);
               }
           }
           if (left < right) {
               for (int row = bottom - 1; row > top; --row) {
                   result.push_back(matrix[row][left]);
               }
           }

           peelRecursively(
               matrix,
               top + 1,
               bottom - 1,
               left + 1,
               right - 1,
               result
           );
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

               for (int row = top; row <= bottom; ++row) {
                   result.push_back(matrix[row][right]);
               }
               --right;

               if (top <= bottom) {
                   for (int column = right; column >= left; --column) {
                       result.push_back(matrix[bottom][column]);
                   }
                   --bottom;
               }

               if (left <= right) {
                   for (int row = bottom; row >= top; --row) {
                       result.push_back(matrix[row][left]);
                   }
                   ++left;
               }
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

直接方法：沿当前方向移动
~~~~~~~~~~~~~~~~~~~~~~~~

最直接的模拟状态包括当前位置和当前方向。方向按右、下、左、上的顺序循环；下一格越界或已经访问时，
顺时针转向一次。

只检查越界不够。例如走完矩阵外圈后，当前位置仍可能向某个矩阵内部坐标移动，但那个坐标已经在外圈中
输出过。``simulateWithVisited`` 因而需要一张 ``m × n`` 的布尔表，才能区分“尚未访问的内部格子”和
“已经经过的外圈格子”。

这种方法直接复现移动过程，时间为 ``O(mn)``，访问表额外占用 ``O(mn)`` 空间。继续优化的关键不是让
转向判断更快，而是判断访问表中是否存在可以被更小状态完整表达的结构。

访问一圈后为什么仍是矩形
~~~~~~~~~~~~~~~~~~~~~~~~

初始未输出区域是整个矩形。依次输出它的上边、右边、下边和左边后，被删除的恰好是最外面一圈；
剩余位置仍是一个矩形，只是四条边各向内收缩一格。

因此，无需记录每一个格子是否访问，只需维护当前未输出矩形：

.. code-block:: text

   行范围：[top, bottom]
   列范围：[left, right]

循环开始时保持以下不变量：这两个闭区间的笛卡尔积恰好包含所有尚未输出的位置，矩形之外的所有位置
已经按螺旋顺序输出且只输出一次。

一轮为什么按上、右、下、左处理
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

当前矩形非空时，上边一定存在，可以从 ``left`` 到 ``right`` 输出，随后执行 ``top++``，表示整条上边
已经移出未处理区域。

新的矩形若仍有位置，原来的右边中尚未输出的部分从新 ``top`` 延伸到 ``bottom``。输出后执行
``right--``。到这里，剩余区域可能已经退化为空，因此下边和左边必须分别重新检查边界。

.. code-block:: text

   输出上边后：top++
   输出右边后：right--
   若 top <= bottom：输出下边，bottom--
   若 left <= right：输出左边，left++

每次边界更新都表示对应整条边已经永久离开未处理矩形。下一轮只处理更内层矩形，不需要访问标记。

为什么下边和左边需要守卫
~~~~~~~~~~~~~~~~~~~~~~~~

当剩余区域只有一行时，上边已经输出这一行全部元素。``top++`` 后会出现 ``top > bottom``；若仍输出
下边，就会把同一行反向输出一次。

当剩余区域只有一列时，上边输出首元素，右边继续输出这一列的其余元素。``right--`` 后会出现
``left > right``；若仍输出左边，就会把同一列向上重复输出。

这两个守卫不是特殊补丁，而是每处理一条边后重新确认未处理矩形是否还具有对应的另一条平行边。

自建示例中的边界演化
~~~~~~~~~~~~~~~~~~~~

对 ``4 × 3`` 示例，第一轮状态如下：

.. list-table::
   :header-rows: 1

   * - 阶段
     - 输出
     - 更新后的未处理矩形
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

第二轮只剩单列 ``[5,8]``。上边输出 ``5``，右边输出 ``8``，随后列范围为空，左边被守卫跳过。

为什么每个位置恰好输出一次
~~~~~~~~~~~~~~~~~~~~~~~~~~

一轮中的四段只取当前矩形的边界。上边和右边共享的右上角在输出上边后通过 ``top++`` 被排除；
右边和下边共享的右下角在输出右边后通过 ``right--`` 被排除。下边和左边的两个角也由循环端点与边界
更新排除，退化为单行或单列时再由守卫阻止重复。

每输出一条边，就把它从未处理矩形中删除，因此已经输出的位置不会进入后续轮次。循环只在未处理矩形
为空时结束，所以所有位置最终都会被输出。

递归剥层与迭代边界的关系
~~~~~~~~~~~~~~~~~~~~~~~~

``peelRecursively`` 先输出当前外圈，再递归处理
``[top+1,bottom-1] × [left+1,right-1]``。它与四边界循环使用相同的不变量；差别只是递归把每一圈
保存在调用栈中。

主入口选择 ``shrinkBoundaries``，因为它保留同样的结构，又不需要 ``O(min(m,n))`` 的递归栈。

复杂度来源
~~~~~~~~~~

矩阵共有 ``mn`` 个位置，每个位置恰好追加一次，因此时间为 ``O(mn)``。主方法除返回数组外只保存四条
边界和循环变量，额外空间为 ``O(1)``。方向模拟额外使用 ``O(mn)`` 访问表；递归剥层额外使用
``O(min(m,n))`` 调用栈。
