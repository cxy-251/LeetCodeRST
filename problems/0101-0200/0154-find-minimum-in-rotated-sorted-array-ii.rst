0154. Find Minimum in Rotated Sorted Array II
=============================================

题目信息
--------

:题号: 0154
:难度: Hard
:主题: 数组、二分查找、重复值消歧、最小值见证
:原题: `LeetCode 0154 <https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/>`_
:访问状态: Available
:教学重点: 等值删除右端、值见证不变量、最坏线性退化

精确契约
--------

输入 ``nums`` 是长度 ``n`` 的非空整数数组，满足：

* ``1 <= n <= 5000``；
* ``-5000 <= nums[i] <= 5000``；
* 某个允许重复值的非递减数组被旋转了 ``1`` 至 ``n`` 次后得到 ``nums``。

函数返回数组中的最小元素，不修改输入。旋转 ``n`` 次等于保持原顺序。与 0153 不同，
最小值可能出现多次，题目也没有要求所有输入都达到 ``O(log n)``，而是要求尽量减少操作。

本解法在比较能区分两段时按比例缩小候选区间；等值无法提供方向时，只安全删除一个冗余右端。
因此最坏时间是 ``O(n)``，不是无条件 ``O(log n)``。

示例与反例
----------

官方示例一
~~~~~~~~~~

``nums = [1,3,5]``。数组保持非递减，最小值为 1。虽然输入没有重复，仍属于允许范围。

官方示例二
~~~~~~~~~~

``nums = [2,2,2,0,1]``。前三个 2 不能让最小值跨越中点，下降位置之后的 0 是答案。

自建等值消歧示例
~~~~~~~~~~~~~~~~

``nums = [10,1,10,10,10]``。初始中点与右端都为 10，但最小值在中点左侧。
等值时不能固定丢弃左半区；删除右端 10 后仍保留值 1。

对称失败反例
~~~~~~~~~~~~

``nums = [10,10,10,1,10]`` 的初始中点与右端也都为 10，但最小值在中点右侧。
这说明等值时也不能固定丢弃右半区。两个反例拥有相同的比较结果，却要求保留不同方向。

复杂度退化见证
~~~~~~~~~~~~~~

``nums = [7,7,7,7,7]``。每轮中点与右端都相等，算法只能执行 ``right -= 1``。
长度为 ``n`` 时需要 ``n-1`` 轮，给出最坏 ``Theta(n)`` 的具体输入族。

问题抽象与解法选择
------------------

设原数组为非递减序列 ``b``。旋转后仍至多由两个非递减段组成：

.. code-block:: text

   b[k], ..., b[n-1] | b[0], ..., b[k-1]

下降边界右侧从全局最小值开始，但重复值可能让同一个最小值同时出现在多个位置，
也可能让下降边界两侧的数值相同。于是 0153 的两个事实不再成立：

* 不再有唯一最小值下标；
* ``mid < right`` 不再保证 ``nums[mid] != nums[right]``。

线性扫描总能在 ``O(n)`` 时间返回最小值。更好的策略是保留二分的两个严格比较分支，
只在等值真正无法判向时退化为单步收缩。这样不会承诺不存在的最坏对数界，
同时在无歧义输入上仍能按比例排除候选。

为什么不能继续跟首元素比较
~~~~~~~~~~~~~~~~~~~~~~~~~~

重复值可让首元素、中点、右端都相同，而最小值藏在任一侧。当前右端至少提供一种可证明的
冗余关系：当它与中点相等时，即使右端恰为全局最小值，中点也保存了同值见证。
这个替代见证正是 ``right -= 1`` 安全的原因。

状态、转移与实现映射
--------------------

维护闭区间 ``[left,right]``。循环只在 ``left < right`` 时执行，取下中点
``mid = left + floor((right-left)/2)``，比较 ``nums[mid]`` 与 ``nums[right]``：

* 若大于，令 ``left = mid+1``；
* 若小于，令 ``right = mid``；
* 若相等，令 ``right = right-1``。

