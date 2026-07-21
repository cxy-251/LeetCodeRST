0068. Text Justification
========================

题目信息
--------

:题号: 0068
:难度: Hard
:主题: 字符串、贪心、文本排版、商余分配
:原题: `LeetCode 0068 <https://leetcode.com/problems/text-justification/>`_
:教学重点: 最大装行、普通行两端对齐、左侧优先、末行特例

题目重述
--------

按原顺序把单词分成若干行，每行长度恰为 ``maxWidth``。普通行尽量均匀分配单词间空格，无法整除时左侧间隔多一个；最后一行和只有一个单词的行使用单空格分隔并在末尾补空格。

自建示例
--------

.. code-block:: text

   words = ["a","bb","ccc","dddd"], maxWidth = 11
   "a   bb  ccc"
   "dddd       "

第一行单词共 6 个字符，需要 5 个空格分到两个间隔，得到 3 和 2。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       std::vector<std::string> temporaryLine(const std::vector<std::string>& words, int width) {
           std::vector<std::vector<std::string>> groups;
           std::vector<std::string> current;
           int letters = 0;
           for (const auto& word : words) {
               if (!current.empty() && letters + static_cast<int>(current.size()) + static_cast<int>(word.size()) > width) {
                   groups.push_back(current); current.clear(); letters = 0;
               }
               current.push_back(word); letters += word.size();
           }
           groups.push_back(current);
           std::vector<std::string> result;
           for (int line = 0; line < static_cast<int>(groups.size()); ++line) {
               int total_letters = 0;
               for (const auto& word : groups[line]) total_letters += word.size();
               bool left = line + 1 == static_cast<int>(groups.size()) || groups[line].size() == 1;
               std::string output;
               if (left) {
                   for (int i = 0; i < static_cast<int>(groups[line].size()); ++i) {
                       if (i) output.push_back(' '); output += groups[line][i];
                   }
               } else {
                   int gaps = groups[line].size() - 1;
                   int spaces = width - total_letters;
                   for (int i = 0; i < static_cast<int>(groups[line].size()); ++i) {
                       output += groups[line][i];
                       if (i < gaps) output.append(spaces / gaps + (i < spaces % gaps), ' ');
                   }
               }
               output.append(width - output.size(), ' '); result.push_back(output);
           }
           return result;
       }

       std::string formatLine(const std::vector<std::string>& words, int start, int end,
                              int letters, int width, bool last) {
           int count = end - start;
           std::string line;
           if (last || count == 1) {
               for (int i = start; i < end; ++i) {
                   if (i > start) line.push_back(' ');
                   line += words[i];
               }
               line.append(width - line.size(), ' ');
               return line;
           }
           int gaps = count - 1;
           int total_spaces = width - letters;
           int base = total_spaces / gaps;
           int extra = total_spaces % gaps;
           for (int i = start; i < end; ++i) {
               line += words[i];
               if (i + 1 < end) line.append(base + (i - start < extra), ' ');
           }
           return line;
       }

       std::vector<std::string> greedyWithFormatter(const std::vector<std::string>& words, int width) {
           std::vector<std::string> result;
           int start = 0;
           while (start < static_cast<int>(words.size())) {
               int end = start, letters = 0;
               while (end < static_cast<int>(words.size()) &&
                      letters + static_cast<int>(words[end].size()) + (end - start) <= width) {
                   letters += words[end].size(); ++end;
               }
               result.push_back(formatLine(words, start, end, letters, width, end == static_cast<int>(words.size())));
               start = end;
           }
           return result;
       }

   public:
       std::vector<std::string> fullJustify(std::vector<std::string>& words, int maxWidth) {
           return greedyWithFormatter(words, maxWidth);
       }
   };

题解
----

为什么先确定行再分空格
~~~~~~~~~~~~~~~~~~~~

某行能否继续加入单词只取决于单词字符总数和最少一个的间隔；而最终空格宽度取决于这一行最终包含多少单词。把“选词”和“格式化”分开，可以避免边试排边回滚复杂字符串。

最大装行条件如何得到
~~~~~~~~~~~~~~~~~~~~

当前行已有 ``end-start`` 个单词、字符总数为 ``letters``。加入下一个单词后，至少需要 ``end-start`` 个单空格间隔，因此条件是：

.. code-block:: text

   letters + next_word_length + (end - start) <= maxWidth

一旦失败，更后的单词仍必须排在下一行，贪心选择当前最多单词不会影响后续顺序。

普通行的空格如何分配
~~~~~~~~~~~~~~~~~~~~

设单词数量 ``count``、间隔 ``gaps=count-1``，需要分配：

