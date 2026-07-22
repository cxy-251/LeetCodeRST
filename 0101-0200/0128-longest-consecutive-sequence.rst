0128. Longest Consecutive Sequence
==================================

题目信息
--------

:题号: 0128
:难度: Medium
:主题: 数组、哈希集合、连续整数、去重
:原题: `LeetCode 0128 <https://leetcode.com/problems/longest-consecutive-sequence/>`_
:教学重点: 连续段起点、重复值去重、期望线性复杂度

题目重述
--------

给定未排序整数数组，返回最长连续整数集合的长度。连续序列中的值逐次增加 1，与原数组下标顺序无关；重复值不增加长度，空数组返回 0。目标时间复杂度为 ``O(n)``。

自建示例
--------

.. code-block:: text

   [100,4,200,1,3,2] -> 4，对应 1,2,3,4
   [1,2,2,3] -> 3
   [-2,-1,0,2] -> 3

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <unordered_set>
   #include <vector>

   class Solution {
   private:
       int sorting(std::vector<int> nums) {
           if (nums.empty()) return 0;
           std::sort(nums.begin(), nums.end());
           int best = 1, current = 1;
           for (int i = 1; i < static_cast<int>(nums.size()); ++i) {
               if (nums[i] == nums[i - 1]) continue;
               if (nums[i] == nums[i - 1] + 1) ++current;
               else current = 1;
               best = std::max(best, current);
           }
           return best;
       }

       int expandFromEveryValue(const std::vector<int>& nums) {
           std::unordered_set<int> values(nums.begin(), nums.end());
           int best = 0;
           for (int value : values) {
               int length = 1;
               while (values.count(value + length)) ++length;
               best = std::max(best, length);
           }
           return best;
       }

       int expandFromStarts(const std::vector<int>& nums) {
           std::unordered_set<int> values(nums.begin(), nums.end());
           int best = 0;
           for (int value : values) {
               if (values.count(value - 1)) continue;
               int current = value, length = 1;
               while (values.count(current + 1)) { ++current; ++length; }
               best = std::max(best, length);
           }
           return best;
       }

   public:
       int longestConsecutive(std::vector<int>& nums) {
           return expandFromStarts(nums);
       }
   };

题解
----

集合解决了哪两个问题
~~~~~~~~~~~~~~~~~~

哈希集合提供期望 ``O(1)`` 成员查询，并自动消除重复值。题目只关心整数是否存在，不关心它在数组中的次数和位置。

连续段起点如何识别
~~~~~~~~~~~~~~~~~~

值 ``x`` 是某段起点，当且仅当 ``x-1`` 不在集合中。若前驱存在，``x`` 位于某段内部，从它再次向右扩张只会重复工作。

.. list-table::
   :header-rows: 1

   * - 值
     - ``x-1`` 是否存在
     - 动作
   * - 100
     - 否
     - 扫描长度 1
   * - 4
     - 是，存在 3
     - 跳过
   * - 1
     - 否
     - 扫描 1,2,3,4，长度 4
   * - 200
     - 否
     - 扫描长度 1

为什么总扩张次数是线性的
~~~~~~~~~~~~~~~~~~~~~~~~

每个连续段只从唯一最小值启动。向右循环访问该段每个后续整数一次；不同连续段互不重叠，所以所有内层循环总访问次数不超过集合大小，而不是每个起点各扫描 ``n`` 次。

重复值为何不影响结果
~~~~~~~~~~~~~~~~~~~~

集合中每个整数只保留一次。``[1,2,2,3]`` 转成 ``{1,2,3}``，连续段元素数量仍为 3；重复下标不是新的连续整数。

排序方法为何不满足目标
~~~~~~~~~~~~~~~~~~~~~~

排序后跳过重复并线性计数很直接，但排序需要 ``O(n log n)``。哈希起点法用 ``O(n)`` 空间换取期望 ``O(n)`` 时间。

为什么结果正确
~~~~~~~~~~~~~~

任意最长连续段有唯一最小值，且该值前驱不存在，因此算法一定从它启动并一直扫描到段末，不会漏掉。每次扫描只沿集合中真实存在的连续整数，得到的长度也一定对应合法段。

