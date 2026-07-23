0039. Combination Sum
=====================

题目信息
--------

:题号: 0039
:难度: Medium
:主题: 数组、回溯、组合搜索、剪枝
:原题: `LeetCode 0039 <https://leetcode.com/problems/combination-sum/>`_
:重点: 候选值互异、同一值可重复使用、组合按数值去重、和等于目标

题目重述
--------

给定由互不相同正整数组成的数组 ``candidates`` 和正整数 ``target``，找出所有元素之和恰好等于 ``target`` 的不同组合。

每个候选值可以在同一个组合中使用任意多次。组合只按所含数值及其出现次数区分，内部顺序不同不算新的组合；答案顺序不作要求。

``candidates`` 的长度位于 ``[1, 30]``，每个候选值位于 ``[2, 40]``，``target`` 位于 ``[1, 40]``。题目保证满足条件的不同组合数量少于 150。

自建示例
--------

同一候选值可多次使用：

.. code-block:: text

   输入：candidates = [2, 3, 7], target = 12
   输出：[[2, 2, 2, 2, 2, 2], [2, 3, 7], [3, 3, 3, 3]]
   解释：三个组合的和都为 12；同一候选值可以重复选择。答案顺序可以不同。

目标小于所有候选值：

.. code-block:: text

   输入：candidates = [5, 8, 11], target = 3
   输出：[]
   解释：候选值均为正数且都大于目标，不存在合法组合。

只有一种组合：

.. code-block:: text

   输入：candidates = [4, 6, 9], target = 18
   输出：[[4, 4, 4, 6], [6, 6, 6], [9, 9]]
   解释：这些是全部数值组合；例如 [6, 4, 4, 4] 与 [4, 4, 4, 6] 视为同一个组合。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       void chooseCounts(const std::vector<int>& values,int index,int remaining,
                         std::vector<int>& path,std::vector<std::vector<int>>& result){
           if(remaining==0){result.push_back(path);return;}
           if(index==static_cast<int>(values.size()))return;
           int value=values[index];
           for(int count=0;count*value<=remaining;count++){
               for(int i=0;i<count;i++)path.push_back(value);
               chooseCounts(values,index+1,remaining-count*value,path,result);
               for(int i=0;i<count;i++)path.pop_back();
           }
       }

       void backtrack(const std::vector<int>& values,int start,int remaining,
                      std::vector<int>& path,std::vector<std::vector<int>>& result){
           if(remaining==0){result.push_back(path);return;}
           for(int i=start;i<static_cast<int>(values.size());i++){
               if(values[i]>remaining)break;
               path.push_back(values[i]);
               backtrack(values,i,remaining-values[i],path,result);
               path.pop_back();
           }
       }

       std::vector<std::vector<int>> sortedBacktracking(std::vector<int> candidates,int target){
           std::sort(candidates.begin(),candidates.end());
           std::vector<std::vector<int>> result;std::vector<int> path;
           backtrack(candidates,0,target,path,result);return result;
       }

   public:
       std::vector<std::vector<int>> combinationSum(std::vector<int>& candidates,int target){
           return sortedBacktracking(candidates,target);
       }
   };

题解
----

无序选择为什么产生排列重复
~~~~~~~~~~~~~~~~~~~~~~~~~~

若每层都从全部候选重新选择，组合 ``[2,3,7]`` 会以多种顺序到达同一叶节点。使用 ``start`` 限制后续下标不小于
当前选择，使路径保持非递减，每个数值多重集合只有一个排列表示。

剩余目标如何成为递归状态
~~~~~~~~~~~~~~~~~~~~~~~~

``remaining`` 是尚需凑出的和。选择 ``values[i]`` 后进入 ``remaining-values[i]``；由于允许重复使用，下一层仍从
``i`` 开始，而不是 ``i+1``。达到零时记录答案。

正数与排序如何支持剪枝
~~~~~~~~~~~~~~~~~~~~~~

所有候选为正数，剩余值只会下降。排序后若当前候选已经大于 ``remaining``，后续候选更大，整段循环都可结束。
若允许非正数，重复选择可能不减少剩余值，搜索无法用相同终止逻辑。

选择与撤销
~~~~~~~~~~

路径追加候选后递归，返回时删除末位。这样每个兄弟分支从同一父路径出发。记录答案时复制路径，后续撤销不会修改
已保存组合。

状态演化
~~~~~~~~

对 ``[2,3,7]``、目标 12 的一条路径：

.. code-block:: text

   remaining=12, path=[]
   选择 2 -> remaining=10, path=[2]
   选择 3 -> remaining=7,  path=[2,3]
   选择 7 -> remaining=0,  path=[2,3,7]

在路径 ``[2,3]`` 后仍从 3 的下标开始，所以可以继续选 3 或更大值，但不会回到 2，避免生成
``[3,2,7]``。

为什么所有组合恰好生成一次
~~~~~~~~~~~~~~~~~~~~~~~~~~

任意合法组合可以唯一排序为非递减序列。回溯允许在同一下标重复选择，并允许之后移动到更大下标，因此必然存在一条
路径生成该序列。路径下标从不下降，其他排列不可能出现；候选值又互不相同，所以没有第二条路径生成同一序列。

按候选次数枚举的替代模型
~~~~~~~~~~~~~~~~~~~~~~~~

另一种写法对每个候选枚举使用次数 ``0..remaining/value``，然后进入下一候选。它直接把状态表示成“每种值取多少个”，
同样不会重复，但循环会为每个次数反复追加和撤销元素。逐元素回溯更紧凑。

复杂度来源
~~~~~~~~~~

