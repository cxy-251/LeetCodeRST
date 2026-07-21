0030. Substring with Concatenation of All Words
===============================================

题目信息
--------

:题号: 0030
:难度: Hard
:主题: 字符串、哈希计数、固定步长滑动窗口、多偏移扫描
:原题: `LeetCode 0030 <https://leetcode.com/problems/substring-with-concatenation-of-all-words/>`_
:教学重点: 等长单词分块、需求频次、余数类扫描、超量收缩、重复单词、重叠答案

题目重述
--------

给定字符串 ``s`` 和等长单词数组 ``words``，找出所有起点，使从该位置开始的连续子串恰好由全部单词各使用一次
拼接而成。单词顺序任意，重复单词必须满足对应次数。结果下标为零基，顺序不限。

自建示例
--------

.. code-block:: text

   s = "wordgoodgoodgoodbestword"
   words = ["word", "good", "best", "good"]
   返回 [8]

起点 8 的分块为 ``good, good, best, word``。第三个连续 ``good`` 会让窗口中的 ``good`` 超量，必须从左侧收缩到
需求频次重新合法。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <unordered_map>
   #include <vector>

   class Solution {
   private:
       std::vector<int> recountEveryStart(
           const std::string& s,
           const std::vector<std::string>& words
       ) {
           std::vector<int> result;
           if (words.empty()) return result;
           int word_length = static_cast<int>(words[0].size());
           int total_length = word_length * static_cast<int>(words.size());
           std::unordered_map<std::string, int> need;
           for (const auto& word : words) ++need[word];

           for (int start = 0; start + total_length <= static_cast<int>(s.size()); ++start) {
               std::unordered_map<std::string, int> used;
               int block = 0;
               for (; block < static_cast<int>(words.size()); ++block) {
                   std::string word = s.substr(start + block * word_length, word_length);
                   if (++used[word] > need[word]) break;
               }
               if (block == static_cast<int>(words.size())) result.push_back(start);
           }
           return result;
       }

       std::vector<int> slidingByOffset(
           const std::string& s,
           const std::vector<std::string>& words
       ) {
           std::vector<int> result;
           if (words.empty() || words[0].empty()) return result;

           const int word_length = static_cast<int>(words[0].size());
           const int word_count = static_cast<int>(words.size());
           const int total_length = word_length * word_count;
           if (total_length > static_cast<int>(s.size())) return result;

           std::unordered_map<std::string, int> need;
           for (const auto& word : words) ++need[word];

           for (int offset = 0; offset < word_length; ++offset) {
               int left = offset;
               int count = 0;
               std::unordered_map<std::string, int> seen;

               for (int right = offset;
                    right + word_length <= static_cast<int>(s.size());
                    right += word_length) {
                   std::string word = s.substr(right, word_length);
                   auto required = need.find(word);
                   if (required == need.end()) {
                       seen.clear();
                       count = 0;
                       left = right + word_length;
                       continue;
                   }

                   ++seen[word];
                   ++count;
                   while (seen[word] > required->second) {
                       std::string removed = s.substr(left, word_length);
                       --seen[removed];
                       --count;
                       left += word_length;
                   }

                   if (count == word_count) {
                       result.push_back(left);
                       std::string removed = s.substr(left, word_length);
                       --seen[removed];
                       --count;
                       left += word_length;
                   }
               }
           }
           return result;
       }

   public:
       std::vector<int> findSubstring(std::string s, std::vector<std::string>& words) {
           return slidingByOffset(s, words);
       }
   };

题解
----

逐起点重计数重复了哪些工作
~~~~~~~~~~~~~~~~~~~~~~~~~~

目标总长度为 ``word_length * word_count``。基准方法枚举每个字符起点，把目标区间重新切成 ``word_count`` 个块并
重建频次。相邻候选的大部分单词块重叠，却被反复切片和统计，块操作最坏 ``O(nk)``。

等长条件如何固定切分边界
~~~~~~~~~~~~~~~~~~~~~~~~

