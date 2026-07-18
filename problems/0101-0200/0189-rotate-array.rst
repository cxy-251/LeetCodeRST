0189. Rotate Array
==================

题目信息
--------

:题号: 0189
:难度: Medium
:主题: 数组、原地变换、分段反转、模运算
:原题: `LeetCode 0189 <https://leetcode.com/problems/rotate-array/>`_
:访问状态: Available
:教学重点: 右旋方向、三次反转证明、原地空间、语言变异语义

精确契约
--------

给定整数数组 ``nums`` 和非负整数 ``k``，把数组整体向右旋转 ``k`` 步：

* 每次右旋会把最后一个元素移动到最前面；
* 官方输入保证 ``1 <= nums.length <= 10^5``；
* ``0 <= k <= 10^5``；
* 目标实现应原地修改数组；
* 核心额外空间要求为 ``O(1)``。

设数组长度为 ``n``。旋转 ``k`` 步与旋转 ``k mod n`` 步完全相同，
因此第一步必须规范化：

.. math::

   shift = k \bmod n

本章实现额外兼容空数组：若 ``n==0`` 直接返回，避免取模除零。
官方合同中数组非空。

示例与反例
----------

标准示例
~~~~~~~~

``nums=[1,2,3,4,5,6,7], k=3``，结果为 ``[5,6,7,1,2,3,4]``。

``k`` 大于数组长度
~~~~~~~~~~~~~~~~~~

``nums=[-1,-100,3,99], k=6``。因为 ``6 mod 4 = 2``，结果为 ``[3,99,-1,-100]``。

零位移
~~~~~~

``k=0`` 或 ``k`` 是 ``n`` 的倍数时，数组保持不变。
代码可以提前返回，也可以让反转区间自然为空；
本章显式提前返回，减少无意义交换。

单元素与重复元素
~~~~~~~~~~~~~~~~

* ``nums=[8], k=100``：规范化后位移为 0，结果仍是 ``[8]``；
* ``nums=[1,1,2,2], k=1``：结果为 ``[2,1,1,2]``。算法依赖位置，不依赖元素互异。

方向错误
~~~~~~~~

若执行“先反转前 ``n-k`` 项，再反转后 ``k`` 项，再反转全部”，
得到的是另一种等价写法；
若仅把三段顺序机械交换，很容易生成左旋结果。本文固定使用：

#. 反转整个数组；
#. 反转前 ``shift`` 项；
#. 反转剩余 ``n-shift`` 项。

问题抽象与解法选择
------------------

把原数组分成两段：

.. math::

   A = nums[0:n-shift],\qquad B = nums[n-shift:n]

右旋目标是 ``B + A``。记 ``rev(X)`` 为把序列 ``X`` 反转。首先反转整个数组：

.. math::

   rev(A+B)=rev(B)+rev(A)

再分别反转两段，就得到：

.. math::

   rev(rev(B))+rev(rev(A))=B+A

因此三次原地反转恰好完成右旋。

解法取舍
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 核心额外空间
     - 取舍
   * - 三次反转
     - ``O(n)``
     - ``O(1)``
     - 主解法；证明直接、跨语言稳定
   * - 环状替换
     - ``O(n)``
     - ``O(1)``
     - 需要处理多个置换环和已移动计数，边界更复杂
   * - 复制辅助数组
     - ``O(n)``
     - ``O(n)``
     - 直观，但不满足原地进阶目标
   * - 重复移动最后元素
     - ``O(nk)``
     - ``O(1)``
     - 大 ``k`` 时重复搬移不可接受

状态、不变量与实现映射
----------------------

反转辅助过程维护闭区间 ``[left,right]``。
每轮交换两端，然后 ``left++``、``right--``。
循环开始时保持：

* 区间外左侧已经放入原区间右端对应元素；
* 区间外右侧已经放入原区间左端对应元素；
* 尚未处理的元素全部位于 ``[left,right]``；
* 已处理位置不会再被修改。

当 ``left>=right`` 时，每对对称位置都完成交换，区间整体反转。

三次调用的区间分别是：

