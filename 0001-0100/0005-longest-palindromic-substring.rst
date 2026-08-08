0005. Longest Palindromic Substring
===================================

题目信息
--------

:题号: 0005. 最长回文子串
:难度: Medium
:主题: 字符串、回文、动态规划、中心扩展、Manacher
:原题: `LeetCode 0005 <https://leetcode.com/problems/longest-palindromic-substring/>`_
:重点: 从枚举全部连续子串，推导到复用内部区间、枚举对称中心，再利用镜像半径消除重复扩展

题目重述
--------

给定字符串 ``s``，需要返回其中一个最长回文子串。回文串从左向右和从右向左读取完全相同；子串必须对应原字符串中的一段连续区间，不能跳过字符重新组合。

字符串长度位于 ``[1, 1000]``，只包含英文字母和数字，因此答案至少包含一个字符。若存在多个长度相同的最长回文子串，返回任意一个即可。

自建示例
--------

* 奇数长度：``s = "cabacx"``，最长回文子串为 ``"cabac"``；
* 偶数长度：``s = "cbbd"``，最长回文子串为 ``"bb"``；
* 多个最长答案：``s = "babad"``，``"bab"`` 与 ``"aba"`` 都合法；
* 全部字符相同：``s = "aaaa"``，返回 ``"aaaa"``；
* 最小规模：``s = "z"``，返回 ``"z"``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <utility>
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

       std::string enumerateSubstrings(const std::string& s) {
           int bestStart = 0;
           int bestLength = 1;
           for (int left = 0; left < static_cast<int>(s.size()); ++left) {
               for (int right = left; right < static_cast<int>(s.size()); ++right) {
                   const int length = right - left + 1;
                   if (length > bestLength && isPalindrome(s, left, right)) {
                       bestStart = left;
                       bestLength = length;
                   }
               }
           }
           return s.substr(bestStart, bestLength);
       }

       std::string dynamicProgramming(const std::string& s) {
           const int n = static_cast<int>(s.size());
           std::vector<std::vector<char>> dp(n, std::vector<char>(n, false));
           int bestStart = 0;
           int bestLength = 1;
           for (int length = 1; length <= n; ++length) {
               for (int left = 0; left + length <= n; ++left) {
                   const int right = left + length - 1;
                   dp[left][right] = s[left] == s[right] && (length <= 2 || dp[left + 1][right - 1]);
                   if (dp[left][right] && length > bestLength) {
                       bestStart = left;
                       bestLength = length;
                   }
               }
           }
           return s.substr(bestStart, bestLength);
       }

       std::pair<int, int> expand(const std::string& s, int left, int right) {
           while (left >= 0 && right < static_cast<int>(s.size()) && s[left] == s[right]) {
               --left;
               ++right;
           }
           return {left + 1, right - left - 1};
       }

       std::string expandAroundCenters(const std::string& s) {
           int bestStart = 0;
           int bestLength = 1;
           for (int center = 0; center < static_cast<int>(s.size()); ++center) {
               const auto odd = expand(s, center, center);
               if (odd.second > bestLength) {
                   bestStart = odd.first;
                   bestLength = odd.second;
               }
               const auto even = expand(s, center, center + 1);
               if (even.second > bestLength) {
                   bestStart = even.first;
                   bestLength = even.second;
               }
           }
           return s.substr(bestStart, bestLength);
       }

       std::string manacher(const std::string& s) {
           std::string transformed;
           transformed.reserve(s.size() * 2 + 1);
           transformed.push_back('#');
           for (char ch : s) {
               transformed.push_back(ch);
               transformed.push_back('#');
           }
           const int n = static_cast<int>(transformed.size());
           std::vector<int> radius(n, 0);
           int center = 0;
           int rightBoundary = -1;
           int bestCenter = 0;
           int bestRadius = 0;
           for (int index = 0; index < n; ++index) {
               if (index <= rightBoundary) {
                   const int mirror = 2 * center - index;
                   radius[index] = std::min(radius[mirror], rightBoundary - index);
               }
               while (index - radius[index] - 1 >= 0 && index + radius[index] + 1 < n &&
                      transformed[index - radius[index] - 1] == transformed[index + radius[index] + 1]) {
                   ++radius[index];
               }
               if (index + radius[index] > rightBoundary) {
                   center = index;
                   rightBoundary = index + radius[index];
               }
               if (radius[index] > bestRadius) {
                   bestCenter = index;
                   bestRadius = radius[index];
               }
           }
           const int bestStart = (bestCenter - bestRadius) / 2;
           return s.substr(bestStart, bestRadius);
       }

   public:
       std::string longestPalindrome(std::string s) {
           return manacher(s);
       }
   };

题解
----

原始搜索空间
~~~~~~~~~~~~

长度为 ``n`` 的字符串共有 ``n(n + 1) / 2`` 个非空连续子串。最直接的方法是枚举闭区间 ``[left, right]``，再从两端向中间检查字符是否相同。

``enumerateSubstrings`` 覆盖全部候选区间，所以不会遗漏答案。候选数量为 ``O(n²)``，单个区间的回文检查最坏需要 ``O(n)`` 次比较，总时间达到 ``O(n³)``。

重复工作出现在内部区间：判断 ``s[left..right]`` 时，两端相同之后仍要重新检查 ``s[left + 1..right - 1]``，而这个内部区间可能已经在其他候选中验证过。

区间状态复用
~~~~~~~~~~~~

定义 ``dp[left][right]`` 表示闭区间 ``[left, right]`` 是否为回文。区间成为回文需要两端字符相同，并且内部区间也是回文：

