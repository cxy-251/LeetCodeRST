0216. Combination Sum III
========================

题目信息
--------

:题号: 0216. 组合总和 III
:难度: Medium
:主题: 回溯、组合枚举、剪枝、状态恢复
:原题: `LeetCode 0216 <https://leetcode.com/problems/combination-sum-iii/>`_
:重点: 递增组合、恰好 K 个、剩余和、可达范围剪枝

题目重述
--------

从数字 ``1`` 到 ``9`` 中恰好选择 ``k`` 个不同数字，使它们的总和等于 ``n``，返回所有满足条件的组合。
同一组数字的不同排列只算一组；结果中的数字按递增顺序排列，每个数字最多使用一次。``k`` 在 ``[1,9]``，
``n`` 在 ``[1,60]``，返回顺序不限。

自建示例
--------

``k=3,n=9`` 的结果为 ``[[1,2,6],[1,3,5],[2,3,4]]``。``[2,1,6]`` 和 ``[1,2,6]`` 使用同一组数字，不能重复返回。

``k=2,n=17`` 只有 ``[8,9]``；``k=3,n=7`` 只有 ``[1,2,4]``；``k=3,n=5`` 返回空数组，
因为三个不同正整数的最小和 ``1+2+3=6`` 已经超过目标。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       static int smallestSum(int start, int count) {
           int sum = 0;
           for (int value = start; value < start + count; ++value) sum += value;
           return sum;
       }

       static int largestSum(int count) {
           int sum = 0;
           for (int value = 9; value > 9 - count; --value) sum += value;
           return sum;
       }

       static void dfsWithoutBounds(int next, int slots, int remaining,
                                    std::vector<int>& path,
                                    std::vector<std::vector<int>>& answer) {
           if (slots == 0) {
               if (remaining == 0) answer.push_back(path);
               return;
           }
           for (int value = next; value <= 9; ++value) {
               path.push_back(value);
               dfsWithoutBounds(value + 1, slots - 1, remaining - value,
                                path, answer);
               path.pop_back();
           }
       }

       static void dfsPruned(int next, int slots, int remaining,
                             std::vector<int>& path,
                             std::vector<std::vector<int>>& answer) {
           if (slots == 0) {
               if (remaining == 0) answer.push_back(path);
               return;
           }
           if (remaining < 0 || 9 - next + 1 < slots) return;
           if (remaining < smallestSum(next, slots) ||
               remaining > largestSum(slots)) {
               return;
           }

           for (int value = next; value <= 9; ++value) {
               if (value > remaining) break;
               path.push_back(value);
               dfsPruned(value + 1, slots - 1, remaining - value,
                         path, answer);
               path.pop_back();
           }
       }

   public:
       std::vector<std::vector<int>> combinationSum3(int k, int n) {
           std::vector<std::vector<int>> answer;
           std::vector<int> path;
           dfsPruned(1, k, n, path, answer);
           return answer;
       }
   };

题解
----

从子集和排列中删除重复
~~~~~~~~~~~~~~~~~~~~~~~~

把 1 到 9 的每个数字标记为选或不选，可以枚举 ``2^9`` 个子集，再检查选中数量和总和；它不会漏解，却没有利用“组合不计顺序”。
若每层从所有数字任意挑选，还会为同一组数字生成 ``k!`` 种排列，再依靠排序或集合去重。

回溯按递增顺序选择候选。状态中的 ``next`` 表示下一层只能从哪个数字开始，选择 ``value`` 后递归到 ``value+1``；
这样路径天然严格递增，同一组数字只有一条生成路径，``next`` 同时替代了 ``used`` 数组和结果去重集合。

状态定义与剪枝
~~~~~~~~~~~~~~

``dfs(next, slots, remaining)`` 表示当前 ``path`` 已经是合法递增前缀，还需要从 ``[next,9]`` 选择 ``slots`` 个数字，
使它们的和为 ``remaining``。进入函数时保持：

* ``path.size() == k - slots``，路径严格递增且没有重复；
* ``path`` 的和为 ``n - remaining``；
* 小于 ``next`` 的数字已经决定，不会在后续重新出现。

