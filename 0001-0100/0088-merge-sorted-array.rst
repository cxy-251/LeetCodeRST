0088. Merge Sorted Array
========================

题目信息
--------

:题号: 0088
:难度: Easy
:主题: 数组、双指针、原地归并、逆向写入
:原题: `LeetCode 0088 <https://leetcode.com/problems/merge-sorted-array/>`_
:教学重点: 有效前缀、尾部预留空间、未读数据保护、逆向取大

题目重述
--------

``nums1`` 总长度为 ``m+n``，前 ``m`` 项有效，后 ``n`` 个槽位用于结果；``nums2`` 前 ``n`` 项有效。把两组非递减元素原地合并到 ``nums1``。尾槽中的初始值不是输入数据。

自建示例
--------

.. code-block:: text

   nums1=[1,2,3,0,0,0], m=3
   nums2=[2,5,6],       n=3
   结果：[1,2,2,3,5,6]

   nums1=[0], m=0，nums2=[1], n=1 -> [1]

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       void appendAndSort(std::vector<int>& nums1, int m,
                          const std::vector<int>& nums2, int n) {
           for (int i = 0; i < n; ++i) nums1[m + i] = nums2[i];
           std::sort(nums1.begin(), nums1.end());
       }

       void copyThenForward(std::vector<int>& nums1, int m,
                            const std::vector<int>& nums2, int n) {
           std::vector<int> first(nums1.begin(), nums1.begin() + m);
           int i = 0, j = 0, write = 0;
           while (i < m || j < n) {
               if (j == n || (i < m && first[i] <= nums2[j])) nums1[write++] = first[i++];
               else nums1[write++] = nums2[j++];
           }
       }

       void mergeBackward(std::vector<int>& nums1, int m,
                          const std::vector<int>& nums2, int n) {
           int first = m - 1, second = n - 1, write = m + n - 1;
           while (second >= 0) {
               if (first >= 0 && nums1[first] > nums2[second])
                   nums1[write--] = nums1[first--];
               else
                   nums1[write--] = nums2[second--];
           }
       }

   public:
       void merge(std::vector<int>& nums1, int m,
                  std::vector<int>& nums2, int n) {
           mergeBackward(nums1, m, nums2, n);
       }
   };

题解
----

为什么正向写会覆盖输入
~~~~~~~~~~~~~~~~~~~~

若直接从下标 0 开始写，来自 ``nums2`` 的较小值可能覆盖 ``nums1`` 尚未比较的有效元素。复制有效前缀可以解决，但需要 ``O(m)`` 额外空间。

尾部容量如何消除覆盖风险
~~~~~~~~~~~~~~~~~~~~~~~~

结果末尾应放置两个未合并前缀中的最大元素。``nums1`` 的尾部本来就是空槽，因此从右向左写时，写入位置始终位于 ``nums1`` 未读有效前缀之后。

三个指针保存什么
~~~~~~~~~~~~~~~~

.. code-block:: text

   first  = m - 1       # nums1 未合并前缀末尾
   second = n - 1       # nums2 未合并前缀末尾
   write  = m + n - 1   # 当前结果空槽

每轮比较两个尾值，把较大者写入 ``write``，并移动对应读指针。

.. list-table::
   :header-rows: 1

   * - first 值
     - second 值
     - 写入
   * - 3
     - 6
     - 最右侧写 6
   * - 3
     - 5
     - 写 5
   * - 3
     - 2
     - 写 3
   * - 2
     - 2
     - 主实现选 nums2 的 2

为什么写入不会破坏 nums1 未读元素
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

只要 ``second >= 0``，就有 ``write = first + second + 1 > first``。因此当前写入位置严格在 ``nums1[0:first]`` 的右侧，无论写入来自哪个数组，都不会覆盖尚未比较的数据。

为什么只需循环到 nums2 耗尽
~~~~~~~~~~~~~~~~~~~~~~~~~~~

若 ``nums2`` 已耗尽，``nums1`` 剩余元素本来就位于结果前缀正确位置，无需复制。若 ``nums1`` 先耗尽，循环会继续把 ``nums2`` 剩余元素依次写到前部。

相等时选择哪侧是否重要
~~~~~~~~~~~~~~~~~~~~~~

只要求数值有序，不要求跨数组稳定性。相等时选择任一侧都正确；主实现选择 ``nums2``，随后 ``nums1`` 的相等值自然留在更左位置。

为什么最终有序且完整
~~~~~~~~~~~~~~~~~~~~

每轮从两个有序未合并前缀中取全局最大值，填入当前最右空槽，因此已写后缀始终有序。每次恰好消费一个有效元素，最终全部 ``m+n`` 个元素都出现一次。

复杂度来源
~~~~~~~~~~

拼接排序为 ``O((m+n)log(m+n))``。正向复制和逆向归并均为 ``O(m+n)``；逆向方法额外空间 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   void merge(int*nums1,int nums1Size,int m,int*nums2,int nums2Size,int n){int i=m-1,j=n-1,w=m+n-1;while(j>=0){if(i>=0&&nums1[i]>nums2[j])nums1[w--]=nums1[i--];else nums1[w--]=nums2[j--];}}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def merge(self, a: list[int], m: int, b: list[int], n: int) -> None:
           i,j,write=m-1,n-1,m+n-1
           while j>=0:
               if i>=0 and a[i]>b[j]:a[write]=a[i];i-=1
               else:a[write]=b[j];j-=1
               write-=1

Java
~~~~

.. code-block:: java

   class Solution {public void merge(int[]a,int m,int[]b,int n){int i=m-1,j=n-1,w=m+n-1;while(j>=0)a[w--]=i>=0&&a[i]>b[j]?a[i--]:b[j--];}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn merge(a:&mut Vec<i32>,m:i32,b:&mut Vec<i32>,n:i32){let(mut i,mut j,mut w)=(m-1,n-1,m+n-1);while j>=0{if i>=0&&a[i as usize]>b[j as usize]{a[w as usize]=a[i as usize];i-=1}else{a[w as usize]=b[j as usize];j-=1}w-=1}}}

Go
~~

.. code-block:: go

   func merge(a []int,m int,b []int,n int){i,j,w:=m-1,n-1,m+n-1;for j>=0{if i>=0&&a[i]>b[j]{a[w]=a[i];i--}else{a[w]=b[j];j--};w--}}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function merge(a:number[],m:number,b:number[],n:number):void{let i=m-1,j=n-1,w=m+n-1;while(j>=0){if(i>=0&&a[i]>b[j])a[w--]=a[i--];else a[w--]=b[j--];}}

C#
~~

.. code-block:: csharp

   public class Solution {public void Merge(int[]a,int m,int[]b,int n){int i=m-1,j=n-1,w=m+n-1;while(j>=0)a[w--]=i>=0&&a[i]>b[j]?a[i--]:b[j--];}}

Julia
~~~~~

.. code-block:: julia

   function merge_sorted!(a,m,b,n)
       i=m;j=n;write=m+n
       while j>=1
           if i>=1&&a[i]>b[j];a[write]=a[i];i-=1;else;a[write]=b[j];j-=1;end
           write-=1
       end;a
   end

R
~

.. code-block:: r

   merge_sorted <- function(a,m,b,n){i<-m;j<-n;write<-m+n;while(j>=1L){if(i>=1L&&a[[i]]>b[[j]]){a[[write]]<-a[[i]];i<-i-1L}else{a[[write]]<-b[[j]];j<-j-1L};write<-write-1L};a}