``dp[left][right] = s[left] == s[right] && (length <= 2 || dp[left + 1][right - 1])``。

长度为 ``1`` 时只有一个字符；长度为 ``2`` 时只需比较两端，因此 ``length <= 2`` 可以统一覆盖没有内部区间的情况。代码按区间长度从短到长填表，计算当前状态时，内部状态已经完成。

动态规划删除了每个候选内部的重复扫描：每个区间只计算一次，时间降为 ``O(n²)``。代价是保存全部 ``O(n²)`` 个区间状态，而题目最终只需要一个最长区间。

对称中心
~~~~~~~~

回文区间还有更直接的结构：字符围绕中心成对相等。奇数长度回文以一个字符为中心，偶数长度回文以两个相邻字符之间的空隙为中心。长度为 ``n`` 的字符串共有 ``n`` 个字符中心和 ``n - 1`` 个间隙中心。

``expandAroundCenters`` 对每个位置分别调用 ``expand(center, center)`` 和 ``expand(center, center + 1)``。固定中心后，只要两侧字符相同就继续向外扩展；第一次不相同或越界时，该中心的最长回文已经确定。

循环停止时 ``left`` 和 ``right`` 已经位于合法区间之外，所以真实起点为 ``left + 1``，长度为 ``right - left - 1``。主循环枚举全部两类中心，因此每个回文都会被其唯一中心覆盖。

中心扩展不再保存所有区间状态，只保留当前边界和全局最优区间，工作空间降为 ``O(1)``。最坏情况下，例如字符串全部由同一字符组成，每个中心仍会向两侧扩展很远，总时间仍为 ``O(n²)``。

镜像半径
~~~~~~~~

中心扩展的剩余重复工作是：相邻中心的回文区间大量重叠，却仍从半径零开始重新比较。Manacher 算法为每个中心保存最长回文半径，并维护当前已知向右延伸最远的回文：

* ``center`` 是该回文中心；
* ``rightBoundary`` 是它覆盖的最右位置；
* ``radius[index]`` 是以 ``index`` 为中心的最长回文半径。

原字符串同时存在字符中心和间隙中心。代码先在每两个字符之间以及首尾加入 ``#``，例如 ``abba`` 转换为 ``#a#b#b#a#``。转换后所有回文都具有单一字符中心，奇偶两类情况使用同一套半径逻辑；由于原题字符只包含字母和数字，``#`` 不会与真实字符混淆。

若当前 ``index`` 位于 ``rightBoundary`` 内，它关于 ``center`` 的镜像位置为 ``mirror = 2 * center - index``。已知大回文内部左右对称，因此当前半径至少可以直接继承：

``radius[index] = min(radius[mirror], rightBoundary - index)``。

取最小值是因为镜像回文可能超出当前大回文的左边界，那一部分没有已知对称关系。继承之后，代码只从已知边界外继续比较；若扩展得更远，就更新 ``center`` 和 ``rightBoundary``。

每个中心最多产生一次失败比较，而所有成功越过旧边界的扩展都会让 ``rightBoundary`` 右移。边界总共只能从左向右移动 ``O(n)`` 次，因此全部扩展为线性工作。

位置映射
~~~~~~~~

转换串中的半径同时等于原字符串中对应回文的长度。若最佳中心为 ``bestCenter``、半径为 ``bestRadius``，其转换串左边界为 ``bestCenter - bestRadius``。转换串每两个位置对应原字符串的一个字符位置，所以原串起点为 ``(bestCenter - bestRadius) / 2``，结果长度就是 ``bestRadius``。

例如 ``abba`` 转换为 ``#a#b#b#a#``，最佳中心位于中间的 ``#``，半径为 ``4``，映射得到起点 ``0``、长度 ``4``。

代码演进
~~~~~~~~

``enumerateSubstrings`` 同时枚举左右端点，并为每个区间重新扫描内部字符。

``dynamicProgramming`` 把内部扫描替换为 ``dp[left + 1][right - 1]`` 查询，删除第三层字符比较循环，但增加二维状态表。

``expandAroundCenters`` 不再询问每个区间是否回文，而是枚举 ``2n - 1`` 个对称中心。二维状态表消失，只保留当前扩展边界；最坏时间仍为二次。

``manacher`` 继续保存各中心半径和最右回文边界。落在已覆盖区域内的中心直接从镜像半径起步，删除重叠区间中的重复字符比较，把时间降为线性。

公开入口采用 ``manacher``，因为它在保持线性空间的同时取得 ``O(n)`` 时间复杂度。

复杂度分析
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 主要代价
   * - 枚举并检查
     - ``O(n³)``
     - ``O(1)``
     - 枚举区间后重新扫描内部字符
   * - 区间动态规划
     - ``O(n²)``
     - ``O(n²)``
     - 保存全部区间真假状态
   * - 中心扩展
     - ``O(n²)``
     - ``O(1)``
     - 每个中心独立向两侧扩展
   * - Manacher
     - ``O(n)``
     - ``O(n)``
     - 保存转换串中每个中心的回文半径

返回的子串由 ``substr`` 创建，其结果空间为 ``O(L)``，其中 ``L`` 是答案长度；表中的工作空间不包含返回结果。

边界处理
~~~~~~~~

* 输入只有一个字符时，四种方法都返回该字符；
* 偶数长度回文由间隙中心或转换串中的 ``#`` 中心表示，不会被遗漏；
* 多个最长答案长度相同时，代码只在发现严格更长结果时更新，因此返回较早发现的一个合法答案；
* 全部字符相同时，中心扩展会达到二次时间，Manacher 仍只线性推进最右边界；
* 输入非空，因此主解法不需要为空字符串构造特殊返回值。