搜索复杂度取决于答案和被剪枝的中间状态；粗略上界可写为 ``O(k^(target/min))``。每个答案复制长度最多
``target/min``。递归深度与路径长度同阶，除输出外工作空间为 ``O(target/min)``。

九语言实现
----------

C
~

.. code-block:: c

   static int cmp_int(const void* a,const void* b){int x=*(const int*)a,y=*(const int*)b;return(x>y)-(x<y);}
   static void dfs(int* a,int n,int start,int remaining,int* path,int depth,int*** result,int** cols,int* size){
       if(remaining==0){(*result)[*size]=malloc((size_t)depth*sizeof(int));memcpy((*result)[*size],path,(size_t)depth*sizeof(int));(*cols)[(*size)++]=depth;return;}
       for(int i=start;i<n&&a[i]<=remaining;i++){path[depth]=a[i];dfs(a,n,i,remaining-a[i],path,depth+1,result,cols,size);}
   }
   int** combinationSum(int* candidates,int n,int target,int* returnSize,int** returnColumnSizes){
       qsort(candidates,n,sizeof(int),cmp_int);int capacity=256;int** result=malloc((size_t)capacity*sizeof(int*));int* cols=malloc((size_t)capacity*sizeof(int));int* path=malloc((size_t)(target/2+1)*sizeof(int));*returnSize=0;dfs(candidates,n,0,target,path,0,&result,&cols,returnSize);free(path);*returnColumnSizes=cols;return result;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def combinationSum(self,candidates:list[int],target:int)->list[list[int]]:
           candidates.sort();result=[];path=[]
           def dfs(start,remaining):
               if remaining==0:result.append(path.copy());return
               for i in range(start,len(candidates)):
                   if candidates[i]>remaining:break
                   path.append(candidates[i]);dfs(i,remaining-candidates[i]);path.pop()
           dfs(0,target);return result

Java
~~~~

.. code-block:: java

   class Solution {
       public List<List<Integer>> combinationSum(int[] candidates,int target){Arrays.sort(candidates);List<List<Integer>> result=new ArrayList<>();dfs(candidates,0,target,new ArrayList<>(),result);return result;}
       private void dfs(int[] a,int start,int remaining,List<Integer> path,List<List<Integer>> result){if(remaining==0){result.add(new ArrayList<>(path));return;}for(int i=start;i<a.length&&a[i]<=remaining;i++){path.add(a[i]);dfs(a,i,remaining-a[i],path,result);path.remove(path.size()-1);}}
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn combination_sum(mut candidates:Vec<i32>,target:i32)->Vec<Vec<i32>>{
           fn dfs(a:&[i32],start:usize,remaining:i32,path:&mut Vec<i32>,out:&mut Vec<Vec<i32>>){if remaining==0{out.push(path.clone());return}for i in start..a.len(){if a[i]>remaining{break}path.push(a[i]);dfs(a,i,remaining-a[i],path,out);path.pop();}}
           candidates.sort_unstable();let mut out=Vec::new();dfs(&candidates,0,target,&mut Vec::new(),&mut out);out
       }
   }

Go
~~

.. code-block:: go

   func combinationSum(candidates []int,target int)[][]int{
       sort.Ints(candidates);result:=[][]int{};path:=[]int{};var dfs func(int,int)
       dfs=func(start,remaining int){if remaining==0{copyPath:=append([]int(nil),path...);result=append(result,copyPath);return};for i:=start;i<len(candidates)&&candidates[i]<=remaining;i++{path=append(path,candidates[i]);dfs(i,remaining-candidates[i]);path=path[:len(path)-1]}}
       dfs(0,target);return result
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function combinationSum(candidates:number[],target:number):number[][]{
       candidates.sort((a,b)=>a-b);const result:number[][]=[],path:number[]=[];
       const dfs=(start:number,remaining:number)=>{if(remaining===0){result.push([...path]);return;}for(let i=start;i<candidates.length&&candidates[i]<=remaining;i++){path.push(candidates[i]);dfs(i,remaining-candidates[i]);path.pop();}};dfs(0,target);return result;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public IList<IList<int>> CombinationSum(int[] candidates,int target){Array.Sort(candidates);var result=new List<IList<int>>();Dfs(candidates,0,target,new List<int>(),result);return result;}
       void Dfs(int[] a,int start,int remaining,List<int> path,List<IList<int>> result){if(remaining==0){result.Add(new List<int>(path));return;}for(int i=start;i<a.Length&&a[i]<=remaining;i++){path.Add(a[i]);Dfs(a,i,remaining-a[i],path,result);path.RemoveAt(path.Count-1);}}
   }

Julia
~~~~~

.. code-block:: julia

   function combination_sum(candidates::Vector{Int},target::Int)
       sort!(candidates);result=Vector{Vector{Int}}();path=Int[]
       function dfs(start,remaining)
           if remaining==0;push!(result,copy(path));return;end
           for i in start:length(candidates);candidates[i]>remaining&&break;push!(path,candidates[i]);dfs(i,remaining-candidates[i]);pop!(path);end
       end;dfs(1,target);result
   end

R
~

.. code-block:: r

   combination_sum <- function(candidates,target) {
       candidates<-sort(candidates);result<-list();path<-integer()
       dfs<-function(start,remaining){if(remaining==0){result[[length(result)+1L]]<<-path;return()};for(i in start:length(candidates)){if(candidates[[i]]>remaining)break;path<<-c(path,candidates[[i]]);dfs(i,remaining-candidates[[i]]);path<<-head(path,-1L)}}
       dfs(1L,target);result
   }