0090. Subsets II
================

题目信息
--------

:题号: 0090
:难度: Medium
:主题: 数组、回溯、排序、重复值去重
:原题: `LeetCode 0090 <https://leetcode.com/problems/subsets-ii/>`_
:重点: 输入位置至多一次、数值子集去重、空集、重复元素数量

题目重述
--------

给定可能包含重复元素的整数数组 ``nums``，返回所有不同子集。每个输入位置在一个子集中最多使用一次；具有相同元素及重复次数的子集只返回一次。答案必须包含空集，结果顺序不限。

约束为 ``1 <= nums.length <= 10``、``-10 <= nums[i] <= 10``。

自建示例
--------

.. code-block:: text

   输入：nums = [1,1,2,2]
   输出：[[],[1],[1,1],[2],[2,2],[1,2],[1,1,2],[1,2,2],[1,1,2,2]]

值 1 和 2 都可分别使用 0、1、2 次，因此共有 ``3 * 3 = 9`` 个不同子集；输出次序可以不同。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <set>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       void allPositionSubsets(const std::vector<int>& nums, int index,
                               std::vector<int>& path,
                               std::set<std::vector<int>>& unique) {
           if (index == static_cast<int>(nums.size())) {
               auto normalized = path;
               std::sort(normalized.begin(), normalized.end());
               unique.insert(std::move(normalized));
               return;
           }
           allPositionSubsets(nums, index + 1, path, unique);
           path.push_back(nums[index]);
           allPositionSubsets(nums, index + 1, path, unique);
           path.pop_back();
       }

       void groupedDfs(const std::vector<std::pair<int,int>>& groups, int index,
                       std::vector<int>& path,
                       std::vector<std::vector<int>>& result) {
           if (index == static_cast<int>(groups.size())) {
               result.push_back(path); return;
           }
           auto [value, count] = groups[index];
           for (int used = 0; used <= count; ++used) {
               groupedDfs(groups, index + 1, path, result);
               if (used < count) path.push_back(value);
           }
           for (int used = 0; used < count; ++used) path.pop_back();
       }

       void sortedDfs(const std::vector<int>& nums, int start,
                      std::vector<int>& path,
                      std::vector<std::vector<int>>& result) {
           result.push_back(path);
           for (int index = start; index < static_cast<int>(nums.size()); ++index) {
               if (index > start && nums[index] == nums[index - 1]) continue;
               path.push_back(nums[index]);
               sortedDfs(nums, index + 1, path, result);
               path.pop_back();
           }
       }

   public:
       std::vector<std::vector<int>> subsetsWithDup(std::vector<int>& nums) {
           std::sort(nums.begin(), nums.end());
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           sortedDfs(nums, 0, path, result);
           return result;
       }
   };

题解
----

为什么按位置生成会重复
~~~~~~~~~~~~~~~~~~~~

两个值相同的输入位置在“只选其中一个”时会形成不同位置路径，却对应同一个元素多重集。例如 ``[1,2_a,2_b]`` 中选择 ``2_a`` 与选择 ``2_b`` 都得到子集 ``[2]``。

排序带来了什么
~~~~~~~~~~~~~~

排序后相同值连续出现。回溯在同一层枚举“下一个加入路径的元素”，相邻等值候选会建立完全等价的兄弟子树，因此只保留该层第一个候选即可。

同层判断为何是 index > start
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   if index > start and nums[index] == nums[index-1]: skip

``start`` 是当前递归层的第一个候选下标。只有 ``index > start`` 才说明前一个等值元素已经在同层建立过兄弟分支；``index == start`` 时，即使它与上一层选择值相同，也必须允许选择。

为什么深层仍可选重复副本
~~~~~~~~~~~~~~~~~~~~~~~~

选择第一个 2 后递归到下一层，新的 ``start`` 指向第二个 2。此时 ``index == start``，不会触发跳过，因此 ``[2,2]`` 能被生成。规则删除的是“同层换一个相同副本作为首次选择”，不是禁止路径包含重复值。

.. list-table::
   :header-rows: 1

   * - 层与候选
     - 动作
   * - 根层选择第一个 2
     - 生成 ``[2]`` 子树
   * - 根层遇到第二个 2
     - 与前一个候选同值且 ``index>start``，跳过
   * - ``[2]`` 的下一层遇到第二个 2
     - ``index==start``，允许选择，生成 ``[2,2]``

为什么每个节点都要提交答案
~~~~~~~~~~~~~~~~~~~~~~~~~~

与固定长度组合不同，任意路径长度都是合法子集，包括空路径。因此每次进入递归节点先复制 ``path`` 到结果，再枚举后续扩展。

频次分组方法如何等价
~~~~~~~~~~~~~~~~~~~~

把每个不同值及其出现次数组成 ``(value,count)``，对该值选择 ``0..count`` 个副本，再递归处理下一值组。每轮递归前路径包含恰好 ``used`` 个当前值；循环结束后弹出 ``count`` 个副本恢复父状态。它直接枚举多重集，但需要额外分组；排序同层去重则通过位置回溯完成，状态更紧凑。

为什么不重不漏
~~~~~~~~~~~~~~

任意唯一子集都可按非递减顺序表示，并确定每个不同值选择多少个副本。算法在每层为某值只建立一个首次选择分支，随后可在深层继续选择剩余副本，因此该表示存在一条路径；同层等值兄弟被删除，不会出现第二条相同多重集路径。