复杂度来源
~~~~~~~~~~

建立集合期望 ``O(n)``，起点检查与全部扩张总计期望 ``O(n)``，空间 ``O(n)``。最坏哈希退化取决于语言容器实现；排序基准为 ``O(n log n)``。

九语言实现
----------

C
~

.. code-block:: c

   typedef struct{int*key;unsigned char*used;int cap;}Set;static unsigned hashInt(int x){return(unsigned)x*2654435761u;}static void put(Set*s,int x){int i=(int)(hashInt(x)&(s->cap-1));while(s->used[i]&&s->key[i]!=x)i=(i+1)&(s->cap-1);s->used[i]=1;s->key[i]=x;}static bool has(Set*s,int x){int i=(int)(hashInt(x)&(s->cap-1));while(s->used[i]){if(s->key[i]==x)return true;i=(i+1)&(s->cap-1);}return false;}int longestConsecutive(int*nums,int n){if(!n)return 0;Set s;for(s.cap=1;s.cap<n*4;s.cap<<=1);s.key=malloc((size_t)s.cap*sizeof(int));s.used=calloc((size_t)s.cap,1);for(int i=0;i<n;i++)put(&s,nums[i]);int best=0;for(int i=0;i<s.cap;i++)if(s.used[i]&&!has(&s,s.key[i]-1)){int x=s.key[i],len=1;while(has(&s,x+1)){x++;len++;}if(len>best)best=len;}free(s.key);free(s.used);return best;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def longestConsecutive(self, nums: list[int]) -> int:
           values, best = set(nums), 0
           for value in values:
               if value - 1 in values: continue
               current, length = value, 1
               while current + 1 in values: current += 1; length += 1
               best = max(best, length)
           return best

Java
~~~~

.. code-block:: java

   class Solution {public int longestConsecutive(int[]nums){Set<Integer>s=new HashSet<>();for(int x:nums)s.add(x);int best=0;for(int x:s)if(!s.contains(x-1)){int y=x,len=1;while(s.contains(y+1)){y++;len++;}best=Math.max(best,len);}return best;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn longest_consecutive(nums:Vec<i32>)->i32{use std::collections::HashSet;let s:HashSet<i32>=nums.into_iter().collect();let mut best=0;for &x in &s{if s.contains(&(x-1)){continue}let(mut y,mut len)=(x,1);while s.contains(&(y+1)){y+=1;len+=1}best=best.max(len);}best}}

Go
~~

.. code-block:: go

   func longestConsecutive(nums []int)int{s:=map[int]bool{};for _,x:=range nums{s[x]=true};best:=0;for x:=range s{if s[x-1]{continue};y,len:=x,1;for s[y+1]{y++;len++};if len>best{best=len}};return best}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function longestConsecutive(nums:number[]):number{const s=new Set(nums);let best=0;for(const x of s){if(s.has(x-1))continue;let y=x,len=1;while(s.has(y+1)){y++;len++;}best=Math.max(best,len);}return best;}

C#
~~

.. code-block:: csharp

   public class Solution {public int LongestConsecutive(int[]nums){var s=new HashSet<int>(nums);int best=0;foreach(int x in s){if(s.Contains(x-1))continue;int y=x,len=1;while(s.Contains(y+1)){y++;len++;}best=Math.Max(best,len);}return best;}}

Julia
~~~~~

.. code-block:: julia

   function longest_consecutive(nums::Vector{Int})
       s=Set(nums);best=0
       for x in s;x-1 in s&&continue;y=x;len=1;while y+1 in s;y+=1;len+=1;end;best=max(best,len);end
       best
   end

R
~

.. code-block:: r

   longest_consecutive <- function(nums){values<-unique(nums);if(!length(values))return(0L);set<-new.env(hash=TRUE,parent=emptyenv());for(x in values)assign(as.character(x),TRUE,set);has<-function(x)exists(as.character(x),set,inherits=FALSE);best<-0L;for(x in values){if(has(x-1L))next;y<-x;len<-1L;while(has(y+1L)){y<-y+1L;len<-len+1L};best<-max(best,len)};best}
