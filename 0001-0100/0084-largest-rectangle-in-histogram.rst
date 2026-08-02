0084. Largest Rectangle in Histogram
====================================

题目信息
--------

:题号: 0084
:难度: Hard
:主题: 数组、单调栈、区间边界
:原题: `LeetCode 0084 <https://leetcode.com/problems/largest-rectangle-in-histogram/>`_
:重点: 柱宽为一、连续区间最小高度、左右边界、最大面积

题目重述
--------

给定非负整数数组 ``heights``，其中每个元素表示宽度为 1 的柱子高度。选择一个连续柱子区间，以该区间内最低柱高作为矩形高度，返回柱状图中可以形成的最大矩形面积。

约束为 ``1 <= heights.length <= 10^5``、``0 <= heights[i] <= 10^4``。

自建示例
--------

.. code-block:: text

   输入：heights = [3,1,4,5,2]
   输出：8

下标 2 和 3 的两根柱子高度分别为 4、5，可形成高度 4、宽度 2 的矩形，面积为 8。

.. code-block:: text

   输入：heights = [2,4,2,1]
   输出：6

前三根柱子可形成高度 2、宽度 3 的矩形。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       int expandEachBar(const std::vector<int>& heights) {
           int best = 0, n = heights.size();
           for (int middle = 0; middle < n; ++middle) {
               int left = middle, right = middle;
               while (left > 0 && heights[left - 1] >= heights[middle]) --left;
               while (right + 1 < n && heights[right + 1] >= heights[middle]) ++right;
               best = std::max(best, heights[middle] * (right - left + 1));
           }
           return best;
       }

       int boundaryArrays(const std::vector<int>& heights) {
           int n = heights.size();
           std::vector<int> left(n), right(n), stack;
           for (int i = 0; i < n; ++i) {
               while (!stack.empty() && heights[stack.back()] >= heights[i]) stack.pop_back();
               left[i] = stack.empty() ? -1 : stack.back();
               stack.push_back(i);
           }
           stack.clear();
           for (int i = n - 1; i >= 0; --i) {
               while (!stack.empty() && heights[stack.back()] >= heights[i]) stack.pop_back();
               right[i] = stack.empty() ? n : stack.back();
               stack.push_back(i);
           }
           int best = 0;
           for (int i = 0; i < n; ++i)
               best = std::max(best, heights[i] * (right[i] - left[i] - 1));
           return best;
       }

       int onePassStack(const std::vector<int>& heights) {
           std::vector<int> stack{-1};
           int best = 0, n = heights.size();
           for (int right = 0; right <= n; ++right) {
               int current = right == n ? 0 : heights[right];
               while (stack.back() != -1 && heights[stack.back()] > current) {
                   int middle = stack.back();
                   stack.pop_back();
                   int width = right - stack.back() - 1;
                   best = std::max(best, heights[middle] * width);
               }
               stack.push_back(right);
           }
           return best;
       }

   public:
       int largestRectangleArea(std::vector<int>& heights) {
           return onePassStack(heights);
       }
   };

题解
----

为什么固定一根柱子的高度
~~~~~~~~~~~~~~~~~~~~~~

任意矩形高度都等于其覆盖柱子中的最小高度。选取其中一根最矮柱 ``middle`` 后，矩形能向两侧扩展到首个严格更矮柱之前。因此只要为每根柱找到左右首个更矮位置，就能覆盖全部候选。

逐柱扩展重复了什么
~~~~~~~~~~~~~~~~

直接从每根柱向左右扫描，会反复跨过相同的高柱区间，最坏 ``O(n²)``。单调栈保存尚未遇到右侧更矮柱的下标，使每根柱的边界只结算一次。

递增栈保存什么
~~~~~~~~~~~~~~

栈中下标递增，对应高度非递减。扫描到 ``right`` 时，栈内每根柱都尚未见到右侧严格更矮柱；若当前高度更低，所有高于它的栈顶柱都在此刻首次获得完整右边界。

弹栈时左右边界如何确定
~~~~~~~~~~~~~~~~~~~~~~

弹出 ``middle`` 时，当前 ``right`` 是右侧首个更矮位置。弹栈后的新栈顶是左侧首个更矮位置；二者之间都能支撑 ``heights[middle]``：

.. code-block:: text

   width = right - stack.top - 1
   area  = heights[middle] * width

.. list-table::
   :header-rows: 1

   * - 当前柱
     - 栈内高度
     - 结算
   * - 3
     - ``[3]``
     - 暂不结算
   * - 1
     - ``[3]``
     - 弹出 3，宽 1，面积 3
   * - 4、5
     - ``[1,4,5]``
     - 保留递增候选
   * - 2
     - ``[1,4,5]``
     - 依次结算 5 和 4，得到面积 8

尾部零哨兵为何必要
~~~~~~~~~~~~~~~~~~

若数组单调递增，扫描中不会出现更矮柱，候选会一直留在栈中。遍历到 ``right == n`` 时使用虚拟高度 0，迫使所有正高度候选弹出；它不写入输入数组。

