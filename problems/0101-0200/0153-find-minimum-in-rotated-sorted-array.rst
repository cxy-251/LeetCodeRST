0153. Find Minimum in Rotated Sorted Array
==========================================

题目信息
--------

:题号: 0153
:难度: Medium
:主题: 数组、二分查找、旋转有序数组、候选区间不变量
:原题: `LeetCode 0153 <https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/>`_
:访问状态: Available
:教学重点: 中点与右端比较、保留中点、对数收缩证明

精确契约
--------

输入 ``nums`` 是长度 ``n`` 的非空整数数组，满足：

* ``1 <= n <= 5000``；
* ``-5000 <= nums[i] <= 5000``；
* 所有元素互不相同；
* 某个严格递增数组被旋转了 ``1`` 至 ``n`` 次后得到 ``nums``。

旋转 ``n`` 次等于保持原顺序，因此输入也可能整体严格递增。函数返回数组中的最小元素，
不修改输入。题目要求最坏 ``O(log n)`` 时间；线性扫描虽然正确，但不满足时间合同。

这里返回的是最小 **值**。由于元素互异，最小值只有一个下标；证明会利用这个唯一性。
十种语言都沿用各自判题平台的数组参数和整数返回值。

示例与反例
----------

官方示例一
~~~~~~~~~~

``nums = [3,4,5,1,2]``。唯一的下降位置在 5 与 1 之间，最小值为 1。

官方示例二
~~~~~~~~~~

``nums = [4,5,6,7,0,1,2]``。旋转后的两个递增段分别为 ``[4,5,6,7]``
和 ``[0,1,2]``，答案为 0。

官方示例三
~~~~~~~~~~

``nums = [11,13,15,17]``。旋转整整一周后数组保持原序，答案仍是首元素 11。

自建最小边界
~~~~~~~~~~~~

``nums = [2,1]``。中点只能取下标 0；``2 > 1`` 直接证明最小值在右侧，答案为 1。

错误规则反例
~~~~~~~~~~~~

对 ``[3,1,2]``，初始中点下标 1 正是最小值。因为 ``nums[mid] < nums[right]``，
若错误执行 ``right = mid - 1``，就会删除答案；正确更新必须是 ``right = mid``。

问题抽象与解法选择
------------------

从小到大线性扫描可在 ``O(n)`` 时间找到答案，但没有使用旋转数组的有序结构。
把原严格递增数组记作：

.. code-block:: text

   b[0] < b[1] < ... < b[n-1]

旋转后，数组至多由两个严格递增段组成：

.. code-block:: text

   较大值段                  较小值段
   b[k], ..., b[n-1] | b[0], ..., b[k-1]
                       ^
                    唯一最小值

若旋转后仍保持原序，可把较大值段看成空段，最小值位于下标 0。设唯一最小值下标为 ``m``，
则下标 ``[0,m)`` 属于较大值段，``[m,n)`` 属于较小值段；每个非空段内部都严格递增。

二分的关键不是把中点与首元素比较，而是把它与 **当前候选区间的右端** 比较。
右端为中点提供同一候选区间内的参照：

* 中点值大于右端值时，两者跨过下降断点，最小值严格在中点右侧；
* 中点值小于右端值时，中点已经处在包含最小值的递增尾段，最小值不在中点右侧；
* 因为 ``mid < right`` 且元素互异，不会出现等值。

状态、转移与实现映射
--------------------

维护闭区间 ``[left,right]``，初始为整个数组。循环条件是 ``left < right``：

#. 计算 ``mid = left + (right-left)/2`` 的向下取整值；
#. 若 ``nums[mid] > nums[right]``，令 ``left = mid + 1``；
#. 否则必有 ``nums[mid] < nums[right]``，令 ``right = mid``；
#. 当两端相等时返回 ``nums[left]``。

使用差值计算中点可避免 ``left + right`` 在更大平台约束下溢出。当前 ``n <= 5000``，
直接相加也不会溢出，但实现保留可迁移的安全写法。

