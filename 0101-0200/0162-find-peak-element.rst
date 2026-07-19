0162. Find Peak Element
=======================

题目信息
--------

:题号: 0162
:难度: Medium
:主题: 数组、二分查找、局部峰值、边界证书
:原题: `LeetCode 0162 <https://leetcode.com/problems/find-peak-element/>`_
:访问状态: Available
:教学重点: 相邻斜率、含峰区间、虚拟负无穷、零基返回

精确契约
--------

输入 ``nums`` 是非空零基整数数组，满足：

* ``1 <= nums.length <= 1000``；
* ``-2^31 <= nums[i] <= 2^31-1``；
* 任意相邻元素不相等，即 ``nums[i] != nums[i+1]``。

下标 ``i`` 是峰值位置，当且仅当 ``nums[i]`` 严格大于它的两个邻居。
数组外侧在数学上视为 ``nums[-1]=nums[n]=-infinity``，所以首尾也可能成为峰值。

函数返回任意一个峰值的 **零基下标**。若有多个峰值，不要求固定返回哪一个。
输入只读，算法必须达到最坏 ``O(log n)`` 时间，不能线性检查全部位置。

虚拟负无穷只是定义和证明工具。代码不会读取数组外位置，也不会用 ``INT_MIN`` 充当哨兵，
因为 ``INT_MIN`` 本身是合法输入值，不能代表严格更小的虚拟值。

示例与反例
----------

官方示例一
~~~~~~~~~~

``nums = [1,2,3,1]``。下标 2 的值 3 同时大于 2 和 1，返回 2。

官方示例二
~~~~~~~~~~

``nums = [1,2,1,3,5,6,4]`` 有两个峰：下标 1 的值 2，以及下标 5 的值 6。
返回 1 或 5 都满足合同；本文实现的分支路径返回 5。

单元素边界
~~~~~~~~~~

``nums = [-2147483648]``。唯一元素虽然等于最小 32 位整数，仍严格大于两侧数学负无穷，
所以峰值下标是 0。这也说明不能把 ``INT_MIN`` 当作边界哨兵。

单调边界
~~~~~~~~

``[1,2,3,4]`` 的峰在末尾下标 3；``[4,3,2,1]`` 的峰在开头下标 0。
局部斜率二分必须覆盖这两种没有内部转折的位置。

返回值类型反例
~~~~~~~~~~~~~~

对 ``[1,3,2]``，峰值 **值** 是 3，峰值 **下标** 是 1。返回 3 会混淆问题目标。

问题抽象与解法选择
------------------

线性扫描可以找到第一个从上升转为下降的位置，时间 ``O(n)``。题目要求对数时间，
因此要用一个局部比较决定哪一半仍保证存在某个峰，而不是寻找全局最大值。

在候选闭区间 ``[left,right]`` 内取下中点 ``mid``，比较相邻元素：

* ``nums[mid] < nums[mid+1]`` 表示从中点向右上升，保留 ``[mid+1,right]``；
* 否则由相邻不等可知 ``nums[mid] > nums[mid+1]``，保留 ``[left,mid]``。

上升分支并不声称 ``mid+1`` 立即是峰；它只建立“新左端大于区间外左邻”的证书。
下降分支同理建立“新右端大于区间外右邻”的证书。两个边界证书共同保证区间内有峰。

状态、边界证书与实现映射
------------------------

维护非空闭区间 ``[left,right]``。每次循环入口保持：

#. ``0 <= left <= right < n``；
#. 左边界证书：``left=0``，或 ``nums[left] > nums[left-1]``；
#. 右边界证书：``right=n-1``，或 ``nums[right] > nums[right+1]``；
#. 由两份证书可推出区间内至少存在一个峰值。

第三条可这样理解：从 ``left`` 开始，若立即向右下降，左端已同时大于左外邻和右邻；
若向右上升，就沿有限区间寻找第一次下降，下降前位置是峰；若一直升到 ``right``，
右边界证书保证 ``right`` 大于右外邻，右端是峰。算法不实际执行这次线性寻找，
它只用该论证证明答案存在。

