0131. Palindrome Partitioning
=============================

题目信息
--------

:题号: 0131. 分割回文串
:难度: Medium
:主题: 字符串、回溯、区间动态规划、结果枚举
:原题: `LeetCode 0131 <https://leetcode.com/problems/palindrome-partitioning/>`_
:重点: 用起始下标表示未覆盖后缀，回溯枚举合法下一段，并预处理区间回文性以删除跨分支重复比较

题目重述
--------

给定字符串 ``s``，在字符之间选择若干切点，把它分成一组连续、非空片段。返回所有满足“每个片段都是
回文串”的完整切分方案。片段必须保持原顺序并恰好覆盖整个字符串，答案顺序不限。

自建示例
--------

* ``s = "abba"``：合法方案为 ``["a", "b", "b", "a"]``、``["a", "bb", "a"]`` 和
  ``["abba"]``；
* ``s = "abc"``：没有长度大于一的回文片段，唯一方案是 ``["a", "b", "c"]``；
* ``s = "aaa"``：``["a", "a", "a"]``、``["a", "aa"]``、``["aa", "a"]``、``["aaa"]``
  都合法，说明相同内容出现在不同位置时仍代表不同切分选择。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       bool isPalindrome(const std::string& s, int left, int right) {
           while (left < right) {
               if (s[left] != s[right]) {
                   return false;
               }
               ++left;
               --right;
           }
           return true;
       }

       void searchWithRepeatedChecks(
           const std::string& s,
           int start,
           std::vector<std::string>& path,
           std::vector<std::vector<std::string>>& answer
       ) {
           if (start == static_cast<int>(s.size())) {
               answer.push_back(path);
               return;
           }
           for (int end = start; end < static_cast<int>(s.size()); ++end) {
               if (!isPalindrome(s, start, end)) {
                   continue;
               }
               path.push_back(s.substr(start, end - start + 1));
               searchWithRepeatedChecks(s, end + 1, path, answer);
               path.pop_back();
           }
       }

       std::vector<std::vector<bool>> buildPalindromeTable(
           const std::string& s
       ) {
           const int length = static_cast<int>(s.size());
           std::vector<std::vector<bool>> palindrome(
               length,
               std::vector<bool>(length, false)
           );

           for (int left = length - 1; left >= 0; --left) {
               for (int right = left; right < length; ++right) {
                   const bool shortInterval = right - left <= 2;
                   palindrome[left][right] =
                       s[left] == s[right] &&
                       (shortInterval || palindrome[left + 1][right - 1]);
               }
           }
           return palindrome;
       }

       void searchWithTable(
           const std::string& s,
           int start,
           const std::vector<std::vector<bool>>& palindrome,
           std::vector<std::string>& path,
           std::vector<std::vector<std::string>>& answer
       ) {
           if (start == static_cast<int>(s.size())) {
               answer.push_back(path);
               return;
           }

           for (int end = start; end < static_cast<int>(s.size()); ++end) {
               if (!palindrome[start][end]) {
                   continue;
               }
               path.push_back(s.substr(start, end - start + 1));
               searchWithTable(s, end + 1, palindrome, path, answer);
               path.pop_back();
           }
       }

   public:
       std::vector<std::vector<std::string>> partition(std::string s) {
           const auto palindrome = buildPalindromeTable(s);
           std::vector<std::vector<std::string>> answer;
           std::vector<std::string> path;
           searchWithTable(s, 0, palindrome, path, answer);
           return answer;
       }
   };

题解
----

从所有切缝的选择开始
~~~~~~~~~~~~~~~~~~~~

长度为 ``n`` 的字符串有 ``n-1`` 个字符间隙，每个间隙都可以切或不切，因此原始切分空间有
``2^(n-1)`` 种。先生成所有切点组合，再逐段验证回文虽然完整，却会保留大量早已包含非回文段的无效后缀
选择；例如前一段确定为 ``"ab"`` 后，无论后面怎样切都不可能成为合法答案。

更有效的搜索状态是 ``start``：``s[0..start-1]`` 已被 ``path`` 中的回文片段完整、无重叠地覆盖，
``s[start..n-1]`` 仍待切分。下一步只需枚举第一段的结束位置 ``end``；若 ``s[start..end]`` 不是回文，
整类以它开头的切分直接删除，只有合法片段才进入递归。