结束时区间只有一个位置，返回该位置的值。

.. list-table::
   :header-rows: 1

   * - 比较结果
     - 能得到的信息
     - 安全更新
   * - ``nums[mid] > nums[right]``
     - ``mid`` 与 ``right`` 之间跨过下降边界
     - 保留 ``[mid+1,right]``
   * - ``nums[mid] < nums[right]``
     - ``[mid,right]`` 不跨下降边界，中点右侧不含更小值
     - 保留 ``[left,mid]``
   * - ``nums[mid] == nums[right]``
     - 不能判定最小值在哪一侧，但右端有中点同值副本
     - 只删除 ``right``

循环不变量：保留值见证
~~~~~~~~~~~~~~~~~~~~~~

设全局最小值为 ``v``。每次循环入口保持：

#. ``0 <= left <= right < n``，候选闭区间非空；
#. 区间 ``[left,right]`` 内至少存在一个下标 ``p``，使 ``nums[p] = v``；
#. 所有下一轮读取都发生在当前非空闭区间内。

这里不固定某个最小值下标。若最小值有多个，更新可以删除其中一些，只要仍保留至少一个
同值见证即可。等值分支可能删除的正是一个最小位置，因此这一区别不是措辞变化，
而是证明能够成立的必要条件。

正确性证明
----------

引理一：大于右端时，右侧保留最小值见证
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

假设 ``nums[mid] > nums[right]``。旋转非递减数组在每个段内都不会随下标下降；
既然较早的中点值严格大于较晚的右端值，``mid`` 与 ``right`` 之间必跨过旋转下降边界。
全局最小值出现在该边界之后，因此 ``[mid+1,right]`` 中至少有一个值等于全局最小值。

中点自身严格大于右端值，更不可能是全局最小值。令 ``left = mid+1`` 后，
值见证不变量保持。

引理二：小于右端时，左侧连同中点保留见证
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

假设 ``nums[mid] < nums[right]``。若 ``mid`` 与 ``right`` 之间跨过下降边界，
中点应位于旋转前较后的段，右端位于较早的段；前者的值不小于后者，
不可能出现严格小于。因此 ``[mid,right]`` 位于同一个非递减段，
其所有位置值都不小于 ``nums[mid]``。

若 ``nums[mid]`` 就是全局最小值，中点本身是见证；若它大于全局最小值，
那么入口不变量保证的见证不可能位于 ``mid`` 右侧，只能位于 ``[left,mid)``。
两种情况都说明 ``[left,mid]`` 保留至少一个见证，所以更新 ``right = mid`` 安全。

引理三：等值时删除右端仍保留见证
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

假设 ``nums[mid] == nums[right]``。由于循环条件是 ``left < right``，下中点满足
``mid < right``，所以删除右端后，中点仍在新区间 ``[left,right-1]``。

若被删的 ``nums[right]`` 大于全局最小值，它不是见证，入口中的某个见证仍在别处。
若它等于全局最小值，则 ``nums[mid]`` 与它相等，中点就是新区间内的替代见证。
无论哪种情况，``right -= 1`` 都保持不变量。

引理四：循环必然终止
~~~~~~~~~~~~~~~~~~~~

当 ``left < right`` 时，``mid < right``。大于分支令左端至少增加 1；小于分支令右端
降到严格小于旧右端的 ``mid``；等值分支令右端减少 1。每轮都让非空闭区间长度严格减少，
所以有限轮后必有 ``left == right``。

定理：算法返回全局最小值
~~~~~~~~~~~~~~~~~~~~~~~~~~

初始区间覆盖整个非空数组，显然包含至少一个全局最小值见证。引理一、二、三覆盖三种
比较结果并保持不变量，引理四保证终止。终止时区间只有下标 ``left``，而不变量要求
这个单点区间仍含值 ``v`` 的见证，因此 ``nums[left] = v``，返回值正确。

