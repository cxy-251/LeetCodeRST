0038. Count and Say
===================

题目信息
--------

:题号: 0038
:难度: Medium
:主题: 字符串、游程编码、递推
:原题: `LeetCode 0038 <https://leetcode.com/problems/count-and-say/>`_
:重点: 相邻相同字符分组、数量后接字符、逐项递推

题目重述
--------

定义字符串序列 ``countAndSay``：第一项为 ``"1"``；从第二项开始，每一项都是对前一项进行游程描述得到的字符串。

描述时从左向右把连续相同字符分成若干组，并对每组依次写出“该字符连续出现的次数”和“该字符本身”。给定整数 ``n``，返回序列的第 ``n`` 项。

``n`` 位于 ``[1, 30]``。

自建示例
--------

第六项：

.. code-block:: text

   输入：n = 6
   输出："312211"
   解释：序列依次为 "1"、"11"、"21"、"1211"、"111221"、"312211"。第五项包含三个 1、两个 2、一个 1，所以描述为 "312211"。

第一项：

.. code-block:: text

   输入：n = 1
   输出："1"
   解释：第一项由定义直接给出，不需要描述前一项。

连续组必须分别描述：

.. code-block:: text

   输入：n = 5
   输出："111221"
   解释：第四项 "1211" 应分成 "1"、"2"、"11" 三个连续组，分别描述为 "11"、"12"、"21"。

C++ 实现
--------

.. code-block:: cpp

   #include <string>

   class Solution {
   private:
       std::string recursive(int n) {
           if (n == 1) return "1";
           return describe(recursive(n - 1));
       }

       std::string describe(const std::string& current) {
           std::string next;
           for (int start = 0; start < static_cast<int>(current.size());) {
               int end = start + 1;
               while (end < static_cast<int>(current.size()) && current[end] == current[start]) ++end;
               next += std::to_string(end - start);
               next.push_back(current[start]);
               start = end;
           }
           return next;
       }

       std::string iterative(int n) {
           std::string current = "1";
           for (int term = 2; term <= n; ++term) current = describe(current);
           return current;
       }

   public:
       std::string countAndSay(int n) {
           return iterative(n);
       }
   };

题解
----

序列递推依赖什么信息
~~~~~~~~~~~~~~~~~~~~

第 ``n`` 项只依赖第 ``n-1`` 项，不需要保存更早字符串。无论递归还是迭代，核心子过程都是对一个字符串进行游程编码：
把最大连续相同字符段转换成“长度 + 字符”。

为什么必须按连续段计数
~~~~~~~~~~~~~~~~~~~~

描述的是读取顺序中的相邻重复，不是全局字符频率。例如 ``1211`` 中三个字符 ``1`` 分属首部单个 1 和末尾两个 1，
不能合并成“3 个 1”，因为中间有字符 2 分隔。

双指针如何找到一个完整字符段
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``start`` 指向当前段首，``end`` 从下一位置向右移动，直到越界或字符改变。此时半开区间 ``[start,end)`` 恰好是一个
最大连续段，长度为 ``end-start``。写入描述后令 ``start=end``，继续处理下一段。

状态演化
~~~~~~~~

描述 ``111221``：

.. list-table::
   :header-rows: 1

   * - 连续段
     - 长度
     - 输出片段
     - 累计结果
   * - ``111``
     - 3
     - ``31``
     - ``31``
   * - ``22``
     - 2
     - ``22``
     - ``3122``
   * - ``1``
     - 1
     - ``11``
     - ``312211``

为什么每轮描述结果唯一
~~~~~~~~~~~~~~~~~~~~~~

任意字符串都能唯一划分为最大连续相同字符段：段首从第一个字符开始，段尾由第一个不同字符唯一确定。每段的字符和长度
也随之唯一，因此下一项没有歧义。

递归与迭代的取舍
~~~~~~~~~~~~~~~~

