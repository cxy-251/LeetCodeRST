0140. Word Break II
===================

题目信息
--------

:题号: 0140
:难度: Hard
:主题: 字符串、记忆化搜索、枚举
:原题: `LeetCode 0140 <https://leetcode.com/problems/word-break-ii/>`_
:访问状态: Available
:教学重点: 后缀句子集合

题目重述
--------

返回把字符串切分成词典单词的所有句子，单词间以单空格连接。

自建示例
--------

.. code-block:: text

   输入：s = "catsanddog", wordDict = ["cat","cats","and","sand","dog"]
   输出：["cats and dog","cat sand dog"]

问题抽象
--------

``solve(i)`` 返回后缀 ``s[i:]`` 的全部句子。枚举词典中的合法前缀，与 ``solve(next)`` 的每个尾句拼接；末尾返回一个空尾句作为组合单位元。

主解法：记忆化 DFS
-------------

思路
~~~~

记忆化 DFS。 后缀句子集合

核心状态与不变量
~~~~~~~~~~~~~~~~

``solve(i)`` 返回后缀 ``s[i:]`` 的全部句子。枚举词典中的合法前缀，与 ``solve(next)`` 的每个尾句拼接；末尾返回一个空尾句作为组合单位元。

正确性依据
~~~~~~~~~~

任意句子的首词唯一确定一个合法前缀，递归覆盖剩余句子；反之每次拼接只使用词典词并完整消费字符串。按下标记忆避免重复求解同一后缀。

复杂度与语言边界
~~~~~~~~~~~~~~~~

设输出总字符载荷为 ``S``。状态扫描最坏 ``O(n^2)`` 加子串成本，生成和复制至少 ``O(S)``；记忆表和输出可能指数大。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <string.h>
   typedef void(*emit_sentence)(const char**words,int count,void*ctx);
   static void dfs(const char*s,int pos,char**dict,int n,const char**path,int depth,emit_sentence
       emit,void*ctx) {
       if(!s[pos]) {
           emit(path,depth,ctx);
           return;
       }
       for(int i=0;i<n;i++) {
           int len=strlen(dict[i]);
           if(strncmp(s+pos,dict[i],len)==0) {
               path[depth]=dict[i];
               dfs(s,pos+len,dict,n,path,depth+1,emit,ctx);
           }
       }
   }
   void wordBreakAll(const char*s,char**dict,int n,emit_sentence emit,void*ctx) {
       int max=strlen(s);
       const char*path[max?max:1];
       dfs(s,0,dict,n,path,0,emit,ctx);
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       unordered_set<string>d;
       unordered_map<int,vector<string>>memo;
       string s;
       vector<string>solve(int i) {
           if(memo.count(i))return memo[i];
           if(i==(int)s.size())return memo[i]= {
               ""
           };
           vector<string>ans;
           for(int j=i+1;j<=(int)s.size();j++) {
               string w=s.substr(i,j-i);
               if(!d.count(w))continue;
               for(string tail:solve(j))ans.push_back(tail.empty()?w:w+" "+tail);
           }
           return memo[i]=move(ans);
       }
       public:vector<string>wordBreak(string x,vector<string>&dict) {
           s=x;
           d= {
               dict.begin(),dict.end()
           };
           return solve(0);
       }
   };
Python
~~~~~~

.. code-block:: python

   from functools import cache

   class Solution:

       def wordBreak(self, s: str, wordDict: list[str]) -> list[str]:
           words = set(wordDict)

           @cache
           def solve(i):
               if i == len(s):
                   return ('',)
               ans = []
               for j in range(i + 1, len(s) + 1):
                   w = s[i:j]
                   if w in words:
                       for tail in solve(j):
                           ans.append(w if not tail else w + ' ' + tail)
               return tuple(ans)
           return list(solve(0))
Java
~~~~