位置图解释为何不会重漏
~~~~~~~~~~~~~~~~~~~~~~

把 ``0..n`` 这 ``n+1`` 个字符边界看成节点。若 ``s[start..end]`` 是回文，就有一条从 ``start`` 到
``end+1`` 的有向边。下标每次严格增大，所以这是一张 DAG；从 ``0`` 到 ``n`` 的每条路径恰好对应一组
合法切分。

任意合法方案的第一段都有唯一终点，外层循环会选择它，之后对剩余后缀重复同样论证，因此不会漏；两个
不同方案至少有一个切点不同，对应的边序列也不同，因此不会重复。

方案一：搜索时现查回文
~~~~~~~~~~~~~~~~~~~~~~

``searchWithRepeatedChecks`` 在需要区间时用双指针从两端向内比较。这比生成所有切分后再验证更早剪枝，且
代码与回文定义直接对应。不过同一区间的回文性可能被不同路径反复询问；一次检查最长 ``O(n)``，而它只由
两个端点决定，与此前选过哪些片段无关。

例如 ``"aaaa..."`` 具有大量合法前缀，不同切分分支会多次来到相同 ``start``，再对同一批
``[start, end]`` 区间执行完全相同的字符比较。这部分判断可以在搜索前一次性共享。

区间状态怎样从短区间生成长区间
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

令 ``palindrome[left][right]`` 表示闭区间 ``s[left..right]`` 是否回文。两端相等，并且内部也是回文时，
整个区间才是回文：

.. code-block:: text

   palindrome[left][right] =
       s[left] == s[right] &&
       (right - left <= 2 || palindrome[left + 1][right - 1])

长度一和长度二可直接由两端判断；代码把长度三也放进 ``right - left <= 2``，因为两端相等时中间单字符
必为回文。对更长区间，依赖项的左端更大，所以 ``left`` 必须从右向左；同一 ``left`` 下，``right`` 从
左向右即可。若反向计算 ``left``，读取 ``palindrome[left+1][right-1]`` 时可能仍是默认值。

回溯路径的不变量
~~~~~~~~~~~~~~~~

``searchWithTable`` 进入函数时，``path`` 恰好覆盖 ``[0, start)``。选择 ``[start, end]`` 后追加对应子串，
不变量对 ``end+1`` 成立；子调用返回后必须弹出同一片段，恢复父状态再尝试下一个终点。到达 ``start == n``
时没有未覆盖字符，此时复制 ``path`` 才形成一条完整答案。

具体走读 ``abba``：

.. list-table::
   :header-rows: 1

   * - ``start`` 与当前路径
     - 表中可选下一段
     - 后续结果
   * - ``0``，``[]``
     - ``"a"``、``"abba"``
     - 产生一个后缀分支和一个直接完成分支
   * - ``1``，``["a"]``
     - ``"b"``、``"bb"``
     - 分别进入 ``start=2`` 与 ``start=3``
   * - ``3``，``["a", "bb"]``
     - ``"a"``
     - 到达 ``4``，保存 ``["a", "bb", "a"]``
   * - ``4``，``["abba"]``
     - 无需再选
     - 复制完整方案

表中 ``"ab"``、``"abb"`` 为假，所以搜索树根本不会生成以这些非回文前缀开头的分支。

主解选择与复杂度
~~~~~~~~~~~~~~~~

公开入口采用“区间 DP 预处理 + 回溯”。它用 ``O(n^2)`` 时间和空间换取每次回文判断 ``O(1)``，删除了
跨分支的重复字符比较；直接检查法省去表空间，更适合字符串很短且合法分支稀少的场景，因此作为有明确
取舍的基线保留。

合法方案数本身可能是指数级，任何返回全部答案的算法都无法避开输出成本。预处理为 ``O(n^2)``；搜索中
每条路径深度最多 ``n``，创建子串和复制答案的总时间与实际生成内容成正比。除返回结果和回文表外，递归栈
与当前路径占 ``O(n)``。
