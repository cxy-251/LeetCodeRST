0075. Sort Colors
=================

题目信息
--------

:题号: 0075
:难度: Medium
:主题: 数组、双指针、原地分区
:原题: `LeetCode 0075 <https://leetcode.com/problems/sort-colors/>`_
:教学重点: 荷兰国旗、四段不变量、交换后复查、原地排序

题目重述
--------

给定只包含 ``0``、``1``、``2`` 的数组，按非递减顺序原地排序，不能调用通用排序函数。标准接口不返回数组。

自建示例
--------

.. code-block:: text

   [2,0,2,1,1,0] -> [0,0,1,1,2,2]
   [2,0,1]       -> [0,1,2]

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       void countingOverwrite(std::vector<int>& nums) {
           int count[3] = {0,0,0};
           for (int value : nums) ++count[value];
           int index = 0;
           for (int value = 0; value < 3; ++value)
               while (count[value]-- > 0) nums[index++] = value;
       }

       void twoPartitions(std::vector<int>& nums) {
           int zero = 0;
           for (int i = 0; i < static_cast<int>(nums.size()); ++i)
               if (nums[i] == 0) std::swap(nums[zero++], nums[i]);
           int one = zero;
           for (int i = zero; i < static_cast<int>(nums.size()); ++i)
               if (nums[i] == 1) std::swap(nums[one++], nums[i]);
       }

       void dutchFlag(std::vector<int>& nums) {
           int low = 0, current = 0, high = nums.size() - 1;
           while (current <= high) {
               if (nums[current] == 0) {
                   std::swap(nums[low], nums[current]);
                   ++low; ++current;
               } else if (nums[current] == 1) {
                   ++current;
               } else {
                   std::swap(nums[current], nums[high]);
                   --high;
               }
           }
       }

   public:
       void sortColors(std::vector<int>& nums) {
           dutchFlag(nums);
       }
   };

题解
----

有限值域为何可以计数
~~~~~~~~~~~~~~~~~~

输入只有三种值，统计各自数量后依次覆盖即可在线性时间排序。它简单稳定，但需要两遍扫描，也没有展示如何在一次扫描中维护原地分区。

四段不变量
~~~~~~~~~~

维护：``[0,low)`` 全是 0；``[low,current)`` 全是 1；``[current,high]`` 尚未分类；``(high,n)`` 全是 2。每轮只处理 ``nums[current]``。

三种当前值分别做什么
~~~~~~~~~~~~~~~~~~~~

当前值为 0，与 ``low`` 交换，0 区扩大；为 1，当前位置已经正确，只推进 ``current``；为 2，与 ``high`` 交换，2 区扩大。

为什么交换 0 后可以推进 current
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``low`` 位于 1 区起点。若 ``low < current``，换入当前位置的是已分类的 1；若二者相等，交换不改变值。因此换入元素无需复查，两个指针都可推进。

为什么交换 2 后不能推进 current
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``high`` 来自未知区间，换回的值可能是 0、1 或 2，尚未分类。若立即推进会跳过它，因此只缩小 ``high``，保留 ``current`` 继续判断。

.. list-table::
   :header-rows: 1

   * - 当前数组
     - ``low,current,high``
     - 动作
   * - ``[2,0,2,1,1,0]``
     - ``0,0,5``
     - 2 与右端 0 交换
   * - ``[0,0,2,1,1,2]``
     - ``0,0,4``
     - 当前换入 0，移入左区
   * - ``[0,0,2,1,1,2]``
     - ``1,1,4``
     - 再处理第二个 0
   * - 后续
     - 未知区持续缩短
     - 最终连接 0、1、2 三段

为什么每轮都会终止推进
~~~~~~~~~~~~~~~~~~~~~~

处理 0 或 1 时 ``current`` 增加；处理 2 时 ``high`` 减少。未知区间长度 ``high-current+1`` 每轮严格减少，因此循环必然结束。

为什么结果保持元素多重集
~~~~~~~~~~~~~~~~~~~~~~~~

算法只交换原数组元素，不创建或删除值。结束时未知区为空，三个已分类区按 0、1、2 顺序连接，数组有序且元素数量不变。

复杂度来源
~~~~~~~~~~

计数覆盖、两次分区和荷兰国旗都为 ``O(n)`` 时间、``O(1)`` 额外空间；荷兰国旗只需单次分类扫描。

九语言实现
----------

C
~

.. code-block:: c

   void sortColors(int*a,int n){int low=0,i=0,high=n-1;while(i<=high){if(a[i]==0){int t=a[low];a[low++]=a[i];a[i++]=t;}else if(a[i]==1)i++;else{int t=a[high];a[high--]=a[i];a[i]=t;}}}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def sortColors(self, a: list[int]) -> None:
           low=i=0;high=len(a)-1
           while i<=high:
               if a[i]==0:a[low],a[i]=a[i],a[low];low+=1;i+=1
               elif a[i]==1:i+=1
               else:a[i],a[high]=a[high],a[i];high-=1

Java
~~~~

.. code-block:: java

   class Solution {public void sortColors(int[]a){int low=0,i=0,high=a.length-1;while(i<=high){if(a[i]==0){int t=a[low];a[low++]=a[i];a[i++]=t;}else if(a[i]==1)i++;else{int t=a[high];a[high--]=a[i];a[i]=t;}}}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn sort_colors(a:&mut Vec<i32>){let(mut low,mut i,mut high)=(0,0,a.len());while i<high{match a[i]{0=>{a.swap(low,i);low+=1;i+=1},1=>i+=1,_=>{high-=1;a.swap(i,high)}}}}}

Go
~~

.. code-block:: go

   func sortColors(a []int){low,i,high:=0,0,len(a)-1;for i<=high{if a[i]==0{a[low],a[i]=a[i],a[low];low++;i++}else if a[i]==1{i++}else{a[i],a[high]=a[high],a[i];high--}}}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function sortColors(a:number[]):void{let low=0,i=0,high=a.length-1;while(i<=high){if(a[i]===0){[a[low],a[i]]=[a[i],a[low]];low++;i++;}else if(a[i]===1)i++;else{[a[i],a[high]]=[a[high],a[i]];high--;}}}

C#
~~

.. code-block:: csharp

   public class Solution {public void SortColors(int[]a){int low=0,i=0,high=a.Length-1;while(i<=high){if(a[i]==0){(a[low],a[i])=(a[i],a[low]);low++;i++;}else if(a[i]==1)i++;else{(a[i],a[high])=(a[high],a[i]);high--;}}}}

Julia
~~~~~

.. code-block:: julia

   function sort_colors!(a)
       low=1;i=1;high=length(a)
       while i<=high;if a[i]==0;a[low],a[i]=a[i],a[low];low+=1;i+=1;elseif a[i]==1;i+=1;else;a[i],a[high]=a[high],a[i];high-=1;end;end;a
   end

R
~

.. code-block:: r

   sort_colors <- function(a){low<-1L;i<-1L;high<-length(a);while(i<=high){if(a[[i]]==0L){tmp<-a[[low]];a[[low]]<-a[[i]];a[[i]]<-tmp;low<-low+1L;i<-i+1L}else if(a[[i]]==1L)i<-i+1L else{tmp<-a[[high]];a[[high]]<-a[[i]];a[[i]]<-tmp;high<-high-1L}};a}
