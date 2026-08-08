0126. Word Ladder II
====================

题目信息
--------

:题号: 0126. 单词接龙 II
:难度: Hard
:主题: 图、广度优先搜索、最短路径 DAG、回溯
:原题: `LeetCode 0126 <https://leetcode.com/problems/word-ladder-ii/>`_
:重点: 用 BFS 确定最短层并保留同层多前驱，再沿最短路径 DAG 恢复全部序列

题目重述
--------

给定起始单词 ``beginWord``、目标单词 ``endWord`` 和字典 ``wordList``，返回从起点变换到终点的所有最短
序列。相邻单词必须恰好有一个位置的字母不同，每次变换后的单词都必须属于字典；``beginWord`` 可以不在
字典中。每条答案都包含起点和终点，答案之间的顺序不限；若终点不在字典中或无法到达，返回空数组。

所有单词长度相同，只包含小写英文字母，字典内没有重复单词，且 ``beginWord != endWord``。

自建示例
--------

* ``beginWord = "red"``、``endWord = "tax"``、字典为
  ``["ted", "tex", "tad", "tax", "rex"]``，三条最短序列是
  ``red -> ted -> tad -> tax``、``red -> ted -> tex -> tax`` 和
  ``red -> rex -> tex -> tax``；
* ``beginWord = "hit"``、``endWord = "cog"``，若字典没有 ``cog``，返回空数组，即使存在通向其他
  单词的变换；
* 若 ``aaa -> aab -> abb`` 与 ``aaa -> aba -> abb`` 都合法，则 ``abb`` 必须同时保留 ``aab`` 和
  ``aba`` 两个上一层来源，否则会漏掉一条最短序列。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <queue>
   #include <string>
   #include <unordered_map>
   #include <unordered_set>
   #include <vector>

   class Solution {
   private:
       std::vector<std::string> validNeighbors(
           const std::string& word,
           const std::unordered_set<std::string>& dictionary
       ) {
           std::vector<std::string> result;
           std::string candidate = word;
           for (int index = 0; index < static_cast<int>(candidate.size()); ++index) {
               const char original = candidate[index];
               for (char ch = 'a'; ch <= 'z'; ++ch) {
                   if (ch == original) {
                       continue;
                   }
                   candidate[index] = ch;
                   if (dictionary.count(candidate)) {
                       result.push_back(candidate);
                   }
               }
               candidate[index] = original;
           }
           return result;
       }

       std::vector<std::vector<std::string>> queueCompletePaths(
           const std::string& beginWord,
           const std::string& endWord,
           const std::unordered_set<std::string>& dictionary
       ) {
           std::queue<std::vector<std::string>> paths;
           paths.push({beginWord});
           std::unordered_set<std::string> unused = dictionary;
           unused.erase(beginWord);
           std::vector<std::vector<std::string>> answer;

           while (!paths.empty() && answer.empty()) {
               int levelSize = static_cast<int>(paths.size());
               std::unordered_set<std::string> usedThisLevel;
               while (levelSize-- > 0) {
                   std::vector<std::string> path = std::move(paths.front());
                   paths.pop();
                   for (const std::string& next : validNeighbors(path.back(), unused)) {
                       std::vector<std::string> extended = path;
                       extended.push_back(next);
                       if (next == endWord) {
                           answer.push_back(std::move(extended));
                       } else {
                           paths.push(std::move(extended));
                       }
                       usedThisLevel.insert(next);
                   }
               }
               for (const std::string& word : usedThisLevel) {
                   unused.erase(word);
               }
           }
           return answer;
       }

       void restorePaths(
           const std::string& word,
           const std::string& beginWord,
           const std::unordered_map<std::string, std::vector<std::string>>& parents,
           std::vector<std::string>& reversedPath,
           std::vector<std::vector<std::string>>& answer
       ) {
           reversedPath.push_back(word);
           if (word == beginWord) {
               answer.emplace_back(reversedPath.rbegin(), reversedPath.rend());
           } else {
               auto found = parents.find(word);
               if (found != parents.end()) {
                   for (const std::string& parent : found->second) {
                       restorePaths(parent, beginWord, parents, reversedPath, answer);
                   }
               }
           }
           reversedPath.pop_back();
       }

       std::vector<std::vector<std::string>> buildShortestPathDag(
           const std::string& beginWord,
           const std::string& endWord,
           const std::vector<std::string>& wordList
       ) {
           std::unordered_set<std::string> dictionary(wordList.begin(), wordList.end());
           if (!dictionary.count(endWord)) {
               return {};
           }

           std::unordered_map<std::string, int> distance{{beginWord, 0}};
           std::unordered_map<std::string, std::vector<std::string>> parents;
           std::queue<std::string> queue;
           queue.push(beginWord);
           int targetDistance = -1;

           while (!queue.empty()) {
               const std::string word = queue.front();
               queue.pop();
               const int nextDistance = distance[word] + 1;
               if (targetDistance != -1 && nextDistance > targetDistance) {
                   continue;
               }

               for (const std::string& next : validNeighbors(word, dictionary)) {
                   auto found = distance.find(next);
                   if (found == distance.end()) {
                       distance[next] = nextDistance;
                       parents[next].push_back(word);
                       queue.push(next);
                       if (next == endWord) {
                           targetDistance = nextDistance;
                       }
                   } else if (found->second == nextDistance) {
                       parents[next].push_back(word);
                   }
               }
           }

           if (!distance.count(endWord)) {
               return {};
           }
           std::vector<std::vector<std::string>> answer;
           std::vector<std::string> reversedPath;
           restorePaths(endWord, beginWord, parents, reversedPath, answer);
           return answer;
       }

   public:
       std::vector<std::vector<std::string>> findLadders(
           std::string beginWord,
           std::string endWord,
           std::vector<std::string>& wordList
       ) {
           return buildShortestPathDag(beginWord, endWord, wordList);
       }
   };

