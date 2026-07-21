0077. Combinations
==================

题目信息
--------

:题号: 0077
:难度: Medium
:主题: 回溯、组合、容量剪枝
:原题: `LeetCode 0077 <https://leetcode.com/problems/combinations/>`_
:教学重点: 严格递增路径、剩余容量、结果快照、输出规模

题目重述
--------

给定 ``n`` 和 ``k``，返回从 ``1..n`` 中选出恰好 ``k`` 个不同整数的全部组合。组合内部顺序不重要，主实现按递增顺序生成，每个结果只出现一次。

自建示例
--------

.. code-block:: text

   n=5,k=3
   [1,2,3] [1,2,4] [1,2,5] [1,3,4] [1,3,5]
   [1,4,5] [2,3,4] [2,3,5] [2,4,5] [3,4,5]

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       std::vector<std::vector<int>> maskEnumeration(int n, int k) {
           std::vector<std::vector<int>> result;
           for (int mask = 0; mask < (1 << n); ++mask) {
               if (__builtin_popcount(static_cast<unsigned>(mask)) != k) continue;
               std::vector<int> current;
               for (int bit = 0; bit < n; ++bit)
                   if (mask & (1 << bit)) current.push_back(bit + 1);
               result.push_back(current);
           }
           return result;
       }

       void plainDfs(int start, int n, int k, std::vector<int>& path,
                     std::vector<std::vector<int>>& result) {
           if (static_cast<int>(path.size()) == k) { result.push_back(path); return; }
           for (int value = start; value <= n; ++value) {
               path.push_back(value);
               plainDfs(value + 1, n, k, path, result);
               path.pop_back();
           }
       }

       void prunedDfs(int start, int n, int k, std::vector<int>& path,
                      std::vector<std::vector<int>>& result) {
           if (static_cast<int>(path.size()) == k) { result.push_back(path); return; }
           int needed = k - path.size();
           int last_start = n - needed + 1;
           for (int value = start; value <= last_start; ++value) {
               path.push_back(value);
               prunedDfs(value + 1, n, k, path, result);
               path.pop_back();
           }
       }

   public:
       std::vector<std::vector<int>> combine(int n, int k) {
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           prunedDfs(1, n, k, path, result);
           return result;
       }
   };

题解
----

枚举所有子集浪费了什么
~~~~~~~~~~~~~~~~~~~~

``1..n`` 有 ``2^n`` 个子集，位掩码方法生成后再筛选长度 ``k``，会访问大量尺寸不合格的候选。回溯可以在路径达到 ``k`` 时立即提交，不再扩展。

start 如何消除排列重复
~~~~~~~~~~~~~~~~~~~~~~

路径保存严格递增的已选数字。选择 ``value`` 后只从 ``value+1`` 继续，因此集合 ``{1,3,5}`` 只会以 ``[1,3,5]`` 生成，不会出现 ``[3,1,5]`` 等排列。

选择与撤销
~~~~~~~~~~

每层先把候选压入路径，递归处理包含它的所有组合，返回后弹出，恢复父层前缀。保存答案时复制当前路径，后续撤销不会修改已提交结果。

剩余容量如何剪枝
~~~~~~~~~~~~~~~~

当前还需要 ``needed = k-path.size()`` 个数字。若本层从 ``value`` 开始，包含它在内至少要有 ``needed`` 个候选，因此最大起点满足：

.. code-block:: text

   value <= n - needed + 1

更大的起点即使选完右侧全部数字也无法填满路径。

.. list-table::
   :header-rows: 1

   * - 路径
     - needed
     - 允许起点上界
   * - ``[]``，n=5,k=3
     - 3
     - 3
   * - ``[1]``
     - 2
     - 4
   * - ``[1,4]``
     - 1
     - 5
   * - ``[1,4,5]``
     - 0
     - 提交

为什么不会漏解
~~~~~~~~~~~~~~

任意大小为 ``k`` 的组合都有唯一递增序列。它的每个前缀都拥有足够的剩余数字，因此不会被容量剪枝；算法会按序选择该序列中的每个值并到达叶子。

为什么不会重复
~~~~~~~~~~~~~~

不同递归路径对应不同严格递增序列。组合的递增表示唯一，因此两个叶子不可能表示同一集合。

输出复杂度为何不可忽略
~~~~~~~~~~~~~~~~~~~~~~

共有 ``C(n,k)`` 个答案，每个答案需要复制 ``k`` 个整数，任何算法至少需要 ``Theta(C(n,k)*k)`` 时间和输出空间。回溯工作空间只保存长度至多 ``k`` 的路径。

