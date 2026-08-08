0028. Find the Index of the First Occurrence in a String
========================================================

题目信息
--------

:题号: 0028. 找出字符串中第一个匹配项的下标
:难度: Easy
:主题: 字符串、模式匹配、前缀函数、KMP
:原题: `LeetCode 0028 <https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/>`_
:重点: 从逐起点重新匹配，推导到复用已匹配后缀，并用前缀函数在失配时跳过不可能起点

题目重述
--------

给定字符串 ``haystack`` 和 ``needle``，在 ``haystack`` 中寻找第一次出现的、与 ``needle`` 完全相同的连续
子串，并返回该子串的零基起始下标；若不存在这样的子串，返回 ``-1``。

匹配必须覆盖 ``needle`` 的全部字符，且字符顺序和大小写都必须完全相同。若 ``needle`` 在文本中出现多次，
只返回起始下标最小的一次。两个字符串长度均位于 ``[1, 10^4]``，只包含小写英文字母。

自建示例
--------

* 首位置命中：``haystack = "abracadabra"``、``needle = "abra"``，返回 ``0``；
* 多次出现：``haystack = "mississippi"``、``needle = "issi"``，分别从下标 ``1`` 和 ``4`` 开始出现，返回 ``1``；
* 需要复用前缀：``haystack = "abababaca"``、``needle = "ababaca"``，返回 ``2``；
* 模式比文本长：``haystack = "abc"``、``needle = "abcd"``，返回 ``-1``；
* 不存在：``haystack = "algorithm"``、``needle = "rhythm"``，返回 ``-1``。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       int naiveSearch(const std::string& text, const std::string& pattern) {
           const int n = static_cast<int>(text.size());
           const int m = static_cast<int>(pattern.size());
           for (int start = 0; start + m <= n; ++start) {
               int offset = 0;
               while (offset < m && text[start + offset] == pattern[offset]) {
                   ++offset;
               }
               if (offset == m) {
                   return start;
               }
           }
           return -1;
       }

       std::vector<int> buildPrefix(const std::string& pattern) {
           const int m = static_cast<int>(pattern.size());
           std::vector<int> prefix(m, 0);
           for (int index = 1; index < m; ++index) {
               int matched = prefix[index - 1];
               while (matched > 0 && pattern[index] != pattern[matched]) {
                   matched = prefix[matched - 1];
               }
               if (pattern[index] == pattern[matched]) {
                   ++matched;
               }
               prefix[index] = matched;
           }
           return prefix;
       }

       int kmpSearch(const std::string& text, const std::string& pattern) {
           const std::vector<int> prefix = buildPrefix(pattern);
           int matched = 0;
           for (int index = 0; index < static_cast<int>(text.size()); ++index) {
               while (matched > 0 && text[index] != pattern[matched]) {
                   matched = prefix[matched - 1];
               }
               if (text[index] == pattern[matched]) {
                   ++matched;
               }
               if (matched == static_cast<int>(pattern.size())) {
                   return index - matched + 1;
               }
           }
           return -1;
       }

   public:
       int strStr(std::string haystack, std::string needle) {
           return kmpSearch(haystack, needle);
       }
   };

题解
----

逐起点验证
~~~~~~~~~~

设文本长度为 ``n``，模式长度为 ``m``。一个完整匹配只能从 ``0`` 到 ``n - m`` 开始。最直接的方法是依次选择
每个合法起点 ``start``，再从模式下标 ``0`` 开始逐字符比较。

``naiveSearch`` 按起点递增顺序检查，因此第一次成功一定是最早出现位置。每个候选要么在某处失配，要么完成全部
``m`` 次比较；所有合法起点都被覆盖，所以不会漏解。

问题在于，相邻起点之间可能重复比较相同字符。以 ``text = "abababaca"``、``pattern = "ababaca"`` 为例，
从起点 ``0`` 已经匹配 ``ababa`` 后，在下一字符处失配。若把模式完全移到起点 ``1`` 并从头开始，就丢弃了
已经确认的文本后缀信息。重复结构较强时，许多起点都会先匹配很长前缀再失配，最坏时间达到 ``O(nm)``。

失配后的有效起点
~~~~~~~~~~~~~~~~

假设当前已经连续匹配了模式前 ``matched`` 个字符：

.. code-block:: text

   文本已读后缀：pattern[0 .. matched)

下一文本字符与 ``pattern[matched]`` 失配时，不能继续保留完整的 ``matched`` 个字符。新的候选匹配若仍然利用
已经读过的文本，它的模式前缀必须等于这段已匹配文本的某个后缀。

而已匹配文本本身等于 ``pattern[0 .. matched)``，所以问题转化为：在这个模式前缀中，寻找一个同时也是后缀的
最长真前缀。若其长度为 ``fallback``，则文本末尾 ``fallback`` 个字符已经等于
``pattern[0 .. fallback)``，无需重新读取，可以继续尝试匹配 ``pattern[fallback]``。

只考虑真前缀，是因为长度仍为 ``matched`` 的候选刚刚已经失配。寻找最长者则能保留最多已确认字符；若它仍然
失配，再继续尝试更短边界。

前缀函数
~~~~~~~~

定义 ``prefix[index]`` 为模式子串 ``pattern[0 .. index]`` 的最长相等真前后缀长度。这里“前后缀相等”表示：