复杂度与语言成本
----------------

设数组长度为 ``n``：

* 严格大于或小于分支会按比例缩小候选；等值分支可能只删除一个位置；
* 每轮至少删除一个候选，故最坏时间上界是 ``O(n)``；
* 全相等长度 ``n`` 的输入确实执行 ``n-1`` 次等值分支，给出 ``Omega(n)``，
  所以最坏时间为 ``Theta(n)``；
* 若执行过程中没有等值分支，退化项消失，路径与 0153 相同，为 ``O(log n)``；
* 核心算法只维护三个下标，辅助空间 ``O(1)``，返回标量也是 ``O(1)``。

所有实现只读取输入，不创建切片、辅助数组或递归栈。C++ 使用可变引用签名但不写入；
Rust 按值取得 ``Vec<i32>`` 所有权但不克隆缓冲；其余数组参数也只承载平台接口，
不改变核心 ``O(1)`` 空间结论。

十语言实现
----------

C
~

.. code-block:: c

   int findMin(int *nums, int numsSize) {
       int left = 0;
       int right = numsSize - 1;

       while (left < right) {
           int mid = left + (right - left) / 2;
           if (nums[mid] > nums[right]) {
               left = mid + 1;
           } else if (nums[mid] < nums[right]) {
               right = mid;
           } else {
               --right;
           }
       }

       return nums[left];
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       int findMin(std::vector<int>& nums) {
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;

           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] > nums[right]) {
                   left = mid + 1;
               } else if (nums[mid] < nums[right]) {
                   right = mid;
               } else {
                   --right;
               }
           }

           return nums[left];
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def findMin(self, nums: list[int]) -> int:
           left = 0
           right = len(nums) - 1

           while left < right:
               mid = left + (right - left) // 2
               if nums[mid] > nums[right]:
                   left = mid + 1
               elif nums[mid] < nums[right]:
                   right = mid
               else:
                   right -= 1

           return nums[left]

Java
~~~~

.. code-block:: java

   class Solution {
       public int findMin(int[] nums) {
           int left = 0;
           int right = nums.length - 1;

           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] > nums[right]) {
                   left = mid + 1;
               } else if (nums[mid] < nums[right]) {
                   right = mid;
               } else {
                   --right;
               }
           }

           return nums[left];
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn find_min(nums: Vec<i32>) -> i32 {
           let mut left = 0usize;
           let mut right = nums.len() - 1;

           while left < right {
               let mid = left + (right - left) / 2;
               if nums[mid] > nums[right] {
                   left = mid + 1;
               } else if nums[mid] < nums[right] {
                   right = mid;
               } else {
                   right -= 1;
               }
           }

           nums[left]
       }
   }

Go
~~

.. code-block:: go

   func findMin(nums []int) int {
       left := 0
       right := len(nums) - 1

       for left < right {
           mid := left + (right-left)/2
           if nums[mid] > nums[right] {
               left = mid + 1
           } else if nums[mid] < nums[right] {
               right = mid
           } else {
               right--
           }
       }

       return nums[left]
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function findMin(nums: number[]): number {
       let left = 0;
       let right = nums.length - 1;

       while (left < right) {
           const mid = left + Math.floor((right - left) / 2);
           if (nums[mid] > nums[right]) {
               left = mid + 1;
           } else if (nums[mid] < nums[right]) {
               right = mid;
           } else {
               right -= 1;
           }
       }

       return nums[left];
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int FindMin(int[] nums) {
           int left = 0;
           int right = nums.Length - 1;

           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] > nums[right]) {
                   left = mid + 1;
               } else if (nums[mid] < nums[right]) {
                   right = mid;
               } else {
                   --right;
               }
           }

           return nums[left];
       }
   }

Julia
~~~~~

.. code-block:: julia

   function find_min(nums::Vector{Int})::Int
       left = 1
       right = length(nums)

       while left < right
           mid = left + (right - left) ÷ 2
           if nums[mid] > nums[right]
               left = mid + 1
           elseif nums[mid] < nums[right]
               right = mid
           else
               right -= 1
           end
       end

       return nums[left]
   end