* ``[0,n-1]``；
* ``[0,shift-1]``；
* ``[shift,n-1]``。

当 ``shift==0`` 时提前返回，因此不会构造 ``[0,-1]``。
Julia 与 R 使用一基索引，对应区间为
``[1,n]``、``[1,shift]``、``[shift+1,n]``。

正确性证明
----------

引理一：``reverseRange`` 正确反转指定闭区间
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每轮交换当前最左和最右尚未处理元素，使它们进入反转后的最终位置。
随后区间向内收缩。任意原位置 ``left_0+d`` 的元素最终被放到
``right_0-d``，反之亦然；中点在奇数长度时保持原位。
循环结束后所有对称位置均正确，因此指定区间被完整反转。

引理二：反转整个数组后得到 ``rev(B)+rev(A)``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

原数组是串联序列 ``A+B``。整体逆序时，后出现的 ``B`` 先出现且内部顺序反转，
随后是内部顺序反转的 ``A``，
所以结果为 ``rev(B)+rev(A)``。

引理三：后两次反转得到 ``B+A``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``B`` 长度正是 ``shift``，因此整体反转后的前 ``shift`` 项是 ``rev(B)``；
第一段局部反转恢复为 ``B``。剩余项是 ``rev(A)``；
第二段局部反转恢复为 ``A``。两段边界互不重叠，最终数组为 ``B+A``。

引理四：``B+A`` 等于右旋 ``shift`` 步
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``B`` 是原数组最后 ``shift`` 项，右旋要求它们按原相对顺序移动到前面；
``A`` 是其余前缀，按原相对顺序接在后面。
这正是 ``B+A``。

定理：算法原地得到右旋 ``k`` 步的数组
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

规范化保证 ``shift`` 与 ``k`` 的旋转效果相同。
引理一保证三次反转各自正确，引理二至四证明组合结果是目标右旋。
所有交换直接发生在输入数组上，因此算法满足原地合同。

复杂度与语言成本
----------------

* 三个反转区间的交换总量是 ``O(n)``，时间复杂度 ``O(n)``；
* 只使用索引和一个临时元素，核心额外空间 ``O(1)``；
* C、C++、Python、Java、Rust、Go、TypeScript、C# 与 Julia 都修改调用者可见数组；
* R 的普通向量参数采用局部绑定语义，函数必须返回旋转后的向量，
  调用方接收返回值；
* Python 元组式交换、Julia 多重赋值和 R 临时变量都只保存常数个元素；
* 除 R 外，本算法不建立完整数组副本；R 的每次 ``reverse_range`` 调用
  都把向量传入新的局部绑定，修改时可能触发整向量复制，
  保守计入 ``O(n)`` 累计复制时间与 ``O(n)`` 峰值额外空间；
* R 返回的旋转向量含 ``n`` 个元素，调用者原绑定不保证改变，
  不能把抽象算法的
  ``O(1)`` 核心空间外推成 R 适配器的完整空间成本。

十语言实现
----------

C
~

.. code-block:: c

   static void reverse_range(int *nums, int left, int right) {
       while (left < right) {
           int temporary = nums[left];
           nums[left] = nums[right];
           nums[right] = temporary;
           ++left;
           --right;
       }
   }

   void rotate(int *nums, int numsSize, int k) {
       if (nums == NULL || numsSize <= 1) {
           return;
       }

       int shift = k % numsSize;
       if (shift == 0) {
           return;
       }

       reverse_range(nums, 0, numsSize - 1);
       reverse_range(nums, 0, shift - 1);
       reverse_range(nums, shift, numsSize - 1);
   }

C++
~~~

