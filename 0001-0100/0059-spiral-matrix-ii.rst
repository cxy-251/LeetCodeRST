0059. Spiral Matrix II
======================

题目信息
--------

:题号: 0059
:难度: Medium
:主题: 矩阵、模拟、边界收缩
:原题: `LeetCode 0059 <https://leetcode.com/problems/spiral-matrix-ii/>`_
:重点: 从逐格转向写入，推导到用四条边界描述尚未填充的矩形

题目重述
--------

给定正整数 ``n``，构造一个 ``n × n`` 矩阵，把整数 ``1`` 到 ``n²`` 按照从左上角开始、顺时针向内旋转的
螺旋顺序依次写入，并返回该矩阵。

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

从定义出发：按方向逐格写入
~~~~~~~~~~~~~~~~~~~~~~~~~~

最直接的方法真实模拟一支笔在矩阵中移动。当前位置写入 ``value`` 后，尝试沿当前方向进入下一格；下一格越界
或已经写过时，方向按右、下、左、上的顺序顺时针旋转一次。

矩阵初始值为 0，而题目写入的值是 ``1..n²``，所以：

.. code-block:: text

   matrix[nextRow][nextColumn] == 0

恰好表示下一位置尚未写入。输出矩阵本身就能兼作访问状态，不需要另外分配 ``visited`` 数组。

``simulateDirections`` 在写入 ``n²`` 后立即结束，不再计算下一坐标。这样 ``row`` 和 ``column`` 始终表示一个
真实待写位置，不会在循环结束前暂时变成越界坐标。

方向模拟保留了哪些多余状态
~~~~~~~~~~~~~~~~~~~~~~~~~~

逐格模拟需要维护当前位置、当前方向，并在每一步检查下一格是否越界或已写入。但完成一整圈后，尚未写入的
位置并不是任意散布的集合，而始终形成一个更小的矩形。

初始未写区域是：

.. code-block:: text

   行范围：[0, n-1]
   列范围：[0, n-1]

写完它的上边、右边、下边和左边后，剩余区域变成：

.. code-block:: text

   行范围：[1, n-2]
   列范围：[1, n-2]

因此，“哪些位置已经写过”的全部结构可以压缩为四条边界，不必继续逐格判断转向。

四条边界表示什么
~~~~~~~~~~~~~~~~

维护：

.. code-block:: text

   top     尚未写入矩形的最上行
   bottom  尚未写入矩形的最下行
   left    尚未写入矩形的最左列
   right   尚未写入矩形的最右列

每轮开始时保持不变量：闭区间 ``[top,bottom] × [left,right]`` 恰好包含全部尚未写入的位置；矩形之外的
位置已经按照正确的螺旋顺序写入 ``1..value-1``。

一轮为什么按上、右、下、左写入
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

当前矩形非空时，上边一定存在。先从左到右写入上边，再执行 ``top++``，把整条上边移出未写区域。

若矩形仍非空，继续从上到下写右边，再执行 ``right--``。随后依次写下边和左边：

.. code-block:: text

   上边：left  -> right，随后 top++
   右边：top   -> bottom，随后 right--
   下边：right -> left，随后 bottom--
   左边：bottom -> top，随后 left++

四段方向首尾相接，正好形成当前矩形的顺时针外圈。下一轮处理严格位于其内部的矩形。

为什么每条边后都要检查矩形是否为空
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

奇数阶矩阵最终会退化成一个中心点。上边循环写入该点后，``top`` 会超过 ``bottom``；若继续写下边，就会
覆盖中心点并消耗一个本不应存在的新值。

虽然本题始终是正方形，内层仍可能在某一步退化为空。每写完一条边就重新检查行范围或列范围，可以让
``n = 1``、奇数中心点和所有普通外圈使用同一套代码，不需要单独判断中心。

四阶矩阵的边界演化
~~~~~~~~~~~~~~~~~~

第一轮从 ``value = 1`` 开始：

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

为什么每个位置和每个值都恰好出现一次
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每条边写完后立即从未写矩形中删除，所以已经写入的位置不会进入后续边界。循环只在行范围或列范围为空时
结束，因此矩阵中的全部 ``n²`` 个位置都会被处理，且每个位置只处理一次。

``value`` 初始为 1，每写一个位置后增加 1。位置共写入 ``n²`` 次，所以写入值依次恰好是 ``1..n²``，没有
遗漏、重复或越界。

为什么整体顺序是顺时针螺旋
~~~~~~~~~~~~~~~~~~~~~~~~~~

同一轮依次沿右、下、左、上四个方向写完当前外圈；下一轮只处理该圈内部。于是所有外圈值都早于内圈值，
每一圈内部又保持顺时针连续，合起来正是题目要求的顺时针向内螺旋顺序。

复杂度来源
~~~~~~~~~~

返回矩阵本身包含 ``n²`` 个位置，任何算法都至少需要 ``Ω(n²)`` 时间完成写入。两种方法都恰好写每个位置
一次，时间为 ``O(n²)``，达到该下界。

不计必须返回的矩阵，方向模拟和四边界方法都只使用常数个变量，额外空间为 ``O(1)``。主入口调用
``shrinkBoundaries``，因为它直接表达未写区域的矩形结构，不依赖 0 作为访问标记。
