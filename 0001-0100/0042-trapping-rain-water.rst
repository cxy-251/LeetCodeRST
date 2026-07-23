0042. Trapping Rain Water
=========================

题目信息
--------

:题号: 0042
:难度: Hard
:主题: 数组、前后缀最大值、单调栈、双指针
:原题: `LeetCode 0042 <https://leetcode.com/problems/trapping-rain-water/>`_
:重点: 单柱水位公式、较低边界确定性、双指针结算顺序、空间消除

题目重述
--------

给定非负整数数组 ``height``，每个元素表示宽度为 1 的柱高。返回降雨后柱子之间能储存的总水量。数组两端没有外侧边界，不能储水。

自建示例
--------

.. code-block:: text

   height = [4,2,0,3,2,5]
   单柱水量 = [0,2,4,1,2,0]
   总量 = 9

.. code-block:: text

   [2,0,2] -> 2
   [1,2,3,4] -> 0

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <stack>
   #include <vector>

   class Solution {
   private:
       int scanEveryColumn(const std::vector<int>& height) {
           int total = 0;
           for (int i = 0; i < static_cast<int>(height.size()); ++i) {
               int left = 0, right = 0;
               for (int j = 0; j <= i; ++j) left = std::max(left, height[j]);
               for (int j = i; j < static_cast<int>(height.size()); ++j) right = std::max(right, height[j]);
               total += std::min(left, right) - height[i];
           }
           return total;
       }

       int prefixSuffix(const std::vector<int>& height) {
           const int n = static_cast<int>(height.size());
           if (n == 0) return 0;
           std::vector<int> left(n), right(n);
           left[0] = height[0];
           for (int i = 1; i < n; ++i) left[i] = std::max(left[i - 1], height[i]);
           right[n - 1] = height[n - 1];
           for (int i = n - 2; i >= 0; --i) right[i] = std::max(right[i + 1], height[i]);
           int total = 0;
           for (int i = 0; i < n; ++i) total += std::min(left[i], right[i]) - height[i];
           return total;
       }

       int monotonicStack(const std::vector<int>& height) {
           std::stack<int> indices;
           int total = 0;
           for (int right = 0; right < static_cast<int>(height.size()); ++right) {
               while (!indices.empty() && height[right] > height[indices.top()]) {
                   int bottom = indices.top(); indices.pop();
                   if (indices.empty()) break;
                   int left = indices.top();
                   int width = right - left - 1;
                   int bounded = std::min(height[left], height[right]) - height[bottom];
                   total += width * bounded;
               }
               indices.push(right);
           }
           return total;
       }

       int twoPointers(const std::vector<int>& height) {
           int left = 0, right = static_cast<int>(height.size()) - 1;
           int left_max = 0, right_max = 0, total = 0;
           while (left <= right) {
               if (left_max <= right_max) {
                   left_max = std::max(left_max, height[left]);
                   total += left_max - height[left];
                   ++left;
               } else {
                   right_max = std::max(right_max, height[right]);
                   total += right_max - height[right];
                   --right;
               }
           }
           return total;
       }

   public:
       int trap(std::vector<int>& height) {
           return twoPointers(height);
       }
   };

题解
----

单柱水量由哪两个边界决定
~~~~~~~~~~~~~~~~~~~~~~~~

位置 ``i`` 上方水面最高只能到左右最高柱中较低者：

.. code-block:: text

   water[i] = min(left_max[i], right_max[i]) - height[i]

左右最大值都包含当前位置，因此差值不会为负。逐柱向两边重新扫描会重复计算大量最大值，最坏 ``O(n²)``。

前后缀数组消除了什么重复
~~~~~~~~~~~~~~~~~~~~~~~~

从左到右递推 ``left_max``，从右到左递推 ``right_max``，每个边界最大值只计算一次。随后每柱可在常数时间结算，总时间降为 ``O(n)``，代价是两个长度为 ``n`` 的数组。

单调栈为何按横层结算
~~~~~~~~~~~~~~~~~~~~

栈保存递减高度的下标。遇到更高右边界时，弹出的柱子成为凹槽底；新栈顶是左边界。宽度是两边界之间的柱数，高度是较低边界减去槽底。每个下标最多入栈、出栈一次。

双指针何时可以确定一侧水量
~~~~~~~~~~~~~~~~~~~~~~~~~~

维护已扫描区域的 ``left_max`` 与 ``right_max``。若 ``left_max <= right_max``，左指针位置的右侧至少已有一根高度为 ``right_max`` 的柱子，因此较低边界必是 ``left_max``；未扫描区域即使出现更高柱，也不会改变该位置水位，可以立即结算左侧。另一种情况对称地结算右侧。

状态演化
~~~~~~~~

对 ``[4,2,0,3,2,5]``：

