0039. Combination Sum
=====================

题目信息
--------

:题号: 0039
:题名: Combination Sum
:难度: Medium
:类型: Algorithms
:主题: 回溯、组合枚举、排序、可重复选择
:原题: `LeetCode 0039 <https://leetcode.com/problems/combination-sum/>`_
:教学重点: 非递减路径、递归起点、当前元素复用、正数剪枝、组合去重

题目重述
--------

给定互不相同的正整数数组 ``candidates`` 和正整数 ``target``。每个候选值可以使用任意次，返回所有和恰好为目标的不同组合。组合内部顺序不影响答案，因此 ``[2,2,3]`` 与 ``[3,2,2]`` 只能保留一个。

自建示例
--------

.. code-block:: text

   candidates = [2,3,5], target = 8
   答案：[2,2,2,2]、[2,3,3]、[3,5]

选择第一个 2 后，下一层仍可选择 2；路径一旦选择 3，后面不再回到 2，因此同一组合不会以其他排列出现。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <set>
   #include <vector>

   class Solution {
   private:
       void orderedDfs(
           const std::vector<int>& candidates,
           int remaining,
           std::vector<int>& path,
           std::set<std::vector<int>>& unique
       ) {
           if (remaining == 0) {
               std::vector<int> canonical = path;
               std::sort(canonical.begin(), canonical.end());
               unique.insert(canonical);
               return;
           }
           for (int value : candidates) if (value <= remaining) {
               path.push_back(value);
               orderedDfs(candidates, remaining - value, path, unique);
               path.pop_back();
           }
       }

       std::vector<std::vector<int>> enumerateThenDeduplicate(
           const std::vector<int>& candidates,
           int target
       ) {
           std::set<std::vector<int>> unique;
           std::vector<int> path;
           orderedDfs(candidates, target, path, unique);
           return {unique.begin(), unique.end()};
       }

       std::vector<std::vector<int>> dynamicProgramming(
           std::vector<int> candidates,
           int target
       ) {
           std::sort(candidates.begin(), candidates.end());
           std::vector<std::vector<std::vector<int>>> dp(target + 1);
           dp[0].push_back({});
           for (int value : candidates) {
               for (int sum = value; sum <= target; ++sum) {
                   for (const auto& prefix : dp[sum - value]) {
                       auto next = prefix;
                       next.push_back(value);
                       dp[sum].push_back(std::move(next));
                   }
               }
           }
           return dp[target];
       }

       void backtrack(
           const std::vector<int>& candidates,
           int start,
           int remaining,
           std::vector<int>& path,
           std::vector<std::vector<int>>& result
       ) {
           if (remaining == 0) {
               result.push_back(path);
               return;
           }
           for (int index = start; index < static_cast<int>(candidates.size()); ++index) {
               int value = candidates[index];
               if (value > remaining) break;
               path.push_back(value);
               backtrack(candidates, index, remaining - value, path, result);
               path.pop_back();
           }
       }

       std::vector<std::vector<int>> sortedBacktracking(
           std::vector<int> candidates,
           int target
       ) {
           std::sort(candidates.begin(), candidates.end());
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           backtrack(candidates, 0, target, path, result);
           return result;
       }

   public:
       std::vector<std::vector<int>> combinationSum(
           std::vector<int>& candidates,
           int target
       ) {
           return sortedBacktracking(candidates, target);
       }
   };

题解
----

枚举有序选择序列为何制造大量重复
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若每层都允许从全部候选重新选择，``[2,3,3]`` 会以 ``2,3,3``、``3,2,3``、``3,3,2`` 等多条路径出现。事后排序路径并放入集合可以去重，但搜索树已经为所有排列付出成本。

组合为什么可以规范为非递减序列
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

组合只关心每个值使用多少次，不关心顺序。任意组合都有唯一的非递减表示。将候选排序，并规定递归后续只能选择当前下标或更大的下标，就只搜索这种规范表示，重复排列不会进入搜索树。

递归状态保存什么
~~~~~~~~~~~~~~~~

