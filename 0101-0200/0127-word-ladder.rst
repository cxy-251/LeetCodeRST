0127. Word Ladder
=================

题目信息
--------

:题号: 0127
:难度: Hard
:主题: 图、广度优先搜索、哈希集合、字符串
:原题: `LeetCode 0127 <https://leetcode.com/problems/word-ladder/>`_
:重点: 最短序列长度、单字符变换、起点计入长度、不可达返回零

题目重述
--------

给定起始单词 ``beginWord``、目标单词 ``endWord`` 和字典 ``wordList``。每一步必须恰好修改一个字母，并且修改后的单词必须存在于 ``wordList`` 中；``beginWord`` 本身可以不在字典中。返回从起点到终点的最短变换序列所包含的单词数量，起点和终点都计入长度；若无法到达 ``endWord``，返回 ``0``。

所有单词长度相同且只包含小写英文字母。单词长度在 ``1..10`` 范围内，``wordList`` 长度在 ``1..5000`` 范围内，字典中的单词互不相同，且 ``beginWord != endWord``。

自建示例
--------

.. code-block:: text

   输入：beginWord = "cold", endWord = "warm"
         wordList = ["cord","card","ward","warm","bold","bald"]
   输出：5
   解释：最短序列之一是 cold -> cord -> card -> ward -> warm，共包含 5 个单词。

.. code-block:: text

   输入：beginWord = "abc", endWord = "xyz"
         wordList = ["xbc","xyc","ayz"]
   输出：0
   解释：字典中的单词无法连成一条从 abc 到 xyz 的完整变换路径。

C++ 实现
--------

.. code-block:: cpp

   #include <queue>
   #include <string>
   #include <unordered_set>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       bool oneDifference(const std::string& a, const std::string& b) {
           int differences = 0;
           for (int i = 0; i < static_cast<int>(a.size()); ++i)
               if (a[i] != b[i] && ++differences > 1) return false;
           return differences == 1;
       }

       int pairwiseGraph(const std::string& beginWord,
                         const std::string& endWord,
                         const std::vector<std::string>& wordList) {
           int end_index = -1, n = wordList.size();
           for (int i = 0; i < n; ++i) if (wordList[i] == endWord) end_index = i;
           if (end_index == -1) return 0;
           std::vector<std::vector<int>> graph(n + 1);
           for (int i = 0; i <= n; ++i)
               for (int j = i + 1; j <= n; ++j) {
                   const std::string& a = i == n ? beginWord : wordList[i];
                   const std::string& b = j == n ? beginWord : wordList[j];
                   if (oneDifference(a,b)) { graph[i].push_back(j); graph[j].push_back(i); }
               }
           std::queue<int> queue; queue.push(n);
           std::vector<int> distance(n + 1, 0); distance[n] = 1;
           while (!queue.empty()) {
               int node = queue.front(); queue.pop();
               if (node == end_index) return distance[node];
               for (int next : graph[node]) if (!distance[next]) {
                   distance[next] = distance[node] + 1; queue.push(next);
               }
           }
           return 0;
       }

       int singleBfs(const std::string& beginWord,
                     const std::string& endWord,
                     const std::vector<std::string>& wordList) {
           std::unordered_set<std::string> unused(wordList.begin(), wordList.end());
           if (!unused.count(endWord)) return 0;
           std::queue<std::string> queue; queue.push(beginWord);
           unused.erase(beginWord);
           int length = 1;
           while (!queue.empty()) {
               int count = queue.size();
               while (count--) {
                   std::string word = queue.front(); queue.pop();
                   if (word == endWord) return length;
                   for (int i = 0; i < static_cast<int>(word.size()); ++i) {
                       char original = word[i];
                       for (char ch = 'a'; ch <= 'z'; ++ch) {
                           if (ch == original) continue;
                           word[i] = ch;
                           if (unused.erase(word)) queue.push(word);
                       }
                       word[i] = original;
                   }
               }
               ++length;
           }
           return 0;
       }

       int bidirectionalBfs(const std::string& beginWord,
                            const std::string& endWord,
                            const std::vector<std::string>& wordList) {
           std::unordered_set<std::string> unused(wordList.begin(), wordList.end());
           if (!unused.count(endWord)) return 0;
           std::unordered_set<std::string> front{beginWord}, back{endWord};
           unused.erase(beginWord); unused.erase(endWord);
           int length = 2;
           while (!front.empty() && !back.empty()) {
               if (front.size() > back.size()) front.swap(back);
               std::unordered_set<std::string> next_front;
               for (std::string word : front)
                   for (int i = 0; i < static_cast<int>(word.size()); ++i) {
                       char original = word[i];
                       for (char ch = 'a'; ch <= 'z'; ++ch) {
                           if (ch == original) continue;
                           word[i] = ch;
                           if (back.count(word)) return length;
                           if (unused.erase(word)) next_front.insert(word);
                       }
                       word[i] = original;
                   }
               front = std::move(next_front); ++length;
           }
           return 0;
       }

   public:
       int ladderLength(std::string beginWord, std::string endWord,
                        std::vector<std::string>& wordList) {
           return singleBfs(beginWord, endWord, wordList);
       }
   };

