0546. Remove Boxes
==================

题目信息
--------

:题号: 0546
:难度: Hard
:主题: 连续同色盒子、删除顺序、区间状态、最大得分
:原题: `LeetCode 0546 <https://leetcode.com/problems/remove-boxes/>`_
:重点: 每次只能删除一段连续同色盒子、删除 k 个获得 k² 分、剩余部分拼接后可能形成新的同色连续段

题目重述
--------

给定整数数组 ``boxes``，每个整数表示一个盒子的颜色。一次操作可以选择当前数组中一段连续且颜色相同的 ``k`` 个盒子，将它们全部删除，并获得 ``k * k`` 分。

删除后，原来位于该段左右两侧的剩余盒子会直接相邻，可能形成新的同色连续段。可以自行决定每次删除顺序，返回删除全部盒子能够获得的最大总分。

自建示例
--------

先删除中间段可以合并两端：

.. code-block:: text

   输入：boxes = [1,2,2,1]
   输出：8
   解释：先删除两个 2 得 4 分，剩余两个 1 变为连续，再删除得 4 分，总分为 8。

全部同色：

.. code-block:: text

   输入：boxes = [3,3,3]
   输出：9
   解释：一次删除三个盒子可得 3²=9 分。

把可合并的同色盒子延迟处理
--------------------------

区间 ``[left,right]`` 之外已有 ``extra`` 个与 ``boxes[right]`` 同色的盒子紧贴在右侧时，若先删除 ``right``，只能得到 ``(extra+1)^2``；若把它和左侧同色盒子合并后再删除，可能获得更高分。因此状态定义为 ``dfs(left,right,extra)``，表示区间内盒子加上右侧额外同色盒子的最大得分。

先把 ``right`` 向左合并连续同色尾部，再考虑两种选择：立即删除这组盒子，或保留它，先删除中间部分以便与更左的同色盒子合并。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       std::vector<int> boxes;
       std::vector<std::vector<std::vector<int>>> memo;

       int search(int left, int right, int extra) {
           if (left > right) return 0;
           while (right > left && boxes[right] == boxes[right - 1]) {
               --right;
               ++extra;
           }
           int& cached = memo[left][right][extra];
           if (cached != -1) return cached;

           cached = (extra + 1) * (extra + 1) +
                    search(left, right - 1, 0);
           for (int middle = left; middle < right; ++middle) {
               if (boxes[middle] != boxes[right]) continue;
               cached = std::max(
                   cached,
                   search(left, middle, extra + 1) +
                   search(middle + 1, right - 1, 0));
           }
           return cached;
       }

   public:
       int removeBoxes(std::vector<int>& boxesValue) {
           boxes = boxesValue;
           int n = static_cast<int>(boxes.size());
           memo.assign(n, std::vector<std::vector<int>>(
               n, std::vector<int>(n + 1, -1)));
           return search(0, n - 1, 0);
       }
   };

代码分析
--------

``extra`` 记录了跨过已删除区间后仍可合并的同色数量，因而每个状态包含决定未来得分的全部信息；立即删除和延迟合并覆盖所有可能的最优顺序。状态数为 ``O(n^3)``，每个状态还可能枚举合并位置，时间复杂度上界为 ``O(n^4)``，空间复杂度为 ``O(n^3)``。