``search(start, remaining)`` 表示：当前路径已经确定，后续只允许使用 ``start`` 及之后的候选，且需要补出和值 ``remaining``。路径始终非递减，并保持：

.. math::

   sum(path)+remaining=target

为什么递归继续传入 index
~~~~~~~~~~~~~~~~~~~~~~~~

选择 ``candidates[index]`` 后传入同一个 ``index``，表示该值仍可再次使用。例如 ``[2,2,3]`` 连续两次选择下标 0。若传入 ``index+1``，每个数组位置最多使用一次，选择模型就变成第 40 题。

正数与排序如何产生剪枝
~~~~~~~~~~~~~~~~~~~~~~

候选均为正数，``remaining`` 每次严格减小。数组已排序时，一旦当前 ``value > remaining``，后面更大的值也全部无法使用，可直接结束本层循环，而不是逐个继续判断。

搜索树局部展开
~~~~~~~~~~~~~~

.. code-block:: text

   remaining=8, start=0
   ├─ 选2 -> remaining=6, start=0
   │  ├─ 选2 -> ... -> [2,2,2,2]
   │  └─ 选3 -> ... -> [2,3,3]
   ├─ 选3 -> remaining=5, start=1
   │  └─ 选5 -> [3,5]
   └─ 选5 -> remaining=3, 后续候选均过大

为什么答案不重不漏
~~~~~~~~~~~~~~~~~~

合法性：只在 ``remaining==0`` 时保存，所有路径元素来自候选数组，所以和值准确。

不重复：下标单调不减，路径只能是非递减序列；同一多重集合只有一种非递减排列。

完整性：任取合法组合并排序为非递减序列。根层会枚举其首值；重复值可因传入当前下标继续选择；后续更大值下标不减，所以整条路径都存在，最终剩余量归零。

动态规划版本的取舍
~~~~~~~~~~~~~~~~~~

按候选值外层、和值内层递增，可逐步构造只使用已处理候选的组合，天然支持重复使用当前值。它避免递归，但需要保存所有中间和值的完整组合，字符串或数组复制较多。回溯只维护一条当前路径，更适合输出枚举。

复杂度来源
~~~~~~~~~~

搜索树最坏为输出敏感的指数级。若最小候选为 ``m``，递归深度最多 ``target/m``；不计输出，路径和调用栈空间为同阶。每个答案还需要复制其路径。排序为 ``O(n log n)``。

九语言实现
----------

C
~