代码状态与数学对象一一对应：

.. list-table::
   :header-rows: 1

   * - 代码状态
     - 数学含义
     - 更新要求
   * - ``left``
     - 候选闭区间左端
     - 只能右移到 ``mid+1``
   * - ``right``
     - 候选闭区间右端
     - 必须允许停在仍可能为答案的 ``mid``
   * - ``mid``
     - 当前区间的下中点
     - ``left < right`` 时满足 ``left <= mid < right``
   * - ``nums[right]``
     - 判断中点位于哪一递增段的参照
     - 比较后才改变边界

循环不变量
~~~~~~~~~~

每次循环入口都保持：

#. ``0 <= left <= m <= right < n``，即闭区间包含唯一最小值下标 ``m``；
#. 区间非空，所有读取下标合法；
#. 区间外被删除的位置不再可能是 ``m``。

第一条是核心正确性证书。互异条件让“保留一个最小值”与“保留唯一最小下标”在本题等价；
下一题允许重复值后，必须换成更弱的值见证不变量。

正确性证明
----------

引理一：大于右端时，最小值严格在中点右侧
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

假设循环入口不变量成立，且 ``nums[mid] > nums[right]``。

若 ``mid`` 与 ``right`` 位于同一递增段，因为 ``mid < right``，严格递增性应给出
``nums[mid] < nums[right]``，与条件矛盾。若 ``mid`` 位于较小值段，那么更靠右的
``right`` 也在该段，仍会得到同样矛盾。

所以 ``mid`` 位于下降断点左边的较大值段，``right`` 位于右边的较小值段。
唯一最小值正是较小值段首项，故 ``mid < m <= right``。删除 ``[left,mid]``，
更新为 ``left = mid+1`` 后仍有 ``left <= m <= right``。

引理二：小于右端时，最小值位于左端至中点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

假设 ``nums[mid] < nums[right]``。若 ``mid`` 位于较大值段而 ``right`` 位于较小值段，
所有较大段值都大于所有较小段值，比较结果应相反。若两者都在较大值段，
则 ``right < m``，又与入口不变量 ``m <= right`` 矛盾。

因此 ``mid`` 位于从最小值开始的较小值递增段，必有 ``m <= mid``。
结合入口不变量 ``left <= m``，得到 ``left <= m <= mid``。令 ``right = mid``
会保留最小值；不能令 ``right = mid-1``，因为 ``mid`` 可能恰等于 ``m``。

引理三：每轮严格缩短并至多保留约一半候选
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

循环入口有 ``left < right``，下中点满足 ``left <= mid < right``。第一分支把左端移到
``mid+1``，第二分支把右端移到 ``mid``，所以两者都严格缩短非空区间。

设旧区间长度为 ``s = right-left+1 >= 2``。第二分支的新长度为
``floor((s-1)/2)+1 = ceil(s/2)``；第一分支的新长度不超过 ``floor(s/2)``。
因此每轮至多保留 ``ceil(s/2)`` 个候选。

定理：算法返回数组唯一最小值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

初始化 ``[0,n-1]`` 包含唯一最小值下标，故不变量成立。引理一和引理二证明每个可达分支
都保持不变量；元素互异且 ``mid < right``，两个值不可能相等，所以分支完备。

由引理三，有限轮后必有 ``left == right``。此时不变量给出
``left <= m <= right``，只能有 ``left = right = m``。返回 ``nums[left]``
即返回唯一最小值。

复杂度与语言成本
----------------

设数组长度为 ``n``：

* 每轮进行常数次索引和比较；候选长度至多变为上取整的一半，因此时间为 ``O(log n)``；
* 核心算法只维护 ``left``、``right``、``mid``，辅助空间为 ``O(1)``；
* 返回载荷是一个整数，大小为 ``O(1)``；
* 所有实现只读取数组元素，不创建切片、辅助数组或递归栈。