.. code-block:: text

   total_spaces = maxWidth - letters
   base  = total_spaces / gaps
   extra = total_spaces % gaps

每个间隔先放 ``base`` 个空格，前 ``extra`` 个间隔再多放一个，正好满足左侧优先。

商余状态跟踪
~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 项目
     - 数值
   * - 单词
     - ``a, bb, ccc``
   * - 字符数
     - ``1+2+3 = 6``
   * - 空格总数
     - ``11-6 = 5``
   * - 间隔数
     - 2
   * - 商与余数
     - ``base=2, extra=1``
   * - 分配
     - 左间隔 3，右间隔 2

为什么左侧多一个是唯一规则实现
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

总空格写成 ``base*gaps + extra``，其中 ``0 <= extra < gaps``。任何相邻间隔差最多为 1 的分配都必须有 ``extra`` 个间隔取 ``base+1``；题目指定左侧优先，因此它们只能是最左边的 ``extra`` 个。

末行为什么不能两端对齐
~~~~~~~~~~~~~~~~~~~~~~

最后一行规定单词间只放一个空格，剩余空格全部补在末尾。若仍使用商余分配，会把额外空格塞入单词间，违反左对齐规则。

单词独占行为何与末行同处理
~~~~~~~~~~~~~~~~~~~~~~~~

只有一个单词时 ``gaps=0``，两端对齐无法做除法，也没有间隔可分。把单词放在左侧并在末尾补满，是唯一满足固定宽度的形式。

为什么每行长度恰好等于 maxWidth
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

普通行写入 ``letters + total_spaces`` 个字符，正好等于宽度。左对齐行先用单空格连接，再补 ``width-line.size()`` 个尾空格，也恰好达到宽度。

最大装行贪心为什么正确
~~~~~~~~~~~~~~~~~~~~~~

题目要求保持单词顺序，并规定每行尽可能容纳单词。若下一个单词连同最少间隔已经超宽，则任何合法格式都不能把它放入当前行；若仍可容纳，提前换行会违反最大装行要求。因此行边界由该条件唯一确定。

复杂度来源
~~~~~~~~~~

每个单词在选行和输出时各处理常数次，输出字符总数为行数乘宽度。时间 ``O(total_characters + output_size)``；除返回结果和当前行字符串外，额外空间 ``O(maxWidth)``。

九语言实现
----------

C
~

