0131. Palindrome Partitioning
=============================

题目信息
--------

:题号: 0131
:难度: Medium
:主题: 字符串、回溯、动态规划
:原题: `LeetCode 0131 <https://leetcode.com/problems/palindrome-partitioning/>`_
:访问状态: Available
:教学重点: 回文表与切分枚举

题目重述
--------

返回把字符串切分为若干回文子串的所有方案。每个字符恰好属于一个片段，方案按切分位置区分。

自建示例
--------

.. code-block:: text

   输入：s = "aab"
   输出：[["a","a","b"],["aa","b"]]

问题抽象
--------

预计算 ``pal[i][j]`` 表示闭区间是否回文；回溯从起点枚举所有回文终点，加入片段后递归到下一位置。

主解法：回文表加回溯
------------

思路
~~~~

回文表加回溯。 回文表与切分枚举

核心状态与不变量
~~~~~~~~~~~~~~~~

预计算 ``pal[i][j]`` 表示闭区间是否回文；回溯从起点枚举所有回文终点，加入片段后递归到下一位置。

正确性依据
~~~~~~~~~~

任意合法切分的首片段必对应某个回文终点，算法会枚举它；递归按同理覆盖剩余切分。起点严格增加保证终止，切分下标序列唯一保证无重复。

复杂度与语言边界
~~~~~~~~~~~~~~~~

