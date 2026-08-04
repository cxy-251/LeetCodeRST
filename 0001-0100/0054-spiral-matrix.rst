0054. Spiral Matrix
===================

题目信息
--------

:题号: 0054
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

只有一行时，向右输出后矩形已经为空，不能再反向输出所谓的下边。

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
               if (count + 1 == total) break;

               int nextRow = row + rowStep[direction];
               int nextColumn = column + columnStep[direction];
               bool blocked = nextRow < 0 || nextRow >= rows ||
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
               if (top > bottom) break;

               for (int row = top; row <= bottom; ++row) {
                   result.push_back(matrix[row][right]);
               }
               --right;
               if (left > right) break;

               for (int column = right; column >= left; --column) {
                   result.push_back(matrix[bottom][column]);
               }
               --bottom;
               if (top > bottom) break;

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

从定义出发：沿当前方向逐格移动
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

最直接的模拟保存三个状态：当前位置 ``(row,column)``、当前方向 ``direction``，以及每个位置是否已经输出。
方向按照右、下、左、上的顺序循环。

每输出一个元素，就尝试沿当前方向进入下一格。下一格越界或已经访问时，说明当前方向被阻挡，需要顺时针
转向一次。

为什么只检查矩阵边界不够
~~~~~~~~~~~~~~~~~~~~~~~~

走完外圈后，当前位置仍可能朝矩阵内部移动。下一格即使没有越界，也可能属于已经输出的外圈；仅靠行列范围
无法区分它与真正尚未输出的内部位置。

``simulateWithVisited`` 因此维护一张 ``m × n`` 的访问表。它直接模拟运动过程，时间为 ``O(mn)``，但额外
空间也是 ``O(mn)``。

代码在输出最后一个元素后立即结束，不再计算下一坐标。这样当前位置始终指向一个真实、尚未输出的格子，
不会为了结束循环而暂时写入越界坐标。

访问表中隐藏了什么结构
~~~~~~~~~~~~~~~~~~~~~~

初始时，尚未输出的位置是整个矩形。若依次输出当前矩形的上边、右边、下边和左边，删除的恰好是最外层；
剩余位置仍然是一个更小的矩形。

所以不必分别记录每个格子的访问状态。只需维护尚未输出矩形的四条边界：

.. code-block:: text

   行范围：[top, bottom]
   列范围：[left, right]

循环开始时保持以下不变量：两个闭区间的笛卡尔积，恰好等于全部尚未输出的位置；矩形之外的位置已经按照
螺旋顺序输出且不会再次进入候选。

一圈如何从四条边界推导
~~~~~~~~~~~~~~~~~~~~~~

只要矩形非空，上边一定存在。先从左到右输出 ``matrix[top][left..right]``，再执行 ``top++``，表示上边
已经从未处理区域中删除。

删除一条边后，矩形可能立即为空。因此每一步都先检查剩余矩形，再决定下一条边是否存在：

.. code-block:: text

   输出上边，top++      ；若 top > bottom，结束
   输出右边，right--     ；若 left > right，结束
   输出下边，bottom--    ；若 top > bottom，结束
   输出左边，left++

右边从新的 ``top`` 开始，不会重复右上角；下边只遍历新的 ``right``，不会重复右下角；左边使用新的
``bottom`` 和原来的 ``top`` 之间的行，也不会重复两个左侧角点。

为什么单行和单列必须提前结束
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若当前矩形只有一行，上边已经输出全部剩余元素。``top++`` 后满足 ``top > bottom``，此时直接结束；若继续
输出下边，就会把同一行反向输出第二次。

若当前矩形只有一列，上边输出顶部元素，右边输出该列其余元素。``right--`` 后满足 ``left > right``，此时
直接结束；若继续输出左边，就会把同一列向上重复一次。

这些判断不是针对示例的补丁，而是在每条边被删除后重新验证循环不变量：只有剩余矩形仍非空，下一条边才
真实存在。

四乘三示例的边界演化
~~~~~~~~~~~~~~~~~~~~

第一轮处理 ``4 × 3`` 示例：

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

第二轮只剩一列。上边输出 ``5``，右边输出 ``8``；随后 ``left > right``，遍历结束。

为什么每个位置恰好输出一次
~~~~~~~~~~~~~~~~~~~~~~~~~~

根据循环不变量，每轮开始时，四条边界包围的矩形恰好包含全部未输出位置。算法按顺时针顺序输出其外层，
并在每条边输出后立即收缩对应边界，因此刚输出的位置永久离开未处理矩形，不可能在后续轮次再次出现。

只要矩形仍非空，至少存在上边，算法就会继续输出元素；只有行区间或列区间为空时才结束。因此所有位置最终
都会被输出。结合“不重复进入未处理矩形”，可得每个位置恰好输出一次，且顺序正是顺时针螺旋顺序。

复杂度来源
~~~~~~~~~~

矩阵共有 ``mn`` 个位置，主方法对每个位置只追加一次，时间为 ``O(mn)``。除返回数组外，只维护四条边界和
循环变量，额外空间为 ``O(1)``。

方向模拟同样是 ``O(mn)`` 时间，但访问表额外占用 ``O(mn)`` 空间。主入口调用 ``shrinkBoundaries``。
