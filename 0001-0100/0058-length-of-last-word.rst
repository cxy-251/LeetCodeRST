0058. Length of Last Word
=========================

题目信息
--------

:题号: 0058
:难度: Easy
:主题: 字符串、扫描、双指针
:原题: `LeetCode 0058 <https://leetcode.com/problems/length-of-last-word/>`_
:重点: 从正向解析全部内容，推导到只扫描包含最后一个单词的必要后缀

题目重述
--------

给定一个只包含英文字母和空格的字符串 ``s``，返回最后一个单词的长度。

单词是由连续字母组成的最大非空片段。字符串中至少存在一个单词，单词之间可能有多个空格，字符串末尾也可能
有空格。

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

从定义出发：解析每一个单词
~~~~~~~~~~~~~~~~~~~~~~~~~~

最直接的方法是按照空格依次读取单词，并不断保存最近一个单词的长度。``parseWithStream`` 正是这样做的：
流提取运算会自动跳过连续空格，扫描结束时保留的长度就是答案。

该方法正确且简洁，但题目只需要最后一个单词。它仍会从头到尾解析所有较早单词，并为临时字符串
``word`` 反复写入内容。继续优化的方向不是减少字符判断次数，而是避免处理与答案无关的前缀。

正向扫描为什么需要两个长度
~~~~~~~~~~~~~~~~~~~~~~~~~~

不用字符串流也可以从左向右扫描。``currentLength`` 表示当前正在读取的单词长度，``lastLength`` 表示最近一个
已经结束的单词长度。

遇到字母时增加 ``currentLength``；遇到空格时，若当前单词非空，就把长度提交给 ``lastLength``，再清零。
扫描结束后：

* 若 ``currentLength > 0``，字符串以单词结尾，答案是 ``currentLength``；
* 否则字符串以空格结尾，答案是此前保存的 ``lastLength``。

这种方法只用常数变量，但仍必须扫描整个字符串，因为从左向右时无法提前知道后面是否还会出现新单词。

为什么从右向左更贴合目标
~~~~~~~~~~~~~~~~~~~~~~~~

最后一个单词位于字符串最右侧，但它后面可能跟着空格。因此逆向扫描自然分成两个阶段：

#. 跳过全部尾部空格，定位最后一个单词的最后一个字母；
#. 继续向左统计连续非空格字符，直到遇到空格或越过字符串开头。

第一阶段结束后，``index`` 指向字符串中最后一个非空格字符。题目保证至少存在一个单词，因此此时
``index >= 0``。

第二阶段访问的字符构成一个连续非空片段；它右侧只有尾部空格或字符串结尾，左侧是空格或字符串开头，所以
这个片段恰好是最后一个单词。循环每访问一个字符就把 ``length`` 加一，最终得到其长度。

状态演化
~~~~~~~~

以 ``"the moon  "`` 为例：

.. list-table::
   :header-rows: 1

   * - 当前字符
     - 阶段
     - 动作
   * - 最后一个空格
     - 跳过尾部空格
     - 下标左移
   * - 前一个空格
     - 跳过尾部空格
     - 下标左移
   * - ``n``
     - 统计单词
     - ``length = 1``
   * - ``o,o,m``
     - 统计单词
     - ``length`` 依次增加到 4
   * - 分隔空格
     - 结束
     - 返回 4

边界情况
~~~~~~~~

单词位于字符串开头时，第二个循环最终令 ``index == -1``，计数仍然正确。只有一个字母时只执行一次计数。
多个连续空格只会在第一阶段被逐个跳过，不会影响单词长度。

输入只包含英文字母和普通空格，因此 C++ 的单字节 ``char`` 足以表示每个输入字符，不涉及多字节字符的长度
差异。

复杂度来源
~~~~~~~~~~

字符串流和正向扫描都需要检查全部 ``n`` 个字符，时间为 ``O(n)``。字符串流还使用临时字符串及流内部状态；
正向扫描只使用 ``O(1)`` 额外空间。

逆向方法只访问尾部空格和最后一个单词，设二者总长度为 ``k``，时间为 ``O(k)``，最坏 ``k = n``，因此最坏
时间仍为 ``O(n)``；额外空间为 ``O(1)``。主入口调用 ``scanBackward``。
