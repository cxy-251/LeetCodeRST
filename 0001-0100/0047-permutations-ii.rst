0047. Permutations II
=====================

题目信息
--------

:题号: 0047
:难度: Medium
:主题: 回溯、排序、重复值、同层去重
:原题: `LeetCode 0047 <https://leetcode.com/problems/permutations-ii/>`_
:重点: 等值分支、used 状态、同层跳过、唯一排列证明

题目重述
--------

给定可能含重复值的整数数组，返回所有不同排列。每个输入下标在一个排列中恰好使用一次；来自不同下标但数值序列相同的排列只能输出一次。

自建示例
--------

.. code-block:: text

   [1,1,2] -> [1,1,2] [1,2,1] [2,1,1]
   [5,5,5] -> [5,5,5]

把两个 1 标记为 ``1a``、``1b`` 时，根层分别选择它们会得到等价子树；但选择 ``1a`` 后，下一层仍必须允许选择 ``1b``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <set>
   #include <unordered_set>
   #include <vector>

   class Solution {
   private:
       void allDfs(std::vector<int>& nums, int position, std::set<std::vector<int>>& unique) {
           if (position == static_cast<int>(nums.size())) { unique.insert(nums); return; }
           for (int i = position; i < static_cast<int>(nums.size()); ++i) {
               std::swap(nums[position], nums[i]);
               allDfs(nums, position + 1, unique);
               std::swap(nums[position], nums[i]);
           }
       }

       std::vector<std::vector<int>> generateThenDeduplicate(std::vector<int> nums) {
           std::set<std::vector<int>> unique;
           allDfs(nums, 0, unique);
           return {unique.begin(), unique.end()};
       }

       void levelSetDfs(std::vector<int>& nums, int position, std::vector<std::vector<int>>& result) {
           if (position == static_cast<int>(nums.size())) { result.push_back(nums); return; }
           std::unordered_set<int> chosen;
           for (int i = position; i < static_cast<int>(nums.size()); ++i) {
               if (!chosen.insert(nums[i]).second) continue;
               std::swap(nums[position], nums[i]);
               levelSetDfs(nums, position + 1, result);
               std::swap(nums[position], nums[i]);
           }
       }

       void sortedDfs(
           const std::vector<int>& nums,
           std::vector<char>& used,
           std::vector<int>& path,
           std::vector<std::vector<int>>& result
       ) {
           if (path.size() == nums.size()) { result.push_back(path); return; }
           for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
               if (used[i]) continue;
               if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) continue;
               used[i] = true; path.push_back(nums[i]);
               sortedDfs(nums, used, path, result);
               path.pop_back(); used[i] = false;
           }
       }

       std::vector<std::vector<int>> sortedUsed(std::vector<int> nums) {
           std::sort(nums.begin(), nums.end());
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           std::vector<char> used(nums.size(), false);
           sortedDfs(nums, used, path, result);
           return result;
       }

   public:
       std::vector<std::vector<int>> permuteUnique(std::vector<int>& nums) {
           return sortedUsed(nums);
       }
   };

题解
----

为什么普通排列会生成重复叶子
~~~~~~~~~~~~~~~~~~~~~~~~~~

若相同值来自不同下标，搜索树把它们视为不同候选。例如根层选择 ``1a`` 或 ``1b``，剩余多重集合完全相同，最终数值排列重复。事后使用集合能去重，却仍遍历了所有 ``n!`` 个下标排列。

同层集合如何直接删除等价分支
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

固定当前位置和前缀时，只要某个数值已经被本层选过，另一个相同值交换到当前位置会产生同样的数值前缀和同样的剩余多重集合。每层维护 ``chosen`` 即可跳过重复值，但每层额外创建哈希集合。

排序与 used 如何表达候选身份
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

排序使相同值相邻，``used[i]`` 表示输入下标 ``i`` 是否已在当前路径中。去重条件为：

.. code-block:: text

   i > 0
   nums[i] == nums[i-1]
   used[i-1] == false

前一个等值下标尚未使用，说明它仍与当前下标同属本层候选；本层应只允许较早下标代表这个数值。

为什么前一个等值下标已使用时不能跳过
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若 ``used[i-1]`` 为真，前一个副本已经位于路径更高层。当前层选择后一个副本是在组合多个相同值，而不是启动等价同层分支。对 ``[1a,1b,2]``，选择 ``1a`` 后必须允许 ``1b``，才能生成 ``[1,1,2]``。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 层级
     - 路径
     - 候选
     - 去重判断
   * - 根层
     - ``[]``
     - ``1a,1b,2``
     - 选 1a 后跳过 1b
   * - 第二层
     - ``[1a]``
     - ``1b,2``
     - ``used[1a]=true``，允许 1b
   * - 第三层
     - ``[1a,1b]``
     - ``2``
     - 生成 ``[1,1,2]``

为什么不会遗漏唯一排列
~~~~~~~~~~~~~~~~~~~~~~

任意数值排列都可把相同值的下标按升序分配到它们出现的位置。该规范下标序列永远不会触发“前一个等值下标未使用”的跳过条件，因此对应路径保留。其他下标分配只会生成相同数值排列，被安全删除。

复杂度来源
~~~~~~~~~~

若不同排列数为 ``P``，复制输出需要 ``O(Pn)``。排序为 ``O(n log n)``，递归栈、路径和 ``used`` 为 ``O(n)``。全部不同值时 ``P=n!``；重复值会减少叶子数。

九语言实现
----------

C
~

