0078. Subsets
=============

题目信息
--------

:题号: 0078
:难度: Medium
:主题: 回溯、位掩码、迭代扩展、幂集
:原题: `LeetCode 0078 <https://leetcode.com/problems/subsets/>`_
:教学重点: 节点即答案、递增下标、结果翻倍、输出规模

题目重述
--------

给定元素互不相同的整数数组，返回所有子集，包括空集和全集。每个元素在子集中最多出现一次，结果不能重复，顺序不限。

自建示例
--------

.. code-block:: text

   nums=[2,5,9]
   [], [2], [5], [9], [2,5], [2,9], [5,9], [2,5,9]

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       std::vector<std::vector<int>> bitmask(const std::vector<int>& nums) {
           int n = nums.size();
           std::vector<std::vector<int>> result;
           for (int mask = 0; mask < (1 << n); ++mask) {
               std::vector<int> current;
               for (int bit = 0; bit < n; ++bit)
                   if (mask & (1 << bit)) current.push_back(nums[bit]);
               result.push_back(current);
           }
           return result;
       }

       std::vector<std::vector<int>> iterativeExpansion(const std::vector<int>& nums) {
           std::vector<std::vector<int>> result(1);
           for (int value : nums) {
               int old_size = result.size();
               for (int i = 0; i < old_size; ++i) {
                   auto next = result[i];
                   next.push_back(value);
                   result.push_back(std::move(next));
               }
           }
           return result;
       }

       void dfs(const std::vector<int>& nums, int start, std::vector<int>& path,
                std::vector<std::vector<int>>& result) {
           result.push_back(path);
           for (int index = start; index < static_cast<int>(nums.size()); ++index) {
               path.push_back(nums[index]);
               dfs(nums, index + 1, path, result);
               path.pop_back();
           }
       }

   public:
       std::vector<std::vector<int>> subsets(std::vector<int>& nums) {
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           dfs(nums, 0, path, result);
           return result;
       }
   };

题解
----

每个元素为什么对应一个二元选择
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对子集而言，每个输入元素只有“选择”或“不选择”两种状态，``n`` 个独立选择形成 ``2^n`` 个子集。位掩码的第 ``i`` 位可直接表示是否选择 ``nums[i]``。

为什么回溯节点本身就是答案
~~~~~~~~~~~~~~~~~~~~~~~~~~

组合题只有长度达到 ``k`` 的叶子是答案；本题允许任意长度，因此空路径、内部路径和叶子路径都代表合法子集。递归入口先保存路径，再继续扩展。

start 保存什么
~~~~~~~~~~~~~~

``start`` 是下一次允许选择的最小输入下标。选择下标 ``index`` 后递归到 ``index+1``，路径下标严格递增，同一个元素不会重复使用。

为什么递增下标保证唯一
~~~~~~~~~~~~~~~~~~~~~~

任意子集都对应唯一的输入下标递增序列。算法只生成递增序列，因此不会把同一集合以不同排列重复生成；元素互不相同，无需额外去重。

迭代扩展为何每次翻倍
~~~~~~~~~~~~~~~~~~~~

加入新元素 ``value`` 前已有一组旧子集。所有新子集分为不含 ``value`` 的旧子集，以及在每个旧子集后加入 ``value`` 的副本，两组数量相等且互不重叠。

.. list-table::
   :header-rows: 1

   * - 已处理元素
     - 子集数量
     - 新增子集
   * - 无
     - 1
     - ``[]``
   * - 2
     - 2
     - ``[2]``
   * - 2,5
     - 4
     - ``[5]``, ``[2,5]``
   * - 2,5,9
     - 8
     - 旧四个子集各加 9

为什么保存答案必须复制路径
~~~~~~~~~~~~~~~~~~~~~~~~~~

回溯使用同一个可变 ``path`` 执行选择和撤销。若结果只保存引用，后续 ``pop`` 会改写已提交答案。每次进入节点必须保存独立快照。

为什么不重不漏
~~~~~~~~~~~~~~

