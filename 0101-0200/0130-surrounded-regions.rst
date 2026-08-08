0130. Surrounded Regions
=======================

题目信息
--------

:题号: 0130. 被围绕的区域
:难度: Medium
:主题: 网格、连通分量、多源广度优先搜索、原地标记
:原题: `LeetCode 0130 <https://leetcode.com/problems/surrounded-regions/>`_
:重点: 将“每个区域是否封闭”反转为“哪些 O 能从边界到达”，先保护安全补集再统一翻转

题目重述
--------

给定只含 ``'X'`` 和 ``'O'`` 的矩形网格 ``board``。上下左右相邻的 ``'O'`` 属于同一区域；一个区域只有
在其中所有格子都不位于边界时才被 ``'X'`` 完全围绕，需要把该区域的全部 ``'O'`` 原地改为 ``'X'``。
只要区域通过若干个 ``'O'`` 与任意边界格相连，整个区域都必须保留。

自建示例
--------

.. code-block:: text

   输入：                   修改后：
   X X X X X               X X X X X
   X O O X X               X X X X X
   X X O O X               X X X X X
   X O X X X               X O X X X
   X O X X X               X O X X X

上方四个 ``O`` 组成封闭区域；左下两个 ``O`` 与底边相连，即使其中一个不在边界也必须保留。

单行网格 ``[O, X, O, O]`` 中每个位置都属于边界，因此没有任何 ``O`` 可以翻转。

C++ 实现
--------

.. code-block:: cpp

   #include <queue>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       void decideEveryComponent(std::vector<std::vector<char>>& board) {
           const int rows = static_cast<int>(board.size());
           const int columns = static_cast<int>(board[0].size());
           const int directions[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
           std::vector<std::vector<bool>> visited(
               rows,
               std::vector<bool>(columns, false)
           );

           for (int startRow = 0; startRow < rows; ++startRow) {
               for (int startColumn = 0; startColumn < columns; ++startColumn) {
                   if (board[startRow][startColumn] != 'O' ||
                       visited[startRow][startColumn]) {
                       continue;
                   }

                   std::queue<std::pair<int, int>> pending;
                   std::vector<std::pair<int, int>> component;
                   pending.push({startRow, startColumn});
                   visited[startRow][startColumn] = true;
                   bool touchesBoundary = false;

                   while (!pending.empty()) {
                       auto [row, column] = pending.front();
                       pending.pop();
                       component.push_back({row, column});
                       if (row == 0 || row == rows - 1 ||
                           column == 0 || column == columns - 1) {
                           touchesBoundary = true;
                       }

                       for (const auto& direction : directions) {
                           const int nextRow = row + direction[0];
                           const int nextColumn = column + direction[1];
                           if (nextRow < 0 || nextRow >= rows ||
                               nextColumn < 0 || nextColumn >= columns ||
                               board[nextRow][nextColumn] != 'O' ||
                               visited[nextRow][nextColumn]) {
                               continue;
                           }
                           visited[nextRow][nextColumn] = true;
                           pending.push({nextRow, nextColumn});
                       }
                   }

                   if (!touchesBoundary) {
                       for (auto [row, column] : component) {
                           board[row][column] = 'X';
                       }
                   }
               }
           }
       }

       void protectBoundaryComponents(std::vector<std::vector<char>>& board) {
           if (board.empty() || board[0].empty()) {
               return;
           }
           const int rows = static_cast<int>(board.size());
           const int columns = static_cast<int>(board[0].size());
           const int directions[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
           std::queue<std::pair<int, int>> pending;

           auto protect = [&](int row, int column) {
               if (board[row][column] == 'O') {
                   board[row][column] = '#';
                   pending.push({row, column});
               }
           };

           for (int row = 0; row < rows; ++row) {
               protect(row, 0);
               protect(row, columns - 1);
           }
           for (int column = 0; column < columns; ++column) {
               protect(0, column);
               protect(rows - 1, column);
           }

           while (!pending.empty()) {
               auto [row, column] = pending.front();
               pending.pop();
               for (const auto& direction : directions) {
                   const int nextRow = row + direction[0];
                   const int nextColumn = column + direction[1];
                   if (nextRow >= 0 && nextRow < rows &&
                       nextColumn >= 0 && nextColumn < columns) {
                       protect(nextRow, nextColumn);
                   }
               }
           }

           for (auto& row : board) {
               for (char& cell : row) {
                   if (cell == 'O') {
                       cell = 'X';
                   } else if (cell == '#') {
                       cell = 'O';
                   }
               }
           }
       }

   public:
       void solve(std::vector<std::vector<char>>& board) {
           protectBoundaryComponents(board);
       }
   };