预处理 ``O(n^2)`` 时间和空间；搜索输出相关，复制总成本为输出字符载荷 ``S``，递归深度 ``O(n)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <string.h>
   typedef void(*emit_partition)(const char**parts,const int*lengths,int count,void*ctx);
   static bool pal(const char*s,int l,int r) {
       while(l<r)if(s[l++]!=s[r--])return false;
       return true;
   }
   static void dfs(const char*s,int n,int start,const char**parts,int*lens,int depth,emit_partition
       emit,void*ctx) {
       if(start==n) {
           emit(parts,lens,depth,ctx);
           return;
       }
       for(int end=start;end<n;end++)if(pal(s,start,end)) {
           parts[depth]=s+start;
           lens[depth]=end-start+1;
           dfs(s,n,end+1,parts,lens,depth+1,emit,ctx);
       }
   }
   void partition(const char*s,emit_partition emit,void*ctx) {
       int n=strlen(s);
       const char*parts[n?n:1];
       int lens[n?n:1];
       dfs(s,n,0,parts,lens,0,emit,ctx);
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       vector<vector<string>>ans;
       vector<string>path;
       vector<vector<char>>pal;
       void dfs(string&s,int i) {
           if(i==(int)s.size()) {
               ans.push_back(path);
               return;
           }
           for(int j=i;j<(int)s.size();j++)if(pal[i][j]) {
               path.push_back(s.substr(i,j-i+1));
               dfs(s,j+1);
               path.pop_back();
           }
       }
       public:vector<vector<string>>partition(string s) {
           int n=s.size();
           pal.assign(n,vector<char>(n));
           for(int i=n-1;i>=0;i--)for(int j=i;j<n;j++)pal[i][j]=s[i]==s[j]&&(j-i<2||pal[i+1][j-1]);
           dfs(s,0);
           return ans;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def partition(self, s: str) -> list[list[str]]:
           n = len(s)
           pal = [[False] * n for _ in range(n)]
           for i in range(n - 1, -1, -1):
               for j in range(i, n):
                   pal[i][j] = s[i] == s[j] and (j - i < 2 or pal[i + 1][j - 1])
           ans = []
           path = []

           def dfs(i):
               if i == n:
                   ans.append(path.copy())
                   return
               for j in range(i, n):
                   if pal[i][j]:
                       path.append(s[i:j + 1])
                       dfs(j + 1)
                       path.pop()
           dfs(0)
           return ans
Java
~~~~

.. code-block:: java

   class Solution {
       List<List<String>>ans=new ArrayList<>();
       List<String>path=new ArrayList<>();
       boolean[][]pal;
       public List<List<String>>partition(String s) {
           int n=s.length();
           pal=new boolean[n][n];
           for(int i=n-1;i>=0;i--)for(int
               j=i;j<n;j++)pal[i][j]=s.charAt(i)==s.charAt(j)&&(j-i<2||pal[i+1][j-1]);
           dfs(s,0);
           return ans;
       }
       void dfs(String s,int i) {
           if(i==s.length()) {
               ans.add(new ArrayList<>(path));
               return;
           }
           for(int j=i;j<s.length();j++)if(pal[i][j]) {
               path.add(s.substring(i,j+1));
               dfs(s,j+1);
               path.remove(path.size()-1);
           }
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn partition(s:String)->Vec<Vec<String>> {
           let b=s.as_bytes();
           let n=b.len();
           let mut pal=vec![vec![false;
           n];
           n];
           for i in(0..n).rev() {
               for j in i..n {
                   pal[i][j]=b[i]==b[j]&&(j-i<2||pal[i+1][j-1]);
               }
           }
           fn dfs(s:&str,i:usize,p:&Vec<Vec<bool>>,path:&mut Vec<String>,ans:&mut Vec<Vec<String>>)
               {
               if i==s.len() {
                   ans.push(path.clone());
                   return;
               }
               for j in i..s.len() {
                   if p[i][j] {
                       path.push(s[i..=j].to_string());
                       dfs(s,j+1,p,path,ans);
                       path.pop();
                   }
               }
           }
           let mut a=vec![];
           dfs(&s,0,&pal,&mut vec![],&mut a);
           a
       }
   }
Go
~~

.. code-block:: go

   func partition(s string) [][]string {
   	n := len(s)
   	pal := make([][]bool, n)
   	for i := range pal {
   		pal[i] = make([]bool, n)
   	}
   	for i := n - 1; i >= 0; i-- {
   		for j := i; j < n; j++ {
   			pal[i][j] = s[i] == s[j] && (j-i < 2 || pal[i+1][j-1])
   		}
   	}
   	ans := [][]string{}
   	path := []string{}
   	var dfs func(int)
   	dfs = func(i int) {
   		if i == n {
   			ans = append(ans, append([]string(nil), path...))
   			return
   		}
   		for j := i; j < n; j++ {
   			if pal[i][j] {
   				path = append(path, s[i:j+1])
   				dfs(j + 1)
   				path = path[:len(path)-1]
   			}
   		}
   	}
   	dfs(0)
   	return ans
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function partition(s: string): string[][] {
       const n = s.length, pal = Array.from({ length: n }, () => Array(n).fill(false));
       for (let i = n - 1; i >= 0; i--)
           for (let j = i; j < n; j++)
               pal[i][j] = s[i] === s[j] && (j
                   - i < 2 || pal[i + 1][j - 1]);
       const ans: string[][] = [], path: string[] = [];
       const dfs = (i: number) => {
           if (i === n) {
               ans.push([...path]);
               return;
           }
           for (let j = i; j < n; j++)
               if (pal[i][j]) {
                   path.push(s.slice(i, j + 1));
                   dfs(j + 1);
                   path.pop();
               }
       };
       dfs(0);
       return ans;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       List<IList<string>>ans=new();
       List<string>path=new();
       bool[,]pal;
       public IList<IList<string>> Partition(string s) {
           int n=s.Length;
           pal=new bool[n,n];
           for(int i=n-1;i>=0;i--)for(int j=i;j<n;j++)pal[i,j]=s[i]==s[j]&&(j-i<2||pal[i+1,j-1]);
           Dfs(s,0);
           return ans;
       }
       void Dfs(string s,int i) {
           if(i==s.Length) {
               ans.Add(new List<string>(path));
               return;
           }
           for(int j=i;j<s.Length;j++)if(pal[i,j]) {
               path.Add(s.Substring(i,j-i+1));
               Dfs(s,j+1);
               path.RemoveAt(path.Count-1);
           }
       }
   }
Julia
~~~~~

.. code-block:: julia

   function partition_pal(s::String)
       b=codeunits(s)
       n=length(b)
       pal=falses(n,n)
       for i in n:-1:1,j in i:n
           pal[i,j]=b[i]==b[j]&&(j-i<2||pal[i+1,j-1])
       end
       ans=Vector{Vector{String}}()
       path=String[]
       function dfs(i)
           if i>n
               push!(ans,copy(path))
               return
           end
           for j in i:n
               if pal[i,j]
                   push!(path,String(b[i:j]))
                   dfs(j+1)
                   pop!(path)
               end
           end
       end
       dfs(1)
       ans
   end
R
~

.. code-block:: r

   partition_pal <- function(s) {
       b<-utf8ToInt(s)
       n<-length(b)
       pal<-matrix(FALSE,n,n)
       if(n>0L)for(i in seq.int(n,1L,by=-1L))for(j in
       i:n)pal[i,j]<-b[[i]]==b[[j]]&&(j-i<2L||pal[i+1L,j-1L])
       ans<-list()
       path<-character()
       dfs<-function(i) {
           if(i>n) {
               ans[[length(ans)+1L]]<<-path
               return()
           }
           for(j in i:n)if(pal[i,j]) {
               path<<-c(path,intToUtf8(b[i:j]))
               dfs(j+1L)
               path<<-path[-length(path)]
           }
       }
       dfs(1L)
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

* 空串的数学切分可定义为包含一个空方案；平台域通常非空。
* 结果片段必须是独立字符串或安全切片。

易错点
------

* 每次重新检查回文导致高额重复工作。
* 保存共享可变路径。

本题新增知识
------------

* 回文表与切分枚举
* 题号 0131 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0132. Palindrome Partitioning II <0132-palindrome-partitioning-ii.rst>`_；
* `0125. Valid Palindrome <0125-valid-palindrome.rst>`_；

最小自检
--------

#. ``回文表加回溯`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

任意合法切分的首片段必对应某个回文终点，算法会枚举它；递归按同理覆盖剩余切分。起点严格增加保证终止，切分下标序列唯一保证无重复。
