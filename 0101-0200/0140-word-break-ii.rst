0140. Word Break II
===================

题目信息
--------

:题号: 0140
:难度: Hard
:主题: 动态规划、记忆化搜索、DAG 路径枚举
:原题: `LeetCode 0140 <https://leetcode.com/problems/word-break-ii/>`_
:教学重点: 后缀答案缓存、空串单位元、输出敏感复杂度

题目重述
--------

给定非空小写字符串和非空字典，在字符串中插入空格，使每段都是字典词，返回所有完整句子。字典词可重复使用；无解返回空列表。

自建示例
--------

.. code-block:: text

   s = "aaaa", dict = ["a","aa"]
   -> "a a a a", "a a aa", "a aa a", "aa a a", "aa aa"

   s = "catsx", dict = ["cat","cats"] -> []

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <unordered_map>
   #include <vector>

   class Solution {
   private:
       void plainDfs(const std::string& s, int start,
                     const std::vector<std::string>& words,
                     std::vector<std::string>& path,
                     std::vector<std::string>& result) {
           if (start == static_cast<int>(s.size())) {
               std::string sentence;
               for (int i = 0; i < static_cast<int>(path.size()); ++i) {
                   if (i) sentence += ' ';
                   sentence += path[i];
               }
               result.push_back(std::move(sentence));
               return;
           }
           for (const std::string& word : words)
               if (start + static_cast<int>(word.size()) <= static_cast<int>(s.size()) &&
                   s.compare(start, word.size(), word) == 0) {
                   path.push_back(word);
                   plainDfs(s, start + word.size(), words, path, result);
                   path.pop_back();
               }
       }

       const std::vector<std::string>& memoDfs(
           const std::string& s, int start,
           const std::vector<std::string>& words,
           std::unordered_map<int,std::vector<std::string>>& memo
       ) {
           auto found = memo.find(start);
           if (found != memo.end()) return found->second;
           std::vector<std::string> sentences;
           if (start == static_cast<int>(s.size())) {
               sentences.push_back("");
           } else {
               for (const std::string& word : words) {
                   int end = start + word.size();
                   if (end > static_cast<int>(s.size()) ||
                       s.compare(start, word.size(), word) != 0) continue;
                   for (const std::string& tail : memoDfs(s, end, words, memo))
                       sentences.push_back(tail.empty() ? word : word + " " + tail);
               }
           }
           return memo.emplace(start, std::move(sentences)).first->second;
       }

       std::vector<std::string> suffixDp(
           const std::string& s, const std::vector<std::string>& words
       ) {
           int n = s.size();
           std::vector<std::vector<std::string>> sentences(n + 1);
           sentences[n].push_back("");
           for (int start = n - 1; start >= 0; --start)
               for (const std::string& word : words) {
                   int end = start + word.size();
                   if (end > n || s.compare(start, word.size(), word) != 0) continue;
                   for (const std::string& tail : sentences[end])
                       sentences[start].push_back(tail.empty() ? word : word + " " + tail);
               }
           return sentences[0];
       }

   public:
       std::vector<std::string> wordBreak(
           std::string s, std::vector<std::string>& wordDict
       ) {
           std::unordered_map<int,std::vector<std::string>> memo;
           return memoDfs(s, 0, wordDict, memo);
       }
   };

题解
----

与第 139 题的差异
~~~~~~~~~~~~~~~~

第 139 题只需知道位置是否可达，一个布尔值足够。本题必须保留从每个位置到终点的所有不同路径及其单词标签，因此状态载荷是句子列表。

后缀状态
~~~~~~~~

定义 ``sentences[start]`` 为能够完整覆盖 ``s[start:n]`` 的全部句子。若首词 ``word`` 匹配当前位置，就与 ``sentences[end]`` 中每个尾句组合。

.. code-block:: text

   word + (tail 为空 ? "" : " " + tail)

为什么终点是 [""]
~~~~~~~~~~~~~~~~~~

空字符串不是公开答案，而是组合单位元。末词到达终点时，只有一个空尾句与它组合，得到词本身；若终点是空列表，末词没有组合对象，所有答案都会消失。

.. list-table::
   :header-rows: 1

   * - 后缀
     - 状态
   * - ``""``
     - ``[""]``
   * - ``"aa"``
     - ``["a a","aa"]``
   * - ``"aaaa"``
     - 五个完整句子

为什么记忆化不会漏掉共享后缀
~~~~~~~~~~~~~~~~~~~~~~~~~~

同一位置之后的可行句子只由后缀内容决定，与到达它的前缀无关。首次完整构造后缓存，其他前缀直接复用全部尾句；共享并不合并不同前缀，组合后仍生成不同完整句子。

为什么结果不重不漏
~~~~~~~~~~~~~~~~~~

每个合法句子对应位置 DAG 中一条从 0 到 ``n`` 的路径，递归会按其首词和后续边完整枚举；不同单词边序列产生不同空格切法。字典词互不重复，因此不会从相同边重复生成同一句子。

复杂度来源
~~~~~~~~~~

路径数量可指数增长，任何算法都至少需要与最终输出字符总量成正比。记忆化避免重复展开同一后缀，但还会保存各后缀的中间句子；空间为这些缓存与输出总量之和，递归深度最多 ``O(n)``。

九语言实现
----------

C
~