代码状态映射：

.. list-table::
   :header-rows: 1

   * - 代码状态
     - 证明含义
     - 安全条件
   * - ``left,right``
     - 带左右边界证书的含峰闭区间
     - 始终非空
   * - ``mid``
     - 当前下中点
     - ``left<right`` 时 ``mid<right``
   * - ``mid+1``
     - 中点右邻，用于判断局部斜率
     - 因 ``mid<right<n``，读取必合法
   * - 返回 ``left``
     - 单点区间的内部下标
     - Julia/R 需减一转换为题目零基下标

正确性证明
----------

引理一：初始区间满足边界证书
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

初始 ``left=0``、``right=n-1``，区间非空且边界合法。左端外侧和右端外侧都按合同视为
负无穷，所以两份边界证书分别由 ``left=0`` 与 ``right=n-1`` 直接成立。
因此整个数组至少含一个峰；单元素时两份证书同时落在唯一位置。

引理二：上升分支保持不变量
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

循环中 ``left<right``，故下中点满足 ``left<=mid<right``，``mid+1`` 合法。
若 ``nums[mid] < nums[mid+1]``，更新 ``left=mid+1``。

新左端严格大于它在新区间外的左邻 ``nums[mid]``，所以新的左边界证书成立；
右端没有改变，原右边界证书继续成立。新区间非空，因为 ``mid+1<=right``。
由两份边界证书，新区间仍至少含一个峰。

引理三：下降分支保持不变量
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

相邻元素不等，所以未进入小于分支时必有 ``nums[mid] > nums[mid+1]``。
更新 ``right=mid`` 后，新右端严格大于新区间外的右邻 ``nums[mid+1]``，
故新右边界证书成立；左端和左边界证书不变。

因为 ``left<=mid``，新区间非空。两份边界证书再次保证其中至少含一个峰。
这里必须保留 ``mid``；它可能已经同时大于左右邻居，直接减到 ``mid-1`` 会删除合法峰。

引理四：候选区间严格折半并终止
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

设旧长度为 ``s=right-left+1>=2``。下中点为
``left+floor((s-1)/2)``。上升分支的新长度是 ``right-mid``，
下降分支的新长度是 ``mid-left+1``，两者都不超过 ``ceil(s/2)`` 且小于 ``s``。

因此区间长度每轮严格减少，并按比例收缩；有限对数轮后必有 ``left==right``。

定理：算法返回一个合法峰值下标
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

引理一建立初始边界证书；引理二和引理三覆盖全部比较结果并保持证书；引理四保证终止。
终止时设唯一位置为 ``p=left=right``。左证书给出 ``p=0`` 或
``nums[p]>nums[p-1]``，右证书给出 ``p=n-1`` 或 ``nums[p]>nums[p+1]``。

结合虚拟负无穷边界，``nums[p]`` 严格大于左右两个邻居，所以 ``p`` 是峰值下标。
零基语言直接返回 ``p``；Julia/R 内部一基位置 ``p+1`` 减一后也返回同一零基下标。

复杂度与语言成本
----------------

每轮做一次相邻比较和常数次下标更新，候选长度至多变为 ``ceil(s/2)``，
所以最坏时间 ``O(log n)``。只维护 ``left``、``right``、``mid``，辅助空间 ``O(1)``；
返回载荷是一个整数。所有实现只读取输入，不创建切片、哨兵数组或递归栈。

Rust 平台签名按值接收 ``Vec<i32>``，只移动向量所有权，不克隆底层缓冲。
C++、Java、Go、TypeScript、C#、Julia 和 R 的数组参数也没有被修改。

十语言实现
----------

C
~

.. code-block:: c

   int findPeakElement(int *nums, int numsSize) {
       int left = 0;
       int right = numsSize - 1;

       while (left < right) {
           int mid = left + (right - left) / 2;
           if (nums[mid] < nums[mid + 1]) {
               left = mid + 1;
           } else {
               right = mid;
           }
       }
       return left;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       int findPeakElement(std::vector<int>& nums) {
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;

           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] < nums[mid + 1]) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }
           return left;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def findPeakElement(self, nums: list[int]) -> int:
           left = 0
           right = len(nums) - 1

           while left < right:
               mid = left + (right - left) // 2
               if nums[mid] < nums[mid + 1]:
                   left = mid + 1
               else:
                   right = mid
           return left