题解
----

为什么这是无权最短路
~~~~~~~~~~~~~~~~~~~~

每个合法单词是节点，恰好相差一个字符的单词之间有边，每条边代价相同。BFS 按边数从小到大访问节点，因此首次到达终点即得到最短路径。

邻居为何按需生成
~~~~~~~~~~~~~~~~

对当前单词每个位置尝试 ``a..z``，候选仍在未访问字典中时就是邻居。这样无需比较全部单词对，也无需保存完整邻接表。

为什么入队时立即删除
~~~~~~~~~~~~~~~~~~~~

节点第一次被发现时来自当前最浅层，距离已经最短。立即从 ``unused`` 删除，可阻止同层其他节点重复入队；本题只求长度，不需要保存上一题中的多个最短前驱。

.. list-table::
   :header-rows: 1

   * - 序列长度
     - 当前层
     - 下一层
   * - 1
     - ``hit``
     - ``hot``
   * - 2
     - ``hot``
     - ``dot, lot``
   * - 3
     - ``dot, lot``
     - ``dog, log``
   * - 4
     - ``dog, log``
     - ``cog``
   * - 5
     - ``cog``
     - 返回 5

返回值为什么从 1 开始
~~~~~~~~~~~~~~~~~~~~~~

题目返回序列中的单词数量，起点本身算一个单词。队列初始层长度为 1，每跨一条边增加 1，因此到达终点时直接返回层长度。

双向 BFS 如何减少前沿
~~~~~~~~~~~~~~~~~~~~~

从起点和终点同时搜索，每轮扩展节点更少的一侧；若生成的候选落入另一侧前沿，两部分最短路径相接。它不改变最坏阶数，但常显著减少访问节点。

为什么首次终点最优
~~~~~~~~~~~~~~~~~~

BFS 队列中节点距离不下降。终点首次出队或首次由当前层生成时，任何尚未发现路径至少同样长；无权图中不存在更短但更晚出现的路径。

复杂度来源
~~~~~~~~~~

设字典大小 ``N``、单词长度 ``L``。每个节点至多入队一次，每次尝试 ``26L`` 个候选，字符串构造/哈希为 ``O(L)``，期望时间 ``O(26NL²)``，空间 ``O(NL)``。两两建图基准为 ``O(N²L)``。

九语言实现
----------

C
~

