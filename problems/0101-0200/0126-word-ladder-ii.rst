0126. Word Ladder II
====================

题目信息
--------

:题号: 0126
:难度: Hard
:主题: 图、BFS、回溯
:原题: `LeetCode 0126 <https://leetcode.com/problems/word-ladder-ii/>`_
:访问状态: Available
:教学重点: 最短层父图、延迟访问

题目重述
--------

给定起始词、结束词和词典，返回所有最短转换序列；每步只能改变一个字符且中间词必须在词典中。

自建示例
--------

.. code-block:: text

   输入：beginWord = "hit", endWord = "cog",
   wordList = ["hot","dot","dog","lot","log","cog"]
   输出：[["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]

问题抽象
--------

BFS 只扩展到首次到达结束词的层。对同层新节点记录全部父节点；一层结束后再从未访问集合删除，最后从结束词沿父图回溯。

主解法：分层 BFS 建父图再回溯
-------------------

思路
~~~~

分层 BFS 建父图再回溯。 最短层父图、延迟访问

核心状态与不变量
~~~~~~~~~~~~~~~~

BFS 只扩展到首次到达结束词的层。对同层新节点记录全部父节点；一层结束后再从未访问集合删除，最后从结束词沿父图回溯。

正确性依据
~~~~~~~~~~

BFS 首次到达层给出最短距离。延迟删除允许同层多个父节点都被记录，同时阻止更深层父边。父图中的每条边都从距离 ``d`` 指向 ``d-1``，回溯枚举全部且仅最短路径。

复杂度与语言边界
~~~~~~~~~~~~~~~~

设词数 ``N``、词长 ``L``。逐位置替换并用哈希集合判定时，BFS 邻居生成约 ``O(N·26·L^2)``（包含字符串构造）；C 适配器使用成对邻接扫描，时间 ``O(N^2L)``。父图和输出可能指数大，输出载荷记为 ``S``，空间 ``O(NL+E+S)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <string.h>
   #include <stdlib.h>
   typedef void (*emit_path)(const char **words, int length, void *ctx);
   static bool adjacent(const char *a,const char*b) {
       int d=0;
       for(int i=0;a[i];i++)d+=a[i]!=b[i];
       return d==1;
   }
   static void backtrack(int v,int start,int n,char **all,bool *parent,int *path,int
       depth,emit_path emit,void*ctx) {
       path[depth]=v;
       if(v==start) {
           const char**out=malloc((size_t)(depth+1)*sizeof(*out));
           for(int i=0;i<=depth;i++)out[i]=all[path[depth-i]];
           emit(out,depth+1,ctx);
           free(out);
           return;
       }
       for(int u=0;u<n;u++)if(parent[v*n+u])backtrack(u,start,n,all,parent,path,depth+1,emit,ctx);
   }
   void findLadders(const char*begin,const char*end,char**wordList,int wordListSize,emit_path
       emit,void*ctx) {
       int end_i=-1;
       for(int i=0;i<wordListSize;i++)if(strcmp(wordList[i],end)==0)end_i=i;
       if(end_i<0)return;
       int n=wordListSize+1,start=n-1;
       char**all=malloc((size_t)n*sizeof(*all));
       for(int i=0;i<wordListSize;i++)all[i]=wordList[i];
       all[start]=(char*)begin;
       int*dist=malloc((size_t)n*sizeof(*dist));
       int*q=malloc((size_t)n*sizeof(*q));
       bool*parent=calloc((size_t)n*n,sizeof(*parent));
       for(int i=0;i<n;i++)dist[i]=-1;
       int h=0,t=0;
       q[t++]=start;
       dist[start]=0;
       while(h<t) {
           int u=q[h++];
           for(int v=0;v<n;v++)if(adjacent(all[u],all[v])) {
               if(dist[v]<0) {
                   dist[v]=dist[u]+1;
                   q[t++]=v;
               }
               if(dist[v]==dist[u]+1)parent[v*n+u]=true;
           }
       }
       if(dist[end_i]>=0) {
           int*path=malloc((size_t)n*sizeof(*path));
           backtrack(end_i,start,n,all,parent,path,0,emit,ctx);
           free(path);
       }
       free(parent);
       free(q);
       free(dist);
       free(all);
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:vector<vector<string>>findLadders(string begin,string end,vector<string>&list) {
           unordered_set<string>unused(list.begin(),list.end());
           if(!unused.count(end))return {
           };
           unordered_map<string,vector<string>>parents;
           unordered_set<string>level {
               begin
           };
           bool found=false;
           while(!level.empty()&&!found) {
               for(auto&w:level)unused.erase(w);
               unordered_set<string>next;
               for(const string&w:level) {
                   string x=w;
                   for(size_t i=0;i<x.size();i++) {
                       char old=x[i];
                       for(char c='a';c<='z';c++) {
                           x[i]=c;
                           if(!unused.count(x))continue;
                           next.insert(x);
                           parents[x].push_back(w);
                           if(x==end)found=true;
                       }
                       x[i]=old;
                   }
               }
               level=move(next);
           }
           vector<vector<string>>ans;
           vector<string>path {
               end
           };
           function<void(string)>dfs=[&](string w) {
               if(w==begin) {
                   auto p=path;
                   reverse(p.begin(),p.end());
                   ans.push_back(move(p));
                   return;
               }
               for(auto&pre:parents[w]) {
                   path.push_back(pre);
                   dfs(pre);
                   path.pop_back();
               }
           };
           if(found)dfs(end);
           return ans;
       }
   };
Python
~~~~~~

.. code-block:: python

   from collections import defaultdict

   class Solution:

       def findLadders(self, beginWord: str, endWord: str, wordList: list[str]) -> list[list[str]]:
           unused = set(wordList)
           if endWord not in unused:
               return []
           parents = defaultdict(list)
           level = {beginWord}
           found = False
           while level and (not found):
               unused -= level
               next_level = set()
               for word in level:
                   for i in range(len(word)):
                       for c in 'abcdefghijklmnopqrstuvwxyz':
                           nxt = word[:i] + c + word[i + 1:]
                           if nxt in unused:
                               next_level.add(nxt)
                               parents[nxt].append(word)
                               found |= nxt == endWord
               level = next_level
           ans = []
           path = [endWord]

           def dfs(w):
               if w == beginWord:
                   ans.append(path[::-1])
                   return
               for pre in parents[w]:
                   path.append(pre)
                   dfs(pre)
                   path.pop()
           if found:
               dfs(endWord)
           return ans
Java
~~~~

.. code-block:: java

   class Solution {
       public List<List<String>>findLadders(String begin,String end,List<String>words) {
           Set<String>unused=new HashSet<>(words);
           if(!unused.contains(end))return new ArrayList<>();
           Map<String,List<String>>parents=new HashMap<>();
           Set<String>level=new HashSet<>();
           level.add(begin);
           boolean found=false;
           while(!level.isEmpty()&&!found) {
               unused.removeAll(level);
               Set<String>next=new HashSet<>();
               for(String w:level) {
                   char[]a=w.toCharArray();
                   for(int i=0;i<a.length;i++) {
                       char old=a[i];
                       for(char c='a';c<='z';c++) {
                           a[i]=c;
                           String x=new String(a);
                           if(unused.contains(x)) {
                               next.add(x);
                               parents.computeIfAbsent(x,k->new ArrayList<>()).add(w);
                               if(x.equals(end))found=true;
                           }
                       }
                       a[i]=old;
                   }
               }
               level=next;
           }
           List<List<String>>ans=new ArrayList<>();
           if(found)dfs(end,begin,parents,new ArrayList<>(List.of(end)),ans);
           return ans;
       }
       void dfs(String w,String
           begin,Map<String,List<String>>p,List<String>path,List<List<String>>ans) {
           if(w.equals(begin)) {
               List<String>x=new ArrayList<>(path);
               Collections.reverse(x);
               ans.add(x);
               return;
           }
           for(String pre:p.getOrDefault(w,List.of())) {
               path.add(pre);
               dfs(pre,begin,p,path,ans);
               path.remove(path.size()-1);
           }
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::collections:: {
       HashMap,HashSet
   };
   impl Solution {
       pub fn find_ladders(begin:String,end:String,words:Vec<String>)->Vec<Vec<String>> {
           let mut unused:HashSet<String>=words.into_iter().collect();
           if !unused.contains(&end) {
               return vec![]
           }
           let mut parents:HashMap<String,Vec<String>>=HashMap::new();
           let mut level=HashSet::from([begin.clone()]);
           let mut found=false;
           while !level.is_empty()&&!found {
               for w in &level {
                   unused.remove(w);
               }
               let mut next=HashSet::new();
               for w in &level {
                   let mut b=w.as_bytes().to_vec();
                   for i in 0..b.len() {
                       let old=b[i];
                       for c in b'a'..=b'z' {
                           b[i]=c;
                           let x=String::from_utf8(b.clone()).unwrap();
                           if unused.contains(&x) {
                               next.insert(x.clone());
                               parents.entry(x.clone()).or_default().push(w.clone());
                               if x==end {
                                   found=true;
                               }
                           }
                       }
                       b[i]=old;
                   }
               }
               level=next;
           }
           fn dfs(w:&str,begin:&str,p:&HashMap<String,Vec<String>>,path:&mut Vec<String>,ans:&mut
               Vec<Vec<String>>) {
               if w==begin {
                   let mut x=path.clone();
                   x.reverse();
                   ans.push(x);
                   return;
               }
               if let Some(v)=p.get(w) {
                   for pre in v {
                       path.push(pre.clone());
                       dfs(pre,begin,p,path,ans);
                       path.pop();
                   }
               }
           }
           let mut ans=vec![];
           if found {
               dfs(&end,&begin,&parents,&mut vec![end],&mut ans);
           }
           ans
       }
   }
Go
~~

.. code-block:: go

   func findLadders(begin, end string, words []string) [][]string {
   	unused := map[string]bool{}
   	for _, w := range words {
   		unused[w] = true
   	}
   	if !unused[end] {
   		return nil
   	}
   	parents := map[string][]string{}
   	level := map[string]bool{begin: true}
   	found := false
   	for len(level) > 0 && !found {
   		for w := range level {
   			delete(unused, w)
   		}
   		next := map[string]bool{}
   		for w := range level {
   			b := []byte(w)
   			for i, old := range b {
   				for c := byte('a'); c <= 'z'; c++ {
   					b[i] = c
   					x := string(b)
   					if unused[x] {
   						next[x] = true
   						parents[x] = append(parents[x], w)
   						if x == end {
   							found = true
   						}
   					}
   				}
   				b[i] = old
   			}
   		}
   		level = next
   	}
   	ans := [][]string{}
   	path := []string{end}
   	var dfs func(string)
   	dfs = func(w string) {
   		if w == begin {
   			x := append([]string(nil), path...)
   			for i, j := 0, len(x)-1; i < j; i, j = i+1, j-1 {
   				x[i], x[j] = x[j], x[i]
   			}
   			ans = append(ans, x)
   			return
   		}
   		for _, pre := range parents[w] {
   			path = append(path, pre)
   			dfs(pre)
   			path = path[:len(path)-1]
   		}
   	}
   	if found {
   		dfs(end)
   	}
   	return ans
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function findLadders(begin: string, end: string, words: string[]): string[][] {
       const unused = new Set(words);
       if (!unused.has(end))
           return [];
       const parents = new Map<string, string[]>();
       let level = new Set([begin]);
       let found = false;
       while (level.size && !found) {
           for (const w of level)
               unused.delete(w);
           const next = new Set<string>();
           for (const w of level)
               for (let i = 0; i < w.length; i++)
                   for (let c = 97; c <= 122; c++) {
                       const x = w.slice(0, i) + String.fromCharCode(c) + w.slice(i + 1);
                       if (unused.has(x)) {
                           next.add(x);
                           if (!parents.has(x))
                               parents.set(x, []);
                           parents.get(x)!.push(w);
                           if (x === end)
                               found = true;
                       }
                   }
           level = next;
       }
       const ans: string[][] = [], path = [end];
       const dfs = (w: string) => {
           if (w === begin) {
               ans.push([...path].reverse());
               return;
           }
           for (const pre of parents.get(w) ?? []) {
               path.push(pre);
               dfs(pre);
               path.pop();
           }
       };
       if (found)
           dfs(end);
       return ans;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public IList<IList<string>> FindLadders(string begin,string end,IList<string>words) {
           var unused=new HashSet<string>(words);
           if(!unused.Contains(end))return new List<IList<string>>();
           var parents=new Dictionary<string,List<string>>();
           var level=new HashSet<string> {
               begin
           };
           bool found=false;
           while(level.Count>0&&!found) {
               unused.ExceptWith(level);
               var next=new HashSet<string>();
               foreach(var w in level) {
                   var a=w.ToCharArray();
                   for(int i=0;i<a.Length;i++) {
                       char old=a[i];
                       for(char c='a';c<='z';c++) {
                           a[i]=c;
                           string x=new string(a);
                           if(unused.Contains(x)) {
                               next.Add(x);
                               if(!parents.ContainsKey(x))parents[x]=new List<string>();
                               parents[x].Add(w);
                               if(x==end)found=true;
                           }
                       }
                       a[i]=old;
                   }
               }
               level=next;
           }
           var ans=new List<IList<string>>();
           var path=new List<string> {
               end
           };
           void Dfs(string w) {
               if(w==begin) {
                   var x=new List<string>(path);
                   x.Reverse();
                   ans.Add(x);
                   return;
               }
               if(parents.TryGetValue(w,out var ps))foreach(var pre in ps) {
                   path.Add(pre);
                   Dfs(pre);
                   path.RemoveAt(path.Count-1);
               }
           }
           if(found)Dfs(end);
           return ans;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function find_ladders(beginword::String,endword::String,words::Vector{String})
       unused=Set(words)
   endword in unused||return Vector{Vector{String}}()
   parents=Dict{String,Vector{String}}()
   level=Set([beginword])
   found=false
   while !isempty(level)&&!found
       setdiff!(unused,level)
       next=Set{String}()
       for w in level,i in eachindex(codeunits(w)),c in UInt8('a'):UInt8('z')
           b=collect(codeunits(w))
           b[i]=c
           x=String(b)
           if x in unused
               push!(next,x)
               push!(get!(parents,x,String[]),w)
               found|=x==endword
           end
       end
       level=next
   end
   ans=Vector{Vector{String}}()
   path=[endword]
   function dfs(w)
       if w==beginword
           push!(ans,reverse(copy(path)))
           return
       end
       for pre in get(parents,w,String[])
           push!(path,pre)
           dfs(pre)
           pop!(path)
       end
   end
   found&&dfs(endword)
   ans
   end
R
~

.. code-block:: r

   find_ladders <- function(begin,end,words) {
       unused<-new.env(hash=TRUE,parent=emptyenv())
       for(w in words)unused[[w]]<-TRUE
       if(is.null(unused[[end]]))return(list())
       parents<-new.env(hash=TRUE,parent=emptyenv())
       level<-begin
       found<-FALSE
       while(length(level)>0L&&!found) {
           for(w in level)rm(list=w,envir=unused)
           next_level<-character()
           for(w in level) {
               chars<-strsplit(w,"",fixed=TRUE)[[1L]]
               for(i in seq_along(chars)) {
                   old<-chars[[i]]
                   for(c in letters) {
                       chars[[i]]<-c
                       x<-paste0(chars,collapse="")
                       if(!is.null(unused[[x]])) {
                           next_level<-unique(c(next_level,x))
                           parents[[x]]<-c(parents[[x]],w)
                           if(x==end)found<-TRUE
                       }
                   }
                   chars[[i]]<-old
               }
           }
           level<-next_level
       }
       ans<-list()
       path<-end
       dfs<-function(w) {
           if(w==begin) {
               ans[[length(ans)+1L]]<<-rev(path)
               return()
           }
           for(pre in parents[[w]]) {
               path<<-c(path,pre)
               dfs(pre)
               path<<-path[-length(path)]
           }
       }
       if(found)dfs(end)
       ans
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 结束词不在词典时返回空。
* 同层访问必须延迟删除。
* 输出顺序通常不要求固定。

易错点
------

* 发现节点后立即全局删除会漏掉同层父节点。
* 找到结束词后继续扩展更深层。

本题新增知识
------------

* 最短层父图、延迟访问
* 题号 0126 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0127. Word Ladder <0127-word-ladder.rst>`_；
* `0140. Word Break II <0140-word-break-ii.rst>`_；

最小自检
--------

#. ``分层 BFS 建父图再回溯`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

BFS 首次到达层给出最短距离。延迟删除允许同层多个父节点都被记录，同时阻止更深层父边。父图中的每条边都从距离 ``d`` 指向 ``d-1``，回溯枚举全部且仅最短路径。
