0003. Longest Substring Without Repeating Characters
====================================================

题目信息
--------

:题号: 0003
:难度: Medium
:主题: 字符串、滑动窗口、哈希表
:原题: `LeetCode 0003 <https://leetcode.com/problems/longest-substring-without-repeating-characters/>`_
:重点: 从重复检查连续子串，推导到维护无重复窗口，再利用字符最近位置直接跳过失效前缀

题目重述
--------

给定字符串 ``s``，需要返回其中不含重复字符的最长连续子串长度。子串必须对应原字符串中的一段连续区间，不能跳过字符重新组合；若存在多个等长答案，只返回长度。

字符串长度位于 ``[0, 5 * 10^4]``，其中可能包含英文字母、数字、符号和空格。空格与标点同样属于字符，参与重复判断；空字符串的答案为 ``0``。

自建示例
--------

* 普通重复：``s = "abcabcbb"``，最长无重复子串可以是 ``"abc"``，返回 ``3``；
* 最优区间位于中部：``s = "abcbadeaf"``，最长无重复子串为 ``"cbade"``，返回 ``5``；
* 重复字符连续出现：``s = "bbbbb"``，任意合法子串都只能包含一个 ``b``，返回 ``1``；
* 空格和符号：``s = "a b!a"``，``"a b!"`` 与 ``" b!a"`` 的长度都为 ``4``，返回 ``4``；
* 空字符串：``s = ""``，返回 ``0``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <array>
   #include <string>

   class Solution {
   private:
       int enumerateStarts(const std::string& s) {
           int best = 0;
           for (int left = 0; left < static_cast<int>(s.size()); ++left) {
               std::array<bool, 256> used{};
               for (int right = left; right < static_cast<int>(s.size()); ++right) {
                   const auto ch = static_cast<unsigned char>(s[right]);
                   if (used[ch]) {
                       break;
                   }
                   used[ch] = true;
                   best = std::max(best, right - left + 1);
               }
           }
           return best;
       }

       int shrinkWithSet(const std::string& s) {
           std::array<bool, 256> inWindow{};
           int left = 0;
           int best = 0;
           for (int right = 0; right < static_cast<int>(s.size()); ++right) {
               const auto ch = static_cast<unsigned char>(s[right]);
               while (inWindow[ch]) {
                   const auto removed = static_cast<unsigned char>(s[left]);
                   inWindow[removed] = false;
                   ++left;
               }
               inWindow[ch] = true;
               best = std::max(best, right - left + 1);
           }
           return best;
       }

       int jumpWithLastPosition(const std::string& s) {
           std::array<int, 256> last;
           last.fill(-1);
           int left = 0;
           int best = 0;
           for (int right = 0; right < static_cast<int>(s.size()); ++right) {
               const auto ch = static_cast<unsigned char>(s[right]);
               left = std::max(left, last[ch] + 1);
               last[ch] = right;
               best = std::max(best, right - left + 1);
           }
           return best;
       }

   public:
       int lengthOfLongestSubstring(std::string s) {
           return jumpWithLastPosition(s);
       }
   };

题解
----

原始搜索空间
~~~~~~~~~~~~

长度为 ``n`` 的字符串共有 ``n(n + 1) / 2`` 个非空连续子串。最直接的方法是固定左端点 ``left``，再不断扩展右端点 ``right``，使用字符表检查当前区间是否出现重复。

``enumerateStarts`` 为每个新左端点重新建立 ``used``。一旦遇到重复字符，继续扩大右端点只会保留已经存在的冲突，因此当前内层循环可以立即停止。

这个剪枝避免了检查同一左端点下更长的非法区间，但相邻左端点之间仍会重复扫描大量相同字符。最坏情况下，例如字符串中的字符长期不重复，每个左端点都可能一直扫描到末尾，总时间仍为 ``O(n²)``。

窗口状态复用
~~~~~~~~~~~~

右端点从左向右移动时，相邻候选区间通常共享大部分字符。重新为每个左端点检查整个区间，丢弃了这些已经确认的信息。

可以维护一个始终无重复的窗口 ``[left, right]``：

* ``right`` 每轮加入一个新字符；
* 若新字符与窗口内旧字符重复，右移 ``left``，删除失效前缀；
* 窗口重新合法后，用 ``right - left + 1`` 更新答案。

加入新字符之前，旧窗口已经无重复，所以本轮唯一可能新增的冲突只来自 ``s[right]``。算法不需要重新检查窗口中其他字符之间的关系。

字符集合窗口
~~~~~~~~~~~~

``shrinkWithSet`` 使用 ``inWindow`` 记录字符是否位于当前窗口中。若当前字符已经存在，就从窗口左端逐个移除字符，直到旧的同字符也被删除，再把当前字符加入窗口。

这一版已经把时间复杂度降为 ``O(n)``。右端点只前进 ``n`` 次，每个字符也最多被左端移出一次，所以两个指针的总移动次数为线性数量级。