.. code-block:: cpp

   #include <utility>
   #include <vector>

   class Solution {
   public:
       void rotate(std::vector<int>& nums, int k) {
           const int n = static_cast<int>(nums.size());
           if (n <= 1) {
               return;
           }

           const int shift = k % n;
           if (shift == 0) {
               return;
           }

           reverseRange(nums, 0, n - 1);
           reverseRange(nums, 0, shift - 1);
           reverseRange(nums, shift, n - 1);
       }

   private:
       static void reverseRange(std::vector<int>& nums, int left, int right) {
           while (left < right) {
               std::swap(nums[left], nums[right]);
               ++left;
               --right;
           }
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def rotate(self, nums: list[int], k: int) -> None:
           n = len(nums)
           if n <= 1:
               return

           shift = k % n
           if shift == 0:
               return

           def reverse_range(left: int, right: int) -> None:
               while left < right:
                   nums[left], nums[right] = nums[right], nums[left]
                   left += 1
                   right -= 1

           reverse_range(0, n - 1)
           reverse_range(0, shift - 1)
           reverse_range(shift, n - 1)

Java
~~~~

.. code-block:: java

   class Solution {
       public void rotate(int[] nums, int k) {
           int n = nums.length;
           if (n <= 1) {
               return;
           }

           int shift = k % n;
           if (shift == 0) {
               return;
           }

           reverseRange(nums, 0, n - 1);
           reverseRange(nums, 0, shift - 1);
           reverseRange(nums, shift, n - 1);
       }

       private void reverseRange(int[] nums, int left, int right) {
           while (left < right) {
               int temporary = nums[left];
               nums[left] = nums[right];
               nums[right] = temporary;
               left++;
               right--;
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn rotate(nums: &mut Vec<i32>, k: i32) {
           let n = nums.len();
           if n <= 1 {
               return;
           }

           let shift = (k as usize) % n;
           if shift == 0 {
               return;
           }

           Self::reverse_range(nums, 0, n - 1);
           Self::reverse_range(nums, 0, shift - 1);
           Self::reverse_range(nums, shift, n - 1);
       }

       fn reverse_range(nums: &mut [i32], mut left: usize, mut right: usize) {
           while left < right {
               nums.swap(left, right);
               left += 1;
               right -= 1;
           }
       }
   }

Go
~~

.. code-block:: go

   func rotate(nums []int, k int) {
       n := len(nums)
       if n <= 1 {
           return
       }

       shift := k % n
       if shift == 0 {
           return
       }

       reverseRange := func(left, right int) {
           for left < right {
               nums[left], nums[right] = nums[right], nums[left]
               left++
               right--
           }
       }

       reverseRange(0, n-1)
       reverseRange(0, shift-1)
       reverseRange(shift, n-1)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function rotate(nums: number[], k: number): void {
       const n = nums.length;
       if (n <= 1) {
           return;
       }

       const shift = k % n;
       if (shift === 0) {
           return;
       }

       const reverseRange = (left: number, right: number): void => {
           while (left < right) {
               const temporary = nums[left];
               nums[left] = nums[right];
               nums[right] = temporary;
               left++;
               right--;
           }
       };

       reverseRange(0, n - 1);
       reverseRange(0, shift - 1);
       reverseRange(shift, n - 1);
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public void Rotate(int[] nums, int k) {
           int n = nums.Length;
           if (n <= 1) {
               return;
           }

           int shift = k % n;
           if (shift == 0) {
               return;
           }

           ReverseRange(nums, 0, n - 1);
           ReverseRange(nums, 0, shift - 1);
           ReverseRange(nums, shift, n - 1);
       }

       private static void ReverseRange(int[] nums, int left, int right) {
           while (left < right) {
               int temporary = nums[left];
               nums[left] = nums[right];
               nums[right] = temporary;
               left++;
               right--;
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function rotate!(nums::Vector{Int}, k::Int)::Nothing
       n = length(nums)
       if n <= 1
           return nothing
       end

       shift = mod(k, n)
       if shift == 0
           return nothing
       end

       function reverse_range!(left::Int, right::Int)
           while left < right
               nums[left], nums[right] = nums[right], nums[left]
               left += 1
               right -= 1
           end
       end

       reverse_range!(1, n)
       reverse_range!(1, shift)
       reverse_range!(shift + 1, n)
       return nothing
   end

R
~

.. code-block:: r

   rotate_array <- function(nums, k) {
     n <- length(nums)
     if (n <= 1L) {
       return(nums)
     }

     shift <- k %% n
     if (shift == 0L) {
       return(nums)
     }

     reverse_range <- function(values, left, right) {
       while (left < right) {
         temporary <- values[left]
         values[left] <- values[right]
         values[right] <- temporary
         left <- left + 1L
         right <- right - 1L
       }
       values
     }

     nums <- reverse_range(nums, 1L, n)
     nums <- reverse_range(nums, 1L, shift)
     nums <- reverse_range(nums, shift + 1L, n)
     nums
   }

静态审查记录
------------

本题代码未运行、未编译、未对拍。完成以下人工与静态检查：

* ``[1,2,3,4,5,6,7], k=3``：整体反转得到 ``[7,6,5,4,3,2,1]``，前 3 项恢复为
  ``[5,6,7]``，后 4 项恢复为 ``[1,2,3,4]``；
* ``[-1,-100,3,99], k=6``：规范化为 ``shift=2``，得到 ``[3,99,-1,-100]``；
* ``k=0``、``k=n``、``n=1`` 均提前返回；
* ``k>n`` 先取模，未重复旋转；
* 十语言均使用右旋的三次反转顺序，没有复制完整输入数组；
* C++ 直接包含 ``<utility>`` 与 ``<vector>``，
  分别提供 ``std::swap`` 和 ``std::vector``；
* Rust 在 ``shift==0`` 后才计算 ``shift-1``，避免 ``usize`` 下溢；
* Julia 一基区间是 ``1:n``、``1:shift``、``shift+1:n``，且 ``shift>0``；
* R 返回局部修改后的向量，没有错误宣称普通调用一定修改调用者绑定；
* R 三次辅助调用的整向量复制风险按 ``O(n)`` 时间与 ``O(n)`` 峰值空间单列，
  没有沿用抽象算法的 ``O(1)`` 完整空间结论；
* C 在空指针或非正长度扩展输入上安全返回，官方非空合同不受影响。

剩余风险：未在各平台实际编译或执行；
平台函数签名与容器变异行为只做静态核对。

边界、失败路径与易错点
----------------------

* 必须在非空条件下计算 ``k mod n``，否则空数组扩展会除零；
* 右旋与左旋方向不能混淆；
* ``shift==0`` 时不要在无符号语言里构造 ``shift-1``；
* 三次反转必须以规范化后的 ``shift`` 划分；
* 使用辅助数组虽然正确，空间应报告 ``O(n)``；
* R 适配器应返回结果并由调用方重新绑定；
  Julia 的 ``!`` 命名明确表示原地修改。

知识更新与关联题目
------------------

本题新增：

* **分段反转恒等式**：``rev(A+B)=rev(B)+rev(A)``；
* **闭区间反转不变量**：区间外对称位置已就位，
  未处理元素始终留在闭区间内；
* **变异可见性适配**：原地算法在 R 中需要返回式接口表达。

本题强化：

* **周期规范化**：延续 0061 Rotate List，旋转次数先按对象长度取模；
* **原地多重集守恒**：延续既有交换式原地算法，
  只改变位置，不遗漏、复制或改写元素值。

关联题目：

* 0151 Reverse Words in a String：同样可利用整体与分段反转；
* 0186 Reverse Words in a String II：原地字符数组反转思想相近，
  但该题已按 Premium 登记；
* 0061 Rotate List：旋转对象从数组换成链表，核心仍是分割尾段并移到前面。

自检问题
--------

#. 为什么要先执行 ``k mod n``？
#. 整体反转后为什么是 ``rev(B)+rev(A)``？
#. 后两次反转怎样恢复每段内部顺序？
#. R 版本为什么返回向量，而 Julia 版本可以直接修改？

答案要点
~~~~~~~~

#. 旋转 ``n`` 步回到原状态，超过一圈的部分没有新效果。
#. 整体逆序会先输出原后缀 ``B`` 的逆序，再输出原前缀 ``A`` 的逆序。
#. 分别对 ``rev(B)`` 和 ``rev(A)`` 再反转，得到 ``B`` 和 ``A``。
#. R 普通参数更新绑定在函数调用内；Julia ``Vector`` 采用共享引用语义，
   元素变异对调用方可见。