所有单词长度为 ``w``。一旦起点确定，块边界只能是 ``start, start+w, start+2w, ...``，无需尝试不同切法。所有
起点按 ``start mod w`` 分成 ``w`` 个余数类；每条扫描线都只按 ``w`` 步长移动。

为什么扫描 w 个偏移仍是线性块数量
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

不同偏移覆盖互不相同的块起点。每个合法字符起点只属于一个余数类，因此所有扫描线处理的完整块总数仍与字符串
长度同阶，而不是对整个字符串重复扫描 ``w`` 遍。

窗口频次维护哪些状态
~~~~~~~~~~~~~~~~~~~~

``need[word]`` 是需求次数，``seen[word]`` 是当前窗口次数，``left`` 是最左块起点，``count`` 是窗口块数。读入块后：

#. 非需求单词会切断所有跨越它的候选，清空窗口并把 ``left`` 移到其后；
#. 合法且未超量时继续扩张；
#. 当前单词超量时，从左逐块移除，直到其频次恢复到需求范围。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 新块
     - ``good`` 次数
     - 动作
     - 窗口
   * - word
     - 0
     - 加入
     - word
   * - good
     - 1
     - 加入
     - word,good
   * - good
     - 2
     - 加入
     - word,good,good
   * - good
     - 3
     - 超量，移除 word 和第一个 good
     - good,good
   * - best
     - 2
     - 加入
     - good,good,best
   * - word
     - 2
     - 达到四块，记录起点 8
     - good,good,best,word

为什么只检查新加入单词的超量
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

扩张前窗口中所有频次都不超过需求。一次只增加新 ``word`` 的频次，因此只有它可能刚刚超量。收缩会让其他单词
次数减少，不可能制造新的超量，无需每轮遍历整个哈希表。

为什么 count 等于单词数时频次必然完全相等
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

窗口只含需求表中的单词，并且每种次数都不超过需求。窗口总块数与需求总次数都等于 ``word_count``；若某个单词
次数仍小于需求，就必须有另一个单词超量才能补足总数，与窗口不变量矛盾。因此所有频次逐项相等。

记录后为何立即移除最左块
~~~~~~~~~~~~~~~~~~~~~~~~

记录完整窗口后移除最左块，使窗口继续寻找同一扫描线上的重叠答案。若直接清空，会遗漏共享后缀的下一答案；若
保持完整窗口再加入新块，窗口长度会超过目标并增加无效状态。

复杂度来源
~~~~~~~~~~

每个对齐块最多被右端加入一次、左端移除一次，哈希窗口操作为 ``O(n)``；若切片复制 ``w`` 个字符，实际字符工作
量可记为 ``O(nw)``。``need`` 与 ``seen`` 最多保存不同单词数 ``u``，额外空间 ``O(u)``。基准方法为
``O(nk)`` 次块检查。

九语言实现
----------

C
~