复杂度来源
~~~~~~~~~~

位掩码筛选为 ``O(2^n*n)``。剪枝回溯的输出主导时间为 ``O(C(n,k)*k)``，不计结果时递归路径空间 ``O(k)``。

九语言实现
----------

C
~

.. code-block:: c

   static void dfs(int start,int n,int k,int*path,int depth,int***out,int*size,int*cap){if(depth==k){if(*size==*cap){*cap*=2;*out=realloc(*out,*cap*sizeof(int*));}int*row=malloc(k*sizeof(int));memcpy(row,path,k*sizeof(int));(*out)[(*size)++]=row;return;}int needed=k-depth,last=n-needed+1;for(int v=start;v<=last;v++){path[depth]=v;dfs(v+1,n,k,path,depth+1,out,size,cap);}}
   int**combine(int n,int k,int*returnSize,int**returnCols){int size=0,cap=4;int**out=malloc(cap*sizeof(int*));int*path=malloc(k*sizeof(int));dfs(1,n,k,path,0,&out,&size,&cap);int*cols=malloc(size*sizeof(int));for(int i=0;i<size;i++)cols[i]=k;free(path);*returnSize=size;*returnCols=cols;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def combine(self, n: int, k: int) -> list[list[int]]:
           result=[];path=[]
           def dfs(start):
               if len(path)==k:result.append(path.copy());return
               needed=k-len(path)
               for value in range(start,n-needed+2):path.append(value);dfs(value+1);path.pop()
           dfs(1);return result

Java
~~~~

.. code-block:: java

   class Solution {List<List<Integer>>out=new ArrayList<>();List<Integer>path=new ArrayList<>();void dfs(int start,int n,int k){if(path.size()==k){out.add(new ArrayList<>(path));return;}int last=n-(k-path.size())+1;for(int v=start;v<=last;v++){path.add(v);dfs(v+1,n,k);path.remove(path.size()-1);}}public List<List<Integer>> combine(int n,int k){dfs(1,n,k);return out;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn combine(n:i32,k:i32)->Vec<Vec<i32>>{fn dfs(start:i32,n:i32,k:usize,path:&mut Vec<i32>,out:&mut Vec<Vec<i32>>){if path.len()==k{out.push(path.clone());return}let last=n-(k-path.len())as i32+1;for v in start..=last{path.push(v);dfs(v+1,n,k,path,out);path.pop();}}let mut out=vec![];dfs(1,n,k as usize,&mut vec![],&mut out);out}}

Go
~~

.. code-block:: go

   func combine(n,k int)[][]int{out:=[][]int{};path:=[]int{};var dfs func(int);dfs=func(start int){if len(path)==k{row:=append([]int(nil),path...);out=append(out,row);return};last:=n-(k-len(path))+1;for v:=start;v<=last;v++{path=append(path,v);dfs(v+1);path=path[:len(path)-1]}};dfs(1);return out}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function combine(n:number,k:number):number[][]{const out:number[][]=[],path:number[]=[];const dfs=(start:number)=>{if(path.length===k){out.push([...path]);return;}const last=n-(k-path.length)+1;for(let v=start;v<=last;v++){path.push(v);dfs(v+1);path.pop();}};dfs(1);return out;}

C#
~~

.. code-block:: csharp

   public class Solution {List<IList<int>>o=new();List<int>p=new();void Dfs(int start,int n,int k){if(p.Count==k){o.Add(new List<int>(p));return;}int last=n-(k-p.Count)+1;for(int v=start;v<=last;v++){p.Add(v);Dfs(v+1,n,k);p.RemoveAt(p.Count-1);}}public IList<IList<int>> Combine(int n,int k){Dfs(1,n,k);return o;}}

Julia
~~~~~

.. code-block:: julia

   function combine(n::Int,k::Int)
       out=Vector{Vector{Int}}();path=Int[]
       function dfs(start);length(path)==k&&(push!(out,copy(path));return);last=n-(k-length(path))+1;for v in start:last;push!(path,v);dfs(v+1);pop!(path);end;end
       dfs(1);out
   end

R
~

.. code-block:: r

   combine_values <- function(n,k){out<-list();path<-integer();dfs<-function(start){if(length(path)==k){out[[length(out)+1L]]<<-path;return()};last<-n-(k-length(path))+1L;if(start<=last)for(v in start:last){path<<-c(path,v);dfs(v+1L);path<<-head(path,-1L)}};dfs(1L);out}
