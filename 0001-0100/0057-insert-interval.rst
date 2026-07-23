0057. Insert Interval
=====================

题目信息
--------

:题号: 0057
:难度: Medium
:主题: 区间、线性扫描、闭区间合并、有序序列
:原题: `LeetCode 0057 <https://leetcode.com/problems/insert-interval/>`_
:重点: 有序不重叠输入、新区间插入、连续重叠合并、结果顺序

题目重述
--------

给定按起点升序排列且彼此不重叠的闭区间数组 ``intervals``，以及一个闭区间 ``newInterval``。把新区间插入数组，并合并所有重叠区间，使返回结果仍按起点升序排列且彼此不重叠。

约束为 ``0 <= intervals.length <= 10^4``，所有端点都在 ``0..10^5`` 范围内，并满足每个区间起点不大于终点。

自建示例
--------

.. code-block:: text

   输入：intervals = [[1,3],[7,9],[12,15]], newInterval = [4,13]
   输出：[[1,3],[4,15]]

新区间与 ``[7,9]``、``[12,15]`` 连续重叠，合并为 ``[4,15]``；它与 ``[1,3]`` 之间仍有空隙。

.. code-block:: text

   输入：intervals = [], newInterval = [5,6]
   输出：[[5,6]]

原数组为空时，结果只包含新区间。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       std::vector<std::vector<int>> appendSortMerge(
           std::vector<std::vector<int>> intervals,
           const std::vector<int>& inserted
       ) {
           intervals.push_back(inserted);
           std::sort(intervals.begin(), intervals.end());
           std::vector<std::vector<int>> result;
           for (const auto& interval : intervals) {
               if (result.empty() || interval[0] > result.back()[1]) result.push_back(interval);
               else result.back()[1] = std::max(result.back()[1], interval[1]);
           }
           return result;
       }

       std::vector<std::vector<int>> binaryThenScan(
           const std::vector<std::vector<int>>& intervals,
           const std::vector<int>& inserted
       ) {
           int position = std::lower_bound(
               intervals.begin(), intervals.end(), inserted,
               [](const auto& interval, const auto& value) { return interval[0] < value[0]; }
           ) - intervals.begin();
           std::vector<std::vector<int>> all = intervals;
           all.insert(all.begin() + position, inserted);
           std::vector<std::vector<int>> result;
           for (const auto& interval : all) {
               if (result.empty() || interval[0] > result.back()[1]) result.push_back(interval);
               else result.back()[1] = std::max(result.back()[1], interval[1]);
           }
           return result;
       }

       std::vector<std::vector<int>> threePhases(
           const std::vector<std::vector<int>>& intervals,
           const std::vector<int>& inserted
       ) {
           std::vector<std::vector<int>> result;
           int index = 0;
           int start = inserted[0], end = inserted[1];

           while (index < static_cast<int>(intervals.size()) && intervals[index][1] < start)
               result.push_back(intervals[index++]);

           while (index < static_cast<int>(intervals.size()) && intervals[index][0] <= end) {
               start = std::min(start, intervals[index][0]);
               end = std::max(end, intervals[index][1]);
               ++index;
           }
           result.push_back({start, end});

           while (index < static_cast<int>(intervals.size()))
               result.push_back(intervals[index++]);
           return result;
       }

   public:
       std::vector<std::vector<int>> insert(
           std::vector<std::vector<int>>& intervals,
           std::vector<int>& newInterval
       ) {
           return threePhases(intervals, newInterval);
       }
   };

题解
----

追加后排序浪费了什么
~~~~~~~~~~~~~~~~~~

把新区间加入后调用第 56 题算法当然正确，但忽略了原数组已经有序且互不重叠。重新排序需要 ``O(n log n)``，而新区间只会影响一个连续区段。

三个阶段如何由相对位置得到
~~~~~~~~~~~~~~~~~~~~~~~~

令当前合并段初始为 ``[start,end] = newInterval``。原区间按起点递增，因此依次属于：

#. ``interval.end < start``：完全在左侧，直接复制；
#. ``interval.start <= end``：与合并段重叠，扩张两端；
#. ``interval.start > end``：完全在右侧，剩余区间全部直接复制。

闭区间为何使用严格分离条件
~~~~~~~~~~~~~~~~~~~~~~~~~~

左侧完全分离要求 ``interval.end < start``；若二者相等，共享端点，仍应进入重叠阶段。右侧同理，只有 ``interval.start > end`` 才完全分离。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 读取区间
     - 当前合并段
     - 动作
   * - ``[1,2]``
     - ``[4,8]``
     - 完全在左侧，复制
   * - ``[3,5]``
     - ``[3,8]``
     - 重叠，左端扩张
   * - ``[6,7]``
     - ``[3,8]``
     - 被当前段包含
   * - ``[8,10]``
     - ``[3,10]``
     - 共享端点，右端扩张
   * - ``[12,16]``
     - ``[3,10]``
     - 进入右侧阶段

为什么重叠区间必然连续出现
~~~~~~~~~~~~~~~~~~~~~~~~~~

原区间起点递增且互不重叠。某个区间起点超过当前合并段右端后，后续起点只会更大，不可能重新相交。因此中间重叠区间构成一个连续块，线性扫描无需回退。

为什么合并段只提交一次
~~~~~~~~~~~~~~~~~~~~

左侧区间与新区间完全分离；中段所有相交区间通过取最小左端和最大右端形成一个覆盖段；进入右侧前提交该段，之后再复制剩余区间。这样结果天然有序且互不重叠。

二分定位为什么不能替代线性合并
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

二分可找到按起点插入的大致位置，但新区间可能向左或向右覆盖多个区间，仍需扫描这些区间。由于最终要复制 ``n`` 个结果元素，整体 ``O(n)`` 已经最优，额外二分收益有限。