.. code-block:: c

   static void dfs(char*s,int n,int start,char**words,int count,char**path,int depth,char***out,int*size,int*cap){if(start==n){int len=depth-1;for(int i=0;i<depth;i++)len+=strlen(path[i]);char*sentence=malloc((size_t)len+1);sentence[0]='\0';for(int i=0;i<depth;i++){if(i)strcat(sentence," ");strcat(sentence,path[i]);}if(*size==*cap){*cap*=2;*out=realloc(*out,(size_t)*cap*sizeof(char*));}(*out)[(*size)++]=sentence;return;}for(int i=0;i<count;i++){int len=strlen(words[i]);if(start+len<=n&&!strncmp(s+start,words[i],(size_t)len)){path[depth]=words[i];dfs(s,n,start+len,words,count,path,depth+1,out,size,cap);}}}
   char**wordBreak(char*s,char**words,int count,int*returnSize){int cap=8,size=0,n=strlen(s);char**out=malloc((size_t)cap*sizeof(char*));char**path=malloc((size_t)(n+1)*sizeof(char*));dfs(s,n,0,words,count,path,0,&out,&size,&cap);free(path);*returnSize=size;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def wordBreak(self, s: str, wordDict: list[str]) -> list[str]:
           memo={len(s): [""]}
           def dfs(start):
               if start in memo: return memo[start]
               out=[]
               for word in wordDict:
                   if s.startswith(word,start):
                       for tail in dfs(start+len(word)): out.append(word if not tail else word+" "+tail)
               memo[start]=out; return out
           return dfs(0)

Java
~~~~

.. code-block:: java

   class Solution {Map<Integer,List<String>>memo=new HashMap<>();public List<String> wordBreak(String s,List<String>w){memo.put(s.length(),List.of(""));return dfs(s,0,w);}List<String>dfs(String s,int st,List<String>w){if(memo.containsKey(st))return memo.get(st);List<String>o=new ArrayList<>();for(String x:w)if(st+x.length()<=s.length()&&s.startsWith(x,st))for(String tail:dfs(s,st+x.length(),w))o.add(tail.isEmpty()?x:x+" "+tail);memo.put(st,o);return o;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn word_break(s:String,words:Vec<String>)->Vec<String>{fn dfs(st:usize,s:&str,w:&Vec<String>,m:&mut std::collections::HashMap<usize,Vec<String>>)->Vec<String>{if let Some(v)=m.get(&st){return v.clone()}let mut o=vec![];for x in w{if s[st..].starts_with(x){for tail in dfs(st+x.len(),s,w,m){o.push(if tail.is_empty(){x.clone()}else{format!("{} {}",x,tail)});}}}m.insert(st,o.clone());o}let mut m=std::collections::HashMap::new();m.insert(s.len(),vec![String::new()]);dfs(0,&s,&words,&mut m)}}

Go
~~

.. code-block:: go

   func wordBreak(s string,words []string)[]string{memo:=map[int][]string{len(s):{"")};var dfs func(int)[]string;dfs=func(st int)[]string{if v,ok:=memo[st];ok{return v};o:=[]string{};for _,w:=range words{if st+len(w)<=len(s)&&s[st:st+len(w)]==w{for _,tail:=range dfs(st+len(w)){if tail==""{o=append(o,w)}else{o=append(o,w+" "+tail)}}}};memo[st]=o;return o};return dfs(0)}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function wordBreak(s:string,words:string[]):string[]{const memo=new Map<number,string[]>([[s.length,[""]]]);const dfs=(st:number):string[]=>{if(memo.has(st))return memo.get(st)!;const out:string[]=[];for(const w of words)if(s.startsWith(w,st))for(const tail of dfs(st+w.length))out.push(tail?`${w} ${tail}`:w);memo.set(st,out);return out;};return dfs(0);}

C#
~~

.. code-block:: csharp

   public class Solution {Dictionary<int,IList<string>>memo=new();public IList<string> WordBreak(string s,IList<string>w){memo[s.Length]=new List<string>{""};return Dfs(s,0,w);}IList<string>Dfs(string s,int st,IList<string>w){if(memo.TryGetValue(st,out var seen))return seen;var o=new List<string>();foreach(var x in w)if(st+x.Length<=s.Length&&s.AsSpan(st,x.Length).SequenceEqual(x))foreach(var tail in Dfs(s,st+x.Length,w))o.Add(tail.Length==0?x:x+" "+tail);memo[st]=o;return o;}}

Julia
~~~~~

.. code-block:: julia

   function word_break_sentences(s,words)
       a=collect(codeunits(s));memo=Dict(length(a)+1=>[""])
       function dfs(st);haskey(memo,st)&&return memo[st];out=String[];for w in words;b=collect(codeunits(w));if st+length(b)-1<=length(a)&&a[st:st+length(b)-1]==b;for tail in dfs(st+length(b));push!(out,isempty(tail) ? w : w*" "*tail);end;end;end;memo[st]=out;out;end
       dfs(1)
   end

R
~

.. code-block:: r

   word_break_sentences <- function(s,words){n<-nchar(s,type="bytes");memo<-new.env(hash=TRUE,parent=emptyenv());assign(as.character(n),"",memo);dfs<-function(st){key<-as.character(st);if(exists(key,memo,inherits=FALSE))return(get(key,memo));out<-character();for(w in words){len<-nchar(w,type="bytes");if(st+len<=n&&substr(s,st+1L,st+len)==w)for(tail in dfs(st+len))out<-c(out,if(tail=="")w else paste(w,tail))};assign(key,out,memo);out};dfs(0L)}