Java
~~~~

.. code-block:: java

   class Solution {
       public int findPeakElement(int[] nums) {
           int left = 0;
           int right = nums.length - 1;

           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] < nums[mid + 1]) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }
           return left;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn find_peak_element(nums: Vec<i32>) -> i32 {
           let mut left = 0usize;
           let mut right = nums.len() - 1;

           while left < right {
               let mid = left + (right - left) / 2;
               if nums[mid] < nums[mid + 1] {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }
           left as i32
       }
   }

Go
~~

.. code-block:: go

   func findPeakElement(nums []int) int {
       left := 0
       right := len(nums) - 1

       for left < right {
           mid := left + (right-left)/2
           if nums[mid] < nums[mid+1] {
               left = mid + 1
           } else {
               right = mid
           }
       }
       return left
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function findPeakElement(nums: number[]): number {
       let left = 0;
       let right = nums.length - 1;

       while (left < right) {
           const mid = left + Math.floor((right - left) / 2);
           if (nums[mid] < nums[mid + 1]) {
               left = mid + 1;
           } else {
               right = mid;
           }
       }
       return left;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int FindPeakElement(int[] nums) {
           int left = 0;
           int right = nums.Length - 1;

           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] < nums[mid + 1]) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }
           return left;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function find_peak_element(nums::Vector{Int})::Int
       left = 1
       right = length(nums)

       while left < right
           mid = left + (right - left) ÷ 2
           if nums[mid] < nums[mid + 1]
               left = mid + 1
           else
               right = mid
           end
       end
       return left - 1
   end

R
~

.. code-block:: r

   find_peak_element <- function(nums) {
     left <- 1L
     right <- length(nums)

     while (left < right) {
       mid <- left + (right - left) %/% 2L
       if (nums[mid] < nums[mid + 1L]) {
         left <- mid + 1L
       } else {
         right <- mid
       }
     }
     left - 1L
   }

人工推演与静态审查
------------------

本题没有运行、编译或测试任何题解代码，也没有执行穷举、随机对拍、属性测试、
sanitizer 或目标语言最小程序。以下证据来自逐轮纸面推演、边界证书证明和逐语言静态审查。

官方示例一推演
~~~~~~~~~~~~~~

对 ``[1,2,3,1]``：

.. list-table::
   :header-rows: 1

   * - ``left,mid,right``
     - 相邻比较
     - 更新
     - 新边界证书
   * - ``0,1,3``
     - ``2 < 3``
     - ``left=2``
     - 值 3 大于左外邻 2
   * - ``2,2,3``
     - ``3 > 1``
     - ``right=2``
     - 值 3 大于右外邻 1

两端汇合在下标 2，左右证书共同证明值 3 是峰。

官方示例二推演
~~~~~~~~~~~~~~

对 ``[1,2,1,3,5,6,4]``：

* ``(0,3,6)``：``3 < 5``，保留 ``[4,6]``；
* ``(4,5,6)``：``6 > 4``，保留 ``[4,5]``；
* ``(4,4,5)``：``5 < 6``，保留 ``[5,5]``。

返回下标 5。下标 1 也是峰，但任意合法峰都满足合同。

单元素与单调数组
~~~~~~~~~~~~~~~~

单元素循环零次，内部一基实现返回 ``1-1=0``。严格递增数组每轮进入上升分支，
最终到末下标；严格递减数组每轮进入下降分支，最终到下标 0。虚拟边界使两端成为合法峰。

逐语言静态语义审查
~~~~~~~~~~~~~~~~~~

* **C / C++ / Java / Python / Go / C#**：非空合同保证右端初始化合法；循环内
  ``mid<right``，因此 ``mid+1<=right``，相邻读取不越界。输入均未修改。