.. code-block:: c

   static int one(char*a,char*b){int d=0;for(int i=0;a[i];i++)if(a[i]!=b[i]&&++d>1)return 0;return d==1;}int ladderLength(char*begin,char*end,char**list,int n){int goal=-1;for(int i=0;i<n;i++)if(!strcmp(list[i],end))goal=i;if(goal<0)return 0;int*dist=calloc((size_t)n+1,sizeof(int)),*q=malloc((size_t)(n+1)*sizeof(int));int h=0,t=0;dist[n]=1;q[t++]=n;while(h<t){int u=q[h++];if(u==goal){int out=dist[u];free(dist);free(q);return out;}char*word=u==n?begin:list[u];for(int v=0;v<n;v++)if(!dist[v]&&one(word,list[v])){dist[v]=dist[u]+1;q[t++]=v;}}free(dist);free(q);return 0;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def ladderLength(self, beginWord, endWord, wordList):
           from collections import deque
           unused = set(wordList)
           if endWord not in unused: return 0
           queue, length = deque([beginWord]), 1
           unused.discard(beginWord)
           while queue:
               for _ in range(len(queue)):
                   word = queue.popleft()
                   if word == endWord: return length
                   for i, old in enumerate(word):
                       for ch in "abcdefghijklmnopqrstuvwxyz":
                           if ch == old: continue
                           nxt = word[:i] + ch + word[i+1:]
                           if nxt in unused: unused.remove(nxt); queue.append(nxt)
               length += 1
           return 0

Java
~~~~

.. code-block:: java

   class Solution {public int ladderLength(String b,String e,List<String>list){Set<String>u=new HashSet<>(list);if(!u.contains(e))return 0;Queue<String>q=new ArrayDeque<>();q.add(b);u.remove(b);int len=1;while(!q.isEmpty()){for(int count=q.size();count>0;count--){String w=q.remove();if(w.equals(e))return len;char[]a=w.toCharArray();for(int i=0;i<a.length;i++){char old=a[i];for(char c='a';c<='z';c++){if(c==old)continue;a[i]=c;String n=new String(a);if(u.remove(n))q.add(n);}a[i]=old;}}len++;}return 0;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn ladder_length(begin:String,end:String,list:Vec<String>)->i32{use std::collections::{HashSet,VecDeque};let mut unused:HashSet<String>=list.into_iter().collect();if !unused.contains(&end){return 0}let mut q=VecDeque::from([begin.clone()]);unused.remove(&begin);let mut steps=1;while !q.is_empty(){for _ in 0..q.len(){let w=q.pop_front().unwrap();if w==end{return steps}let mut a=w.into_bytes();for i in 0..a.len(){let old=a[i];for c in b'a'..=b'z'{if c==old{continue}a[i]=c;let n=String::from_utf8(a.clone()).unwrap();if unused.remove(&n){q.push_back(n)}}a[i]=old;}}steps+=1;}0}}

Go
~~

.. code-block:: go

   func ladderLength(begin,end string,list []string)int{unused:=map[string]bool{};for _,w:=range list{unused[w]=true};if !unused[end]{return 0};q:=[]string{begin};delete(unused,begin);steps:=1;for h:=0;h<len(q);steps++{count:=len(q)-h;for ;count>0;count--{w:=q[h];h++;if w==end{return steps};a:=[]byte(w);for i,old:=range a{for c:=byte('a');c<='z';c++{if c==old{continue};a[i]=c;n:=string(a);if unused[n]{delete(unused,n);q=append(q,n)}};a[i]=old}}};return 0}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function ladderLength(begin:string,end:string,list:string[]):number{const unused=new Set(list);if(!unused.has(end))return 0;const q=[begin];unused.delete(begin);let head=0,steps=1;while(head<q.length){let count=q.length-head;while(count--){const w=q[head++];if(w===end)return steps;for(let i=0;i<w.length;i++)for(let k=0;k<26;k++){const c=String.fromCharCode(97+k);if(c===w[i])continue;const n=w.slice(0,i)+c+w.slice(i+1);if(unused.delete(n))q.push(n);}}steps++;}return 0;}

C#
~~

.. code-block:: csharp

   public class Solution {public int LadderLength(string b,string e,IList<string>list){var u=new HashSet<string>(list);if(!u.Contains(e))return 0;var q=new Queue<string>();q.Enqueue(b);u.Remove(b);int steps=1;while(q.Count>0){for(int count=q.Count;count>0;count--){var w=q.Dequeue();if(w==e)return steps;var a=w.ToCharArray();for(int i=0;i<a.Length;i++){char old=a[i];for(char c='a';c<='z';c++){if(c==old)continue;a[i]=c;var n=new string(a);if(u.Remove(n))q.Enqueue(n);}a[i]=old;}}steps++;}return 0;}}

Julia
~~~~~

.. code-block:: julia

   function ladder_length(begin_word,end_word,word_list)
       unused=Set(word_list);end_word in unused||return 0;q=[begin_word];delete!(unused,begin_word);head=1;steps=1
       while head<=length(q);count=length(q)-head+1;for _ in 1:count;w=q[head];head+=1;w==end_word&&return steps;a=collect(codeunits(w));for i in eachindex(a);old=a[i];for c in UInt8('a'):UInt8('z');c==old&&continue;a[i]=c;n=String(copy(a));if n in unused;delete!(unused,n);push!(q,n);end;end;a[i]=old;end;end;steps+=1;end;0
   end

R
~

.. code-block:: r

   ladder_length <- function(begin,end,word_list){if(!(end%in%word_list))return(0L);words<-unique(c(word_list,begin));n<-length(words);one<-function(a,b)sum(strsplit(a,"",fixed=TRUE)[[1L]]!=strsplit(b,"",fixed=TRUE)[[1L]])==1L;start<-match(begin,words);goal<-match(end,words);dist<-rep(0L,n);dist[[start]]<-1L;q<-start;head<-1L;while(head<=length(q)){u<-q[[head]];head<-head+1L;if(u==goal)return(dist[[u]]);for(v in seq_len(n))if(dist[[v]]==0L&&one(words[[u]],words[[v]])){dist[[v]]<-dist[[u]]+1L;q<-c(q,v)}};0L}