.. code-block:: c

   static int cmp(const void*a,const void*b){int x=*(const int*)a,y=*(const int*)b;return(x>y)-(x<y);}static void dfs(int*a,int n,bool*used,int*path,int depth,int***rows,int*count,int*cap){if(depth==n){if(*count==*cap){*cap*=2;*rows=realloc(*rows,(size_t)*cap*sizeof(int*));}int*copy=malloc((size_t)n*sizeof(int));memcpy(copy,path,(size_t)n*sizeof(int));(*rows)[(*count)++]=copy;return;}for(int i=0;i<n;i++){if(used[i])continue;if(i>0&&a[i]==a[i-1]&&!used[i-1])continue;used[i]=true;path[depth]=a[i];dfs(a,n,used,path,depth+1,rows,count,cap);used[i]=false;}}
   int**permuteUnique(int*a,int n,int*returnSize,int**returnColumnSizes){qsort(a,(size_t)n,sizeof(int),cmp);bool*used=calloc((size_t)n,sizeof(bool));int*path=malloc((size_t)n*sizeof(int));int cap=16,count=0;int**rows=malloc(16*sizeof(int*));dfs(a,n,used,path,0,&rows,&count,&cap);int*sizes=malloc((size_t)count*sizeof(int));for(int i=0;i<count;i++)sizes[i]=n;free(used);free(path);*returnSize=count;*returnColumnSizes=sizes;return rows;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def permuteUnique(self, nums: list[int]) -> list[list[int]]:
           nums.sort(); used=[False]*len(nums); path=[]; result=[]
           def dfs():
               if len(path)==len(nums): result.append(path.copy()); return
               for i,value in enumerate(nums):
                   if used[i] or (i>0 and value==nums[i-1] and not used[i-1]): continue
                   used[i]=True;path.append(value);dfs();path.pop();used[i]=False
           dfs();return result

Java
~~~~

.. code-block:: java

   class Solution {List<List<Integer>>out=new ArrayList<>();List<Integer>path=new ArrayList<>();int[]a;boolean[]used;void dfs(){if(path.size()==a.length){out.add(new ArrayList<>(path));return;}for(int i=0;i<a.length;i++){if(used[i]||(i>0&&a[i]==a[i-1]&&!used[i-1]))continue;used[i]=true;path.add(a[i]);dfs();path.remove(path.size()-1);used[i]=false;}}public List<List<Integer>> permuteUnique(int[]nums){Arrays.sort(nums);a=nums;used=new boolean[nums.length];dfs();return out;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn permute_unique(mut a:Vec<i32>)->Vec<Vec<i32>>{fn dfs(a:&[i32],used:&mut Vec<bool>,path:&mut Vec<i32>,out:&mut Vec<Vec<i32>>){if path.len()==a.len(){out.push(path.clone());return}for i in 0..a.len(){if used[i]||(i>0&&a[i]==a[i-1]&&!used[i-1]){continue}used[i]=true;path.push(a[i]);dfs(a,used,path,out);path.pop();used[i]=false}}a.sort();let mut out=vec![];dfs(&a,&mut vec![false;a.len()],&mut vec![],&mut out);out}}

Go
~~

.. code-block:: go

   func permuteUnique(a []int)[][]int{sort.Ints(a);used:=make([]bool,len(a));path:=[]int{};out:=[][]int{};var dfs func();dfs=func(){if len(path)==len(a){out=append(out,append([]int(nil),path...));return};for i,v:=range a{if used[i]||(i>0&&v==a[i-1]&&!used[i-1]){continue};used[i]=true;path=append(path,v);dfs();path=path[:len(path)-1];used[i]=false}};dfs();return out}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function permuteUnique(a:number[]):number[][]{a.sort((x,y)=>x-y);const used=Array(a.length).fill(false),path:number[]=[],out:number[][]=[];const dfs=()=>{if(path.length===a.length){out.push([...path]);return;}for(let i=0;i<a.length;i++){if(used[i]||(i>0&&a[i]===a[i-1]&&!used[i-1]))continue;used[i]=true;path.push(a[i]);dfs();path.pop();used[i]=false;}};dfs();return out;}

C#
~~

.. code-block:: csharp

   public class Solution {IList<IList<int>>out=new List<IList<int>>();List<int>path=new();int[]a;bool[]used;void Dfs(){if(path.Count==a.Length){out.Add(new List<int>(path));return;}for(int i=0;i<a.Length;i++){if(used[i]||(i>0&&a[i]==a[i-1]&&!used[i-1]))continue;used[i]=true;path.Add(a[i]);Dfs();path.RemoveAt(path.Count-1);used[i]=false;}}public IList<IList<int>> PermuteUnique(int[]nums){Array.Sort(nums);a=nums;used=new bool[a.Length];Dfs();return out;}}

Julia
~~~~~

.. code-block:: julia

   function unique_permutations(a::Vector{Int})
       sort!(a);used=falses(length(a));path=Int[];out=Vector{Vector{Int}}()
       function dfs();length(path)==length(a)&&(push!(out,copy(path));return);for i in eachindex(a);(used[i]||(i>1&&a[i]==a[i-1]&&!used[i-1]))&&continue;used[i]=true;push!(path,a[i]);dfs();pop!(path);used[i]=false;end;end
       dfs();out
   end

R
~

.. code-block:: r

   unique_permutations <- function(a){a<-sort(a);used<-rep(FALSE,length(a));path<-integer();out<-list();dfs<-function(){if(length(path)==length(a)){out[[length(out)+1L]]<<-path;return()};for(i in seq_along(a)){if(used[[i]]||(i>1L&&a[[i]]==a[[i-1L]]&&!used[[i-1L]]))next;used[[i]]<<-TRUE;path<<-c(path,a[[i]]);dfs();path<<-path[-length(path)];used[[i]]<<-FALSE}};dfs();out}