R
~

.. code-block:: r

   find_min <- function(nums) {
     left <- 1L
     right <- length(nums)

     while (left < right) {
       mid <- left + (right - left) %/% 2L
       if (nums[mid] > nums[right]) {
         left <- mid + 1L
       } else if (nums[mid] < nums[right]) {
         right <- mid
       } else {
         right <- right - 1L
       }
     }

     nums[left]
   }

人工推演与静态审查
------------------

本题没有运行、编译或测试任何题解代码，也没有执行随机对拍、穷举、属性测试、
sanitizer 或目标语言最小程序。以下证据来自逐轮纸面推演、值见证证明、
复杂度退化构造和逐语言静态语义审查。

官方示例一推演
~~~~~~~~~~~~~~

对 ``[1,3,5]``：初始 ``(left,mid,right)=(0,1,2)``，``3 < 5``，更新为
``[0,1]``；随后 ``(0,0,1)`` 满足 ``1 < 3``，更新为 ``[0,0]``，返回 1。

官方示例二推演
~~~~~~~~~~~~~~

对 ``[2,2,2,0,1]``：

.. list-table::
   :header-rows: 1

   * - ``left,mid,right``
     - 比较
     - 更新
     - 保留的最小值见证
   * - ``0,2,4``
     - ``2 > 1``
     - ``left=3``
     - 下标 3 的 0
   * - ``3,3,4``
     - ``0 < 1``
     - ``right=3``
     - 下标 3 的 0

返回 0。这个示例本身没有进入等值分支，因此不能单独证明重复值消歧正确。

自建等值示例推演
~~~~~~~~~~~~~~~~

对 ``[10,1,10,10,10]``：

* ``(0,2,4)``：``10 == 10``，删除右端后区间为 ``[0,3]``，值 1 仍在下标 1；
* ``(0,1,3)``：``1 < 10``，保留 ``[0,1]``，中点自身是见证；
* ``(0,0,1)``：``10 > 1``，保留 ``[1,1]``，返回 1。

对称反例 ``[10,10,10,1,10]`` 初始也得到 ``10 == 10``，但值 1 在中点右侧。
两者共同证明等值时不能固定选择半区；``right -= 1`` 在两者中都只删除有中点副本的 10。

退化边界推演
~~~~~~~~~~~~

长度为 5 的 ``[7,7,7,7,7]`` 依次把右端从 4 减到 3、2、1、0，执行 4 轮后
返回 7。推广到长度 ``n`` 就是 ``n-1`` 轮，静态构造已足以证明线性最坏下界。

逐语言静态语义审查
~~~~~~~~~~~~~~~~~~

* **C / C++**：官方非空合同保证右端初始化合法；``right--`` 仅在
  ``left<right`` 时执行，所以不会减到候选左端以下。C++ 引用输入未修改。
* **Python / Java / C#**：三分支互斥且完备；小于分支保留中点，等值分支只减右端，
  整数下标始终位于当前闭区间。
* **Rust**：非空合同防止 ``nums.len()-1`` 下溢；等值分支执行前有
  ``right>left>=0``，所以 ``usize`` 减一安全。向量被移动但未克隆。
* **Go**：右端为非负 ``int``；``right--`` 是语句而非表达式，位置合法。
  切片底层数组只读，代码不创建子切片。
* **TypeScript**：中点用 ``Math.floor``，没有位运算收窄；长度和值域都在
  ``number`` 精确整数范围内，比较不会引入浮点舍入差异。
* **Julia**：一基区间初始为 ``[1,length(nums)]``；单元素不入循环，等值减一前
  ``right>left>=1``，不会产生索引 0。
* **R**：一基小整数下标与 ``%/%`` 结果精确；``while`` 先检查两端，
  单元素不执行 ``right-1L``，函数不做向量子赋值。