题解
----

从单词序列还原成图问题
~~~~~~~~~~~~~~~~~~~~~~

把每个合法单词看成节点，恰好相差一个字母的两个单词之间连一条边。每次变换的代价都为一，于是题目不是
任意路径枚举，而是无权图中的“全部最短路径”。这两个限定缺一不可：DFS 能枚举路径，却可能先深入很长的
分支；普通 BFS 能得到最短距离，却若只给每个节点记录一个来源，又无法恢复全部答案。

邻居无需预先两两建图。对当前单词的每个位置尝试 ``a`` 到 ``z``，候选存在于哈希字典时，就得到一条真实
边。这样按需生成至多 ``25L`` 个不同候选，避免为字典中全部单词对做比较和保存完整邻接表。

方案一：BFS 队列直接保存完整路径
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

最接近原定义的方案把 ``[beginWord]`` 放入队列。BFS 每轮取出同样长度的路径，把每个合法邻居接到末尾；
首次出现终点的这一层就是最短层，但必须处理完整层，才能收齐其他同长度答案。

``queueCompletePaths`` 还揭示了一个容易写错的细节：本层发现的单词不能立刻从 ``unused`` 删除。假设
``aab`` 和 ``aba`` 位于同一层，它们都能到达 ``abb``；若第一条路径发现 ``abb`` 时就删除它，第二个
前驱对应的答案会消失。因此代码先放进 ``usedThisLevel``，完成整层后再统一删除。删除更早层访问过的单词
是安全的，因为重新到达它只会形成更长路径或环。

该方案正确且直接，但队列元素是路径而不是节点。大量候选共享同一前缀，代码仍要反复复制整条前缀；在
到达终点之前，许多最终不会成为答案的完整路径也会占用内存。瓶颈不在找邻居，而在过早展开并复制输出。

