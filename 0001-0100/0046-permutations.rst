0046. Permutations
==================

题目信息
--------

:题号: 0046
:题名: Permutations
:难度: Medium
:类型: Algorithms
:主题: 回溯、排列、原地交换、搜索树
:原题: `LeetCode 0046 <https://leetcode.com/problems/permutations/>`_
:教学重点: 位置决策、候选集合、交换与撤销、输出敏感复杂度

题目重述
--------

给定一个不含重复值的整数数组 ``nums``，返回它的所有可能排列。每个排列都必须使用数组中的全部元素，并且每个元素恰好出现一次；结果顺序不作要求。

自建示例
--------

.. code-block:: text

   [1,2,3] ->
   [1,2,3] [1,3,2]
   [2,1,3] [2,3,1]
   [3,2,1] [3,1,2]

.. code-block:: text

   [7] -> [[7]]

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       void usedDfs(
           const std::vector<int>& nums,
           std::vector<char>& used,
           std::vector<int>& path,
           std::vector<std::vector<int>>& result
       ) {
           if (path.size() == nums.size()) { result.push_back(path); return; }
           for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
               if (used[i]) continue;
               used[i] = true; path.push_back(nums[i]);
               usedDfs(nums, used, path, result);
               path.pop_back(); used[i] = false;
           }
       }

       std::vector<std::vector<int>> usedArray(const std::vector<int>& nums) {
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           std::vector<char> used(nums.size(), false);
           usedDfs(nums, used, path, result);
           return result;
       }

       void swapDfs(std::vector<int>& nums, int position, std::vector<std::vector<int>>& result) {
           if (position == static_cast<int>(nums.size())) { result.push_back(nums); return; }
           for (int candidate = position; candidate < static_cast<int>(nums.size()); ++candidate) {
               std::swap(nums[position], nums[candidate]);
               swapDfs(nums, position + 1, result);
               std::swap(nums[position], nums[candidate]);
           }
       }

       std::vector<std::vector<int>> swapBacktrack(std::vector<int> nums) {
           std::vector<std::vector<int>> result;
           swapDfs(nums, 0, result);
           return result;
       }

       std::vector<std::vector<int>> iterativeInsert(const std::vector<int>& nums) {
           std::vector<std::vector<int>> result(1);
           for (int value : nums) {
               std::vector<std::vector<int>> next;
               for (const auto& permutation : result) {
                   for (int position = 0; position <= static_cast<int>(permutation.size()); ++position) {
                       auto copy = permutation;
                       copy.insert(copy.begin() + position, value);
                       next.push_back(std::move(copy));
                   }
               }
               result = std::move(next);
           }
           return result;
       }

   public:
       std::vector<std::vector<int>> permute(std::vector<int>& nums) {
           return swapBacktrack(nums);
       }
   };

题解
----

排列为什么适合按位置建立搜索树
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

第 0 位可以选择任意元素；确定后，第 1 位从剩余元素选择，直到所有位置固定。深度为 ``n``，第 ``k`` 层有 ``n-k`` 个候选，每个根到叶路径对应一个排列。

used 数组与交换方法保存了什么
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``used`` 方法显式记录哪些输入下标已经进入路径。交换方法把同样信息编码进数组边界：

.. code-block:: text

   nums[0:position]   已确定前缀
   nums[position:n]  尚未使用的候选

把候选交换到 ``position`` 后，它自然离开未使用后缀，无需额外布尔数组。

交换后为什么必须恢复
~~~~~~~~~~~~~~~~~~~~

递归返回时，当前候选的整棵子树已完成。交换回来可恢复进入本层前的候选顺序，使下一个候选从相同父状态出发。若不撤销，兄弟分支会继承上一个分支的修改，候选集合含义被破坏。

三元素搜索树前两层
~~~~~~~~~~~~~~~~~~

.. code-block:: text

   position 0: 选择 1 / 2 / 3
   选择 1 后：position 1 选择 2 / 3
       1,2 -> 追加 3
       1,3 -> 追加 2

其他首元素完全对称。输入无重复值，因此同一层的每个候选值不同，不需要去重集合。

为什么所有排列恰好生成一次
~~~~~~~~~~~~~~~~~~~~~~~~~~

任意排列有唯一的逐位置选择序列。交换回溯在每一层枚举当前后缀中的所有元素，所以该序列对应的分支一定存在。两个不同排列至少在某个最早位置选择不同元素，它们在该层进入不同分支，因此不会生成同一叶子。

迭代插入方法如何构造相同集合
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

处理一个新元素时，把它插入每个旧排列的所有位置。长度 ``k-1`` 的每个排列产生 ``k`` 个新排列；删除新元素后又能唯一恢复旧排列和插入位置，因此不会漏解或重复。

复杂度来源
~~~~~~~~~~