如果可用数字不足 ``slots`` 个，分支不可能完成；若 ``slots==0``，只有 ``remaining==0`` 才能收集路径。
进一步从 ``next`` 取最小的 ``slots`` 个数得到未来最小和，从 9 向下取最大的 ``slots`` 个数得到未来最大和；
若 ``remaining`` 不在这个闭区间内，整棵后续搜索树都可以删除。循环中当 ``value > remaining`` 时也可停止，
因为后续候选更大且所有数字为正。

上界从 9 开始计算可能比“从 ``next`` 开始还能拿到的最大和”宽松，但它始终是安全上界：可用数字越少只会让真实最大和更小，
不会把可行分支误判为不可行。候选域固定为 1 到 9，这个常数级计算换来的是在递归入口一次性判断整棵子树。

递增回溯如何覆盖且只覆盖组合
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

在任意状态，目标组合的下一位一定是 ``[next,9]`` 中的某个数字。循环逐一尝试候选，递归负责更大的后缀，
所以任何递增组合都会沿其唯一的数字顺序被走到。反过来，递归参数改为 ``value+1``，使后续数字严格更大，
因此生成的每条路径都合法且不会把同一组数字换顺序再次生成。

以 ``k=3,n=9`` 为例，选择 1 后下一层从 2 开始，可以生成 ``[1,2,6]`` 和 ``[1,3,5]``；回溯弹出 1 后选择 2，
下一层从 3 开始生成 ``[2,3,4]``，不会重复生成以 1 开头的组合。

上下界剪枝删除了哪部分搜索
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

不做剪枝时，``dfsWithoutBounds`` 会继续走完所有递增的 ``k`` 元子集，即使剩余和已经不可能变成 0。
例如进入 ``dfs(1,3,5)`` 时，未来最小和为 6，所有分支都只会更大，整个调用可以立即返回；若还需 3 个数字但最大可取和 ``9+8+7=24``
仍小于剩余目标，也同样不必展开。

这些上下界只使用候选集合的单调事实，不依赖某个具体解。它们删除的是整棵不可能子树，而不是在叶节点逐条确认失败，
所以不会跳过合法组合。

状态走读
~~~~~~~~

对 ``k=3,n=9``，成功分支和剪枝分支如下：

.. list-table::
   :header-rows: 1

   * - 调用状态
     - 选择或判断
     - 下一状态
   * - ``dfsPruned(1,3,9)``
     - 选 1
     - ``dfsPruned(2,2,8)``，路径 ``[1]``
   * - ``dfsPruned(2,2,8)``
     - 选 2
     - ``dfsPruned(3,1,6)``，路径 ``[1,2]``
   * - ``dfsPruned(3,1,6)``
     - 选 6
     - ``dfsPruned(7,0,0)``，收集 ``[1,2,6]``
   * - 回溯到 ``dfsPruned(2,2,8)``
     - 选 3
     - 后续剩余 5，继续得到 ``[1,3,5]``
   * - ``dfsPruned(1,3,5)``
     - 最小未来和 6 大于 5
     - 立即返回，不展开子树

``path.pop_back()`` 必须紧跟递归返回：它撤销当前分支的最后一个选择，使兄弟分支重新看到相同的父状态。
答案保存的是路径副本，之后的回溯不会改变已经收集的组合。

代码演进
~~~~~~~~

``dfsWithoutBounds`` 先展示只靠递增约束的完整组合枚举；它删除了排列重复，但仍会访问大量和不可能的状态。
``dfsPruned`` 增加可用数量、剩余和上下界以及 ``value > remaining`` 的剪枝，主入口选择它以压缩实际搜索。
``smallestSum`` 和 ``largestSum`` 不改变路径，只负责在进入下一层前证明“剩余槽位是否仍有可能补出目标”。

复杂度与边界
~~~~~~~~~~~~

固定候选集只有 9 个数，未剪枝的状态上界为 ``O(2^9)``；每个状态的上下界计算最多循环 9 次，视为常数。递归深度和路径空间为 ``O(k)``，
返回结果空间另计。``k=9``、目标小于最小和或大于最大和、``slots==0`` 等边界都由同一状态转移处理。