等高柱为什么可以留在栈中
~~~~~~~~~~~~~~~~~~~~~~

主实现只在栈顶高度严格大于当前高度时弹出。等高柱可同时保留，较早下标最终获得更宽区间；即使后一个等高柱也被结算，只会产生不更大的重复候选，不影响答案。边界数组版本选择 ``>=`` 弹栈，同样正确。

每根柱为什么只处理常数次
~~~~~~~~~~~~~~~~~~~~~~~~

每个真实下标入栈一次，弹栈至多一次。内层循环虽然可能一次弹出多根柱，但全部弹栈次数总计不超过 ``n``，因此整体线性。

为什么覆盖最大矩形
~~~~~~~~~~~~~~~~~~

最大矩形至少有一根柱达到其高度。该柱弹栈时，左右首个更矮边界都已确定，计算出的最大可扩展区间包含该矩形且高度相同，因此候选面积不小于最大矩形；所有候选又都由实际柱高和合法区间组成，不会超过真实最优。

复杂度来源
~~~~~~~~~~

逐柱扩展最坏 ``O(n²)``。左右边界数组与单遍栈均为 ``O(n)`` 时间、``O(n)`` 空间。

九语言实现
----------

C
~

.. code-block:: c

   int largestRectangleArea(int*h,int n){int*st=malloc((n+2)*sizeof(int)),top=0,best=0;st[0]=-1;for(int r=0;r<=n;r++){int cur=r==n?0:h[r];while(st[top]!=-1&&h[st[top]]>cur){int m=st[top--],width=r-st[top]-1,area=h[m]*width;if(area>best)best=area;}st[++top]=r;}free(st);return best;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def largestRectangleArea(self, h: list[int]) -> int:
           stack=[-1];best=0
           for right in range(len(h)+1):
               current=0 if right==len(h) else h[right]
               while stack[-1]!=-1 and h[stack[-1]]>current:
                   middle=stack.pop();best=max(best,h[middle]*(right-stack[-1]-1))
               stack.append(right)
           return best

Java
~~~~

.. code-block:: java

   class Solution {public int largestRectangleArea(int[]h){int[]st=new int[h.length+2];int top=0,best=0;st[0]=-1;for(int r=0;r<=h.length;r++){int cur=r==h.length?0:h[r];while(st[top]!=-1&&h[st[top]]>cur){int m=st[top--];best=Math.max(best,h[m]*(r-st[top]-1));}st[++top]=r;}return best;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn largest_rectangle_area(h:Vec<i32>)->i32{let mut st:Vec<i32>=vec![-1];let mut best=0;for r in 0..=h.len(){let cur=if r==h.len(){0}else{h[r]};while *st.last().unwrap()!=-1&&h[*st.last().unwrap()as usize]>cur{let m=st.pop().unwrap()as usize;let width=r as i32-*st.last().unwrap()-1;best=best.max(h[m]*width);}st.push(r as i32);}best}}

Go
~~

.. code-block:: go

   func largestRectangleArea(h []int)int{st:=[]int{-1};best:=0;for r:=0;r<=len(h);r++{cur:=0;if r<len(h){cur=h[r]};for st[len(st)-1]!=-1&&h[st[len(st)-1]]>cur{m:=st[len(st)-1];st=st[:len(st)-1];area:=h[m]*(r-st[len(st)-1]-1);if area>best{best=area}};st=append(st,r)};return best}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function largestRectangleArea(h:number[]):number{const st=[-1];let best=0;for(let r=0;r<=h.length;r++){const cur=r===h.length?0:h[r];while(st[st.length-1]!==-1&&h[st[st.length-1]]>cur){const m=st.pop()!;best=Math.max(best,h[m]*(r-st[st.length-1]-1));}st.push(r);}return best;}

C#
~~

.. code-block:: csharp

   public class Solution {public int LargestRectangleArea(int[]h){var st=new List<int>{-1};int best=0;for(int r=0;r<=h.Length;r++){int cur=r==h.Length?0:h[r];while(st[^1]!=-1&&h[st[^1]]>cur){int m=st[^1];st.RemoveAt(st.Count-1);best=Math.Max(best,h[m]*(r-st[^1]-1));}st.Add(r);}return best;}}

Julia
~~~~~

.. code-block:: julia

   function largest_rectangle_area(h)
       stack=Int[0];best=0
       for right in 1:length(h)+1
           current=right>length(h) ? 0 : h[right]
           while stack[end]!=0&&h[stack[end]]>current
               middle=pop!(stack);best=max(best,h[middle]*(right-stack[end]-1))
           end;push!(stack,right)
       end;best
   end

R
~

.. code-block:: r

   largest_rectangle_area <- function(h){stack<-0L;best<-0L;for(right in seq_len(length(h)+1L)){current<-if(right>length(h))0L else h[[right]];while(tail(stack,1)!=0L&&h[[tail(stack,1)]]>current){middle<-tail(stack,1);stack<-head(stack,-1);best<-max(best,h[[middle]]*(right-tail(stack,1)-1L))};stack<-c(stack,right)};best}