共有 ``n!`` 个答案，每个答案复制 ``n`` 个元素，时间和输出空间至少 ``O(n*n!)``。交换回溯除递归栈外使用 ``O(n)`` 工作空间；``used`` 方法再使用 ``O(n)`` 标记。

九语言实现
----------

C
~

.. code-block:: c

   static void dfs(int *nums,int n,int pos,int ***rows,int *count,int *capacity){if(pos==n){if(*count==*capacity){*capacity*=2;*rows=realloc(*rows,(size_t)*capacity*sizeof(int*));}int *copy=malloc((size_t)n*sizeof(int));memcpy(copy,nums,(size_t)n*sizeof(int));(*rows)[(*count)++]=copy;return;}for(int i=pos;i<n;i++){int t=nums[pos];nums[pos]=nums[i];nums[i]=t;dfs(nums,n,pos+1,rows,count,capacity);t=nums[pos];nums[pos]=nums[i];nums[i]=t;}}
   int **permute(int *nums,int n,int *returnSize,int **returnColumnSizes){int capacity=16,count=0;int **rows=malloc(16*sizeof(int*));dfs(nums,n,0,&rows,&count,&capacity);int *sizes=malloc((size_t)count*sizeof(int));for(int i=0;i<count;i++)sizes[i]=n;*returnSize=count;*returnColumnSizes=sizes;return rows;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def permute(self, nums: list[int]) -> list[list[int]]:
           result = []
           def dfs(position: int) -> None:
               if position == len(nums): result.append(nums.copy()); return
               for candidate in range(position, len(nums)):
                   nums[position], nums[candidate] = nums[candidate], nums[position]
                   dfs(position + 1)
                   nums[position], nums[candidate] = nums[candidate], nums[position]
           dfs(0)
           return result

Java
~~~~

.. code-block:: java

   class Solution {List<List<Integer>> result=new ArrayList<>();void dfs(int[] a,int pos){if(pos==a.length){List<Integer> row=new ArrayList<>();for(int v:a)row.add(v);result.add(row);return;}for(int i=pos;i<a.length;i++){int t=a[pos];a[pos]=a[i];a[i]=t;dfs(a,pos+1);t=a[pos];a[pos]=a[i];a[i]=t;}}public List<List<Integer>> permute(int[] nums){dfs(nums,0);return result;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn permute(mut nums:Vec<i32>)->Vec<Vec<i32>>{fn dfs(a:&mut Vec<i32>,pos:usize,out:&mut Vec<Vec<i32>>){if pos==a.len(){out.push(a.clone());return}for i in pos..a.len(){a.swap(pos,i);dfs(a,pos+1,out);a.swap(pos,i)}}let mut out=vec![];dfs(&mut nums,0,&mut out);out}}

Go
~~

.. code-block:: go

   func permute(nums []int)[][]int{result:=[][]int{};var dfs func(int);dfs=func(pos int){if pos==len(nums){result=append(result,append([]int(nil),nums...));return};for i:=pos;i<len(nums);i++{nums[pos],nums[i]=nums[i],nums[pos];dfs(pos+1);nums[pos],nums[i]=nums[i],nums[pos]}};dfs(0);return result}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function permute(nums:number[]):number[][]{const result:number[][]=[];const dfs=(pos:number):void=>{if(pos===nums.length){result.push([...nums]);return;}for(let i=pos;i<nums.length;i++){[nums[pos],nums[i]]=[nums[i],nums[pos]];dfs(pos+1);[nums[pos],nums[i]]=[nums[i],nums[pos]];}};dfs(0);return result;}

C#
~~

.. code-block:: csharp

   public class Solution {IList<IList<int>> result=new List<IList<int>>();void Dfs(int[] a,int pos){if(pos==a.Length){result.Add(new List<int>(a));return;}for(int i=pos;i<a.Length;i++){(a[pos],a[i])=(a[i],a[pos]);Dfs(a,pos+1);(a[pos],a[i])=(a[i],a[pos]);}}public IList<IList<int>> Permute(int[] nums){Dfs(nums,0);return result;}}

Julia
~~~~~

.. code-block:: julia

   function permutations!(nums::Vector{Int})
       result=Vector{Vector{Int}}()
       function dfs(pos)
           if pos>length(nums);push!(result,copy(nums));return;end
           for i in pos:length(nums);nums[pos],nums[i]=nums[i],nums[pos];dfs(pos+1);nums[pos],nums[i]=nums[i],nums[pos];end
       end
       dfs(1);result
   end

R
~

.. code-block:: r

   permutations <- function(nums){result<-list();dfs<-function(pos){if(pos>length(nums)){result[[length(result)+1L]]<<-nums;return()};for(i in pos:length(nums)){temporary<-nums[[pos]];nums[[pos]]<<-nums[[i]];nums[[i]]<<-temporary;dfs(pos+1L);temporary<-nums[[pos]];nums[[pos]]<<-nums[[i]];nums[[i]]<<-temporary}};dfs(1L);result}