.. code-block:: c

   struct Result { int **rows,*sizes,count,capacity,*path,path_len; };
   static int cmp_int(const void *a,const void *b){int x=*(const int*)a,y=*(const int*)b;return(x>y)-(x<y);}
   static void save(struct Result *r){
       if(r->count==r->capacity){r->capacity*=2;r->rows=realloc(r->rows,(size_t)r->capacity*sizeof(int*));r->sizes=realloc(r->sizes,(size_t)r->capacity*sizeof(int));}
       int *copy=malloc((size_t)r->path_len*sizeof(int));memcpy(copy,r->path,(size_t)r->path_len*sizeof(int));
       r->rows[r->count]=copy;r->sizes[r->count++]=r->path_len;
   }
   static void dfs(int *a,int n,int start,int remain,struct Result *r){
       if(remain==0){save(r);return;}
       for(int i=start;i<n;i++){if(a[i]>remain)break;r->path[r->path_len++]=a[i];dfs(a,n,i,remain-a[i],r);r->path_len--;}
   }
   int **combinationSum(int *a,int n,int target,int *returnSize,int **returnColumnSizes){
       qsort(a,(size_t)n,sizeof(int),cmp_int);struct Result r;
       r.count=0;r.capacity=16;r.path_len=0;r.rows=malloc(16*sizeof(int*));r.sizes=malloc(16*sizeof(int));r.path=malloc((size_t)(target/a[0]+1)*sizeof(int));
       dfs(a,n,0,target,&r);free(r.path);*returnSize=r.count;*returnColumnSizes=r.sizes;return r.rows;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
           candidates.sort(); result, path = [], []
           def dfs(start: int, remaining: int) -> None:
               if remaining == 0:
                   result.append(path.copy()); return
               for index in range(start, len(candidates)):
                   value = candidates[index]
                   if value > remaining: break
                   path.append(value); dfs(index, remaining - value); path.pop()
           dfs(0, target); return result

Java
~~~~

.. code-block:: java

   class Solution {
       List<List<Integer>> result=new ArrayList<>();List<Integer> path=new ArrayList<>();int[] values;
       void dfs(int start,int remaining){if(remaining==0){result.add(new ArrayList<>(path));return;}
           for(int i=start;i<values.length;i++){if(values[i]>remaining)break;path.add(values[i]);dfs(i,remaining-values[i]);path.remove(path.size()-1);}}
       public List<List<Integer>> combinationSum(int[] candidates,int target){Arrays.sort(candidates);values=candidates;dfs(0,target);return result;}
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn combination_sum(mut candidates: Vec<i32>, target: i32) -> Vec<Vec<i32>> {
           fn dfs(a:&[i32],start:usize,remaining:i32,path:&mut Vec<i32>,out:&mut Vec<Vec<i32>>){
               if remaining==0{out.push(path.clone());return}for i in start..a.len(){if a[i]>remaining{break}path.push(a[i]);dfs(a,i,remaining-a[i],path,out);path.pop();}}
           candidates.sort();let mut out=vec![];dfs(&candidates,0,target,&mut vec![],&mut out);out
       }
   }

Go
~~

.. code-block:: go

   func combinationSum(candidates []int,target int)[][]int{sort.Ints(candidates);result:=[][]int{};path:=[]int{}
       var dfs func(int,int);dfs=func(start,remaining int){if remaining==0{copyPath:=append([]int(nil),path...);result=append(result,copyPath);return};for i:=start;i<len(candidates);i++{value:=candidates[i];if value>remaining{break};path=append(path,value);dfs(i,remaining-value);path=path[:len(path)-1]}}
       dfs(0,target);return result}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function combinationSum(candidates:number[],target:number):number[][]{candidates.sort((a,b)=>a-b);const result:number[][]=[],path:number[]=[];
       const dfs=(start:number,remaining:number):void=>{if(remaining===0){result.push([...path]);return;}for(let i=start;i<candidates.length;i++){const value=candidates[i];if(value>remaining)break;path.push(value);dfs(i,remaining-value);path.pop();}};
       dfs(0,target);return result;}

C#
~~

.. code-block:: csharp

   public class Solution {List<IList<int>> result=new();List<int> path=new();int[] values;
       void Dfs(int start,int remaining){if(remaining==0){result.Add(new List<int>(path));return;}for(int i=start;i<values.Length;i++){if(values[i]>remaining)break;path.Add(values[i]);Dfs(i,remaining-values[i]);path.RemoveAt(path.Count-1);}}
       public IList<IList<int>> CombinationSum(int[] candidates,int target){System.Array.Sort(candidates);values=candidates;Dfs(0,target);return result;}}

Julia
~~~~~

.. code-block:: julia

   function combination_sum(candidates::Vector{Int},target::Int)
       sort!(candidates);result=Vector{Vector{Int}}();path=Int[]
       function dfs(start,remaining)
           remaining==0&&(push!(result,copy(path));return)
           for i in start:length(candidates)
               value=candidates[i];value>remaining&&break;push!(path,value);dfs(i,remaining-value);pop!(path)
           end
       end
       dfs(1,target);result
   end

R
~

.. code-block:: r

   combination_sum <- function(candidates,target){candidates<-sort(candidates);result<-list();path<-integer()
     dfs<-function(start,remaining){if(remaining==0L){result[[length(result)+1L]]<<-path;return()};if(start<=length(candidates))for(i in start:length(candidates)){value<-candidates[[i]];if(value>remaining)break;path<<-c(path,value);dfs(i,remaining-value);path<<-path[-length(path)]}}
     dfs(1L,target);result
   }