排序副作用如何理解
~~~~~~~~~~~~~~~~~~

C++ 标准入口直接排序 ``nums``，会改变输入元素顺序；题目不要求保持输入。需要只读语义时可排序副本，算法复杂度不变但增加 ``O(n)`` 复制空间。

复杂度来源
~~~~~~~~~~

排序 ``O(n log n)``。设输出中所有子集元素总数为 ``P``，生成和复制结果为 ``Theta(P)``；最坏互异元素时 ``P=Theta(n*2^n)``。递归工作空间 ``O(n)``，不计输出。

九语言实现
----------

C
~

.. code-block:: c

   static int cmp(const void*a,const void*b){int x=*(int*)a,y=*(int*)b;return(x>y)-(x<y);}
   static void dfs(int*a,int n,int start,int*path,int depth,int***out,int**cols,int*size){int*row=malloc((size_t)depth*sizeof(int));if(depth)memcpy(row,path,(size_t)depth*sizeof(int));(*out)[*size]=row;(*cols)[(*size)++]=depth;for(int i=start;i<n;i++){if(i>start&&a[i]==a[i-1])continue;path[depth]=a[i];dfs(a,n,i+1,path,depth+1,out,cols,size);}}
   int**subsetsWithDup(int*a,int n,int*returnSize,int**returnCols){qsort(a,(size_t)n,sizeof(int),cmp);int total=1<<n,size=0;int**out=malloc((size_t)total*sizeof(int*));int*cols=malloc((size_t)total*sizeof(int));int*path=malloc((size_t)n*sizeof(int));dfs(a,n,0,path,0,&out,&cols,&size);free(path);*returnSize=size;*returnCols=cols;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def subsetsWithDup(self, nums: list[int]) -> list[list[int]]:
           nums.sort();result=[];path=[]
           def dfs(start):
               result.append(path.copy())
               for index in range(start,len(nums)):
                   if index>start and nums[index]==nums[index-1]:continue
                   path.append(nums[index]);dfs(index+1);path.pop()
           dfs(0);return result

Java
~~~~

.. code-block:: java

   class Solution {List<List<Integer>>out=new ArrayList<>();List<Integer>path=new ArrayList<>();void dfs(int[]a,int start){out.add(new ArrayList<>(path));for(int i=start;i<a.length;i++){if(i>start&&a[i]==a[i-1])continue;path.add(a[i]);dfs(a,i+1);path.remove(path.size()-1);}}public List<List<Integer>> subsetsWithDup(int[]a){Arrays.sort(a);dfs(a,0);return out;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn subsets_with_dup(mut a:Vec<i32>)->Vec<Vec<i32>>{fn dfs(a:&[i32],start:usize,path:&mut Vec<i32>,out:&mut Vec<Vec<i32>>){out.push(path.clone());for i in start..a.len(){if i>start&&a[i]==a[i-1]{continue}path.push(a[i]);dfs(a,i+1,path,out);path.pop();}}a.sort();let mut out=vec![];dfs(&a,0,&mut vec![],&mut out);out}}

Go
~~

.. code-block:: go

   func subsetsWithDup(a []int)[][]int{sort.Ints(a);out:=[][]int{};path:=[]int{};var dfs func(int);dfs=func(start int){copyPath:=append([]int(nil),path...);out=append(out,copyPath);for i:=start;i<len(a);i++{if i>start&&a[i]==a[i-1]{continue};path=append(path,a[i]);dfs(i+1);path=path[:len(path)-1]}};dfs(0);return out}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function subsetsWithDup(a:number[]):number[][]{a.sort((x,y)=>x-y);const out:number[][]=[],path:number[]=[];const dfs=(start:number)=>{out.push([...path]);for(let i=start;i<a.length;i++){if(i>start&&a[i]===a[i-1])continue;path.push(a[i]);dfs(i+1);path.pop();}};dfs(0);return out;}

C#
~~

.. code-block:: csharp

   public class Solution {List<IList<int>>o=new();List<int>p=new();void Dfs(int[]a,int start){o.Add(new List<int>(p));for(int i=start;i<a.Length;i++){if(i>start&&a[i]==a[i-1])continue;p.Add(a[i]);Dfs(a,i+1);p.RemoveAt(p.Count-1);}}public IList<IList<int>> SubsetsWithDup(int[]a){Array.Sort(a);Dfs(a,0);return o;}}

Julia
~~~~~

.. code-block:: julia

   function subsets_with_dup!(a)
       sort!(a);out=Vector{Vector{Int}}();path=Int[]
       function dfs(start)
           push!(out,copy(path))
           for index in start:length(a)
               index>start&&a[index]==a[index-1]&&continue
               push!(path,a[index]);dfs(index+1);pop!(path)
           end
       end
       dfs(1);out
   end

R
~

.. code-block:: r

   subsets_with_dup <- function(a){a<-sort(a);out<-list();path<-numeric();dfs<-function(start){out[[length(out)+1L]]<<-path;if(start<=length(a))for(index in start:length(a)){if(index>start&&a[[index]]==a[[index-1L]])next;path<<-c(path,a[[index]]);dfs(index+1L);path<<-head(path,-1L)}};dfs(1L);out}