结构信息：最短路径只沿相邻层前进
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

BFS 首次发现节点时已经确定其最短距离。任何最短序列上的边都必须从距离 ``d`` 的节点走到距离 ``d+1``
的节点；若走向同层或更浅层，已经消耗一条边却没有增加到起点的最短距离，整条序列不可能仍然最短。

因此搜索阶段只需为每个节点保存：它的最短距离，以及所有能以相同最短距离到达它的上一层节点。共享前缀
不再复制为多份路径，而被压缩为一张“最短路径 DAG”；真正的组合展开推迟到确定能到达终点之后。

为何第一次发现后仍要接纳同层前驱
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

处理从 ``word`` 到 ``next`` 的边时，令候选距离为 ``distance[word] + 1``：

* ``next`` 从未发现：候选距离就是其最短距离，记录 ``word`` 并让 ``next`` 入队一次；
* ``next`` 已经以同一候选距离发现：不再重复入队，但追加 ``word``，因为它代表另一条最短路径；
* ``next`` 的已知距离更小：这条边会生成更长路线，不记录。

“节点只入队一次”压缩了搜索工作，“同距离前驱全部保留”保存了答案分叉，两者并不冲突。

终点出现后的停止边界
~~~~~~~~~~~~~~~~~~~~

首次发现 ``endWord`` 时得到 ``targetDistance``，但不能立即终止：队列中其他距离
``targetDistance - 1`` 的节点仍可能直接连到终点，或者补充其他最短层节点的前驱。代码继续处理所有
``nextDistance <= targetDistance`` 的节点，只停止生成更深一层。这样收齐最短 DAG，又不探索不可能属于
答案的更长后缀。

具体走读
~~~~~~~~

对示例 ``red -> tax``，BFS 保留的核心状态为：

.. list-table::
   :header-rows: 1

   * - 距离
     - 新发现节点
     - 记录的前驱
   * - 0
     - ``red``
     - 无
   * - 1
     - ``ted``、``rex``
     - ``ted <- red``、``rex <- red``
   * - 2
     - ``tad``、``tex``
     - ``tad <- ted``、``tex <- ted, rex``
   * - 3
     - ``tax``
     - ``tax <- tad, tex``

``tex`` 第一次由 ``ted`` 发现后已经入队；随后 ``rex`` 以相同距离到达它，只追加第二个前驱。回溯从
``tax`` 选择 ``tad`` 或 ``tex``，选择 ``tex`` 后又可选择 ``ted`` 或 ``rex``，恰好恢复三条序列。

回溯为何不重不漏
~~~~~~~~~~~~~~~~

每条记录边都让距离严格减一，所以沿 ``parents`` 反向移动不可能成环，最终只能到达起点。任一最短序列
在每一层都有一条对应前驱边，递归会枚举它，因此不漏；两次不同的前驱选择至少产生一个不同单词，因此不
重复。``reversedPath`` 维护“终点到当前节点”的选择，抵达起点时反向复制为正序答案，返回后弹出当前节点，
让兄弟分支复用同一缓冲区。

主解选择与复杂度
~~~~~~~~~~~~~~~~

公开入口采用 ``buildShortestPathDag``。相较完整路径 BFS，它增加了距离表和前驱表，却删除了搜索期间的
路径前缀复制；只有确实属于最短答案的 DAG 才会在回溯阶段展开。完整路径方案保留为直觉基线，适合展示
“整层延迟删除”的必要性，但不作为主解。

设字典大小为 ``N``、单词长度为 ``L``。每个被发现节点至多出队一次，每次尝试 ``O(26L)`` 个字符串，
构造和哈希字符串需要 ``O(L)``，搜索期望时间为 ``O(26NL^2)``。前驱 DAG 占用 ``O(N + E)`` 条记录；
回溯时间和答案空间必然与所有返回序列的字符总量成正比，无法由只依赖 ``N`` 的多项式上界替代。