递归定义最贴近数学序列，但需要 ``O(n)`` 调用栈，并在回溯时构造每一项。迭代只维护当前项，逐轮替换，控制流更直接，
标准入口采用迭代。

复杂度来源
~~~~~~~~~~

设第 ``i`` 项长度为 ``L_i``，生成第 ``n`` 项的总时间为 ``O(\sum_{i=1}^{n} L_i)``；最后一轮与返回字符串空间为
``O(L_n)``。迭代除当前项和下一项外不保存历史序列。

九语言实现
----------

C
~

.. code-block:: c

   char* countAndSay(int n){
       char* current=malloc(2);strcpy(current,"1");
       for(int term=2;term<=n;term++){int len=(int)strlen(current);char* next=malloc((size_t)(2*len+16));int write=0;
           for(int start=0;start<len;){int end=start+1;while(end<len&&current[end]==current[start])end++;write+=sprintf(next+write,"%d%c",end-start,current[start]);start=end;}
           next[write]='\0';free(current);current=next;}
       return current;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def countAndSay(self, n: int) -> str:
           current="1"
           for _ in range(2,n+1):
               pieces=[];start=0
               while start<len(current):
                   end=start+1
                   while end<len(current) and current[end]==current[start]:end+=1
                   pieces.append(str(end-start));pieces.append(current[start]);start=end
               current="".join(pieces)
           return current

Java
~~~~

.. code-block:: java

   class Solution {
       public String countAndSay(int n){String current="1";for(int term=2;term<=n;term++){StringBuilder next=new StringBuilder();for(int start=0;start<current.length();){int end=start+1;while(end<current.length()&&current.charAt(end)==current.charAt(start))end++;next.append(end-start).append(current.charAt(start));start=end;}current=next.toString();}return current;}
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn count_and_say(n:i32)->String{
           let mut current=String::from("1");for _ in 2..=n{let b=current.as_bytes();let mut next=String::new();let mut start=0;while start<b.len(){let mut end=start+1;while end<b.len()&&b[end]==b[start]{end+=1;}next.push_str(&(end-start).to_string());next.push(b[start] as char);start=end;}current=next;}current
       }
   }

Go
~~

.. code-block:: go

   func countAndSay(n int)string{
       current:="1";for term:=2;term<=n;term++{var next strings.Builder;for start:=0;start<len(current);{end:=start+1;for end<len(current)&&current[end]==current[start]{end++};next.WriteString(strconv.Itoa(end-start));next.WriteByte(current[start]);start=end};current=next.String()};return current
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function countAndSay(n:number):string{
       let current="1";for(let term=2;term<=n;term++){let next="";for(let start=0;start<current.length;){let end=start+1;while(end<current.length&&current[end]===current[start])end++;next+=String(end-start)+current[start];start=end;}current=next;}return current;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public string CountAndSay(int n){string current="1";for(int term=2;term<=n;term++){var next=new StringBuilder();for(int start=0;start<current.Length;){int end=start+1;while(end<current.Length&&current[end]==current[start])end++;next.Append(end-start).Append(current[start]);start=end;}current=next.ToString();}return current;}
   }

Julia
~~~~~

.. code-block:: julia

   function count_and_say(n::Int)
       current="1";for _ in 2:n;chars=collect(current);io=IOBuffer();start=1;while start<=length(chars);stop=start+1;while stop<=length(chars)&&chars[stop]==chars[start];stop+=1;end;print(io,stop-start,chars[start]);start=stop;end;current=String(take!(io));end;current
   end

R
~

.. code-block:: r

   count_and_say <- function(n) {
       current<-"1";if(n>=2L)for(term in 2:n){chars<-strsplit(current,"",fixed=TRUE)[[1]];parts<-character();start<-1L
           while(start<=length(chars)){end<-start+1L;while(end<=length(chars)&&chars[[end]]==chars[[start]])end<-end+1L;parts<-c(parts,as.character(end-start),chars[[start]]);start<-end};current<-paste(parts,collapse="")};current
   }