为什么结果覆盖范围完全相同
~~~~~~~~~~~~~~~~~~~~~~~~~~

每个原区间恰好被复制或并入合并段，新区间也从始至终属于该段。合并只把有交集的闭区间替换为它们的最小覆盖区间，所以并集不变；三个阶段又互不遗漏。

复杂度来源
~~~~~~~~~~

三阶段扫描访问每个区间一次，时间 ``O(n)``；不计返回结果，只使用索引和两个端点，额外空间 ``O(1)``。追加排序方法为 ``O(n log n)``。

九语言实现
----------

C
~

.. code-block:: c

   int**insert(int**a,int n,int*cols,int*newI,int newSize,int*returnSize,int**returnCols){int**o=malloc((size_t)(n+1)*sizeof(int*));int k=0,i=0,s=newI[0],e=newI[1];while(i<n&&a[i][1]<s){o[k]=malloc(2*sizeof(int));o[k][0]=a[i][0];o[k++][1]=a[i++][1];}while(i<n&&a[i][0]<=e){if(a[i][0]<s)s=a[i][0];if(a[i][1]>e)e=a[i][1];i++;}o[k]=malloc(2*sizeof(int));o[k][0]=s;o[k++][1]=e;while(i<n){o[k]=malloc(2*sizeof(int));o[k][0]=a[i][0];o[k++][1]=a[i++][1];}int*sizes=malloc((size_t)k*sizeof(int));for(i=0;i<k;i++)sizes[i]=2;*returnSize=k;*returnCols=sizes;return o;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def insert(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
           result, index = [], 0
           start, end = newInterval
           while index < len(intervals) and intervals[index][1] < start:
               result.append(intervals[index][:]); index += 1
           while index < len(intervals) and intervals[index][0] <= end:
               start = min(start, intervals[index][0]); end = max(end, intervals[index][1]); index += 1
           result.append([start, end])
           result.extend(interval[:] for interval in intervals[index:])
           return result

Java
~~~~

.. code-block:: java

   class Solution {public int[][] insert(int[][]a,int[]v){List<int[]>o=new ArrayList<>();int i=0,s=v[0],e=v[1];while(i<a.length&&a[i][1]<s)o.add(new int[]{a[i][0],a[i++][1]});while(i<a.length&&a[i][0]<=e){s=Math.min(s,a[i][0]);e=Math.max(e,a[i][1]);i++;}o.add(new int[]{s,e});while(i<a.length)o.add(new int[]{a[i][0],a[i++][1]});return o.toArray(new int[o.size()][]);}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn insert(a:Vec<Vec<i32>>,v:Vec<i32>)->Vec<Vec<i32>>{let(mut o,mut i,mut s,mut e)=(vec![],0,v[0],v[1]);while i<a.len()&&a[i][1]<s{o.push(a[i].clone());i+=1}while i<a.len()&&a[i][0]<=e{s=s.min(a[i][0]);e=e.max(a[i][1]);i+=1}o.push(vec![s,e]);while i<a.len(){o.push(a[i].clone());i+=1}o}}

Go
~~

.. code-block:: go

   func insert(a [][]int,v []int)[][]int{o:=[][]int{};i,s,e:=0,v[0],v[1];for i<len(a)&&a[i][1]<s{o=append(o,[]int{a[i][0],a[i][1]});i++};for i<len(a)&&a[i][0]<=e{if a[i][0]<s{s=a[i][0]};if a[i][1]>e{e=a[i][1]};i++};o=append(o,[]int{s,e});for i<len(a){o=append(o,[]int{a[i][0],a[i][1]});i++};return o}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function insert(a:number[][],v:number[]):number[][]{const o:number[][]=[];let i=0,s=v[0],e=v[1];while(i<a.length&&a[i][1]<s)o.push([...a[i++]]);while(i<a.length&&a[i][0]<=e){s=Math.min(s,a[i][0]);e=Math.max(e,a[i][1]);i++;}o.push([s,e]);while(i<a.length)o.push([...a[i++]]);return o;}

C#
~~

.. code-block:: csharp

   public class Solution {public int[][] Insert(int[][]a,int[]v){var o=new List<int[]>();int i=0,s=v[0],e=v[1];while(i<a.Length&&a[i][1]<s)o.Add(new[]{a[i][0],a[i++][1]});while(i<a.Length&&a[i][0]<=e){s=Math.Min(s,a[i][0]);e=Math.Max(e,a[i][1]);i++;}o.Add(new[]{s,e});while(i<a.Length)o.Add(new[]{a[i][0],a[i++][1]});return o.ToArray();}}

Julia
~~~~~

.. code-block:: julia

   function insert_interval(a,v)
       o=Vector{Vector{Int}}();i=1;s=v[1];e=v[2]
       while i<=length(a)&&a[i][2]<s;push!(o,copy(a[i]));i+=1;end
       while i<=length(a)&&a[i][1]<=e;s=min(s,a[i][1]);e=max(e,a[i][2]);i+=1;end
       push!(o,[s,e]);while i<=length(a);push!(o,copy(a[i]));i+=1;end;o
   end

R
~

.. code-block:: r

   insert_interval <- function(a,v){out<-list();i<-1L;s<-v[[1L]];e<-v[[2L]];n<-if(is.null(dim(a)))0L else nrow(a);while(i<=n&&a[i,2]<s){out[[length(out)+1L]]<-a[i,];i<-i+1L};while(i<=n&&a[i,1]<=e){s<-min(s,a[i,1]);e<-max(e,a[i,2]);i<-i+1L};out[[length(out)+1L]]<-c(s,e);while(i<=n){out[[length(out)+1L]]<-a[i,];i<-i+1L};do.call(rbind,out)}