C 接收指针与长度，C++ 接收 ``vector<int>&``，Go/TypeScript/C#/Julia/R 接收各自的
数组或向量引用语义；算法本身都不复制元素。Rust 平台签名按值接收 ``Vec<i32>``，会移动
向量所有权进入函数，但不会克隆底层缓冲；该接口所有权转移不等于算法新增 ``O(n)`` 分配。

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
           } else {
               right = mid;
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
               } else {
                   right = mid;
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
               else:
                   right = mid

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
               } else {
                   right = mid;
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
               } else {
                   right = mid;
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
           } else {
               right = mid
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
           } else {
               right = mid;
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
               } else {
                   right = mid;
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
           else
               right = mid
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
       } else {
         right <- mid
       }
     }

     nums[left]
   }

人工推演与静态审查
------------------

本题没有运行、编译或测试任何题解代码，也没有执行随机对拍、穷举、属性测试、
sanitizer 或目标语言最小程序。以下证据来自逐轮纸面推演、上述证明和逐语言静态审查。

官方示例一推演
~~~~~~~~~~~~~~

对 ``[3,4,5,1,2]``：

.. list-table::
   :header-rows: 1

   * - ``left,mid,right``
     - ``nums[mid]`` 与 ``nums[right]``
     - 更新
     - 新候选
   * - ``0,2,4``
     - ``5 > 2``
     - ``left=3``
     - ``[3,4]``，仍含值 1 的下标 3
   * - ``3,3,4``
     - ``1 < 2``
     - ``right=3``
     - ``[3,3]``

两端汇合在下标 3，纸面结果为 1。

官方示例二推演
~~~~~~~~~~~~~~

对 ``[4,5,6,7,0,1,2]``，状态依次为：

* ``(0,3,6)``：``7 > 2``，保留 ``[4,6]``；
* ``(4,5,6)``：``1 < 2``，保留 ``[4,5]``；
* ``(4,4,5)``：``0 < 1``，保留 ``[4,4]``。

返回下标 4 的值 0。

官方示例三与自建边界
~~~~~~~~~~~~~~~~~~~~

``[11,13,15,17]`` 先由 ``(0,1,3)`` 收缩到 ``[0,1]``，再由 ``(0,0,1)``
收缩到 ``[0,0]``，返回 11。``[2,1]`` 的唯一一轮比较为 ``2 > 1``，
候选从 ``[0,1]`` 变为 ``[1,1]``，返回 1。

逐语言静态语义审查
~~~~~~~~~~~~~~~~~~

* **C / C++**：非空合同保证 ``numsSize-1`` 和 ``size()-1`` 合法；C++ 在减一前
  把非空长度转为 ``int``，而 ``n<=5000`` 可表示。两个实现不修改输入。
* **Python / Java / C#**：整除或整数除法对非负下标差向下取整；闭区间更新与
  平台零基数组一致，方法签名和返回类型保持平台形式。
* **Rust**：非空合同防止 ``usize`` 下溢；只有 ``left<right`` 才计算中点，
  所以 ``mid<right``。按值 ``Vec`` 被移动但未克隆或修改。
* **Go**：切片非空保证右端合法；``right-left`` 非负，整数除法给出下中点；
  切片描述符按值传递，底层数组只读。
* **TypeScript**：``Math.floor`` 显式得到整数中点；下标最大 4999，远低于
  ``number`` 的精确整数上限，代码没有使用会收窄到 32 位的位运算。
* **Julia**：边界从 1 开始，``÷`` 对非负差给出整数下中点；循环不使用
  ``1:0`` 一类范围，单元素直接返回 ``nums[1]``。
* **R**：``length(nums)`` 在当前规模精确，``%/%`` 对非负差给出有效一基中点；
  下标始终是精确小整数，函数没有触发向量子赋值或显式复制。

剩余风险
~~~~~~~~

