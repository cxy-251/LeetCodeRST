0058. Length of Last Word
=========================

题目信息
--------

:题号: 0058
:难度: Easy
:主题: 字符串、反向扫描、边界跳过
:原题: `LeetCode 0058 <https://leetcode.com/problems/length-of-last-word/>`_
:重点: 尾部空格、最后一个单词、连续字母、长度统计

题目重述
--------

给定只包含英文字母和空格的字符串 ``s``，返回最后一个单词的长度。单词是由连续字母组成的最大非空片段；字符串保证至少包含一个单词，首尾和单词之间都可能出现空格。

约束为 ``1 <= s.length <= 10^4``。

自建示例
--------

.. code-block:: text

   输入：s = "code   review   "
   输出：6

忽略末尾空格后，最后一个单词是 ``"review"``，长度为 6。

.. code-block:: text

   输入：s = "   x"
   输出：1

唯一的单词是 ``"x"``。

C++ 实现
--------

.. code-block:: cpp

   #include <sstream>
   #include <string>

   class Solution {
   private:
       int splitAllWords(const std::string& s) {
           std::istringstream stream(s);
           std::string word, last;
           while (stream >> word) last = word;
           return static_cast<int>(last.size());
       }

       int forwardRolling(const std::string& s) {
           int current = 0, last = 0;
           for (char ch : s) {
               if (ch == ' ') {
                   if (current > 0) last = current;
                   current = 0;
               } else {
                   ++current;
               }
           }
           return current > 0 ? current : last;
       }

       int reverseTwoPhases(const std::string& s) {
           int index = static_cast<int>(s.size()) - 1;
           while (index >= 0 && s[index] == ' ') --index;
           int end = index;
           while (index >= 0 && s[index] != ' ') --index;
           return end - index;
       }

   public:
       int lengthOfLastWord(std::string s) {
           return reverseTwoPhases(s);
       }
   };

题解
----

分割全部单词做了哪些多余工作
~~~~~~~~~~~~~~~~~~~~~~~~~~

按空格分割可以得到答案，但会扫描并保存所有单词，而题目只需要末尾一个。流式分词还隐藏了跳过连续空格的行为和中间字符串分配。

正向扫描需要保存什么
~~~~~~~~~~~~~~~~~~

正向方法维护当前单词长度 ``current`` 和最近完成单词长度 ``last``。遇到字母增加 ``current``；遇到空格时把非零 ``current`` 提交给 ``last``。扫描结束若 ``current`` 非零，它就是最后单词，否则返回 ``last``。

为什么反向扫描更直接
~~~~~~~~~~~~~~~~~~

最后一个单词位于字符串的最大非空后缀之前。反向扫描分成两个不可逆阶段：

#. 跳过所有尾部空格，定位最后一个字母；
#. 从该位置继续向左，直到遇到空格或越过开头。

第二阶段访问的字符恰好是最后一个单词，不需要关心更早内容。

状态演化
~~~~~~~~

以 ``"the moon  "`` 为例：

.. list-table::
   :header-rows: 1

   * - 下标字符
     - 阶段
     - 动作
   * - 最后一个空格
     - 跳过尾空格
     - 下标左移
   * - 前一个空格
     - 跳过尾空格
     - 下标左移
   * - ``n``
     - 计数
     - 记录结束位置
   * - ``o,o,m``
     - 计数
     - 持续左移
   * - 分隔空格
     - 停止
     - 长度为 4

长度公式为何是 end - index
~~~~~~~~~~~~~~~~~~~~~~~~~

``end`` 是最后一个字母下标；第二个循环结束后，``index`` 指向单词前的空格或 ``-1``。单词范围是 ``index+1..end``，长度为 ``end-(index+1)+1 = end-index``。

题目保证如何简化边界
~~~~~~~~~~~~~~~~~~~~

字符串至少有一个单词，因此跳过尾部空格后 ``end >= 0``。若仍保留通用实现，该公式对单词位于开头也成立：此时 ``index == -1``。

C++ 字符单位为什么没有歧义
~~~~~~~~~~~~~~~~~~~~~~~~~~~

输入字符域只有 ASCII 字母和空格，C++ 的 ``char`` 按单字节读取它们。反向扫描只需比较空格并统计连续字母，不涉及多字节字符拆分。

为什么只访问必要后缀
~~~~~~~~~~~~~~~~~~

反向算法在找到最后单词左边界后立即停止。若最后单词很短，即使字符串前缀很长也不再扫描；最坏仍为 ``O(n)``，最好只访问少量尾部字符。

复杂度来源
~~~~~~~~~~

三种方法均最坏 ``O(n)`` 时间。分割方法需要 ``O(n)`` 中间存储；正向滚动和反向两阶段只使用常数变量，额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   int lengthOfLastWord(char*s){int i=(int)strlen(s)-1;while(i>=0&&s[i]==' ')i--;int end=i;while(i>=0&&s[i]!=' ')i--;return end-i;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def lengthOfLastWord(self, s: str) -> int:
           index = len(s) - 1
           while index >= 0 and s[index] == " ": index -= 1
           end = index
           while index >= 0 and s[index] != " ": index -= 1
           return end - index

Java
~~~~

.. code-block:: java

   class Solution {public int lengthOfLastWord(String s){int i=s.length()-1;while(i>=0&&s.charAt(i)==' ')i--;int end=i;while(i>=0&&s.charAt(i)!=' ')i--;return end-i;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn length_of_last_word(s:String)->i32{let b=s.as_bytes();let mut i=b.len()as i32-1;while i>=0&&b[i as usize]==b' '{i-=1}let end=i;while i>=0&&b[i as usize]!=b' '{i-=1}end-i}}

Go
~~

.. code-block:: go

   func lengthOfLastWord(s string)int{i:=len(s)-1;for i>=0&&s[i]==' '{i--};end:=i;for i>=0&&s[i]!=' '{i--};return end-i}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function lengthOfLastWord(s:string):number{let i=s.length-1;while(i>=0&&s[i]===" ")i--;const end=i;while(i>=0&&s[i]!==" ")i--;return end-i;}

C#
~~

.. code-block:: csharp

   public class Solution {public int LengthOfLastWord(string s){int i=s.Length-1;while(i>=0&&s[i]==' ')i--;int end=i;while(i>=0&&s[i]!=' ')i--;return end-i;}}

Julia
~~~~~

.. code-block:: julia

   function length_of_last_word(s::String)
       chars=collect(s);i=length(chars)
       while i>=1&&chars[i]==' ';i-=1;end
       last=i
       while i>=1&&chars[i]!=' ';i-=1;end
       last-i
   end

R
~

.. code-block:: r

   length_of_last_word <- function(s){chars<-strsplit(s,"",fixed=TRUE)[[1L]];i<-length(chars);while(i>=1L&&chars[[i]]==" ")i<-i-1L;last<-i;while(i>=1L&&chars[[i]]!=" ")i<-i-1L;last-i}
