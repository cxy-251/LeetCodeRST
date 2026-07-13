0127. Word Ladder
=================

题目信息
--------

:题号: 0127
:难度: Hard
:主题: 图、BFS、最短路径
:原题: `LeetCode 0127 <https://leetcode.com/problems/word-ladder/>`_
:访问状态: Available
:教学重点: 隐式图最短层数

题目重述
--------

返回从起始词到结束词的最短转换序列长度，无法转换返回 0。

自建示例
--------

.. code-block:: text

   输入：beginWord = "hit", endWord = "cog",
   wordList = ["hot","dot","dog","lot","log","cog"]
   输出：5

问题抽象
--------

队列保存单词和序列长度；逐位置替换字符生成邻居，首次访问时入队并从未访问集合删除。

主解法：BFS 隐式图
-------------

思路
~~~~

BFS 隐式图。 隐式图最短层数

核心状态与不变量
~~~~~~~~~~~~~~~~

队列保存单词和序列长度；逐位置替换字符生成邻居，首次访问时入队并从未访问集合删除。

正确性依据
~~~~~~~~~~

每条转换代价为 1，BFS 按距离递增处理。单词首次入队即得到最短距离，首次取到结束词时序列长度最小。

复杂度与语言边界
~~~~~~~~~~~~~~~~

哈希邻居生成版本约 ``O(N·26·L)``；C 适配器为避免未声明哈希容器，使用成对邻接扫描 ``O(N^2L)``。空间 ``O(NL)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stdlib.h>
   #include <string.h>
   static bool adjacent(const char*a,const char*b) {
       int d=0;
       for(int i=0;a[i];i++)d+=a[i]!=b[i];
       return d==1;
   }
   int ladderLength(char*begin,char*end,char**words,int n) {
       int endi=-1;
       for(int i=0;i<n;i++)if(strcmp(words[i],end)==0)endi=i;
       if(endi<0)return 0;
       char**all=malloc((size_t)(n+1)*sizeof(*all));
       for(int i=0;i<n;i++)all[i]=words[i];
       all[n]=begin;
       int*q=malloc((size_t)(n+1)*sizeof(*q));
       int*dist=calloc((size_t)(n+1),sizeof(*dist));
       int h=0,t=0;
       q[t++]=n;
       dist[n]=1;
       while(h<t) {
           int u=q[h++];
           if(u==endi) {
               int a=dist[u];
               free(dist);
               free(q);
               free(all);
               return a;
           }
           for(int v=0;v<=n;v++)if(!dist[v]&&adjacent(all[u],all[v])) {
               dist[v]=dist[u]+1;
               q[t++]=v;
           }
       }
       free(dist);
       free(q);
       free(all);
       return 0;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:int ladderLength(string begin,string end,vector<string>&words) {
           unordered_set<string>unused(words.begin(),words.end());
           if(!unused.count(end))return 0;
           queue<pair<string,int>>q;
           q.push({begin,1});
           unused.erase(begin);
           while(!q.empty()) {
               auto[w,d]=q.front();
               q.pop();
               if(w==end)return d;
               string x=w;
               for(size_t i=0;i<x.size();i++) {
                   char old=x[i];
                   for(char c='a';c<='z';c++) {
                       x[i]=c;
                       if(unused.erase(x))q.push({x,d+1});
                   }
                   x[i]=old;
               }
           }
           return 0;
       }
   };
Python
~~~~~~

.. code-block:: python

   from collections import deque

   class Solution:

       def ladderLength(self, beginWord: str, endWord: str, wordList: list[str]) -> int:
           unused = set(wordList)
           if endWord not in unused:
               return 0
           q = deque([(beginWord, 1)])
           unused.discard(beginWord)
           while q:
               w, d = q.popleft()
               if w == endWord:
                   return d
               for i in range(len(w)):
                   for c in 'abcdefghijklmnopqrstuvwxyz':
                       x = w[:i] + c + w[i + 1:]
                       if x in unused:
                           unused.remove(x)
                           q.append((x, d + 1))
           return 0
Java
~~~~

