0127. Word Ladder
=================

题目信息
--------

:题号: 0127. 单词接龙
:难度: Hard
:主题: 图、广度优先搜索、双向搜索、哈希集合
:原题: `LeetCode 0127 <https://leetcode.com/problems/word-ladder/>`_
:重点: 把单词变换建模为无权最短路，按需生成邻居，并用双向 BFS 缩小搜索前沿

题目重述
--------

给定 ``beginWord``、``endWord`` 和字典 ``wordList``。每次必须恰好修改一个字母，修改后得到的单词必须
在字典中；起点本身可以不在字典中。返回最短变换序列包含的单词数量，起点和终点都计数；无法到达时返回
``0``。

所有单词长度相同，只包含小写英文字母，字典中的单词互不相同，且 ``beginWord != endWord``。

自建示例
--------

* ``cold`` 到 ``warm``，字典为 ``["cord", "card", "ward", "warm", "bold"]``：最短序列
  ``cold -> cord -> card -> ward -> warm`` 含五个单词，返回 ``5``；
* ``hit`` 到 ``cog``，字典为 ``["hot", "dot", "dog"]``：终点不在字典中，返回 ``0``；
* ``aaa`` 到 ``aab``，且字典含 ``aab``：两词直接相连，返回 ``2``，不是变换次数 ``1``。

C++ 实现
--------

.. code-block:: cpp

   #include <queue>
   #include <string>
   #include <unordered_set>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       bool differsByOne(const std::string& first, const std::string& second) {
           int differences = 0;
           for (int index = 0; index < static_cast<int>(first.size()); ++index) {
               if (first[index] != second[index]) {
                   ++differences;
                   if (differences > 1) {
                       return false;
                   }
               }
           }
           return differences == 1;
       }

       int scanDictionaryForEveryNode(
           const std::string& beginWord,
           const std::string& endWord,
           const std::vector<std::string>& wordList
       ) {
           std::unordered_set<std::string> unused(wordList.begin(), wordList.end());
           if (!unused.count(endWord)) {
               return 0;
           }
           std::queue<std::string> queue;
           queue.push(beginWord);
           unused.erase(beginWord);
           int sequenceLength = 1;

           while (!queue.empty()) {
               int levelSize = static_cast<int>(queue.size());
               while (levelSize-- > 0) {
                   const std::string word = queue.front();
                   queue.pop();
                   if (word == endWord) {
                       return sequenceLength;
                   }
                   for (auto it = unused.begin(); it != unused.end();) {
                       if (differsByOne(word, *it)) {
                           queue.push(*it);
                           it = unused.erase(it);
                       } else {
                           ++it;
                       }
                   }
               }
               ++sequenceLength;
           }
           return 0;
       }

       int bfsWithGeneratedNeighbors(
           const std::string& beginWord,
           const std::string& endWord,
           const std::vector<std::string>& wordList
       ) {
           std::unordered_set<std::string> unused(wordList.begin(), wordList.end());
           if (!unused.count(endWord)) {
               return 0;
           }
           std::queue<std::string> queue;
           queue.push(beginWord);
           unused.erase(beginWord);
           int sequenceLength = 1;

           while (!queue.empty()) {
               int levelSize = static_cast<int>(queue.size());
               while (levelSize-- > 0) {
                   std::string word = queue.front();
                   queue.pop();
                   if (word == endWord) {
                       return sequenceLength;
                   }
                   for (int index = 0; index < static_cast<int>(word.size()); ++index) {
                       const char original = word[index];
                       for (char ch = 'a'; ch <= 'z'; ++ch) {
                           word[index] = ch;
                           if (unused.erase(word)) {
                               queue.push(word);
                           }
                       }
                       word[index] = original;
                   }
               }
               ++sequenceLength;
           }
           return 0;
       }

       int bidirectionalBfs(
           const std::string& beginWord,
           const std::string& endWord,
           const std::vector<std::string>& wordList
       ) {
           std::unordered_set<std::string> unused(wordList.begin(), wordList.end());
           if (!unused.count(endWord)) {
               return 0;
           }

           std::unordered_set<std::string> front{beginWord};
           std::unordered_set<std::string> back{endWord};
           unused.erase(beginWord);
           unused.erase(endWord);
           int sequenceLength = 2;

           while (!front.empty() && !back.empty()) {
               if (front.size() > back.size()) {
                   front.swap(back);
               }
               std::unordered_set<std::string> nextFront;
               for (std::string word : front) {
                   for (int index = 0; index < static_cast<int>(word.size()); ++index) {
                       const char original = word[index];
                       for (char ch = 'a'; ch <= 'z'; ++ch) {
                           word[index] = ch;
                           if (back.count(word)) {
                               return sequenceLength;
                           }
                           if (unused.erase(word)) {
                               nextFront.insert(word);
                           }
                       }
                       word[index] = original;
                   }
               }
               front = std::move(nextFront);
               ++sequenceLength;
           }
           return 0;
       }

   public:
       int ladderLength(
           std::string beginWord,
           std::string endWord,
           std::vector<std::string>& wordList
       ) {
           return bidirectionalBfs(beginWord, endWord, wordList);
       }
   };

