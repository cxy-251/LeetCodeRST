0056. Merge Intervals
=====================

题目信息
--------

:题号: 0056
:难度: Medium
:主题: 区间、排序、贪心、扫描线
:原题: `LeetCode 0056 <https://leetcode.com/problems/merge-intervals/>`_
:重点: 起点排序、闭区间重叠、当前覆盖段、结果提交

题目重述
--------

给定若干闭区间 ``[start,end]``，合并所有重叠区间，返回互不重叠且覆盖范围相同的区间列表。闭区间共享端点也视为重叠，例如 ``[1,4]`` 与 ``[4,5]`` 应合并。

自建示例
--------

.. code-block:: text

   [[1,3],[2,6],[8,10],[15,18]]
   -> [[1,6],[8,10],[15,18]]

.. code-block:: text

   [[1,10],[2,3],[4,8]] -> [[1,10]]
   [[1,4],[4,5]] -> [[1,5]]

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       std::vector<std::vector<int>> repeatPairMerge(std::vector<std::vector<int>> intervals) {
           bool changed = true;
           while (changed) {
               changed = false;
               for (int i = 0; i < static_cast<int>(intervals.size()) && !changed; ++i) {
                   for (int j = i + 1; j < static_cast<int>(intervals.size()); ++j) {
                       if (intervals[i][1] < intervals[j][0] || intervals[j][1] < intervals[i][0]) continue;
                       intervals[i][0] = std::min(intervals[i][0], intervals[j][0]);
                       intervals[i][1] = std::max(intervals[i][1], intervals[j][1]);
                       intervals.erase(intervals.begin() + j);
                       changed = true;
                       break;
                   }
               }
           }
           return intervals;
       }

       std::vector<std::vector<int>> eventSweep(const std::vector<std::vector<int>>& intervals) {
           std::vector<std::pair<int,int>> events;
           for (const auto& interval : intervals) {
               events.push_back({interval[0], 1});
               events.push_back({interval[1], -1});
           }
           std::sort(events.begin(), events.end(), [](auto a, auto b) {
               return a.first != b.first ? a.first < b.first : a.second > b.second;
           });
           std::vector<std::vector<int>> result;
           int active = 0, start = 0;
           for (auto [position, delta] : events) {
               if (active == 0 && delta == 1) start = position;
               active += delta;
               if (active == 0) result.push_back({start, position});
           }
           return result;
       }

       std::vector<std::vector<int>> sortAndMerge(std::vector<std::vector<int>> intervals) {
           std::sort(intervals.begin(), intervals.end());
           std::vector<std::vector<int>> result;
           for (const auto& interval : intervals) {
               if (result.empty() || interval[0] > result.back()[1]) {
                   result.push_back(interval);
               } else {
                   result.back()[1] = std::max(result.back()[1], interval[1]);
               }
           }
           return result;
       }

   public:
       std::vector<std::vector<int>> merge(std::vector<std::vector<int>>& intervals) {
           return sortAndMerge(intervals);
       }
   };

题解
----

反复两两合并为何代价高
~~~~~~~~~~~~~~~~~~~~~~

无序区间中，每次合并都可能改变与其他区间的关系，需要重新比较。最坏会进行平方级甚至更多重复检查。关键是先建立一种顺序，让已经结束的覆盖段可以永久提交。

按起点排序带来了什么
~~~~~~~~~~~~~~~~~~~~

排序后，后续区间起点不会减小。若当前合并段为 ``[start,end]``：

* ``next.start <= end`` 时，两闭区间重叠，扩张 ``end``；
* ``next.start > end`` 时，当前段与所有后续区间都不可能再相交，可以安全写入结果。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 新区间
     - 当前段
     - 动作
   * - ``[1,3]``
     - ``[1,3]``
     - 建立当前段
   * - ``[2,6]``
     - ``[1,6]``
     - 起点不超过 3，扩张右端
   * - ``[8,10]``
     - ``[8,10]``
     - 提交 ``[1,6]``，建立新区间
   * - ``[15,18]``
     - ``[15,18]``
     - 提交 ``[8,10]``
   * - 扫描结束
     - —
     - 提交最后一段

包含关系为何只更新右端
~~~~~~~~~~~~~~~~~~~~~~

排序保证当前段起点不晚于新区间起点，因此合并后的左端仍是当前左端。若新区间完全包含在当前段中，``max(end,next.end)`` 不改变状态；若它向右延伸，只需更新右端。

端点接触为什么要合并
~~~~~~~~~~~~~~~~~~~~

区间是闭区间。``next.start == current.end`` 时共享同一个点，交集非空，所以重叠条件使用 ``<=``。只有 ``next.start > current.end`` 才完全分离。

当前段为何可以直接保存在结果末尾
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

实现可以把结果末尾作为尚未完成的当前段。遇到重叠时原地扩张末尾右端；遇到分离时追加新区间。返回结构保存独立的区间快照，不依赖后续输入变化。

扫描线方法的取舍
~~~~~~~~~~~~~~~~