剩余风险
~~~~~~~~

静态审查没有确认判题机语言版本、模板导入或合同外输入行为。所有实现依赖输入非空且确实来自
非递减数组旋转；任意无结构数组不满足三分支排除证明。没有执行代码来观察平台边界，
也没有用编译或测试消除语法、模板或运行时差异风险。

关键边界与失败方式
------------------

* 单元素时循环零次，唯一位置本身就是最小值见证。
* 全相等数组正确但需要线性轮数，不能宣称无条件 ``O(log n)``。
* 最小值出现多次时允许删除部分最小位置；不变量只要求至少保留一个同值见证。
* 大于分支删除中点，小于分支保留中点；两者不能合并成统一的 ``mid±1`` 模板。
* 等值时固定丢左半或右半都分别被两个自建反例推翻。
* 等值时直接返回 ``nums[right]`` 不安全；相等只说明两个端点值相同，
  区间内部仍可能存在更小值。
* 直接删除中点也没有同样的替代见证证明；本实现删除的是有中点同值副本的右端。
* 把“有利输入接近二分”写成平均 ``O(log n)`` 需要概率模型；题目没有提供该模型，
  因此这里只陈述无等值路径和最坏界。
* Rust/Julia/R 的无下溢结论来自循环入口 ``left<right``，不能脱离该条件单看减一语句。

学习链与知识更新
----------------

0153 维护唯一最小下标；本题允许重复值后，算法状态必须降级为“至少保留一个最小值见证”。
这种不变量允许删除某个答案位置，只要另一个同值位置仍在候选区间。重复值不仅增加一个代码分支，
还消除了每轮折半所需的信息，因此从根本上改变最坏复杂度。

新增或强化的知识包括：

* 当答案位置不唯一时，用值见证存在性替代固定下标不变量；
* 等值分支的安全性来自明确的替代见证，而不是“去重应该没问题”；
* 两个比较结果相同但答案方向相反的输入，是证明无法判向的有效反例对；
* 最坏上界 ``O(n)`` 与全相等族的 ``Omega(n)`` 合并为 ``Theta(n)``；
* 与 `0153. Find Minimum in Rotated Sorted Array
  <0153-find-minimum-in-rotated-sorted-array.rst>`_ 对照，可看清互异条件提供的信息价值；
* `0081. Search in Rotated Sorted Array II
  <../0001-0100/0081-search-in-rotated-sorted-array-ii.rst>`_ 也需要处理重复值造成的判向歧义，
  但目标从保留最小值见证变为保留目标存在性；
* 这类退化说明“使用二分形式”不等于“具备对数最坏界”。

带答案自检
----------

#. **为什么不能继续维护某个固定最小值下标？**

   最小值可能出现多次；等值分支可能删除其中一个最小位置，但只要中点提供同值见证，
   返回最小值的目标仍可完成。

#. **``nums[mid] == nums[right]`` 为什么不能判定最小值方向？**

   ``[10,1,10,10,10]`` 与 ``[10,10,10,1,10]`` 初始比较相同，
   但最小值分别位于中点左侧和右侧。

#. **删除右端时，谁替代可能被删除的最小值？**

   循环中 ``mid<right``；若右端值就是全局最小值，等值条件保证仍留在区间内的中点
   具有相同最小值。

#. **为什么小于分支必须保留中点？**

   中点到右端没有下降边界，中点右侧没有更小值；中点自身仍可能等于全局最小值。

#. **为什么最坏时间是 ``Theta(n)``？**

   每轮至少删一个候选给出 ``O(n)`` 上界；全相等数组每轮只能删一个右端，
   需要 ``n-1`` 轮，给出 ``Omega(n)`` 下界。

#. **什么时候仍能得到对数路径？**

   若整个执行过程中中点与右端从不相等，每轮都进入与 0153 相同的严格比较分支，
   候选长度按比例缩小，路径为 ``O(log n)``。