.. code-block:: c

   static int word_id(const char* slice,char** words,int wordsSize,int w,int* rep,int unique){
       for(int id=0;id<unique;++id)if(memcmp(slice,words[rep[id]],(size_t)w)==0)return id;return -1;
   }
   int* findSubstring(char* s,char** words,int wordsSize,int* returnSize){
       *returnSize=0;if(wordsSize==0)return NULL;int n=(int)strlen(s),w=(int)strlen(words[0]);if(w==0||w*wordsSize>n)return NULL;
       int* rep=malloc((size_t)wordsSize*sizeof(int));int* need=calloc((size_t)wordsSize,sizeof(int));int unique=0;
       for(int i=0;i<wordsSize;++i){int id=-1;for(int j=0;j<unique;++j)if(strcmp(words[i],words[rep[j]])==0){id=j;break;}if(id<0){id=unique;rep[unique++]=i;}need[id]++;}
       int* result=malloc((size_t)(n+1)*sizeof(int));int* seen=calloc((size_t)unique,sizeof(int));
       for(int offset=0;offset<w;++offset){memset(seen,0,(size_t)unique*sizeof(int));int left=offset,count=0;
           for(int right=offset;right+w<=n;right+=w){int id=word_id(s+right,words,wordsSize,w,rep,unique);if(id<0){memset(seen,0,(size_t)unique*sizeof(int));count=0;left=right+w;continue;}seen[id]++;count++;
               while(seen[id]>need[id]){int removed=word_id(s+left,words,wordsSize,w,rep,unique);seen[removed]--;count--;left+=w;}
               if(count==wordsSize){result[(*returnSize)++]=left;int removed=word_id(s+left,words,wordsSize,w,rep,unique);seen[removed]--;count--;left+=w;}}}
       free(rep);free(need);free(seen);return result;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def findSubstring(self, s: str, words: list[str]) -> list[int]:
           if not words: return []
           from collections import Counter, defaultdict
           w, k, need = len(words[0]), len(words), Counter(words)
           result = []
           for offset in range(w):
               left = offset; count = 0; seen = defaultdict(int)
               for right in range(offset, len(s) - w + 1, w):
                   word = s[right:right+w]
                   if word not in need:
                       seen.clear(); count = 0; left = right + w; continue
                   seen[word] += 1; count += 1
                   while seen[word] > need[word]:
                       removed = s[left:left+w]; seen[removed] -= 1; count -= 1; left += w
                   if count == k:
                       result.append(left)
                       removed = s[left:left+w]; seen[removed] -= 1; count -= 1; left += w
           return result

Java
~~~~

.. code-block:: java

   class Solution {
       public List<Integer> findSubstring(String s,String[] words){
           List<Integer> result=new ArrayList<>();if(words.length==0)return result;int w=words[0].length(),k=words.length;
           Map<String,Integer> need=new HashMap<>();for(String x:words)need.merge(x,1,Integer::sum);
           for(int offset=0;offset<w;offset++){int left=offset,count=0;Map<String,Integer> seen=new HashMap<>();
               for(int right=offset;right+w<=s.length();right+=w){String word=s.substring(right,right+w);if(!need.containsKey(word)){seen.clear();count=0;left=right+w;continue;}seen.merge(word,1,Integer::sum);count++;
                   while(seen.get(word)>need.get(word)){String removed=s.substring(left,left+w);seen.put(removed,seen.get(removed)-1);count--;left+=w;}
                   if(count==k){result.add(left);String removed=s.substring(left,left+w);seen.put(removed,seen.get(removed)-1);count--;left+=w;}}}
           return result;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn find_substring(s:String,words:Vec<String>)->Vec<i32>{
           use std::collections::HashMap;if words.is_empty(){return vec![]}let w=words[0].len();let k=words.len();let mut need:HashMap<&str,i32>=HashMap::new();for x in &words{*need.entry(x).or_insert(0)+=1;}
           let mut result=Vec::new();for offset in 0..w{let(mut left,mut count)=(offset,0usize);let mut seen:HashMap<&str,i32>=HashMap::new();let mut right=offset;
               while right+w<=s.len(){let word=&s[right..right+w];right+=w;if !need.contains_key(word){seen.clear();count=0;left=right;continue;}*seen.entry(word).or_insert(0)+=1;count+=1;
                   while seen[word]>need[word]{let removed=&s[left..left+w];*seen.get_mut(removed).unwrap()-=1;count-=1;left+=w;}
                   if count==k{result.push(left as i32);let removed=&s[left..left+w];*seen.get_mut(removed).unwrap()-=1;count-=1;left+=w;}}}result
       }
   }

Go
~~

.. code-block:: go

   func findSubstring(s string,words []string)[]int{
       if len(words)==0{return []int{}};w,k:=len(words[0]),len(words);need:=map[string]int{};for _,x:=range words{need[x]++};result:=[]int{}
       for offset:=0;offset<w;offset++{left,count:=offset,0;seen:=map[string]int{};for right:=offset;right+w<=len(s);right+=w{word:=s[right:right+w];limit,ok:=need[word];if !ok{seen=map[string]int{};count=0;left=right+w;continue};seen[word]++;count++
               for seen[word]>limit{removed:=s[left:left+w];seen[removed]--;count--;left+=w};if count==k{result=append(result,left);removed:=s[left:left+w];seen[removed]--;count--;left+=w}}};return result
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function findSubstring(s:string,words:string[]):number[]{
       if(words.length===0)return [];const w=words[0].length,k=words.length,need=new Map<string,number>();for(const x of words)need.set(x,(need.get(x)??0)+1);const result:number[]=[];
       for(let offset=0;offset<w;offset++){let left=offset,count=0;const seen=new Map<string,number>();for(let right=offset;right+w<=s.length;right+=w){const word=s.slice(right,right+w),limit=need.get(word);if(limit===undefined){seen.clear();count=0;left=right+w;continue;}seen.set(word,(seen.get(word)??0)+1);count++;
               while(seen.get(word)!>limit){const removed=s.slice(left,left+w);seen.set(removed,seen.get(removed)!-1);count--;left+=w;}if(count===k){result.push(left);const removed=s.slice(left,left+w);seen.set(removed,seen.get(removed)!-1);count--;left+=w;}}}return result;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public IList<int> FindSubstring(string s,string[] words){
           var result=new List<int>();if(words.Length==0)return result;int w=words[0].Length,k=words.Length;var need=new Dictionary<string,int>();foreach(var x in words)need[x]=need.GetValueOrDefault(x)+1;
           for(int offset=0;offset<w;offset++){int left=offset,count=0;var seen=new Dictionary<string,int>();for(int right=offset;right+w<=s.Length;right+=w){string word=s.Substring(right,w);if(!need.ContainsKey(word)){seen.Clear();count=0;left=right+w;continue;}seen[word]=seen.GetValueOrDefault(word)+1;count++;
                   while(seen[word]>need[word]){string removed=s.Substring(left,w);seen[removed]--;count--;left+=w;}if(count==k){result.Add(left);string removed=s.Substring(left,w);seen[removed]--;count--;left+=w;}}}return result;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function find_substring(s::String,words::Vector{String})
       isempty(words)&&return Int[];w=ncodeunits(words[1]);k=length(words);need=Dict{String,Int}();for x in words;need[x]=get(need,x,0)+1;end;result=Int[];n=ncodeunits(s)
       for offset in 0:w-1;left=offset+1;count=0;seen=Dict{String,Int}();right=offset+1
           while right+w-1<=n;word=String(SubString(s,right,right+w-1));right+=w;if !haskey(need,word);empty!(seen);count=0;left=right;continue;end;seen[word]=get(seen,word,0)+1;count+=1
               while seen[word]>need[word];removed=String(SubString(s,left,left+w-1));seen[removed]-=1;count-=1;left+=w;end
               if count==k;push!(result,left-1);removed=String(SubString(s,left,left+w-1));seen[removed]-=1;count-=1;left+=w;end
           end
       end;result
   end

R
~

.. code-block:: r

   find_substring <- function(s, words) {
       if (length(words)==0L) return(integer()); w<-nchar(words[[1]]);k<-length(words);need<-table(words);result<-integer()
       for (offset in 0:(w-1L)) { left<-offset+1L;right<-offset+1L;count<-0L;seen<-setNames(integer(length(need)),names(need))
           while (right+w-1L<=nchar(s)) { word<-substr(s,right,right+w-1L);right<-right+w
               if (!(word %in% names(need))) { seen[]<-0L;count<-0L;left<-right;next }
               seen[[word]]<-seen[[word]]+1L;count<-count+1L
               while(seen[[word]]>need[[word]]){removed<-substr(s,left,left+w-1L);seen[[removed]]<-seen[[removed]]-1L;count<-count-1L;left<-left+w}
               if(count==k){result<-c(result,left-1L);removed<-substr(s,left,left+w-1L);seen[[removed]]<-seen[[removed]]-1L;count<-count-1L;left<-left+w}
           }
       }
       result
   }
