0212. Word Search II
====================

题目信息
--------

:题号: 0212. 单词搜索 II
:难度: Hard
:主题: Trie、二维棋盘、深度优先搜索、回溯剪枝
:原题: `LeetCode 0212 <https://leetcode.com/problems/word-search-ii/>`_
:重点: 四邻接路径、路径内不可复用格子、共享前缀剪枝、结果去重

题目重述
--------

给定一个由小写英文字母组成的 ``m x n`` 棋盘 ``board``，以及一个单词数组 ``words``，返回其中能够在棋盘中找到的所有
单词，返回顺序不限。一个单词必须从任意格子开始，随后每次移动到上、下、左、右的相邻格，按访问顺序拼出字符；不能
对角移动，同一条路径中同一个格子不能使用两次。输入单词互不相同，结果中每个找到的单词也只能出现一次。

棋盘行列数最多为 12，单词数量最多为 ``3 * 10^4``，单词长度最多为 10。搜索过程可以临时改变棋盘来标记访问状态，
但递归返回时应恢复字符，避免一个起点或一条分支污染其他路径。

自建示例
--------

共享前缀由不同路径继续：

.. code-block:: text

   board = [[c,a,t],
            [r,r,e],
            [d,o,g]]
   words = ["cat", "car", "care", "dog", "card"]
   输出 = ["cat", "car", "care", "dog"]（顺序不限）

``cat`` 沿第一行找到，``car`` 和 ``care`` 共用 ``c-a-r`` 前缀，``dog`` 在底行找到；``card`` 要从 ``r`` 对角走到
``d``，不满足四邻接规则。

同一格不能在一条路径中重复使用：

.. code-block:: text

   board = [[a,b],
            [c,d]]
   words = ["abd", "aba", "acdb"]
   输出 = ["abd", "acdb"]

``abd`` 的路径是 ``a-b-d``，``acdb`` 的路径是 ``a-c-d-b``；``aba`` 若从唯一的 ``a`` 出发，最后必须再次回到起点，
因此不能找到。棋盘标记若不在回溯时恢复，第二条合法路径也会被误删。

C++ 实现
--------

.. code-block:: cpp

   #include <array>
   #include <memory>
   #include <string>
   #include <vector>

   class Solution {
   private:
       struct Node {
           std::array<std::unique_ptr<Node>, 26> children{};
           std::string word;
       };

       Node root_;

       void insert(const std::string& word) {
           Node* node = &root_;
           for (char character : word) {
               const int index = character - 'a';
               if (node->children[index] == nullptr) {
                   node->children[index] = std::make_unique<Node>();
               }
               node = node->children[index].get();
           }
           node->word = word;
       }

       void searchFrom(int row, int column, Node* parent,
                      std::vector<std::vector<char>>& board,
                      std::vector<std::string>& answer) {
           if (row < 0 || row >= static_cast<int>(board.size()) ||
               column < 0 || column >= static_cast<int>(board[0].size())) {
               return;
           }

           const char character = board[row][column];
           if (character == '#') return;
           Node* node = parent->children[character - 'a'].get();
           if (node == nullptr) return;

           if (!node->word.empty()) {
               answer.push_back(node->word);
               node->word.clear();
           }

           board[row][column] = '#';
           searchFrom(row + 1, column, node, board, answer);
           searchFrom(row - 1, column, node, board, answer);
           searchFrom(row, column + 1, node, board, answer);
           searchFrom(row, column - 1, node, board, answer);
           board[row][column] = character;
       }

   public:
       std::vector<std::string> findWords(std::vector<std::vector<char>>& board,
                                          std::vector<std::string>& words) {
           for (const std::string& word : words) insert(word);

           std::vector<std::string> answer;
           if (board.empty() || board[0].empty()) return answer;
           for (int row = 0; row < static_cast<int>(board.size()); ++row) {
               for (int column = 0;
                    column < static_cast<int>(board[0].size()); ++column) {
                   searchFrom(row, column, &root_, board, answer);
               }
           }
           return answer;
       }
   };

题解
----

逐词 DFS 的原始空间
~~~~~~~~~~~~~~~~~~~~

最直接的方案是对每个 ``word`` 单独做棋盘 DFS：从每个格子尝试作为首字母，匹配成功后递归四个方向，并用
``visited`` 防止同一路径重复使用格子。它逐个检查了所有目标词，所以不会漏词；越界、字符不匹配或重复使用格子时，
当前路径立即失败。

瓶颈在于不同单词会重复走同一段棋盘路径。字典同时含 ``car``、``care``、``card`` 时，三个搜索都会先走出 ``c-a-r``，
直到后面才分叉。设棋盘为 ``m x n``、单词数为 ``W``、最大长度为 ``L``，这种方法最坏接近 ``O(Wmn * 4 * 3^(L-1))``。
反过来，先枚举所有棋盘路径再与字典比较，会生成大量根本不是任何单词前缀的字符串；两种做法都没有把“共享前缀”变成状态。

Trie 与棋盘 DFS 合并两层搜索
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

把所有单词先插入 Trie。Trie 节点表示一个词前缀，边表示追加的字符，终止节点保存对应完整单词。联合 DFS 同时维护：

