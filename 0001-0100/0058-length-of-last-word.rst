0058. Length of Last Word
=========================

题目信息
--------

:题号: 0058. 最后一个单词的长度
:难度: Easy
:主题: 字符串、扫描、双指针
:原题: `LeetCode 0058 <https://leetcode.com/problems/length-of-last-word/>`_
:重点: 从正向解析全部内容，推导到只扫描包含最后一个单词的必要后缀

题目重述
--------

给定一个只包含英文字母和空格的字符串 ``s``，返回最后一个单词的长度。

单词是由连续字母组成的最大非空片段。字符串中至少存在一个单词，单词之间可能有多个空格，
字符串末尾也可能有空格。

约束为 ``1 <= s.length <= 10^4``。

自建示例
--------

.. code-block:: text

   输入：s = "code   review   "
   输出：6

跳过末尾三个空格后，最后一个单词是 ``"review"``。

.. code-block:: text

   输入：s = "   x"
   输出：1

最后一个单词也是唯一的单词 ``"x"``。

.. code-block:: text

   输入：s = "single"
   输出：6

字符串没有空格时，整个字符串就是最后一个单词。

C++ 实现
--------

.. code-block:: cpp

   #include <sstream>
   #include <string>

   class Solution {
   private:
       int parseWithStream(const std::string& s) {
           std::istringstream stream(s);
           std::string word;
           int lastLength = 0;

           while (stream >> word) {
               lastLength = static_cast<int>(word.size());
           }
           return lastLength;
       }

       int scanForward(const std::string& s) {
           int currentLength = 0;
           int lastLength = 0;

           for (char ch : s) {
               if (ch == ' ') {
                   if (currentLength > 0) {
                       lastLength = currentLength;
                       currentLength = 0;
                   }
               } else {
                   ++currentLength;
               }
           }

           return currentLength > 0 ? currentLength : lastLength;
       }

       int scanBackward(const std::string& s) {
           int index = static_cast<int>(s.size()) - 1;

           while (index >= 0 && s[index] == ' ') {
               --index;
           }

           int length = 0;
           while (index >= 0 && s[index] != ' ') {
               ++length;
               --index;
           }
           return length;
       }

   public:
       int lengthOfLastWord(std::string s) {
           return scanBackward(s);
       }
   };

题解
----

完整单词解析
~~~~~~~~~~~~

最直接的方法是从左到右读取所有单词，并不断覆盖最近一个单词的长度。
``parseWithStream`` 利用流提取自动跳过连续空格，扫描结束时，``lastLength`` 保存的就是答案。

这种方法直接对应题意，也自然处理开头、结尾和单词之间的多个空格。它仍会解析所有较早单词，
并反复写入临时字符串 ``word``。题目只询问最后一个单词，因此这些前缀内容并不是必要信息。

正向状态压缩
~~~~~~~~~~~~

去掉字符串流后，可以只维护两个整数：

.. code-block:: text

   currentLength = 当前连续字母片段的长度
   lastLength    = 最近一个已经结束的单词长度

遇到字母时增加 ``currentLength``。遇到空格时，若当前片段非空，就把它提交给
``lastLength``，再把 ``currentLength`` 清零。

扫描结束时存在两种状态：

* ``currentLength > 0``：字符串以单词结尾，当前片段就是最后一个单词；
* ``currentLength == 0``：字符串以空格结尾，答案保存在 ``lastLength`` 中。

``scanForward`` 已把完整单词内容压缩为长度，但从左向右时无法知道后面是否还有新单词，
所以仍必须扫描整个字符串。

必要后缀
~~~~~~~~

最后一个单词只与字符串末尾的一段后缀有关：

.. code-block:: text

   若干尾部空格 + 最后一个单词

更早的单词和分隔空格不会影响答案。于是扫描方向可以改为从右向左，只处理这段必要后缀：

#. 跳过全部尾部空格，定位最后一个单词的末尾；
#. 继续向左统计连续非空格字符，直到遇到空格或越过字符串开头。

题目保证至少存在一个单词，因此第一阶段结束后，``index`` 一定指向某个字母。

反向扫描不变量
~~~~~~~~~~~~~~

第一阶段循环保持：``index`` 右侧已经检查过的字符全部是尾部空格。循环结束时，
``s[index]`` 是字符串最右侧的字母，也就是最后一个单词的最后一个字符。

第二阶段循环保持：已经计数的 ``length`` 个字符，恰好是从该最右侧字母向左扩展得到的连续字母后缀。
只要当前字符不是空格，它仍属于同一个单词；一旦遇到空格或数组左边界，这个最大连续片段就结束。

因此第二阶段访问的字符满足：

* 右侧只有字符串结尾或已经跳过的尾部空格；
* 内部全部是字母；
* 左侧是空格或字符串开头。

它正好符合“最后一个单词”的定义，最终 ``length`` 就是答案。

状态演化
~~~~~~~~

以 ``"the moon  "`` 为例：

.. list-table::
   :header-rows: 1

   * - 当前字符
     - 阶段
     - 状态变化
   * - 最后一个空格
     - 跳过尾部空格
     - ``index`` 左移
   * - 前一个空格
     - 跳过尾部空格
     - ``index`` 左移
   * - ``n``
     - 统计单词
     - ``length = 1``
   * - ``o, o, m``
     - 统计单词
     - ``length`` 增加到 4
   * - 分隔空格
     - 结束
     - 返回 4

边界处理
~~~~~~~~

字符串没有尾部空格时，第一阶段不执行，直接从最后一个字母开始计数。

最后一个单词位于字符串开头时，第二阶段最终令 ``index == -1``，计数仍然正确。
只有一个字母时，第二阶段只执行一次。

输入只包含英文字母和普通空格，因此每个输入字符都可由单字节 ``char`` 直接判断，
不存在多字节字符长度问题。

复杂度分析
~~~~~~~~~~

字符串流和正向扫描都检查全部 ``n`` 个字符，时间为 ``O(n)``。正向扫描使用
``O(1)`` 额外空间；字符串流还维护临时单词和流内部状态。

逆向方法只访问尾部空格和最后一个单词。设这段必要后缀长度为 ``k``，时间为 ``O(k)``，
最坏 ``k = n``，因此最坏时间仍为 ``O(n)``；额外空间为 ``O(1)``。

公开入口调用 ``scanBackward``，且不修改输入字符串。