把每个端点转为进入和离开事件，可通过活动区间计数恢复覆盖并集。它适合覆盖层数等扩展问题，但本题只需并集，排序区间本身状态更少。

为什么合并结果完整且互不重叠
~~~~~~~~~~~~~~~~~~~~~~~~~~

每个输入区间按顺序被加入当前组或启动新组，因此没有遗漏。新组只在起点严格大于旧组右端时建立，所以结果相邻区间不重叠；组内所有相连区间通过不断取最大右端形成恰好相同的覆盖并集。

复杂度来源
~~~~~~~~~~

排序为 ``O(n log n)``，扫描为 ``O(n)``；不计返回结果，额外空间取决于排序实现，通常为 ``O(log n)``。两两方法最坏平方级，事件扫描需要 ``O(n)`` 事件空间。

九语言实现
----------

C
~

.. code-block:: c

   static int cmp(const void*a,const void*b){int*x=*(int**)a,*y=*(int**)b;return x[0]!=y[0]?x[0]-y[0]:x[1]-y[1];}
   int**merge(int**a,int n,int*cols,int*returnSize,int**returnCols){qsort(a,(size_t)n,sizeof(int*),cmp);int**out=malloc((size_t)n*sizeof(int*));int k=0;for(int i=0;i<n;i++){if(k==0||a[i][0]>out[k-1][1]){out[k]=malloc(2*sizeof(int));out[k][0]=a[i][0];out[k][1]=a[i][1];k++;}else if(a[i][1]>out[k-1][1])out[k-1][1]=a[i][1];}int*s=malloc((size_t)k*sizeof(int));for(int i=0;i<k;i++)s[i]=2;*returnSize=k;*returnCols=s;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def merge(self, intervals: list[list[int]]) -> list[list[int]]:
           intervals.sort()
           result = []
           for start, end in intervals:
               if not result or start > result[-1][1]: result.append([start, end])
               else: result[-1][1] = max(result[-1][1], end)
           return result

Java
~~~~

.. code-block:: java

   class Solution {public int[][] merge(int[][]a){Arrays.sort(a,(x,y)->x[0]!=y[0]?Integer.compare(x[0],y[0]):Integer.compare(x[1],y[1]));List<int[]>o=new ArrayList<>();for(int[]v:a){if(o.isEmpty()||v[0]>o.get(o.size()-1)[1])o.add(new int[]{v[0],v[1]});else o.get(o.size()-1)[1]=Math.max(o.get(o.size()-1)[1],v[1]);}return o.toArray(new int[o.size()][]);}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn merge(mut a:Vec<Vec<i32>>)->Vec<Vec<i32>>{a.sort();let mut o:Vec<Vec<i32>>=vec![];for v in a{if o.is_empty()||v[0]>o.last().unwrap()[1]{o.push(v)}else{let last=o.last_mut().unwrap();last[1]=last[1].max(v[1]);}}o}}

Go
~~

.. code-block:: go

   func merge(a [][]int)[][]int{sort.Slice(a,func(i,j int)bool{if a[i][0]==a[j][0]{return a[i][1]<a[j][1]};return a[i][0]<a[j][0]});o:=[][]int{};for _,v:=range a{if len(o)==0||v[0]>o[len(o)-1][1]{o=append(o,[]int{v[0],v[1]})}else if v[1]>o[len(o)-1][1]{o[len(o)-1][1]=v[1]}};return o}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function merge(a:number[][]):number[][]{a.sort((x,y)=>x[0]-y[0]||x[1]-y[1]);const o:number[][]=[];for(const v of a){if(!o.length||v[0]>o[o.length-1][1])o.push([...v]);else o[o.length-1][1]=Math.max(o[o.length-1][1],v[1]);}return o;}

C#
~~

.. code-block:: csharp

   public class Solution {public int[][] Merge(int[][]a){Array.Sort(a,(x,y)=>x[0]!=y[0]?x[0].CompareTo(y[0]):x[1].CompareTo(y[1]));var o=new List<int[]>();foreach(var v in a){if(o.Count==0||v[0]>o[^1][1])o.Add(new[]{v[0],v[1]});else o[^1][1]=Math.Max(o[^1][1],v[1]);}return o.ToArray();}}

Julia
~~~~~

.. code-block:: julia

   function merge_intervals(a)
       sort!(a,by=x->(x[1],x[2]));o=Vector{Vector{Int}}()
       for v in a;if isempty(o)||v[1]>o[end][2];push!(o,copy(v));else;o[end][2]=max(o[end][2],v[2]);end;end;o
   end

R
~

.. code-block:: r

   merge_intervals <- function(a){a<-a[order(a[,1],a[,2]),,drop=FALSE];out<-list();for(i in seq_len(nrow(a))){v<-a[i,];if(length(out)==0L||v[[1]]>out[[length(out)]][[2]])out[[length(out)+1L]]<-c(v[[1]],v[[2]])else out[[length(out)]][[2]]<-max(out[[length(out)]][[2]],v[[2]])};do.call(rbind,out)}