* 棋盘路径决定当前字符；
* Trie 子节点决定这个字符是否仍有词可接；
* 终止单词决定何时写入结果；
* 临时棋盘标记决定当前路径能否再次进入某格。

因此同一个 ``c-a-r`` 状态只需走一次；若当前字符没有对应子节点，当前路径已经不是任何目标词的前缀，继续添加字符也
不可能挽救它，分支可以立刻剪枝。终止节点保存完整单词文本，命中后把 ``word`` 清空即可抑制重复输出，但不能删除节点，
因为 ``car`` 被找到后仍要沿它的子树继续找到 ``care``。

递归状态与不变量
~~~~~~~~~~~~~~~~

``searchFrom(row, column, parent)`` 的入口含义是：将棋盘格 ``(row,column)`` 的字符接到 ``parent`` 所代表的前缀后面。
成功进入函数后保持以下不变量：

* 坐标在棋盘内，当前格尚未被本条递归路径使用；
* 从本次起点到当前格的字符序列，恰好等于 Trie 根到当前 ``node`` 的路径；
* 路径只经过四邻接移动，已标记格正好是当前递归栈上的格子；
* 找到的终止词只会被清空输出标记，不会改变 Trie 的前缀结构；
* 函数返回时当前格恢复为进入前的字符，其他起点看到的棋盘保持不变。

转移顺序不能任意调换：先检查越界、``'#'`` 和 Trie 子节点，避免无效路径写入状态；再提交完整词；随后把当前格改成
``'#'``，递归四个方向，最后恢复原字符。标记必须发生在递归之前，否则相邻回到当前格会形成非法环；恢复必须发生在
所有子调用之后，否则同一条路径的兄弟方向和后续起点会错误地认为该格已使用。这里的 ``'#'`` 不会与输入字符冲突，
因为题目棋盘只含小写字母。

状态走读
~~~~~~~~

对前面棋盘中的 ``car`` 路径，从左上角 ``c`` 开始时，Trie 和棋盘状态如下：

.. list-table::
   :header-rows: 1

   * - 递归阶段
     - Trie 前缀
     - 棋盘标记
     - 下一步
   * - 起点
     - ``c``
     - ``(0,0)`` 标为 ``#``
     - 可走右侧 ``a`` 或下侧 ``r``；只有 ``a`` 是 Trie 子节点
   * - 第二格
     - ``ca``
     - ``(0,1)`` 也标为 ``#``
     - 向下到 ``r``，得到 ``car``
   * - 终点
     - ``car``
     - 三个格子均在当前路径
     - ``node->word`` 非空，提交 ``car`` 并清空它
   * - 回溯
     - 返回 ``ca``、再返回 ``c``
     - 依次恢复 ``a``、``c``
     - 其他起点仍能使用这些格子，``care`` 也可沿 ``r-e`` 继续

如果从 ``car`` 终点继续尝试 ``card``，Trie 仍有 ``d`` 子节点时会继续 DFS；如果下一格是对角线位置，四次递归都不会
进入它，路径被正确拒绝。清空 ``car`` 的终止字符串不影响 ``care`` 节点的子树，正是“去重但不剪掉长词”的区别。

代码演进与方案选择
~~~~~~~~~~~~~~~~~~~~

``Node`` 用 ``word`` 保存终止词，避免递归返回时重新拼接当前路径字符串；这也让找到结果后的去重成为一次 ``clear``。
``children`` 使用智能指针管理 Trie 所有权，``insert`` 只为缺失边创建节点，公共前缀不会重复分配。

``searchFrom`` 把当前字符从棋盘读出后立即查 ``parent`` 的对应边；没有额外的“当前 Trie 节点字符串”，因为递归链已经
隐含了完整前缀。棋盘原地标记后在四个方向返回时恢复，因而状态只在当前递归路径有效，不把一个起点的访问痕迹带给下一个起点。

公共入口先建立一次 Trie，再从每个格子启动联合搜索。它没有在找到一个词后删除 Trie 节点：节点可能仍是更长词的前缀，
只清空终止词字段即可完成结果去重。

逐词 DFS 只在一个词的搜索中共享路径状态；联合 Trie DFS 把多个词的公共前缀提升为全局状态，删除了重复的棋盘走法。
直接生成所有棋盘路径再和字典比较则会产生大量没有词前缀的字符串，主解选择“棋盘路径与 Trie 边同时推进”，
因为每一步都能用字典前缀立即剪枝。

复杂度与边界
~~~~~~~~~~~~

设所有单词字符总数为 ``S``，Trie 节点数为 ``T``，棋盘 DFS 实际进入的合法状态数为 ``Q``，输出字符总量为 ``Z``。
建 Trie 时间为 ``O(S)``，固定 26 个子指针占 ``O(26T)`` 空间，常数字母表下记为 ``O(T)``；搜索时间按实际状态数
计为 ``O(Q)``。不考虑剪枝时，单一起点长度为 ``L`` 的路径上界约为 ``4 * 3^(L-1)``，真实状态还会受 Trie 前缀限制。

递归栈最多 ``O(min(L, mn))``，棋盘标记不另建矩阵；返回结果占 ``O(Z)``。空棋盘返回空结果；单格棋盘只会检查一次；
长度相同的重复路径不会重复输出，因为终止词第一次命中后被清空；共享前缀的更长单词仍可继续搜索。