.. list-table::
   :header-rows: 1

   * - ``left``
     - ``right``
     - ``left_max``
     - ``right_max``
     - 本轮水量
   * - 0
     - 5
     - 4
     - 0
     - 左侧 0
   * - 1
     - 5
     - 4
     - 5
     - 左侧 2
   * - 2
     - 5
     - 4
     - 5
     - 左侧 4
   * - 3
     - 5
     - 4
     - 5
     - 左侧 1
   * - 4
     - 5
     - 4
     - 5
     - 左侧 2

为什么处理过的位置不会需要修正
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

结算较低最大值一侧时，另一侧已经存在不低于它的边界。该柱的水位上限和下限都确定为较低最大值：更高的未来边界不能抬高较低侧，更低的未来柱也不能推翻已经存在的高边界。因此每个位置一次结算即为最终值。

复杂度来源
~~~~~~~~~~

逐柱扫描 ``O(n²)``；前后缀和单调栈均为 ``O(n)`` 时间、``O(n)`` 空间；双指针为 ``O(n)`` 时间、``O(1)`` 额外空间。

九语言实现
----------

C
~

.. code-block:: c

   int trap(int *height, int n) {
       int left = 0, right = n - 1, left_max = 0, right_max = 0, total = 0;
       while (left <= right) {
           if (left_max <= right_max) {
               if (height[left] > left_max) left_max = height[left];
               total += left_max - height[left++];
           } else {
               if (height[right] > right_max) right_max = height[right];
               total += right_max - height[right--];
           }
       }
       return total;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def trap(self, height: list[int]) -> int:
           left, right = 0, len(height) - 1
           left_max = right_max = total = 0
           while left <= right:
               if left_max <= right_max:
                   left_max = max(left_max, height[left])
                   total += left_max - height[left]
                   left += 1
               else:
                   right_max = max(right_max, height[right])
                   total += right_max - height[right]
                   right -= 1
           return total

Java
~~~~

.. code-block:: java

   class Solution {
       public int trap(int[] height) {
           int left=0,right=height.length-1,leftMax=0,rightMax=0,total=0;
           while(left<=right){
               if(leftMax<=rightMax){leftMax=Math.max(leftMax,height[left]);total+=leftMax-height[left++];}
               else{rightMax=Math.max(rightMax,height[right]);total+=rightMax-height[right--];}
           }
           return total;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn trap(height: Vec<i32>) -> i32 {
           if height.is_empty() { return 0; }
           let (mut left, mut right) = (0usize, height.len()-1);
           let (mut left_max, mut right_max, mut total) = (0,0,0);
           while left <= right {
               if left_max <= right_max {
                   left_max = left_max.max(height[left]); total += left_max-height[left]; left += 1;
               } else {
                   right_max = right_max.max(height[right]); total += right_max-height[right];
                   if right == 0 { break; } right -= 1;
               }
           }
           total
       }
   }

Go
~~

.. code-block:: go

   func trap(height []int) int {
       left,right,leftMax,rightMax,total:=0,len(height)-1,0,0,0
       for left<=right {
           if leftMax<=rightMax { if height[left]>leftMax{leftMax=height[left]}; total+=leftMax-height[left]; left++
           } else { if height[right]>rightMax{rightMax=height[right]}; total+=rightMax-height[right]; right-- }
       }
       return total
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function trap(height: number[]): number {
       let left=0,right=height.length-1,leftMax=0,rightMax=0,total=0;
       while(left<=right){
           if(leftMax<=rightMax){leftMax=Math.max(leftMax,height[left]);total+=leftMax-height[left++];}
           else{rightMax=Math.max(rightMax,height[right]);total+=rightMax-height[right--];}
       }
       return total;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int Trap(int[] height) {
           int left=0,right=height.Length-1,leftMax=0,rightMax=0,total=0;
           while(left<=right){
               if(leftMax<=rightMax){leftMax=Math.Max(leftMax,height[left]);total+=leftMax-height[left++];}
               else{rightMax=Math.Max(rightMax,height[right]);total+=rightMax-height[right--];}
           }
           return total;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function trap(height::Vector{Int})::Int
       left,right,leftmax,rightmax,total=1,length(height),0,0,0
       while left<=right
           if leftmax<=rightmax
               leftmax=max(leftmax,height[left]);total+=leftmax-height[left];left+=1
           else
               rightmax=max(rightmax,height[right]);total+=rightmax-height[right];right-=1
           end
       end
       total
   end

R
~

.. code-block:: r

   trap <- function(height) {
     left<-1L;right<-length(height);left_max<-0L;right_max<-0L;total<-0L
     while(left<=right){
       if(left_max<=right_max){left_max<-max(left_max,height[[left]]);total<-total+left_max-height[[left]];left<-left+1L}
       else{right_max<-max(right_max,height[[right]]);total<-total+right_max-height[[right]];right<-right-1L}
     }
     total
   }