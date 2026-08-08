0139. Word Break
================

题目信息
--------

:题号: 0139. 单词拆分
:难度: Medium
:主题: 字符串、动态规划、记忆化搜索、位置可达性
:原题: `LeetCode 0139 <https://leetcode.com/problems/word-break/>`_
:重点: 用切分位置表示已完整覆盖的前缀，将指数切分树压缩为有限位置状态，并只从可达位置传播

题目重述
--------

给定非空字符串 ``s`` 和字典 ``wordDict``，判断能否把 ``s`` 按原顺序完整切分成一个或多个非空字典词。
每次使用不会消耗字典词，所以同一个词可以在不同位置重复使用。只需返回是否存在至少一种合法切分，不必
输出具体方案。

自建示例
--------

* ``s = "mintmint"``、``wordDict = ["mint"]``：可切为 ``mint | mint``，返回 ``true``；
* ``s = "applepenx"``、字典为 ``["apple", "pen"]``：前八个字符可覆盖，但末尾 ``x`` 无法覆盖，
  返回 ``false``；
* ``s = "cars"``、字典为 ``["car", "ca", "rs"]``：``ca | rs`` 可行，不能因先尝试 ``car`` 失败
  就否定其他切点。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       bool matchesAt(
           const std::string& s,
           int start,
           const std::string& word
       ) {
           const int wordLength = static_cast<int>(word.size());
           return start + wordLength <= static_cast<int>(s.size()) &&
                  s.compare(start, wordLength, word) == 0;
       }

       bool searchEveryCut(
           const std::string& s,
           int start,
           const std::vector<std::string>& words
       ) {
           if (start == static_cast<int>(s.size())) {
               return true;
           }
           for (const std::string& word : words) {
               if (matchesAt(s, start, word) &&
                   searchEveryCut(
                       s,
                       start + static_cast<int>(word.size()),
                       words
                   )) {
                   return true;
               }
           }
           return false;
       }

       bool searchWithMemo(
           const std::string& s,
           int start,
           const std::vector<std::string>& words,
           std::vector<int>& memo
       ) {
           if (start == static_cast<int>(s.size())) {
               return true;
           }
           if (memo[start] != -1) {
               return memo[start] == 1;
           }

           for (const std::string& word : words) {
               const int next = start + static_cast<int>(word.size());
               if (matchesAt(s, start, word) &&
                   searchWithMemo(s, next, words, memo)) {
                   memo[start] = 1;
                   return true;
               }
           }
           memo[start] = 0;
           return false;
       }

       bool propagateReachablePrefixes(
           const std::string& s,
           const std::vector<std::string>& words
       ) {
           const int length = static_cast<int>(s.size());
           std::vector<bool> reachable(length + 1, false);
           reachable[0] = true;

           for (int start = 0; start < length; ++start) {
               if (!reachable[start]) {
                   continue;
               }
               for (const std::string& word : words) {
                   if (matchesAt(s, start, word)) {
                       const int end =
                           start + static_cast<int>(word.size());
                       reachable[end] = true;
                   }
               }
           }
           return reachable[length];
       }

   public:
       bool wordBreak(
           std::string s,
           std::vector<std::string>& wordDict
       ) {
           return propagateReachablePrefixes(s, wordDict);
       }
   };

题解
----

原始选择空间：下一段取哪个字典词
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

从位置 ``start`` 开始，可以尝试所有与当前后缀前缀匹配的字典词；选择一个后，进入它末尾之后的新位置。
``searchEveryCut`` 正是这棵选择树。抵达字符串末尾说明每一段都来自字典，返回真；一个分支失败后还要尝试
其他词，因为不同长度的匹配词会产生不同切点。

这比枚举所有 ``n-1`` 个切缝再验证更早删除了非字典片段，但仍可能指数增长。例如许多短词都能匹配
``"aaaa..."`` 的前缀，不同切分前缀会反复到达相同 ``start``，再完整尝试相同后缀。

后缀只由位置决定
~~~~~~~~~~~~~~~~

到达 ``start`` 后，未来能否完成只取决于 ``s[start..]`` 和固定字典，不取决于此前用了哪些词。字典词不是
消耗品，所以状态中也不需要“剩余词集合”。``searchWithMemo`` 为每个位置保存三种状态：``-1`` 尚未计算、
``0`` 不可完成、``1`` 可以完成。每个后缀只展开一次，指数路径树被压缩为至多 ``n`` 个位置状态。

短路分支也有明确含义：找到一个匹配词且其后缀可完成，就足以把当前状态记为真；只有所有匹配词都失败，
才能记为假。

字符边界构成一张有向无环图
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

字符串有 ``0..n`` 共 ``n+1`` 个边界位置。若字典词 ``word`` 在 ``start`` 处匹配，就存在一条
``start -> start + word.length`` 的边。边总是向更大下标前进，因此图无环；题目等价于判断节点 ``n`` 是否
从节点 ``0`` 可达。

记忆化搜索从终点反问后缀能否完成；主解则按下标拓扑顺序正向传播。令 ``reachable[i]`` 表示前 ``i`` 个
字符能否被若干字典词完整覆盖。空前缀 ``reachable[0] = true`` 是传播起点，并不表示字典含空词；题目
字符串非空，最终仍需沿至少一条非空单词边才能到达 ``n``。

为什么只能从可达起点传播
~~~~~~~~~~~~~~~~~~~~~~~~

某个词即使在位置 ``start`` 与后缀匹配，若 ``s[0..start-1]`` 无法完整切分，这条局部匹配也不能属于从
零出发的完整方案。代码先检查 ``reachable[start]``，只从已有合法前缀延伸；匹配成功后把词尾边界标为
可达。不可达位置无需尝试全部字典词，既是正确剪枝，也删除无效字符串比较。

具体走读词的重复使用
~~~~~~~~~~~~~~~~~~~~

对 ``s = "mintmint"``、字典 ``["mint"]``：

.. list-table::
   :header-rows: 1

   * - 起始边界
     - 当前状态
     - 匹配与传播
   * - ``0``
     - ``reachable[0] = true``
     - ``mint`` 匹配，标记 ``reachable[4]``
   * - ``1..3``
     - 不可达
     - 全部跳过
   * - ``4``
     - ``reachable[4] = true``
     - 再次尝试同一个 ``mint``，标记 ``reachable[8]``
   * - ``8``
     - 终点可达
     - 返回 ``true``

字典词只定义边的匹配规则，每个可达位置都会重新遍历字典，所以重复使用自然发生，不需要复制词或维护
使用次数。

代码顺序与边界
~~~~~~~~~~~~~~

``matchesAt`` 先检查单词不会越过字符串末尾，再调用定长 ``compare``，避免构造临时子串。正向 DP 按
``start`` 递增处理；所有入边都来自更小下标，所以访问一个位置时，它的可达性已经不会再被更晚位置改变。
即使终点提前标真，继续扫描也不影响结果；也可据此增加提前返回，但不是正确性所必需。

主解选择与复杂度
~~~~~~~~~~~~~~~~

公开入口采用前缀可达 DP，避免递归深度，状态含义也直接对应“完整覆盖”。设字符串长度为 ``n``、字典词数
为 ``D``、最大词长为 ``L``，最多从 ``n`` 个可达位置尝试 ``D`` 个词，每次比较 ``O(L)``，最坏时间
``O(nDL)``、空间 ``O(n)``。记忆化搜索具有相同数量的位置状态和类似匹配上界，但使用递归栈；无记忆 DFS
最坏为指数时间。三种代码保留的是从路径枚举、状态合并到迭代可达性的真实演进。