对任意子集，按照其元素在输入中的下标递增选择，存在唯一递归路径到达它，因此不会遗漏。不同节点的递增下标序列不同，对应不同子集，因此不会重复。

复杂度来源
~~~~~~~~~~

输出有 ``2^n`` 个子集，复制所有元素的总量为 ``Theta(n*2^n)``，三种方法时间和输出空间均达到该下界。回溯工作空间 ``O(n)``。

九语言实现
----------

C
~

.. code-block:: c

   static void dfs(int*nums,int n,int start,int*path,int depth,int***out,int**cols,int*size){int*row=malloc(depth*sizeof(int));memcpy(row,path,depth*sizeof(int));(*out)[*size]=row;(*cols)[(*size)++]=depth;for(int i=start;i<n;i++){path[depth]=nums[i];dfs(nums,n,i+1,path,depth+1,out,cols,size);}}
   int**subsets(int*nums,int n,int*returnSize,int**returnCols){int total=1<<n;int**out=malloc(total*sizeof(int*));int*cols=malloc(total*sizeof(int));int*path=malloc(n*sizeof(int));int size=0;dfs(nums,n,0,path,0,&out,&cols,&size);free(path);*returnSize=size;*returnCols=cols;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def subsets(self, nums: list[int]) -> list[list[int]]:
           result=[];path=[]
           def dfs(start):
               result.append(path.copy())
               for i in range(start,len(nums)):path.append(nums[i]);dfs(i+1);path.pop()
           dfs(0);return result

Java
~~~~

.. code-block:: java

   class Solution {List<List<Integer>>o=new ArrayList<>();List<Integer>p=new ArrayList<>();void dfs(int[]a,int start){o.add(new ArrayList<>(p));for(int i=start;i<a.length;i++){p.add(a[i]);dfs(a,i+1);p.remove(p.size()-1);}}public List<List<Integer>> subsets(int[]a){dfs(a,0);return o;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn subsets(a:Vec<i32>)->Vec<Vec<i32>>{fn dfs(a:&[i32],start:usize,p:&mut Vec<i32>,o:&mut Vec<Vec<i32>>){o.push(p.clone());for i in start..a.len(){p.push(a[i]);dfs(a,i+1,p,o);p.pop();}}let mut o=vec![];dfs(&a,0,&mut vec![],&mut o);o}}

Go
~~

.. code-block:: go

   func subsets(a []int)[][]int{o:=[][]int{};p:=[]int{};var dfs func(int);dfs=func(start int){o=append(o,append([]int(nil),p...));for i:=start;i<len(a);i++{p=append(p,a[i]);dfs(i+1);p=p[:len(p)-1]}};dfs(0);return o}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function subsets(a:number[]):number[][]{const o:number[][]=[],p:number[]=[];const dfs=(start:number)=>{o.push([...p]);for(let i=start;i<a.length;i++){p.push(a[i]);dfs(i+1);p.pop();}};dfs(0);return o;}

C#
~~

.. code-block:: csharp

   public class Solution {List<IList<int>>o=new();List<int>p=new();void Dfs(int[]a,int start){o.Add(new List<int>(p));for(int i=start;i<a.Length;i++){p.Add(a[i]);Dfs(a,i+1);p.RemoveAt(p.Count-1);}}public IList<IList<int>> Subsets(int[]a){Dfs(a,0);return o;}}

Julia
~~~~~

.. code-block:: julia

   function subsets_values(a)
       o=Vector{Vector{Int}}();p=Int[]
       function dfs(start);push!(o,copy(p));for i in start:length(a);push!(p,a[i]);dfs(i+1);pop!(p);end;end
       dfs(1);o
   end

R
~

.. code-block:: r

   subsets_values <- function(a){out<-list();path<-numeric();dfs<-function(start){out[[length(out)+1L]]<<-path;if(start<=length(a))for(i in start:length(a)){path<<-c(path,a[[i]]);dfs(i+1L);path<<-head(path,-1L)}};dfs(1L);out}