* **Rust**：``nums.len()-1`` 由非空合同支撑；``usize`` 差值非负，返回下标最大 999，
  转为 ``i32`` 安全。按值向量只移动所有权，没有克隆。
* **TypeScript**：``Math.floor`` 产生整数中点，不使用位运算；长度和全部输入整数都在
  ``number`` 精确整数域，比较保持严格次序。
* **Julia**：内部闭区间为一基；``mid+1`` 最大为 ``right``，不会访问 ``n+1``；
  最终减一把一基位置转换为题目零基下标。
* **R**：短向量长度与下标是精确整数，``%/%`` 对非负差取下中点；循环条件先保证
  ``mid+1L`` 有效，返回 ``left-1L`` 而不是峰值本身。

剩余风险
~~~~~~~~

静态审查未确认判题机语言版本和模板导入。代码依赖官方非空及相邻不等合同；若允许相邻相等，
``else`` 不再等价于严格下降，单点终止未必满足严格峰定义。没有运行、编译或测试来消除
平台签名、索引或运行时差异风险。

关键边界与失败方式
------------------

* 单元素同时由两个虚拟边界证书保护，直接返回 0。
* ``mid+1`` 只因循环使用 ``left<right`` 和下中点才安全；改成 ``left<=right`` 会越界。
* 上升只证明右半区存在某个峰，不保证右邻立刻是峰。
* 下降分支必须保留 ``mid``；它可能已经是峰值。
* 相邻不等保证 ``else`` 是严格下降；存在平台相等值时不能沿用同一证明。
* 返回的是下标而非峰值，Julia/R 必须执行一基到零基转换。
* 虚拟负无穷不能落地为 ``INT_MIN``，因为合法元素也可以是 ``INT_MIN``。
* 多峰输入不要求稳定选择，不能把与示例说明不同但合法的峰判成失败。
* “循环长得像二分”不足以证明对数界；需要候选长度至多减半的递推。

学习链与知识更新
----------------

本题的二分谓词不是全局单调布尔函数，而是局部斜率。每次比较建立一份新的区间边界证书，
证书保证所保留区间内至少存在某个峰。答案不唯一反而提供了自由：不必判断哪个峰最好，
只需持续保留一个存在性见证。

新增或强化的知识包括：

* 用“左端从外侧上升、右端向外侧下降”证明区间内必有峰；
* 上升保右、下降保左的分支本质是在更新边界证书；
* 虚拟边界只参与数学定义，不需要也不应物化为有限整数哨兵；
* 非唯一答案二分维护存在性，而不维护某个固定目标下标；
* ``mid+1`` 的合法性来自下中点与严格循环条件的组合；
* 可对照 `0153. Find Minimum in Rotated Sorted Array
  <0153-find-minimum-in-rotated-sorted-array.rst>`_：两题都收缩含答案区间，
  但本题的证书来自相邻斜率，0153 来自旋转两段结构。

带答案自检
----------

#. **为什么上升时不能直接返回 ``mid+1``？**

   ``mid+1`` 可能还继续小于它的右邻；上升只建立右半区存在峰的证书，不保证紧邻位置已经是峰。

#. **左右边界证书分别是什么？**

   左端要么是数组首项，要么严格大于它的左外邻；右端要么是数组末项，
   要么严格大于它的右外邻。

#. **下降分支为什么保留 ``mid``？**

   ``nums[mid]>nums[mid+1]`` 建立了中点的右边界证书；中点也可能大于左邻并已是峰，
   所以只能令 ``right=mid``。

#. **``mid+1`` 为什么永不越界？**

   循环只在 ``left<right`` 时执行，下中点严格小于 ``right``，故 ``mid+1<=right<n``。

#. **单点终止为什么直接得到峰？**

   当 ``left=right=p``，同一位置同时拥有左、右边界证书，结合虚拟负无穷边界，
   它严格大于两侧邻居。

#. **为什么复杂度是最坏 ``O(log n)``？**

   长度 ``s>=2`` 的闭区间在任一分支后至多剩 ``ceil(s/2)``，连续按比例收缩到 1
   只需对数轮，每轮工作为常数。