静态审查没有确认各判题机的实际语言版本、模板导入或空输入防御行为；实现依赖官方非空、互异和
旋转递增合同。若调用者传入空数组，多个语言会在初始化或最终读取时失败；若允许重复值，
``nums[mid] == nums[right]`` 将出现，本题两分支代码不再足够。没有用执行或编译消除这些风险。

关键边界与失败方式
------------------

* 单元素时循环零次，初始唯一候选直接返回。
* 未有效旋转时，每轮都是小于右端分支，候选稳定向下标 0 收缩。
* 两元素时下中点等于左端，两种相对顺序分别触发两个分支。
* 大于右端分支必须删除中点，因为中点位于较大值段，不可能是最小值。
* 小于右端分支必须保留中点；写成 ``right=mid-1`` 会在中点为答案时失败。
* 循环条件必须是 ``left<right``；若在单点区间继续比较，中点与右端会是同一下标，
  互异元素也会得到等值。
* 只写“用了二分所以是 ``O(log n)``”不充分；复杂度来自每轮新长度至多为
  ``ceil(s/2)`` 的长度递推。
* 把中点与固定的原数组末端比较，却又在证明中当作当前右端，会造成代码与不变量错位。
* 当前算法依赖元素互异；允许重复值时不能把等值随意归入任一不等分支。

学习链与知识更新
----------------

这道题的二分目标不是查找一个给定值，而是维护“唯一最小值下标仍在候选闭区间内”。
旋转数组至多一个下降断点，使中点与当前右端的相对大小能够识别二者是否跨段；
``right=mid`` 则展示了二分中“中点是否还是候选”必须由证明决定，不能机械套用 ``mid±1``。

新增或强化的知识包括：

* 用旋转后两个递增段的结构证明整段排除，而不靠图形直觉；
* 闭区间二分中，下中点配合 ``left=mid+1`` 或 ``right=mid`` 保证严格收缩；
* 唯一答案下标不变量把返回值正确性转化为单点终止；
* 候选长度递推是最坏对数复杂度的正式依据；
* 可关联 `0033. Search in Rotated Sorted Array
  <../0001-0100/0033-search-in-rotated-sorted-array.rst>`_ 的旋转段判定；
* 下一题 `0154. Find Minimum in Rotated Sorted Array II
  <0154-find-minimum-in-rotated-sorted-array-ii.rst>`_ 加入重复值后，需要最小值见证与等值消歧；
* `0162. Find Peak Element <0162-find-peak-element.rst>`_ 同样用局部比较维护答案存在区间，
  但其结构证书来自相邻坡度而不是旋转断点。

带答案自检
----------

#. **为什么比较当前 ``right``，而不是只比较固定的最后一个元素？**

   不变量描述的是不断缩小的候选区间；当前右端保证参照点仍与中点属于同一候选结构，
   分支证明才能直接排除区间。固定末端可能早已位于候选区间之外。

#. **为什么 ``nums[mid] > nums[right]`` 时可以删除中点？**

   同段内部严格递增，不会出现左位置值大于右位置值；该比较证明中点在较大段、
   右端在较小段，所以唯一最小值严格位于中点右侧。

#. **为什么另一分支不能执行 ``right = mid-1``？**

   小于右端只能证明最小值不在中点右侧；中点自身可能正是唯一最小值，必须保留。

#. **互异条件具体消除了哪个分支？**

   循环内 ``mid<right``，两处是不同下标；互异保证二者值不等，只需处理大于和小于。

#. **最坏 ``O(log n)`` 怎样从代码推出？**

   旧区间长度为 ``s`` 时，任一分支的新长度至多为 ``ceil(s/2)``；连续折半至 1
   只需对数轮，每轮工作为常数。

#. **为什么终止时无需再比较候选？**

   不变量保证唯一最小下标在 ``[left,right]``；当两端相等，区间只有一个下标，
   它必然就是最小下标。