* 前缀从模式下标 ``0`` 开始；
* 后缀在下标 ``index`` 结束；
* 二者内容相同；
* 长度小于当前子串总长度。

例如模式 ``ababaca`` 的前缀函数为：

.. list-table::
   :header-rows: 1

   * - ``index``
     - 字符
     - 当前子串
     - ``prefix[index]``
     - 最长边界
   * - 0
     - ``a``
     - ``a``
     - 0
     - 空
   * - 1
     - ``b``
     - ``ab``
     - 0
     - 空
   * - 2
     - ``a``
     - ``aba``
     - 1
     - ``a``
   * - 3
     - ``b``
     - ``abab``
     - 2
     - ``ab``
   * - 4
     - ``a``
     - ``ababa``
     - 3
     - ``aba``
   * - 5
     - ``c``
     - ``ababac``
     - 0
     - 空
   * - 6
     - ``a``
     - ``ababaca``
     - 1
     - ``a``

因此，当已经匹配 ``ababa``，即 ``matched = 5``，下一字符失配时，可以先回退到
``prefix[4] = 3``。已匹配文本末尾的 ``aba`` 与模式开头的 ``aba`` 相同，新的候选无需从长度零重新开始。

前缀函数的构造
~~~~~~~~~~~~~~

计算 ``prefix[index]`` 时，``prefix[index - 1]`` 已经给出前一个模式前缀的最长边界长度，记为 ``matched``。
若 ``pattern[index] == pattern[matched]``，就在原边界两端追加同一个字符，新边界长度增加一。

若二者不相等，当前长度 ``matched`` 无法扩展。下一候选不能随意减一，因为只有当前边界自身的相等前后缀，才
可能继续作为整个子串的相等前后缀。该候选长度正是 ``prefix[matched - 1]``：

.. code-block:: text

   matched = prefix[matched - 1]

回退后仍使用同一个 ``pattern[index]`` 重新比较。若继续失配，就沿前缀函数链尝试更短边界；若最终退到零，
只需判断当前字符能否与模式首字符形成长度为一的边界。

这个构造过程与文本匹配使用同一种状态转换：都在失配时寻找“当前已匹配内容的最长可复用后缀”。区别只是构造
阶段的字符来自模式本身。

文本扫描
~~~~~~~~

``kmpSearch`` 令 ``matched`` 表示处理当前文本字符之前，文本已读前缀的末尾有多少个字符等于模式前缀。
处理 ``text[index]`` 时：

#. 若它与 ``pattern[matched]`` 不同，沿前缀函数缩短 ``matched``；
#. 每次回退后仍用同一个 ``text[index]`` 重新比较，因为该字符尚未被任何新候选消费；
#. 若字符相等，令 ``matched`` 增加一；
#. 若 ``matched == m``，模式已经在当前位置结束。

以 ``text = "abababaca"``、``pattern = "ababaca"`` 为例：文本前五个字符使 ``matched`` 达到 ``5``。
处理下标 ``5`` 的字符 ``b`` 时，它与模式下标 ``5`` 的 ``c`` 失配，于是回退到 ``prefix[4] = 3``。
此时同一个文本字符 ``b`` 与模式下标 ``3`` 的 ``b`` 匹配，``matched`` 变为 ``4``；之后继续匹配
``a``、``c``、``a``，最终在文本下标 ``8`` 完成匹配，起点为 ``8 - 7 + 1 = 2``。

文本下标没有退回到旧起点之后重新扫描。前缀函数已经证明，被跳过的更长候选必然失配，而保留下来的模式前缀
已经与文本已读后缀相等。

首次出现位置
~~~~~~~~~~~~

文本按下标从左到右处理。第一次出现 ``matched == m`` 时，得到的是结束位置最小的完整匹配。所有匹配长度都为
``m``，结束位置越小，起始位置 ``index - m + 1`` 也越小，因此可以立即返回。

如果模式比文本长，扫描过程中 ``matched`` 不可能达到 ``m``，最终自然返回 ``-1``，无需单独分支。

代码演进
~~~~~~~~

``naiveSearch`` 为每个候选起点重新从模式首字符开始比较。一次失配会把已经匹配的全部前缀信息清空，文本字符
可能在后续起点中被重复读取。

KMP 先用 ``buildPrefix`` 为模式的每个前缀记录最长可复用边界。``kmpSearch`` 失配时不再枚举下一个文本起点，
而是沿边界链直接跳过已经证明不可能的候选；文本下标始终向右，只调整模式已匹配长度。

公开入口采用 ``kmpSearch``。它把逐起点的重复比较替换为一次模式预处理和一次文本扫描，在重复结构明显的输入上
仍保持线性时间。

复杂度分析
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 主要代价
   * - 逐起点验证
     - ``O(nm)``
     - ``O(1)``
     - 相邻起点可能重复比较相同文本字符
   * - KMP
     - ``O(n+m)``
     - ``O(m)``
     - 构造前缀函数并单向扫描文本

构造前缀函数时，``index`` 只向右移动，``matched`` 的每次回退都会严格减小；其总比较次数为 ``O(m)``。
文本扫描同理，文本下标只前进，``matched`` 的增长与回退总量为线性级别，因此扫描为 ``O(n)``。前缀数组保存
``m`` 个整数，工作空间为 ``O(m)``。
