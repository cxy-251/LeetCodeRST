0126. Word Ladder II
====================

题目信息
--------

:题号: 0126
:难度: Hard
:主题: 图、广度优先搜索、最短路径 DAG、回溯
:原题: `LeetCode 0126 <https://leetcode.com/problems/word-ladder-ii/>`_
:重点: 所有最短序列、单字符变换、同层多前驱、结果顺序不限

题目重述
--------

给定起始单词 ``beginWord``、目标单词 ``endWord`` 和字典 ``wordList``，返回从 ``beginWord`` 变换到 ``endWord`` 的所有最短单词序列。每一步必须恰好修改一个字母，修改后的单词必须出现在 ``wordList`` 中；``beginWord`` 本身可以不在字典中。每条序列都包含起点和终点，若无法到达则返回空数组，多个最短序列的返回顺序不限。

所有单词长度相同且只包含小写英文字母。单词长度在 ``1..5`` 范围内，``wordList`` 长度在 ``1..500`` 范围内，字典中的单词互不相同，且 ``beginWord != endWord``。

自建示例
--------

.. code-block:: text

   输入：beginWord = "red", endWord = "tax"
         wordList = ["ted","tex","red","tax","tad","den","rex","pee"]
   输出：[["red","ted","tad","tax"],
         ["red","ted","tex","tax"],
         ["red","rex","tex","tax"]]
   解释：三条序列都只在相邻单词间改变一个字母，长度均为 4，并且不存在更短的合法序列；结果顺序可以不同。

.. code-block:: text

   输入：beginWord = "abc", endWord = "xyz"
         wordList = ["xbc","xyc","ayz"]
   输出：[]
   解释：虽然字典中存在若干局部变换，但无法形成从 abc 到 xyz 的连续路径。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <queue>
   #include <string>
   #include <unordered_map>
   #include <unordered_set>
   #include <vector>

   class Solution {
   private:
       std::vector<std::string> neighbors(
           const std::string& word,
           const std::unordered_set<std::string>& dictionary
       ) {
           std::vector<std::string> result;
           std::string candidate = word;
           for (int i = 0; i < static_cast<int>(candidate.size()); ++i) {
               char original = candidate[i];
               for (char ch = 'a'; ch <= 'z'; ++ch) {
                   if (ch == original) continue;
                   candidate[i] = ch;
                   if (dictionary.count(candidate)) result.push_back(candidate);
               }
               candidate[i] = original;
           }
           return result;
       }

       std::vector<std::vector<std::string>> queueFullPaths(
           const std::string& beginWord,
           const std::string& endWord,
           const std::unordered_set<std::string>& dictionary
       ) {
           std::queue<std::vector<std::string>> queue;
           queue.push({beginWord});
           std::unordered_set<std::string> unused = dictionary;
           std::vector<std::vector<std::string>> result;
           while (!queue.empty() && result.empty()) {
               int count = queue.size();
               std::unordered_set<std::string> used_this_level;
               while (count--) {
                   auto path = std::move(queue.front()); queue.pop();
                   for (const std::string& next : neighbors(path.back(), unused)) {
                       auto extended = path; extended.push_back(next);
                       if (next == endWord) result.push_back(std::move(extended));
                       else queue.push(std::move(extended));
                       used_this_level.insert(next);
                   }
               }
               for (const auto& word : used_this_level) unused.erase(word);
           }
           return result;
       }

       void restore(const std::string& word, const std::string& beginWord,
                    const std::unordered_map<std::string,std::vector<std::string>>& parents,
                    std::vector<std::string>& reversed,
                    std::vector<std::vector<std::string>>& result) {
           reversed.push_back(word);
           if (word == beginWord) {
               result.emplace_back(reversed.rbegin(), reversed.rend());
           } else {
               auto found = parents.find(word);
               if (found != parents.end())
                   for (const std::string& parent : found->second)
                       restore(parent, beginWord, parents, reversed, result);
           }
           reversed.pop_back();
       }

       std::vector<std::vector<std::string>> parentDag(
           const std::string& beginWord,
           const std::string& endWord,
           const std::vector<std::string>& wordList
       ) {
           std::unordered_set<std::string> dictionary(wordList.begin(), wordList.end());
           if (!dictionary.count(endWord)) return {};
           std::unordered_map<std::string,int> distance;
           std::unordered_map<std::string,std::vector<std::string>> parents;
           std::queue<std::string> queue;
           distance[beginWord] = 0; queue.push(beginWord);
           int target_distance = -1;
           while (!queue.empty()) {
               std::string word = queue.front(); queue.pop();
               int current_distance = distance[word];
               if (target_distance != -1 && current_distance >= target_distance) continue;
               for (const std::string& next : neighbors(word, dictionary)) {
                   auto found = distance.find(next);
                   if (found == distance.end()) {
                       distance[next] = current_distance + 1;
                       parents[next].push_back(word);
                       queue.push(next);
                       if (next == endWord) target_distance = current_distance + 1;
                   } else if (found->second == current_distance + 1) {
                       parents[next].push_back(word);
                   }
               }
           }
           if (!distance.count(endWord)) return {};
           std::vector<std::vector<std::string>> result;
           std::vector<std::string> reversed;
           restore(endWord, beginWord, parents, reversed, result);
           return result;
       }

   public:
       std::vector<std::vector<std::string>> findLadders(
           std::string beginWord, std::string endWord,
           std::vector<std::string>& wordList
       ) {
           return parentDag(beginWord, endWord, wordList);
       }
   };