集合只保存“是否存在”，不知道旧字符的具体位置。因此发生重复时，代码必须通过 ``while`` 循环逐个删除失效前缀。下一步优化不是改变渐进复杂度，而是让状态直接指出左边界应跳到哪里。

最近位置跳跃
~~~~~~~~~~~~

``jumpWithLastPosition`` 使用 ``last[ch]`` 保存字符 ``ch`` 在已扫描前缀中的最近下标。处理 ``right`` 处字符时，设其旧位置为 ``p``：

* 若 ``p < left``，旧字符已经位于窗口外，不会产生冲突；
* 若 ``p >= left``，窗口同时包含旧字符和当前字符，左边界必须移动到 ``p + 1``；
* 两种情况统一为 ``left = max(left, p + 1)``。

这里的 ``max`` 不能省略。左边界只能保持或右移，不能因为当前字符更早的一次出现而退回，否则会重新包含之前已经排除的重复字符。

更新左边界后再执行 ``last[ch] = right``，让当前位置成为后续扫描使用的最近位置。字符集合方案中的逐个删除循环因此消失，恢复窗口合法性只需一次边界更新。

状态推演
~~~~~~~~

以 ``s = "abcbadeaf"`` 为例：

.. list-table::
   :header-rows: 1

   * - ``right``
     - 字符
     - 旧位置
     - 原 ``left``
     - 新 ``left``
     - 当前窗口
     - ``best``
   * - 0
     - ``a``
     - -1
     - 0
     - 0
     - ``a``
     - 1
   * - 1
     - ``b``
     - -1
     - 0
     - 0
     - ``ab``
     - 2
   * - 2
     - ``c``
     - -1
     - 0
     - 0
     - ``abc``
     - 3
   * - 3
     - ``b``
     - 1
     - 0
     - 2
     - ``cb``
     - 3
   * - 4
     - ``a``
     - 0
     - 2
     - 2
     - ``cba``
     - 3
   * - 5
     - ``d``
     - -1
     - 2
     - 2
     - ``cbad``
     - 4
   * - 6
     - ``e``
     - -1
     - 2
     - 2
     - ``cbade``
     - 5
   * - 7
     - ``a``
     - 4
     - 2
     - 5
     - ``dea``
     - 5
   * - 8
     - ``f``
     - -1
     - 5
     - 5
     - ``deaf``
     - 5

处理下标 ``4`` 的 ``a`` 时，它的旧位置 ``0`` 已经位于窗口左侧，因此 ``left`` 保持为 ``2``。处理下标 ``7`` 的 ``a`` 时，旧位置 ``4`` 位于当前窗口内，左边界直接跳到 ``5``。

代码演进
~~~~~~~~

``enumerateStarts`` 使用两层循环：外层选择左端点，内层重新检查该起点能够扩展多远。瓶颈来自不同起点之间反复扫描相同字符。

``shrinkWithSet`` 保留上一个窗口的字符状态，外层左端枚举消失，改为两个只向右移动的边界。重复出现时仍需要逐个删除窗口前缀，因为布尔表只知道字符是否存在。

``jumpWithLastPosition`` 把布尔状态升级为最近下标。``while`` 删除循环和逐字符清理操作消失，左边界可以一次跳到旧字符之后。

三种实现对应三层认识：

* 不复用区间信息时，为每个左端点重新扩展；
* 维护合法窗口时，每个字符最多进入和离开窗口一次；
* 保存最近位置时，可以直接计算新的最小合法左边界。

公开入口采用 ``jumpWithLastPosition``。它保持 ``O(n)`` 时间，同时避免集合窗口发生冲突时的逐步删除操作。

复杂度分析
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 主要代价
   * - 固定左端扩展
     - ``O(n²)``
     - ``O(1)``
     - 为每个左端点重新扫描后续字符
   * - 字符集合窗口
     - ``O(n)``
     - ``O(1)``
     - 每个字符最多进入和移出窗口一次
   * - 最近位置跳跃
     - ``O(n)``
     - ``O(1)``
     - 每个字符执行一次位置读取与写入

题目字符可以按单字节字符处理，因此固定的 256 项数组记为 ``O(1)`` 工作空间。若推广到更大的字符域并改用哈希表，空间复杂度为 ``O(k)``，其中 ``k`` 是记录过的不同字符数量。

边界处理
~~~~~~~~

* 空字符串不会进入循环，初始答案 ``0`` 直接返回；
* 全部字符相同时，窗口每轮只保留当前字符，答案为 ``1``；
* 空格、数字和标点都通过同一字符索引参与重复判断；
* 使用 ``unsigned char`` 转换后再作为数组下标，避免有符号 ``char`` 产生负下标；
* 左边界通过 ``max`` 保证只向右移动，不会重新引入已经排除的重复字符。