题解
----

原始问题为何容易产生重复搜索
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对一个内部 ``O``，最直接的问题是：“从这里沿 ``O`` 能否走到边界？”可以为每个格子单独做 DFS 或 BFS，
但同一区域中的每个起点都会重新走过几乎相同的格子；在一大片 ``O`` 中，搜索量可能从网格大小
``mn`` 膨胀到 ``O((mn)^2)``。而且在确定无法到边界之前不能提前翻转途中的格子，否则后续搜索看到的图已
被改变。

方案一：以连通分量为单位作决定
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``decideEveryComponent`` 使用全局 ``visited``，每个未访问 ``O`` 只启动一次 BFS。搜索时同时收集
``component``，并记录是否碰到任意边界；完成整个分量后，只有 ``touchesBoundary == false`` 才统一翻转。

这个方案把逐格重复判断压缩为逐分量判断，每个格子只搜索一次，时间已是 ``O(mn)``。不过每个分量仍需
保存格子列表，等到“是否接触边界”确定后再决定是否回写；还要同时维护 ``visited`` 和原网格两套状态。

结构反转：应翻转集合的补集更容易找到
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

一个区域“不被围绕”当且仅当它含有边界 ``O``。等价地，一个 ``O`` 应被保留，当且仅当存在一条全由
``O`` 组成的四方向路径把它连接到边界。所有安全格子因此可以从四条边上的 ``O`` 同时出发，一次连通搜索
直接得到；搜索结束后仍未标记的 ``O`` 恰好就是封闭区域。

这使算法不再为每个分量记录一个布尔结论和完整成员列表，而是先给安全补集打标记，最后对全网格做一次
确定性转换。

三种字符就是三个阶段状态
~~~~~~~~~~~~~~~~~~~~~~~~~~

输入只允许 ``X`` 和 ``O``，所以搜索期间可借用 ``#`` 表示“原本是 ``O``，并且已经证明与边界连通”：

.. list-table::
   :header-rows: 1

   * - 搜索阶段字符
     - 含义
     - 最终动作
   * - ``X``
     - 原本就是阻挡格
     - 保持 ``X``
   * - ``O``
     - 尚未证明安全；搜索结束仍为此状态即封闭
     - 改为 ``X``
   * - ``#``
     - 已从边界到达的安全格
     - 恢复为 ``O``

``protect`` 在入队时立即把 ``O`` 改为 ``#``。这样同一格子被不同邻居看到时，只有第一次能够入队；角点
虽然会被行边界循环和列边界循环各检查一次，也不会重复进入队列。若推迟到出队才标记，一个格子可能在
处理前被多个邻居重复加入。

具体走读空边界与内部通道
~~~~~~~~~~~~~~~~~~~~~~~~

在自建网格中，初始化边界时只有左下角一组中的底边 ``O`` 入队并变为 ``#``。BFS 向上找到与它相邻的
另一个 ``O``，也标成 ``#``；上方封闭区域与这条通道之间隔着 ``X``，始终保持 ``O``。最终扫描将上方
四格翻为 ``X``，把两个 ``#`` 恢复为 ``O``。

若网格只有一行或一列，每个格子都在边界上。所有 ``O`` 会在初始化或随后的扩展中变为 ``#``，最终全部
恢复，因此自然得到“没有被围绕区域”，无需尺寸特判。空网格检查则必须发生在读取 ``board[0]`` 之前。

正确性、主解选择与复杂度
~~~~~~~~~~~~~~~~~~~~~~~~

从边界多源 BFS 标记的每个格子，都有一条由搜索父关系构成的 ``O`` 路径连接边界，所以确实不能翻转；
任意应保留的 ``O`` 也有这样一条路径，BFS 会从路径的边界端逐格到达它，所以不会漏标。于是未标记 ``O``
与“被围绕区域”完全相同，最终转换正确。

公开入口采用边界反向搜索：它和逐分量方案都是 ``O(mn)`` 时间，却利用网格字符原地记录访问状态，只需
队列最坏 ``O(mn)`` 空间，不再分配访问矩阵和分量列表。逐分量方案保留为直觉演进，因为它直接表达原始
判定；多源方案则把“先收集、后决定”变成“先保护、再翻转补集”。
