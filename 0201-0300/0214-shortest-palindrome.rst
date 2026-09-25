0214. Shortest Palindrome
=========================

题目信息
--------

:题号: 0214. 最短回文串
:难度: Hard
:主题: 字符串、回文前缀、前缀函数、KMP
:原题: `LeetCode 0214 <https://leetcode.com/problems/shortest-palindrome/>`_
:重点: 只能在开头添加、最长回文前缀、border 复用、失配跳转

题目重述
--------

给定字符串 ``s``，只能在它的开头添加字符，返回得到的最短回文串。原字符串内部的字符顺序不能改变，新增字符不能插入到中间
或末尾；若原串已经是回文，则不需要添加任何字符。输入只含小写英文字母，长度最多为 ``5 * 10^4``。

自建示例
--------

``s = "abcd"`` 返回 ``"dcbabcd"``。原串中能保留的最长回文前缀只有 ``"a"``，未保留后缀 ``"bcd"`` 的逆序 ``"dcb"``
必须放到前面；保留 ``"ab"`` 不能修复 ``ab`` 内部已经存在的非回文关系。

``s = "aacecaaa"`` 的最长回文前缀是 ``"aacecaa"``，只需在前面添加剩余字符 ``"a"`` 的逆序，结果仍是原串本身。
``s = "aba"`` 已经是回文，答案为 ``"aba"``；``s = ""`` 返回空串。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <vector>

   class Solution {
   private:
       static bool isPalindrome(const std::string& text, int right) {
           int left = 0;
           while (left < right) {
               if (text[left++] != text[right--]) return false;
           }
           return true;
       }

       static std::string byCheckingPrefixes(const std::string& s) {
           for (int prefix = static_cast<int>(s.size()); prefix >= 0; --prefix) {
               if (prefix > 0 && !isPalindrome(s, prefix - 1)) continue;
               std::string reversed = s.substr(prefix);
               std::reverse(reversed.begin(), reversed.end());
               return reversed + s;
           }
           return s;
       }

       static std::string byPrefixFunction(const std::string& s) {
           if (s.empty()) return s;

           std::string reversed = s;
           std::reverse(reversed.begin(), reversed.end());
           const std::string combined = s + '#' + reversed;
           std::vector<int> lps(combined.size(), 0);

           for (std::size_t i = 1; i < combined.size(); ++i) {
               int length = lps[i - 1];
               while (length > 0 && combined[i] != combined[length]) {
                   length = lps[length - 1];
               }
               if (combined[i] == combined[length]) ++length;
               lps[i] = length;
           }

           const int palindrome_prefix = lps.back();
           std::string answer = reversed.substr(0, s.size() - palindrome_prefix);
           answer += s;
           return answer;
       }

   public:
       std::string shortestPalindrome(const std::string& s) {
           return byPrefixFunction(s);
       }
   };

题解
----

先确定能保留的原串
~~~~~~~~~~~~~~~~~~~~

新增字符只能放在开头。若保留原串前缀 ``s[0..p)``，剩余后缀 ``s[p..n)`` 的镜像只能放到最前面，构造被唯一确定为：

.. code-block:: text

   reverse(s[p..n)) + s

它成为回文的必要条件是保留的前缀本身是回文；同时 ``p`` 越大，新增字符越少。因此题目不是在所有新字符串中搜索，
而是在所有前缀中寻找最长回文前缀。

前缀枚举基线
~~~~~~~~~~~~

从 ``p=n`` 向下尝试，每次从两端检查 ``s[0..p)`` 是否回文，第一次成功就能构造最短答案。这个方案直接对应定义，
但相邻候选前缀共享绝大部分字符，最坏时间达到 ``O(n^2)``。滚动哈希可以加速单次判断，却需要接受碰撞概率或维护多组哈希，
仍没有解释不同候选之间如何复用失配位置。

把回文前缀变成最长 border
~~~~~~~~~~~~~~~~~~~~~~~~~~

令 ``r = reverse(s)``，构造 ``combined = s + '#' + r``，其中 ``#`` 不在小写字母输入域中。若 ``s`` 的前缀长度为 ``p`` 且是回文，
它会与 ``r`` 的后缀相同，于是 ``combined`` 存在长度为 ``p`` 的相等前缀和后缀。反过来，分隔符阻止匹配跨越两部分，
所以 ``combined`` 的最长 border（同时是前缀和后缀的字符串）恰好对应最长回文前缀。

前缀函数压缩失配工作
~~~~~~~~~~~~~~~~~~~~~~

``lps[i]`` 表示 ``combined[0..i]`` 的最长 border 长度。处理新字符时先继承 ``lps[i-1]``：相等就延长；失配就跳到
``lps[length-1]`` 代表的更短 border，继续尝试；所有候选都失败才归零。更短 border 本来就是更长 border 的后缀，因此这个跳转
不会漏掉可能接上当前字符的候选。每次跳转都丢弃一批已证明不可能的前缀，整个计算降为线性。

状态走读
~~~~~~~~

对 ``s="abcd"``，组合串为 ``"abcd#dcba"``：

.. list-table::
   :header-rows: 1

   * - 扫描到
     - ``lps`` 的关键状态
     - 含义
   * - ``a``、``ab``、``abc``、``abcd``
     - 末尾都没有相等的真前后缀
     - 当前候选长度保持 0
   * - ``#``
     - 分隔符不能与小写字母匹配
     - 跨界候选被切断
   * - ``dcb``
     - 仍不能接到首字符 ``a``
     - 长度保持 0
   * - 最后的 ``a``
     - 与组合串首字符相等
     - ``lps.back() = 1``

因此保留 ``a``，新增 ``dcb``。对于 ``aacecaaa``，边界会沿已知 border 逐步回退和延伸，最后得到长度 7 的回文前缀，
不需要逐个重新检查长度 7、6、5 等候选。得到 ``palindrome_prefix`` 后，代码从 ``reversed`` 取出未保留部分并接回 ``s``。

代码演进与方案选择
~~~~~~~~~~~~~~~~~~~~

``byCheckingPrefixes`` 保留了直接定义，最坏时间为 ``O(n^2)``，其中内层回文检查重复读取前缀。``byPrefixFunction``
把所有候选 border 的关系存入 ``lps``，失配时跳到已知的更短 border，时间降为 ``O(n)``；公共入口选择它，因为不依赖哈希随机性。

``length`` 失配后不能直接归零，较短 border 仍可能接上当前字符；而分隔符必须不在输入字符域，否则可能得到跨界伪匹配。

复杂度与边界
~~~~~~~~~~~~

``byCheckingPrefixes`` 最坏时间为 ``O(n^2)``，``byPrefixFunction`` 时间为 ``O(n)``。主解的反转串、组合串和 ``lps``
共同占用 ``O(n)`` 额外空间；空串和单字符在同一逻辑下自然返回自身，整串回文时新增部分长度为 0。