题解
----

从原始搜索空间开始
~~~~~~~~~~~~~~~~~~

一个状态是当前单词，一步选择是修改某个位置为另一个字母。若不做约束，长度为 ``L`` 的小写单词共有
``26^L`` 个；题目给出的字典把可进入状态限制为有限集合。把合法单词看成节点，恰好相差一个字母的两个
节点之间连边，每条边都代表一次等价的变换，问题就成为无权图最短路。

DFS 适合寻找“是否存在路径”，却不能保证第一条到达终点的路径最短，还要处理环和全局最优值。BFS 按距
起点的边数逐层扩展，因此首次到达终点时，所有更短层都已检查，得到的必是最短长度。

方案一：对每个节点扫描剩余字典
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

最直接的邻居查找方式，是从当前单词出发，逐个比较所有尚未访问的字典单词。``differsByOne`` 统计不同
位置，恰好一个不同时就是邻居；``scanDictionaryForEveryNode`` 将发现的单词立即入队并从 ``unused`` 删除。

删除是安全的，因为本题只求长度，不需要像“单词接龙 II”那样保留同层多前驱。一个单词第一次被 BFS
发现时距离已经最短；以后再到达只会得到相同或更长距离，不可能改善最终答案。入队即删还能阻止同一层把
它重复加入队列。

该方案把图定义直接翻译成比较，但若最终访问 ``N`` 个单词，每个节点又扫描大部分字典，重复工作接近
``O(N^2L)``：绝大多数比较只是再次确认两个单词不是邻居。

方案二：反过来生成所有可能邻居
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

题目提供了比“两词是否相邻”更强的结构：邻居必须只改一个位置，而每个位置只有 26 种字母。对当前单词
依次替换每个字符，再用哈希集合判断候选是否存在，只需检查 ``O(26L)`` 个模式，不再扫描整个字典。

``bfsWithGeneratedNeighbors`` 中 ``unused.erase(word)`` 同时完成成员判断与访问标记：返回非零表示候选原本
存在且是第一次发现，于是入队；返回零表示候选不在字典或已经访问，不再处理。循环也会尝试原字母，但原
单词早已从 ``unused`` 删除，因此不会产生自环。

BFS 层数映射到返回值
~~~~~~~~~~~~~~~~~~~~

``sequenceLength`` 表示当前队列层中任一单词对应的序列长度。初始队列只有起点，所以从 ``1`` 开始；完成
整层后增加一。若 ``aaa`` 在第一层生成 ``aab``，``aab`` 位于第二层，出队时返回 ``2``。这里返回的是
单词数，不是边数，初始化为零会造成统一的少一错误。

方案三：从两端压缩搜索前沿
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

单向 BFS 的距离已经最优，但当每个节点有许多邻居、最短路径较深时，前沿会呈指数式膨胀。因为变换关系
是无向的，可以同时维护起点侧 ``front`` 和终点侧 ``back``；每扩展一层，就让已计入的序列长度增加一，
生成候选落入另一侧当前前沿时，两段路径接合。

代码始终扩展节点数较少的一侧。``front.swap(back)`` 只交换搜索方向，不改变两侧已经扩展的总层数；
``sequenceLength`` 记录的是两侧深度之和加上两个端点，因此仍在每轮统一递增。未访问集合由两侧共享，任一
单词被某侧发现后立即删除，避免两棵搜索树内部重复展开。

具体走读
~~~~~~~~

以 ``cold`` 到 ``warm`` 为例，忽略无关分支：

.. list-table::
   :header-rows: 1

   * - 待连接长度
     - 扩展前沿
     - 生成结果
   * - 2
     - 起点侧 ``{cold}``
     - ``{cord, bold}``
   * - 3
     - 终点侧 ``{warm}``
     - ``{ward}``
   * - 4
     - 终点侧 ``{ward}``
     - ``{card}``
   * - 5
     - 较小的一侧生成 ``cord`` 或 ``card``
     - 命中另一前沿，返回 ``5``

实际扩展哪一侧由集合大小决定，不要求严格交替。关键不变量是：``front``、``back`` 分别代表两棵 BFS 树
尚待连接的最浅边界；只有整层生成完才用 ``nextFront`` 替换当前边界。

主解选择与复杂度
~~~~~~~~~~~~~~~~

公开入口采用双向 BFS。它比单向方案多维护一个前沿并增加相遇长度的推理成本，但在常见分支较多的图中能
显著减少实际访问节点；若更重视实现简洁，``bfsWithGeneratedNeighbors`` 是同样正确的稳健方案。逐词扫描
只保留为原始基线，因为它没有利用单字符变化结构。

设访问节点数为 ``N``、单词长度为 ``L``。逐词扫描最坏时间 ``O(N^2L)``。按需生成邻居时，每个节点尝试
``26L`` 个候选，字符串构造和哈希需要 ``O(L)``，期望时间 ``O(26NL^2)``，空间 ``O(NL)``。双向 BFS
不改变最坏渐进上界，但通常把搜索深度从约 ``d`` 分摊到两端，实际前沿远小于单向搜索。
