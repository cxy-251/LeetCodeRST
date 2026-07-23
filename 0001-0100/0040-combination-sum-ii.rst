0040. Combination Sum II
========================

题目信息
--------

:题号: 0040
:难度: Medium
:主题: 回溯、排序、同层去重、一次性选择
:原题: `LeetCode 0040 <https://leetcode.com/problems/combination-sum-ii/>`_
:重点: 下标只用一次、同层跳过重复值、不同层允许相同值、排序剪枝

题目重述
--------

给定正整数数组 ``candidates`` 和目标值 ``target``。数组可能包含重复值，但每个数组位置最多使用一次。返回所有和值为目标的不同数值组合；不同下标若形成相同数值序列，也只能保留一个答案。

自建示例
--------

.. code-block:: text

   输入：candidates = [1,1,1,2], target = 3
   输出：[[1,1,1],[1,2]]

三个值为 1 的元素来自不同下标。根层只保留一个以 1 开始的分支，避免重复输出 ``[1,2]``；进入下一层后仍可继续选择后续的 1，因此 ``[1,1,1]`` 不会被错误删除。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <map>
   #include <set>
   #include <vector>

   class Solution {
   private:
       void subsetDfs(
           const std::vector<int>& candidates,
           int index,
           int remaining,
           std::vector<int>& path,
           std::set<std::vector<int>>& unique
       ) {
           if (remaining == 0) {
               auto canonical = path;
               std::sort(canonical.begin(), canonical.end());
               unique.insert(canonical);
               return;
           }
           if (index == static_cast<int>(candidates.size()) || remaining < 0) return;
           subsetDfs(candidates, index + 1, remaining, path, unique);
           path.push_back(candidates[index]);
           subsetDfs(candidates, index + 1, remaining - candidates[index], path, unique);
           path.pop_back();
       }

       std::vector<std::vector<int>> enumerateSubsetsThenDeduplicate(
           const std::vector<int>& candidates,
           int target
       ) {
           std::set<std::vector<int>> unique;
           std::vector<int> path;
           subsetDfs(candidates, 0, target, path, unique);
           return {unique.begin(), unique.end()};
       }

       void frequencyDfs(
           const std::vector<std::pair<int,int>>& groups,
           int group,
           int remaining,
           std::vector<int>& path,
           std::vector<std::vector<int>>& result
       ) {
           if (remaining == 0) { result.push_back(path); return; }
           if (group == static_cast<int>(groups.size())) return;
           auto [value, count] = groups[group];
           int maximum = std::min(count, remaining / value);
           for (int used = 0; used <= maximum; ++used) {
               for (int k = 0; k < used; ++k) path.push_back(value);
               frequencyDfs(groups, group + 1, remaining - used * value, path, result);
               for (int k = 0; k < used; ++k) path.pop_back();
           }
       }

       std::vector<std::vector<int>> frequencyGroups(
           const std::vector<int>& candidates,
           int target
       ) {
           std::map<int,int> counts;
           for (int value : candidates) ++counts[value];
           std::vector<std::pair<int,int>> groups(counts.begin(), counts.end());
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           frequencyDfs(groups, 0, target, path, result);
           return result;
       }

       void backtrack(
           const std::vector<int>& candidates,
           int start,
           int remaining,
           std::vector<int>& path,
           std::vector<std::vector<int>>& result
       ) {
           if (remaining == 0) { result.push_back(path); return; }
           for (int index = start; index < static_cast<int>(candidates.size()); ++index) {
               if (index > start && candidates[index] == candidates[index - 1]) continue;
               int value = candidates[index];
               if (value > remaining) break;
               path.push_back(value);
               backtrack(candidates, index + 1, remaining - value, path, result);
               path.pop_back();
           }
       }

       std::vector<std::vector<int>> sortedSameLevelDedup(
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
       std::vector<std::vector<int>> combinationSum2(
           std::vector<int>& candidates,
           int target
       ) {
           return sortedSameLevelDedup(candidates, target);
       }
   };

题解
----

下标子集为何仍产生数值重复
~~~~~~~~~~~~~~~~~~~~~~~~~~

每个下标只有“选或不选”，共有最多 ``2^n`` 个子集。重复值来自不同下标时，多组子集可能形成相同数值序列。例如选择 ``1a`` 或 ``1b`` 再选择 2 都得到 ``[1,2]``。事后集合去重正确，但先生成了等价分支。

排序如何让等价分支相邻
~~~~~~~~~~~~~~~~~~~~~~

排序后相同值连续。固定当前路径和递归起点时，多个相同值作为“本层下一选择”会生成相同的数值前缀。只保留本层第一个相同值即可覆盖这组等价分支。

为什么去重条件必须是 index > start
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

条件：

.. code-block:: text

   index > start 且 candidates[index] == candidates[index-1]

只跳过同一层中第二个及之后的相同值。选择 ``1a`` 进入下一层后，``start`` 移到 ``1b``；此时 ``index == start``，所以 ``1b`` 可以被选择，合法组合中的重复数值得以保留。

若误写为 ``index > 0``，深层的 ``1b``、``1c`` 也会被全局跳过，``[1,1,1]`` 等答案将丢失。

为什么递归传入 index + 1
~~~~~~~~~~~~~~~~~~~~~~~~

本题限制每个数组位置最多使用一次。选择 ``index`` 后，下一层只能从后续下标开始，因此传入 ``index+1``。第 39 题传入当前 ``index``，代表候选值可无限复用；这是两题最核心的状态差异。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 层级
     - 可选后缀
     - 选择
     - 去重行为
   * - 根层
     - ``1a,1b,1c,2``
     - 选择 ``1a``
     - 跳过 ``1b``、``1c`` 的等价根分支
   * - 第二层
     - ``1b,1c,2``
     - 可选择 ``1b``
     - ``1b`` 是本层第一个 1
   * - 第三层
     - ``1c,2``
     - 可选择 ``1c``
     - 得到 ``[1,1,1]``

排序为什么还能提供和值剪枝
~~~~~~~~~~~~~~~~~~~~~~~~~~

所有值为正。若当前值已经大于 ``remaining``，后续值只会更大，本层可直接结束。每次选择后剩余量严格减小，搜索不会形成循环。

为什么同层跳过不漏解
~~~~~~~~~~~~~~~~~~~~

固定路径前缀时，若后面的相同值作为本层首选，得到的数值前缀与第一个相同值完全一致，而且它可使用的后缀更短，不可能产生第一个分支无法产生的新数值组合。任意使用后面等值下标的解，都可把该层选择替换为最早可用等值下标，剩余选择仍然可用。

频次分组方法的取舍
~~~~~~~~~~~~~~~~~~

把相同值压缩为 ``(value,count)``，每组枚举使用 0 至 ``count`` 次，可从模型上消除重复下标身份。它同样正确，但构造路径时要批量追加和撤销，标准排序回溯更接近常见组合搜索模板。

复杂度来源
~~~~~~~~~~

排序为 ``O(n log n)``。下标子集上界为 ``2^n``，实际搜索被和值与重复值剪枝缩小；复制答案还需其总长度。递归深度和路径长度最多 ``n``，不计输出的额外空间 ``O(n)``。

九语言实现
----------

C
~

.. code-block:: c

   struct Result { int **rows,*sizes,count,capacity,*path,path_len; };
   static int cmp_int(const void *a,const void *b){int x=*(const int*)a,y=*(const int*)b;return(x>y)-(x<y);}
   static void save(struct Result *r){if(r->count==r->capacity){r->capacity*=2;r->rows=realloc(r->rows,(size_t)r->capacity*sizeof(int*));r->sizes=realloc(r->sizes,(size_t)r->capacity*sizeof(int));}int *copy=malloc((size_t)r->path_len*sizeof(int));memcpy(copy,r->path,(size_t)r->path_len*sizeof(int));r->rows[r->count]=copy;r->sizes[r->count++]=r->path_len;}
   static void dfs(int *a,int n,int start,int remain,struct Result *r){if(remain==0){save(r);return;}for(int i=start;i<n;i++){if(i>start&&a[i]==a[i-1])continue;if(a[i]>remain)break;r->path[r->path_len++]=a[i];dfs(a,n,i+1,remain-a[i],r);r->path_len--;}}
   int **combinationSum2(int *a,int n,int target,int *returnSize,int **returnColumnSizes){qsort(a,(size_t)n,sizeof(int),cmp_int);struct Result r={0};r.capacity=16;r.rows=malloc(16*sizeof(int*));r.sizes=malloc(16*sizeof(int));r.path=malloc((size_t)n*sizeof(int));dfs(a,n,0,target,&r);free(r.path);*returnSize=r.count;*returnColumnSizes=r.sizes;return r.rows;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def combinationSum2(self, candidates: list[int], target: int) -> list[list[int]]:
           candidates.sort(); result, path = [], []
           def dfs(start: int, remaining: int) -> None:
               if remaining == 0:
                   result.append(path.copy()); return
               for index in range(start, len(candidates)):
                   if index > start and candidates[index] == candidates[index - 1]:
                       continue
                   value = candidates[index]
                   if value > remaining: break
                   path.append(value); dfs(index + 1, remaining - value); path.pop()
           dfs(0, target); return result

Java
~~~~

.. code-block:: java

   class Solution {List<List<Integer>> result=new ArrayList<>();List<Integer> path=new ArrayList<>();int[] values;
       void dfs(int start,int remain){if(remain==0){result.add(new ArrayList<>(path));return;}for(int i=start;i<values.length;i++){if(i>start&&values[i]==values[i-1])continue;if(values[i]>remain)break;path.add(values[i]);dfs(i+1,remain-values[i]);path.remove(path.size()-1);}}
       public List<List<Integer>> combinationSum2(int[] candidates,int target){Arrays.sort(candidates);values=candidates;dfs(0,target);return result;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn combination_sum2(mut a:Vec<i32>,target:i32)->Vec<Vec<i32>>{
       fn dfs(a:&[i32],start:usize,remain:i32,path:&mut Vec<i32>,out:&mut Vec<Vec<i32>>){if remain==0{out.push(path.clone());return}for i in start..a.len(){if i>start&&a[i]==a[i-1]{continue}if a[i]>remain{break}path.push(a[i]);dfs(a,i+1,remain-a[i],path,out);path.pop();}}
       a.sort();let mut out=vec![];dfs(&a,0,target,&mut vec![],&mut out);out}}

Go
~~

.. code-block:: go

   func combinationSum2(a []int,target int)[][]int{sort.Ints(a);result:=[][]int{};path:=[]int{};var dfs func(int,int);dfs=func(start,remain int){if remain==0{result=append(result,append([]int(nil),path...));return};for i:=start;i<len(a);i++{if i>start&&a[i]==a[i-1]{continue};if a[i]>remain{break};path=append(path,a[i]);dfs(i+1,remain-a[i]);path=path[:len(path)-1]}};dfs(0,target);return result}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function combinationSum2(a:number[],target:number):number[][]{a.sort((x,y)=>x-y);const result:number[][]=[],path:number[]=[];const dfs=(start:number,remain:number):void=>{if(remain===0){result.push([...path]);return;}for(let i=start;i<a.length;i++){if(i>start&&a[i]===a[i-1])continue;if(a[i]>remain)break;path.push(a[i]);dfs(i+1,remain-a[i]);path.pop();}};dfs(0,target);return result;}

C#
~~

.. code-block:: csharp

   public class Solution {List<IList<int>> result=new();List<int> path=new();int[] values;
       void Dfs(int start,int remain){if(remain==0){result.Add(new List<int>(path));return;}for(int i=start;i<values.Length;i++){if(i>start&&values[i]==values[i-1])continue;if(values[i]>remain)break;path.Add(values[i]);Dfs(i+1,remain-values[i]);path.RemoveAt(path.Count-1);}}
       public IList<IList<int>> CombinationSum2(int[] candidates,int target){System.Array.Sort(candidates);values=candidates;Dfs(0,target);return result;}}

Julia
~~~~~

.. code-block:: julia

   function combination_sum2(a::Vector{Int},target::Int)
       sort!(a);result=Vector{Vector{Int}}();path=Int[]
       function dfs(start,remain)
           if remain==0;push!(result,copy(path));return;end
           for i in start:length(a)
               i>start&&a[i]==a[i-1]&&continue
               a[i]>remain&&break
               push!(path,a[i]);dfs(i+1,remain-a[i]);pop!(path)
           end
       end
       dfs(1,target);result
   end

R
~

.. code-block:: r

   combination_sum2 <- function(a,target){a<-sort(a);result<-list();path<-integer()
     dfs<-function(start,remain){if(remain==0L){result[[length(result)+1L]]<<-path;return()};if(start<=length(a))for(i in start:length(a)){if(i>start&&a[[i]]==a[[i-1L]])next;if(a[[i]]>remain)break;path<<-c(path,a[[i]]);dfs(i+1L,remain-a[[i]]);path<<-path[-length(path)]}}
     dfs(1L,target);result
   }