题解
----

为什么 BFS 与回溯要分工
~~~~~~~~~~~~~~~~~~~~~~~~

BFS 队列若直接保存完整路径，共享前缀会被复制到大量队列元素。更稳定的做法是 BFS 只计算最短距离，并记录每个节点来自上一层的全部前驱；随后 DFS 沿前驱边恢复最终路径。

同层多前驱为何必须保留
~~~~~~~~~~~~~~~~~~~~~~

一个单词第一次被发现时确定最短距离，但同一 BFS 层中的其他节点可能以相同最短距离再次到达它。这些前驱对应不同最短序列，不能因为节点已经入队就全部丢弃。

.. code-block:: text

   首次发现 next：
       distance[next] = distance[word] + 1
       parents[next] = [word]
       next 入队

   再次发现且距离相同：
       parents[next].append(word)
       不重复入队

为什么目标出现后仍要完成当前层
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

首次发现终点只确定最短距离。当前层尚未处理的其他节点仍可能连接到终点或同距离节点，形成其他最短路径。可以停止扩展更深层，但必须处理完所有距离小于目标距离的节点。

前驱边为何构成 DAG
~~~~~~~~~~~~~~~~~~

只记录从距离 ``d`` 节点到距离 ``d+1`` 节点的边。沿前驱方向距离严格减一，不可能形成环；从终点回溯到距离 0 的起点时，每条路径长度相同且必为最短。

.. list-table::
   :header-rows: 1

   * - 距离
     - 单词
     - 前驱
   * - 0
     - ``hit``
     - 无
   * - 1
     - ``hot``
     - ``hit``
   * - 2
     - ``dot, lot``
     - ``hot``
   * - 3
     - ``dog, log``
     - ``dot, lot``
   * - 4
     - ``cog``
     - ``dog, log``

为什么回溯不重不漏
~~~~~~~~~~~~~~~~~~

每条最短序列在每个节点处选择一个真实上一层前驱，因而对应 DAG 中唯一反向路径；所有记录前驱都会被枚举，所以不漏。不同前驱选择至少在一个节点不同，生成的单词序列也不同，因此不重复。

复杂度来源
~~~~~~~~~~

设字典大小 ``N``、单词长度 ``L``。字符替换生成邻居需要尝试 ``26L`` 个候选，字符串哈希/复制带来 ``O(L)``，搜索期望 ``O(26NL²)``。前驱 DAG 空间为 ``O(N+E)``；回溯还需与全部输出字符总量成正比。

九语言实现
----------

C
~