.. code-block:: java

   class Solution {
       public int ladderLength(String begin,String end,List<String>words) {
           Set<String>unused=new HashSet<>(words);
           if(!unused.contains(end))return 0;
           ArrayDeque<String>q=new ArrayDeque<>();
           q.add(begin);
           unused.remove(begin);
           int d=1;
           while(!q.isEmpty()) {
               for(int size=q.size();size>0;--size) {
                   String w=q.remove();
                   if(w.equals(end))return d;
                   char[]a=w.toCharArray();
                   for(int i=0;i<a.length;i++) {
                       char old=a[i];
                       for(char c='a';c<='z';c++) {
                           a[i]=c;
                           String x=new String(a);
                           if(unused.remove(x))q.add(x);
                       }
                       a[i]=old;
                   }
               }
               d++;
           }
           return 0;
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::collections:: {
       HashSet,VecDeque
   };
   impl Solution {
       pub fn ladder_length(begin:String,end:String,words:Vec<String>)->i32 {
           let mut unused:HashSet<String>=words.into_iter().collect();
           if !unused.contains(&end) {
               return 0
           }
           let mut q=VecDeque::from([(begin,1)]);
           while let Some((w,d))=q.pop_front() {
               if w==end {
                   return d
               }
               let mut b=w.into_bytes();
               for i in 0..b.len() {
                   let old=b[i];
                   for c in b'a'..=b'z' {
                       b[i]=c;
                       let x=String::from_utf8(b.clone()).unwrap();
                       if unused.remove(&x) {
                           q.push_back((x,d+1));
                       }
                   }
                   b[i]=old;
               }
           }
           0
       }
   }
Go
~~

.. code-block:: go

   func ladderLength(begin, end string, words []string) int {
   	unused := map[string]bool{}
   	for _, w := range words {
   		unused[w] = true
   	}
   	if !unused[end] {
   		return 0
   	}
   	type item struct {
   		w string
   		d int
   	}
   	q := []item{{begin, 1}}
   	delete(unused, begin)
   	for len(q) > 0 {
   		cur := q[0]
   		q = q[1:]
   		if cur.w == end {
   			return cur.d
   		}
   		b := []byte(cur.w)
   		for i, old := range b {
   			for c := byte('a'); c <= 'z'; c++ {
   				b[i] = c
   				x := string(b)
   				if unused[x] {
   					delete(unused, x)
   					q = append(q, item{x, cur.d + 1})
   				}
   			}
   			b[i] = old
   		}
   	}
   	return 0
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function ladderLength(begin: string, end: string, words: string[]): number {
       const unused = new Set(words);
       if (!unused.has(end))
           return 0;
       const q: [
           string,
           number
       ][] = [[begin, 1]];
       let head = 0;
       unused.delete(begin);
       while (head < q.length) {
           const [w, d] = q[head++];
           if (w === end)
               return d;
           for (let i = 0; i < w.length; i++)
               for (let c = 97; c <= 122; c++) {
                   const x = w.slice(0, i) + String.fromCharCode(c) + w.slice(i + 1);
                   if (unused.delete(x))
                       q.push([x, d + 1]);
               }
       }
       return 0;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public int LadderLength(string begin,string end,IList<string>words) {
           var unused=new HashSet<string>(words);
           if(!unused.Contains(end))return 0;
           var q=new Queue<(string,int)>();
           q.Enqueue((begin,1));
           unused.Remove(begin);
           while(q.Count>0) {
               var(w,d)=q.Dequeue();
               if(w==end)return d;
               var a=w.ToCharArray();
               for(int i=0;i<a.Length;i++) {
                   char old=a[i];
                   for(char c='a';c<='z';c++) {
                       a[i]=c;
                       string x=new string(a);
                       if(unused.Remove(x))q.Enqueue((x,d+1));
                   }
                   a[i]=old;
               }
           }
           return 0;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function ladder_length(beginword::String,endword::String,words::Vector{String})::Int
       unused=Set(words)
   endword in unused||return 0
   q=Tuple{String,Int}[(beginword,1)]
   head=1
   delete!(unused,beginword)
   while head<=length(q)
       w,d=q[head]
       head+=1
       w==endword&&return d
       b=collect(codeunits(w))
       for i in eachindex(b)
           old=b[i]
           for c in UInt8('a'):UInt8('z')
               b[i]=c
               x=String(copy(b))
               if x in unused
                   delete!(unused,x)
                   push!(q,(x,d+1))
               end
           end
           b[i]=old
       end
   end
   0
   end
R
~

.. code-block:: r

   ladder_length <- function(begin,end,words) {
       unused<-new.env(hash=TRUE,parent=emptyenv())
       for(w in words)unused[[w]]<-TRUE
       if(is.null(unused[[end]]))return(0L)
       q<-list(list(w=begin,d=1L))
       head<-1L
       if(!is.null(unused[[begin]]))rm(list=begin,envir=unused)
       while(head<=length(q)) {
           cur<-q[[head]]
           head<-head+1L
           if(cur$w==end)return(cur$d)
           chars<-strsplit(cur$w,"",fixed=TRUE)[[1L]]
           for(i in seq_along(chars)) {
               old<-chars[[i]]
               for(c in letters) {
                   chars[[i]]<-c
                   x<-paste0(chars,collapse="")
                   if(!is.null(unused[[x]])) {
                       rm(list=x,envir=unused)
                       q[[length(q)+1L]]<-list(w=x,d=cur$d+1L)
                   }
               }
               chars[[i]]<-old
           }
       }
       0L
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 结束词不在词典直接返回 0。
* 起始词可不在词典。

易错点
------

* 把返回值当作边数而少 1。
* 访问标记过晚导致大量重复入队。

本题新增知识
------------

* 隐式图最短层数
* 题号 0127 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0126. Word Ladder II <0126-word-ladder-ii.rst>`_；

最小自检
--------

#. ``BFS 隐式图`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

每条转换代价为 1，BFS 按距离递增处理。单词首次入队即得到最短距离，首次取到结束词时序列长度最小。