.. code-block:: java

   class Solution {
       Set<String>d;
       Map<Integer,List<String>>memo=new HashMap<>();
       String s;
       public List<String>wordBreak(String x,List<String>dict) {
           s=x;
           d=new HashSet<>(dict);
           return solve(0);
       }
       List<String>solve(int i) {
           if(memo.containsKey(i))return memo.get(i);
           List<String>a=new ArrayList<>();
           if(i==s.length()) {
               a.add("");
               return a;
           }
           for(int j=i+1;j<=s.length();j++) {
               String w=s.substring(i,j);
               if(!d.contains(w))continue;
               for(String tail:solve(j))a.add(tail.isEmpty()?w:w+" "+tail);
           }
           memo.put(i,a);
           return a;
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::collections:: {
       HashMap,HashSet
   };
   impl Solution {
       pub fn word_break(s:String,dict:Vec<String>)->Vec<String> {
           fn solve(i:usize,s:&str,d:&HashSet<String>,m:&mut
               HashMap<usize,Vec<String>>)->Vec<String> {
               if let Some(x)=m.get(&i) {
                   return x.clone()
               }
               if i==s.len() {
                   return vec![String::new()]
               }
               let mut a=vec![];
               for j in i+1..=s.len() {
                   let w=&s[i..j];
                   if d.contains(w) {
                       for tail in solve(j,s,d,m) {
                           a.push(if tail.is_empty(){w.to_string()}else{format!("{} {}",w,tail)});
                       }
                   }
               }
               m.insert(i,a.clone());
               a
           }
           solve(0,&s,&dict.into_iter().collect(),&mut HashMap::new())
       }
   }
Go
~~

.. code-block:: go

   func wordBreak(s string, dict []string) []string {
   	d := map[string]bool{}
   	for _, w := range dict {
   		d[w] = true
   	}
   	memo := map[int][]string{}
   	var solve func(int) []string
   	solve = func(i int) []string {
   		if x, ok := memo[i]; ok {
   			return x
   		}
   		if i == len(s) {
   			return []string{""}
   		}
   		a := []string{}
   		for j := i + 1; j <= len(s); j++ {
   			w := s[i:j]
   			if d[w] {
   				for _, tail := range solve(j) {
   					if tail == "" {
   						a = append(a, w)
   					} else {
   						a = append(a, w+" "+tail)
   					}
   				}
   			}
   		}
   		memo[i] = a
   		return a
   	}
   	return solve(0)
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function wordBreak(s: string, dict: string[]): string[] {
       const d = new Set(dict), memo = new Map<number, string[]>();
       const solve = (i: number): string[] => {
           if (memo.has(i))
               return memo.get(i)!;
           if (i === s.length)
               return [''];
           const a: string[] = [];
           for (let j = i + 1; j <= s.length; j++) {
               const w = s.slice(i, j);
               if (d.has(w))
                   for (const tail of solve(j))
                       a.push(tail ? `${w} ${tail}` : w);
           }
           memo.set(i, a);
           return a;
       };
       return solve(0);
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       HashSet<string>d;
       Dictionary<int,IList<string>>memo=new();
       string s;
       public IList<string> WordBreak(string x,IList<string>dict) {
           s=x;
           d=new(dict);
           return Solve(0);
       }
       IList<string>Solve(int i) {
           if(memo.TryGetValue(i,out var z))return z;
           if(i==s.Length)return new List<string> {
               ""
           };
           var a=new List<string>();
           for(int j=i+1;j<=s.Length;j++) {
               string w=s.Substring(i,j-i);
               if(!d.Contains(w))continue;
               foreach(string tail in Solve(j))a.Add(tail.Length==0?w:w+" "+tail);
           }
           memo[i]=a;
           return a;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function word_break_all(s::String,dict::Vector{String})
       b=codeunits(s)
       d=Set(dict)
       memo=Dict{Int,Vector{String}}()
       function solve(i)
           haskey(memo,i)&&return memo[i]
           i>length(b)&&return [""]
           a=String[]
           for j in i:length(b)
               w=String(b[i:j])
               if w in d
                   for tail in solve(j+1)
                       push!(a,isempty(tail) ? w : w*" "*tail)
                   end
               end
           end
           memo[i]=a
       end
       solve(1)
   end
R
~

.. code-block:: r

   word_break_all <- function(s,dict) {
       b<-utf8ToInt(s)
       n<-length(b)
       d<-new.env(hash=TRUE,parent=emptyenv())
       for(w in dict)d[[w]]<-TRUE
       memo<-new.env(hash=TRUE,parent=emptyenv())
       solve<-function(i) {
           key<-as.character(i)
           if(!is.null(memo[[key]]))return(memo[[key]])
           if(i>n)return("")
           a<-character()
           for(j in i:n) {
               w<-intToUtf8(b[i:j])
               if(!is.null(d[[w]]))for(tail in solve(j+1L))a<-c(a,if(nchar(tail)==0L)w else
               paste(w,tail))
           }
           memo[[key]]<-a
           a
       }
       solve(1L)
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 无解返回空列表。
* 终点状态返回 ``[""]`` 供上一层组合，公开结果不包含空句。

易错点
------

* 终点返回空列表导致无法完成任何句子。
* 只记忆布尔可行性却重复生成后缀句子。

本题新增知识
------------

* 后缀句子集合
* 题号 0140 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0139. Word Break <0139-word-break.rst>`_；
* `0126. Word Ladder II <0126-word-ladder-ii.rst>`_；

最小自检
--------

#. ``记忆化 DFS`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

任意句子的首词唯一确定一个合法前缀，递归覆盖剩余句子；反之每次拼接只使用词典词并完整消费字符串。按下标记忆避免重复求解同一后缀。