.. code-block:: c

   static char**words;static unsigned char**parent;static int*path,pathLen,beginId,total,outSize,outCap;static char***out;static int*widths;
   static int oneDiff(const char*a,const char*b){int d=0;for(int i=0;a[i];i++)if(a[i]!=b[i]&&++d>1)return 0;return d==1;}
   static void emit(void){if(outSize==outCap){outCap*=2;out=realloc(out,(size_t)outCap*sizeof(char**));widths=realloc(widths,(size_t)outCap*sizeof(int));}char**row=malloc((size_t)pathLen*sizeof(char*));for(int i=0;i<pathLen;i++){char*s=words[path[pathLen-1-i]];row[i]=malloc(strlen(s)+1);strcpy(row[i],s);}out[outSize]=row;widths[outSize++]=pathLen;}
   static void restore(int v){path[pathLen++]=v;if(v==beginId)emit();else for(int u=0;u<total;u++)if(parent[v][u])restore(u);pathLen--;}
   char***findLadders(char*begin,char*end,char**list,int n,int*returnSize,int**returnColumnSizes){int endId=-1;beginId=-1;words=malloc((size_t)(n+1)*sizeof(char*));for(int i=0;i<n;i++){words[i]=list[i];if(!strcmp(list[i],end))endId=i;if(!strcmp(list[i],begin))beginId=i;}if(endId<0){*returnSize=0;*returnColumnSizes=NULL;free(words);return NULL;}total=n;if(beginId<0){beginId=total;words[total++]=begin;}int*dist=malloc((size_t)total*sizeof(int)),*q=malloc((size_t)total*sizeof(int));parent=malloc((size_t)total*sizeof(unsigned char*));for(int i=0;i<total;i++){dist[i]=-1;parent[i]=calloc((size_t)total,1);}int h=0,t=0;dist[beginId]=0;q[t++]=beginId;while(h<t){int u=q[h++];for(int v=0;v<total;v++)if(oneDiff(words[u],words[v])){if(dist[v]<0){dist[v]=dist[u]+1;parent[v][u]=1;q[t++]=v;}else if(dist[v]==dist[u]+1)parent[v][u]=1;}}outCap=8;outSize=0;out=malloc((size_t)outCap*sizeof(char**));widths=malloc((size_t)outCap*sizeof(int));path=malloc((size_t)total*sizeof(int));pathLen=0;if(dist[endId]>=0)restore(endId);for(int i=0;i<total;i++)free(parent[i]);free(parent);free(dist);free(q);free(path);free(words);*returnSize=outSize;*returnColumnSizes=widths;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def findLadders(self, beginWord, endWord, wordList):
           from collections import defaultdict, deque
           dictionary = set(wordList)
           if endWord not in dictionary: return []
           distance, parents, queue = {beginWord: 0}, defaultdict(list), deque([beginWord])
           target = None
           while queue:
               word = queue.popleft(); depth = distance[word]
               if target is not None and depth >= target: continue
               for i, old in enumerate(word):
                   for ch in "abcdefghijklmnopqrstuvwxyz":
                       if ch == old: continue
                       nxt = word[:i] + ch + word[i+1:]
                       if nxt not in dictionary: continue
                       if nxt not in distance:
                           distance[nxt] = depth + 1; parents[nxt].append(word); queue.append(nxt)
                           if nxt == endWord: target = depth + 1
                       elif distance[nxt] == depth + 1: parents[nxt].append(word)
           result, path = [], []
           def dfs(word):
               path.append(word)
               if word == beginWord: result.append(path[::-1])
               else:
                   for parent in parents[word]: dfs(parent)
               path.pop()
           if endWord in distance: dfs(endWord)
           return result

Java
~~~~

.. code-block:: java

   class Solution {Map<String,List<String>>parents=new HashMap<>();List<List<String>>out=new ArrayList<>();String begin;void dfs(String w,List<String>p){p.add(w);if(w.equals(begin)){List<String>r=new ArrayList<>(p);Collections.reverse(r);out.add(r);}else for(String x:parents.getOrDefault(w,List.of()))dfs(x,p);p.remove(p.size()-1);}public List<List<String>> findLadders(String b,String e,List<String>list){Set<String>d=new HashSet<>(list);if(!d.contains(e))return out;begin=b;Map<String,Integer>dist=new HashMap<>();Queue<String>q=new ArrayDeque<>();dist.put(b,0);q.add(b);int target=Integer.MAX_VALUE;while(!q.isEmpty()){String w=q.remove();int dep=dist.get(w);if(dep>=target)continue;char[]a=w.toCharArray();for(int i=0;i<a.length;i++){char old=a[i];for(char c='a';c<='z';c++){if(c==old)continue;a[i]=c;String n=new String(a);if(!d.contains(n))continue;if(!dist.containsKey(n)){dist.put(n,dep+1);parents.computeIfAbsent(n,k->new ArrayList<>()).add(w);q.add(n);if(n.equals(e))target=dep+1;}else if(dist.get(n)==dep+1)parents.computeIfAbsent(n,k->new ArrayList<>()).add(w);}a[i]=old;}}if(dist.containsKey(e))dfs(e,new ArrayList<>());return out;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn find_ladders(begin:String,end:String,word_list:Vec<String>)->Vec<Vec<String>>{use std::collections::{HashMap,HashSet,VecDeque};let dict:HashSet<String>=word_list.into_iter().collect();if !dict.contains(&end){return vec![]}let mut dist=HashMap::new();let mut parents:HashMap<String,Vec<String>>=HashMap::new();let mut q=VecDeque::new();dist.insert(begin.clone(),0usize);q.push_back(begin.clone());let mut target=usize::MAX;while let Some(w)=q.pop_front(){let depth=dist[&w];if depth>=target{continue}let mut bytes=w.as_bytes().to_vec();for i in 0..bytes.len(){let old=bytes[i];for c in b'a'..=b'z'{if c==old{continue}bytes[i]=c;let n=String::from_utf8(bytes.clone()).unwrap();if !dict.contains(&n){continue}match dist.get(&n){None=>{dist.insert(n.clone(),depth+1);parents.entry(n.clone()).or_default().push(w.clone());q.push_back(n.clone());if n==end{target=depth+1}},Some(&d)if d==depth+1=>parents.entry(n).or_default().push(w.clone()),_=>{}}}bytes[i]=old;}}fn dfs(w:&str,b:&str,p:&HashMap<String,Vec<String>>,path:&mut Vec<String>,out:&mut Vec<Vec<String>>){path.push(w.to_string());if w==b{let mut r=path.clone();r.reverse();out.push(r)}else if let Some(v)=p.get(w){for x in v{dfs(x,b,p,path,out)}}path.pop();}let mut out=vec![];if dist.contains_key(&end){dfs(&end,&begin,&parents,&mut vec![],&mut out)}out}}

Go
~~

.. code-block:: go

   func findLadders(begin,end string,list []string)[][]string{dict:=map[string]bool{};for _,w:=range list{dict[w]=true};if !dict[end]{return nil};dist:=map[string]int{begin:0};parents:=map[string][]string{};q:=[]string{begin};target:=int(^uint(0)>>1);for h:=0;h<len(q);h++{w:=q[h];d:=dist[w];if d>=target{continue};a:=[]byte(w);for i,old:=range a{for c:=byte('a');c<='z';c++{if c==old{continue};a[i]=c;n:=string(a);if !dict[n]{continue};nd,ok:=dist[n];if !ok{dist[n]=d+1;parents[n]=append(parents[n],w);q=append(q,n);if n==end{target=d+1}}else if nd==d+1{parents[n]=append(parents[n],w)}};a[i]=old}};out:=[][]string{};path:=[]string{};var dfs func(string);dfs=func(w string){path=append(path,w);if w==begin{r:=make([]string,len(path));for i:=range path{r[i]=path[len(path)-1-i]};out=append(out,r)}else{for _,p:=range parents[w]{dfs(p)}};path=path[:len(path)-1]};if _,ok:=dist[end];ok{dfs(end)};return out}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function findLadders(begin:string,end:string,list:string[]):string[][]{const dict=new Set(list);if(!dict.has(end))return[];const dist=new Map<string,number>([[begin,0]]),parents=new Map<string,string[]>(),q=[begin];let target=Infinity;for(let h=0;h<q.length;h++){const w=q[h],d=dist.get(w)!;if(d>=target)continue;for(let i=0;i<w.length;i++)for(let k=0;k<26;k++){const c=String.fromCharCode(97+k);if(c===w[i])continue;const n=w.slice(0,i)+c+w.slice(i+1);if(!dict.has(n))continue;if(!dist.has(n)){dist.set(n,d+1);parents.set(n,[w]);q.push(n);if(n===end)target=d+1;}else if(dist.get(n)===d+1)parents.get(n)!.push(w);}}const out:string[][]=[],path:string[]=[];const dfs=(w:string)=>{path.push(w);if(w===begin)out.push([...path].reverse());else for(const p of parents.get(w)??[])dfs(p);path.pop();};if(dist.has(end))dfs(end);return out;}

C#
~~

.. code-block:: csharp

   public class Solution {Dictionary<string,List<string>>parents=new();List<IList<string>>outp=new();string begin;void Dfs(string w,List<string>p){p.Add(w);if(w==begin){var r=new List<string>(p);r.Reverse();outp.Add(r);}else if(parents.TryGetValue(w,out var ps))foreach(var x in ps)Dfs(x,p);p.RemoveAt(p.Count-1);}public IList<IList<string>> FindLadders(string b,string e,IList<string>list){var dict=new HashSet<string>(list);if(!dict.Contains(e))return outp;begin=b;var dist=new Dictionary<string,int>{{b,0}};var q=new Queue<string>();q.Enqueue(b);int target=int.MaxValue;while(q.Count>0){var w=q.Dequeue();int d=dist[w];if(d>=target)continue;var a=w.ToCharArray();for(int i=0;i<a.Length;i++){char old=a[i];for(char c='a';c<='z';c++){if(c==old)continue;a[i]=c;var n=new string(a);if(!dict.Contains(n))continue;if(!dist.ContainsKey(n)){dist[n]=d+1;parents[n]=new List<string>{w};q.Enqueue(n);if(n==e)target=d+1;}else if(dist[n]==d+1)parents[n].Add(w);}a[i]=old;}}if(dist.ContainsKey(e))Dfs(e,new List<string>());return outp;}}

Julia
~~~~~

.. code-block:: julia

   function find_ladders(begin_word,end_word,word_list)
       dict=Set(word_list);end_word in dict||return Vector{Vector{String}}();dist=Dict(begin_word=>0);parents=Dict{String,Vector{String}}();q=[begin_word];head=1;target=typemax(Int)
       while head<=length(q);w=q[head];head+=1;d=dist[w];d>=target&&continue;a=collect(codeunits(w));for i in eachindex(a);old=a[i];for c in UInt8('a'):UInt8('z');c==old&&continue;a[i]=c;n=String(copy(a));n in dict||continue;if !haskey(dist,n);dist[n]=d+1;push!(get!(parents,n,String[]),w);push!(q,n);n==end_word&&(target=d+1);elseif dist[n]==d+1;push!(get!(parents,n,String[]),w);end;end;a[i]=old;end;end
       out=Vector{Vector{String}}();path=String[];function dfs(w);push!(path,w);if w==begin_word;push!(out,reverse(copy(path)));else;for p in get(parents,w,String[]);dfs(p);end;end;pop!(path);end;haskey(dist,end_word)&&dfs(end_word);out
   end

R
~

.. code-block:: r

   find_ladders <- function(begin,end,word_list){if(!(end%in%word_list))return(list());words<-unique(c(word_list,begin));n<-length(words);one<-function(a,b){sum(strsplit(a,"",fixed=TRUE)[[1L]]!=strsplit(b,"",fixed=TRUE)[[1L]])==1L};dist<-rep(NA_integer_,n);start<-match(begin,words);goal<-match(end,words);dist[[start]]<-0L;q<-start;head<-1L;parents<-vector("list",n);while(head<=length(q)){u<-q[[head]];head<-head+1L;for(v in seq_len(n))if(one(words[[u]],words[[v]])){if(is.na(dist[[v]])){dist[[v]]<-dist[[u]]+1L;parents[[v]]<-c(parents[[v]],u);q<-c(q,v)}else if(dist[[v]]==dist[[u]]+1L)parents[[v]]<-c(parents[[v]],u)}};out<-list();path<-integer();dfs<-function(v){path<<-c(path,v);if(v==start)out[[length(out)+1L]]<<-rev(words[path])else for(p in parents[[v]])dfs(p);path<<-path[-length(path)]};if(!is.na(dist[[goal]]))dfs(goal);out}