.. code-block:: c

   char**fullJustify(char**w,int n,int width,int*returnSize){char**out=malloc((size_t)n*sizeof(char*));int count=0,start=0;while(start<n){int end=start,letters=0;while(end<n&&letters+(int)strlen(w[end])+(end-start)<=width){letters+=(int)strlen(w[end]);end++;}int words=end-start,gaps=words-1,last=end==n;char*line=malloc((size_t)width+1);memset(line,' ',(size_t)width);line[width]='\0';int pos=0;if(last||words==1){for(int i=start;i<end;i++){if(i>start)pos++;int len=(int)strlen(w[i]);memcpy(line+pos,w[i],(size_t)len);pos+=len;}}else{int spaces=width-letters,base=spaces/gaps,extra=spaces%gaps;for(int i=start;i<end;i++){int len=(int)strlen(w[i]);memcpy(line+pos,w[i],(size_t)len);pos+=len;if(i+1<end)pos+=base+((i-start)<extra);}}out[count++]=line;start=end;}*returnSize=count;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def fullJustify(self, words: list[str], width: int) -> list[str]:
           result, start = [], 0
           while start < len(words):
               end, letters = start, 0
               while end < len(words) and letters + len(words[end]) + end-start <= width:
                   letters += len(words[end]); end += 1
               count, last = end-start, end == len(words)
               if last or count == 1:
                   line = " ".join(words[start:end]).ljust(width)
               else:
                   spaces, gaps = width-letters, count-1
                   base, extra = divmod(spaces, gaps)
                   line = "".join(words[i] + (" " * (base + (i-start < extra)) if i+1 < end else "") for i in range(start,end))
               result.append(line); start = end
           return result

Java
~~~~

.. code-block:: java

   class Solution {public List<String> fullJustify(String[]w,int width){List<String>out=new ArrayList<>();int start=0;while(start<w.length){int end=start,letters=0;while(end<w.length&&letters+w[end].length()+end-start<=width)letters+=w[end++].length();int count=end-start;boolean last=end==w.length;StringBuilder line=new StringBuilder();if(last||count==1){for(int i=start;i<end;i++){if(i>start)line.append(' ');line.append(w[i]);}while(line.length()<width)line.append(' ');}else{int spaces=width-letters,gaps=count-1,base=spaces/gaps,extra=spaces%gaps;for(int i=start;i<end;i++){line.append(w[i]);if(i+1<end)line.append(" ".repeat(base+(i-start<extra?1:0)));}}out.add(line.toString());start=end;}return out;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn full_justify(w:Vec<String>,width:i32)->Vec<String>{let width=width as usize;let(mut out,mut start)=(vec![],0);while start<w.len(){let(mut end,mut letters)=(start,0);while end<w.len()&&letters+w[end].len()+end-start<=width{letters+=w[end].len();end+=1}let count=end-start;let mut line=String::new();if end==w.len()||count==1{line=w[start..end].join(" ");line.push_str(&" ".repeat(width-line.len()));}else{let spaces=width-letters;let(base,extra)=(spaces/(count-1),spaces%(count-1));for i in start..end{line.push_str(&w[i]);if i+1<end{line.push_str(&" ".repeat(base+usize::from(i-start<extra)));}}}out.push(line);start=end}out}}

Go
~~

.. code-block:: go

   func fullJustify(w []string,width int)[]string{out:=[]string{};for start:=0;start<len(w);{end,letters:=start,0;for end<len(w)&&letters+len(w[end])+end-start<=width{letters+=len(w[end]);end++};count:=end-start;var b strings.Builder;if end==len(w)||count==1{b.WriteString(strings.Join(w[start:end]," "));b.WriteString(strings.Repeat(" ",width-b.Len()))}else{spaces,gaps:=width-letters,count-1;base,extra:=spaces/gaps,spaces%gaps;for i:=start;i<end;i++{b.WriteString(w[i]);if i+1<end{add:=base;if i-start<extra{add++};b.WriteString(strings.Repeat(" ",add))}}};out=append(out,b.String());start=end};return out}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function fullJustify(w:string[],width:number):string[]{const out:string[]=[];for(let start=0;start<w.length;){let end=start,letters=0;while(end<w.length&&letters+w[end].length+end-start<=width)letters+=w[end++].length;const count=end-start,last=end===w.length;let line="";if(last||count===1)line=w.slice(start,end).join(" ").padEnd(width);else{const spaces=width-letters,gaps=count-1,base=Math.floor(spaces/gaps),extra=spaces%gaps;for(let i=start;i<end;i++){line+=w[i];if(i+1<end)line+=" ".repeat(base+(i-start<extra?1:0));}}out.push(line);start=end;}return out;}

C#
~~

.. code-block:: csharp

   public class Solution {public IList<string> FullJustify(string[]w,int width){var o=new List<string>();for(int start=0;start<w.Length;){int end=start,letters=0;while(end<w.Length&&letters+w[end].Length+end-start<=width)letters+=w[end++].Length;int count=end-start;var b=new System.Text.StringBuilder();if(end==w.Length||count==1){b.Append(string.Join(" ",w[start..end]));b.Append(' ',width-b.Length);}else{int spaces=width-letters,gaps=count-1,base=spaces/gaps,extra=spaces%gaps;for(int i=start;i<end;i++){b.Append(w[i]);if(i+1<end)b.Append(' ',base+(i-start<extra?1:0));}}o.Add(b.ToString());start=end;}return o;}}

Julia
~~~~~

.. code-block:: julia

   function full_justify(words,width)
       out=String[];start=1
       while start<=length(words);stop=start;letters=0;while stop<=length(words)&&letters+length(words[stop])+(stop-start)<=width;letters+=length(words[stop]);stop+=1;end;count=stop-start
           if stop>length(words)||count==1;line=join(words[start:stop-1]," ");line*=repeat(" ",width-length(line));else;spaces=width-letters;base=spaces÷(count-1);extra=spaces%(count-1);parts=String[];for i in start:stop-1;push!(parts,words[i]);i+1<stop&&push!(parts,repeat(" ",base+(i-start<extra)));end;line=join(parts);end
           push!(out,line);start=stop
       end;out
   end

R
~

.. code-block:: r

   full_justify <- function(words,width){out<-character();start<-1L;n<-length(words);while(start<=n){end<-start;letters<-0L;while(end<=n&&letters+nchar(words[[end]])+(end-start)<=width){letters<-letters+nchar(words[[end]]);end<-end+1L};count<-end-start;if(end>n||count==1L){line<-paste(words[start:(end-1L)],collapse=" ");line<-paste0(line,strrep(" ",width-nchar(line)))}else{spaces<-width-letters;gaps<-count-1L;base<-spaces%/%gaps;extra<-spaces%%gaps;parts<-character();for(i in 0:(count-1L)){parts<-c(parts,words[[start+i]]);if(i<gaps)parts<-c(parts,strrep(" ",base+as.integer(i<extra)))};line<-paste0(parts,collapse="")};out<-c(out,line);start<-end};out}
