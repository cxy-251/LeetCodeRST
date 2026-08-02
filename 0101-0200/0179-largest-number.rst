0179. Largest Number
====================

题目信息
--------

:题号: 0179
:难度: Medium
:主题: 字符串、排序、比较器、交换论证
:原题: `LeetCode 0179 <https://leetcode.com/problems/largest-number/>`_
:访问状态: Available
:教学重点: 拼接比较、严格弱序、相邻交换、全零归一化

精确契约
--------

输入非空整数数组 ``nums``，满足：

* ``1 <= nums.length <= 100``；
* ``0 <= nums[i] <= 10^9``；
* 把每个整数的十进制表示恰好使用一次并重新排列；
* 返回所有排列能够形成的最大十进制字符串。

返回类型必须是字符串，因为完整拼接结果可能超过任何固定宽整数。输入数组不修改。
整数的十进制表示没有前导零；若所有元素都是 0，规范输出为单个 ``"0"``，不能返回
``"00"`` 或更长的零串。

示例与反例
----------

两个元素
~~~~~~~~

``nums = [10, 2]``。比较 ``"10" + "2" = "102"`` 与
``"2" + "10" = "210"``，所以 2 必须排在 10 前面，答案是 ``"210"``。

经典组合
~~~~~~~~

``nums = [3,30,34,5,9]``。排序后为 ``9,5,34,3,30``，答案是
``"9534330"``。普通数值降序会把 30 放在 3 前面，得到更小结果。

全零输入
~~~~~~~~

``nums = [0,0]``。比较器认为两个 ``"0"`` 等价，直接拼接会得到 ``"00"``；
最终必须归一化为 ``"0"``。

前缀相同
~~~~~~~~

``nums = [121,12]``。``"12121" > "12112"``，所以 ``"12"`` 应在
``"121"`` 前面，答案是 ``"12121"``。只比较公共前缀后的长度无法可靠决定顺序。

更长项不一定靠前
~~~~~~~~~~~~~~~~

比较 ``"8308"`` 与 ``"830"``：

* ``"8308830"``；
* ``"8308308"``。

前者更大，因此 ``8308`` 在前。规则来自两种拼接的完整比较，不是“更长优先”。

问题抽象与解法选择
------------------

先把每个整数转成十进制字符串。对两个字符串 ``a`` 与 ``b``，若：

.. math::

   ab > ba

其中比较是等长十进制字符串的字典序比较，就让 ``a`` 排在 ``b`` 前面。

这里 ``ab`` 与 ``ba`` 长度相同，且只包含 ``0..9``，字典序与对应十进制串的数值大小完全一致；
无需也不能把它们解析为固定宽整数。

解法取舍
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 额外空间
     - 取舍
   * - 拼接顺序比较后排序
     - ``O(n log n)`` 次比较
     - 字符串与排序状态
     - 主解法；直接对应全局最优
   * - 枚举全部排列
     - ``O(n!)``
     - ``O(n)``
     - 只适合极小输入
   * - 按数值大小降序
     - ``O(n log n)``
     - 取决于排序
     - ``3`` 与 ``30`` 等边界会失败
   * - 按普通字符串字典序
     - ``O(n log n)``
     - 取决于排序
     - 不能处理前缀与周期关系

状态、不变量与实现映射
----------------------

虚拟拼接比较
~~~~~~~~~~~~

实现比较器时不必真的分配 ``ab`` 与 ``ba``。设 ``m=|a|``、``n=|b|``，
从位置 0 扫描到 ``m+n-1``：

* 左侧虚拟串先读 ``a``，再读 ``b``；
* 右侧虚拟串先读 ``b``，再读 ``a``；
* 第一个不同字符决定顺序；
* 全部相同则两项在排序关系中等价。

C++ 比较器使用这一虚拟读取，避免每次比较分配两个临时拼接串；它与前述 ``ab``、``ba``
的数学定义逐字符对应。

比较关系为何能交给排序 API
~~~~~~~~~~~~~~~~~~~~~~~~~~

对非空字符串 ``a``，记 ``a^ω`` 为无限重复串
``aaaa...``。定义 ``a`` 应排在 ``b`` 前面，当且仅当 ``a^ω`` 的字典序大于
``b^ω``。

设 ``A``、``B`` 分别是 ``a``、``b`` 表示的非负整数，``m=|a|``、``n=|b|``。则：

.. math::

   ab > ba
   \iff A\cdot 10^n+B > B\cdot 10^m+A
   \iff \frac{A}{10^m-1} > \frac{B}{10^n-1}

右侧两个分数正是循环小数 ``0.\overline{a}`` 与 ``0.\overline{b}`` 的值，
也就是无限周期串 ``a^ω`` 与 ``b^ω`` 的字典序。等号情形同理给出 ``ab=ba``
当且仅当两个周期串相等。这里只用分数建立证明，不在实现中构造大整数或浮点键。

因此比较器继承无限字符串字典序的性质：

* 自己与自己不构成“在前”，所以关系非自反；
* 若 ``a`` 在 ``b`` 前，``b`` 不会同时在 ``a`` 前；
* 若 ``a`` 在 ``b`` 前且 ``b`` 在 ``c`` 前，则 ``a^ω>b^ω>c^ω``，
  从而 ``a`` 在 ``c`` 前；
* ``ab=ba`` 构成等价关系，等价项任意顺序都产生相同局部拼接。

这正是排序 API 所要求的严格弱序。稳定排序不是正确性前提。

排序后不变量
~~~~~~~~~~~~

排序完成后，对任意相邻字符串 ``a,b`` 都有 ``ab >= ba``。
也就是不存在通过交换一个相邻对就能增大完整结果的逆序。

正确性证明
----------

引理一：比较器对两个元素给出局部最优顺序
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

固定完整排列中的公共前缀 ``P`` 与公共后缀 ``S``，只考虑相邻元素 ``a,b``。
两种排列结果分别是：

.. math::

   PabS,\qquad PbaS

它们拥有相同前缀 ``P``。进入相邻块后，``ab`` 与 ``ba`` 长度相同；
若 ``ab>ba``，则 ``PabS>PbaS``。所以把 ``a`` 放在 ``b`` 前面恰好是这两个元素的局部最优选择。

引理二：比较关系是合法的严格弱序
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

上一节把 ``ab`` 与 ``ba`` 的顺序等价为无限周期串 ``a^ω`` 与 ``b^ω`` 的字典序。
字典序具有传递性和不对称性；相等周期串形成传递的等价类。因此比较器满足排序算法要求，
不会出现 ``a<b``、``b<c`` 却 ``c<a`` 的循环关系。

引理三：任意未排序排列都可通过不减小结果的相邻交换变成排序结果
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若排列不符合比较器顺序，排序过程可以找到一个相邻逆序对 ``b,a``，其中 ``ab>ba``。
由引理一，把 ``b,a`` 交换为 ``a,b`` 会严格增大完整拼接；若 ``ab=ba``，交换不改变结果。

有限次相邻交换可以把任意排列变成某个按比较器排序的排列。沿途结果从不减小，
所以排序排列的结果不小于起始任意排列。

引理四：所有合法排序结果产生同一个最大拼接值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

排序关系中的非等价元素顺序由严格弱序固定。等价元素满足 ``ab=ba``，
交换它们不改变任何包含该相邻块的完整拼接。故不同排序算法或稳定性只可能重排等价项，
最终拼接值相同。

引理五：全零归一化不改变数值
~~~~~~~~~~~~~~~~~~~~~~~~

若排序后首字符是 ``'0'``，由于每个输入非负且没有前导零，所有字符串都只能是 ``"0"``。
完整拼接代表数值 0。返回单个 ``"0"`` 与该数值相同，并满足规范输出。

定理：算法返回能够形成的最大数字字符串
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

引理三说明排序结果不小于任意输入排列；引理四说明所有合法排序结果等价；
引理五处理唯一的多前导零情况。因此算法返回全局最大且格式规范的字符串。

复杂度与实现边界
----------------

设 ``n`` 为元素个数，``d_i`` 为第 ``i`` 个十进制字符串长度，
``D=sum(d_i)``，``k=max(d_i)``：

* 数字转字符串需要 ``O(D)`` 时间与 ``O(D)`` 存储；
* 排序执行 ``O(n log n)`` 次比较；
* 比较 ``a,b`` 最多扫描 ``|a|+|b| <= 2k`` 个字符，因此排序时间上界
  ``O(n k log n)``；
* 最终拼接需要 ``O(D)`` 时间，返回字符串载荷为 ``Theta(D)``；
* 核心辅助对象是 ``n`` 个字符串引用及排序工作区；字符串与返回结果合计 ``O(D+n)``；
* C++ 比较器不分配临时串，字符串数组与排序工作区属于前述 ``O(D+n)`` 载荷与工作空间；
* C++ 主入口不修改输入整数数组，最终结果单独构造并返回。

十语言实现
----------

C
~

.. code-block:: c

   #include <stddef.h>
   #include <stdint.h>
   #include <stdio.h>
   #include <stdlib.h>
   #include <string.h>

   typedef struct {
       char *text;
       size_t length;
   } NumberText;

   static int compare_number_text(const void *left_ptr, const void *right_ptr) {
       const NumberText *left = left_ptr;
       const NumberText *right = right_ptr;
       const size_t total = left->length + right->length;

       for (size_t index = 0; index < total; ++index) {
           const char left_char = index < left->length
               ? left->text[index]
               : right->text[index - left->length];
           const char right_char = index < right->length
               ? right->text[index]
               : left->text[index - right->length];

           if (left_char != right_char) {
               return left_char > right_char ? -1 : 1;
           }
       }
       return 0;
   }

   static void free_number_texts(NumberText *items, int count) {
       if (items == NULL) {
           return;
       }
       for (int index = 0; index < count; ++index) {
           free(items[index].text);
       }
       free(items);
   }

   char *largestNumber(int *nums, int numsSize) {
       NumberText *items = calloc((size_t)numsSize, sizeof(*items));
       if (items == NULL) {
           return NULL;
       }

       for (int index = 0; index < numsSize; ++index) {
           const int required = snprintf(NULL, 0, "%d", nums[index]);
           if (required < 0) {
               free_number_texts(items, numsSize);
               return NULL;
           }

           items[index].text = malloc((size_t)required + 1U);
           if (items[index].text == NULL) {
               free_number_texts(items, numsSize);
               return NULL;
           }

           const int written = snprintf(
               items[index].text,
               (size_t)required + 1U,
               "%d",
               nums[index]
           );
           if (written != required) {
               free_number_texts(items, numsSize);
               return NULL;
           }
           items[index].length = (size_t)required;
       }

       qsort(items, (size_t)numsSize, sizeof(*items), compare_number_text);

       if (items[0].text[0] == '0') {
           char *zero = malloc(2U);
           if (zero != NULL) {
               zero[0] = '0';
               zero[1] = '\0';
           }
           free_number_texts(items, numsSize);
           return zero;
       }

       size_t total_length = 0U;
       for (int index = 0; index < numsSize; ++index) {
           if (items[index].length > SIZE_MAX - total_length) {
               free_number_texts(items, numsSize);
               return NULL;
           }
           total_length += items[index].length;
       }
       if (total_length == SIZE_MAX) {
           free_number_texts(items, numsSize);
           return NULL;
       }

       char *answer = malloc(total_length + 1U);
       if (answer == NULL) {
           free_number_texts(items, numsSize);
           return NULL;
       }

       size_t offset = 0U;
       for (int index = 0; index < numsSize; ++index) {
           memcpy(answer + offset, items[index].text, items[index].length);
           offset += items[index].length;
       }
       answer[offset] = '\0';

       free_number_texts(items, numsSize);
       return answer;
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <vector>

   class Solution {
       static bool comesBefore(
           const std::string& left,
           const std::string& right
       ) {
           const std::size_t total = left.size() + right.size();
           for (std::size_t index = 0; index < total; ++index) {
               const char left_char = index < left.size()
                   ? left[index]
                   : right[index - left.size()];
               const char right_char = index < right.size()
                   ? right[index]
                   : left[index - right.size()];
               if (left_char != right_char) {
                   return left_char > right_char;
               }
           }
           return false;
       }

   public:
       std::string largestNumber(const std::vector<int>& nums) {
           std::vector<std::string> texts;
           texts.reserve(nums.size());
           for (const int value : nums) {
               texts.push_back(std::to_string(value));
           }

           std::sort(texts.begin(), texts.end(), comesBefore);
           if (texts.front() == "0") {
               return "0";
           }

           std::string answer;
           std::size_t total = 0;
           for (const std::string& text : texts) {
               total += text.size();
           }
           answer.reserve(total);
           for (const std::string& text : texts) {
               answer += text;
           }
           return answer;
       }
   };

Python
~~~~~~

.. code-block:: python

   from functools import cmp_to_key

   class Solution:
       def largestNumber(self, nums: list[int]) -> str:
           texts = [str(value) for value in nums]

           def compare(left: str, right: str) -> int:
               total = len(left) + len(right)
               for index in range(total):
                   left_char = (
                       left[index]
                       if index < len(left)
                       else right[index - len(left)]
                   )
                   right_char = (
                       right[index]
                       if index < len(right)
                       else left[index - len(right)]
                   )
                   if left_char != right_char:
                       return -1 if left_char > right_char else 1
               return 0

           texts.sort(key=cmp_to_key(compare))
           if texts[0] == "0":
               return "0"
           return "".join(texts)

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.List;

   class Solution {
       private static int compareForLargest(String left, String right) {
           int total = left.length() + right.length();
           for (int index = 0; index < total; ++index) {
               char leftChar = index < left.length()
                   ? left.charAt(index)
                   : right.charAt(index - left.length());
               char rightChar = index < right.length()
                   ? right.charAt(index)
                   : left.charAt(index - right.length());

               if (leftChar != rightChar) {
                   return leftChar > rightChar ? -1 : 1;
               }
           }
           return 0;
       }

       public String largestNumber(int[] nums) {
           List<String> texts = new ArrayList<>(nums.length);
           for (int value : nums) {
               texts.add(Integer.toString(value));
           }

           texts.sort(Solution::compareForLargest);
           if (texts.get(0).equals("0")) {
               return "0";
           }

           StringBuilder answer = new StringBuilder();
           for (String text : texts) {
               answer.append(text);
           }
           return answer.toString();
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cmp::Ordering;

   impl Solution {
       fn compare_for_largest(left: &str, right: &str) -> Ordering {
           let left_bytes = left.as_bytes();
           let right_bytes = right.as_bytes();
           let total = left_bytes.len() + right_bytes.len();

           for index in 0..total {
               let left_byte = if index < left_bytes.len() {
                   left_bytes[index]
               } else {
                   right_bytes[index - left_bytes.len()]
               };
               let right_byte = if index < right_bytes.len() {
                   right_bytes[index]
               } else {
                   left_bytes[index - right_bytes.len()]
               };

               if left_byte != right_byte {
                   return right_byte.cmp(&left_byte);
               }
           }
           Ordering::Equal
       }

       pub fn largest_number(nums: Vec<i32>) -> String {
           let mut texts: Vec<String> =
               nums.into_iter().map(|value| value.to_string()).collect();

           texts.sort_by(|left, right| {
               Self::compare_for_largest(left, right)
           });

           if texts[0] == "0" {
               return "0".to_string();
           }
           texts.concat()
       }
   }

Go
~~

.. code-block:: go

   import (
       "sort"
       "strconv"
       "strings"
   )

   func comesBefore(left string, right string) bool {
       total := len(left) + len(right)
       for index := 0; index < total; index++ {
           var leftByte byte
           if index < len(left) {
               leftByte = left[index]
           } else {
               leftByte = right[index-len(left)]
           }

           var rightByte byte
           if index < len(right) {
               rightByte = right[index]
           } else {
               rightByte = left[index-len(right)]
           }

           if leftByte != rightByte {
               return leftByte > rightByte
           }
       }
       return false
   }

   func largestNumber(nums []int) string {
       texts := make([]string, len(nums))
       totalLength := 0
       for index, value := range nums {
           texts[index] = strconv.Itoa(value)
           totalLength += len(texts[index])
       }

       sort.Slice(texts, func(i int, j int) bool {
           return comesBefore(texts[i], texts[j])
       })

       if texts[0] == "0" {
           return "0"
       }

       var builder strings.Builder
       builder.Grow(totalLength)
       for _, text := range texts {
           builder.WriteString(text)
       }
       return builder.String()
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function compareForLargest(left: string, right: string): number {
       const total = left.length + right.length;
       for (let index = 0; index < total; index++) {
           const leftCharacter = index < left.length
               ? left[index]
               : right[index - left.length];
           const rightCharacter = index < right.length
               ? right[index]
               : left[index - right.length];

           if (leftCharacter !== rightCharacter) {
               return leftCharacter > rightCharacter ? -1 : 1;
           }
       }
       return 0;
   }

   function largestNumber(nums: number[]): string {
       const texts = nums.map(String);
       texts.sort(compareForLargest);

       if (texts[0] === "0") {
           return "0";
       }
       return texts.join("");
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;
   using System.Text;

   public class Solution {
       private static int CompareForLargest(string left, string right) {
           int total = left.Length + right.Length;
           for (int index = 0; index < total; ++index) {
               char leftCharacter = index < left.Length
                   ? left[index]
                   : right[index - left.Length];
               char rightCharacter = index < right.Length
                   ? right[index]
                   : left[index - right.Length];

               if (leftCharacter != rightCharacter) {
                   return leftCharacter > rightCharacter ? -1 : 1;
               }
           }
           return 0;
       }

       public string LargestNumber(int[] nums) {
           var texts = new List<string>(nums.Length);
           int totalLength = 0;
           foreach (int value in nums) {
               string text = value.ToString();
               texts.Add(text);
               totalLength += text.Length;
           }

           texts.Sort(CompareForLargest);
           if (texts[0] == "0") {
               return "0";
           }

           var answer = new StringBuilder(totalLength);
           foreach (string text in texts) {
               answer.Append(text);
           }
           return answer.ToString();
       }
   }

Julia
~~~~~

.. code-block:: julia

   function comes_before(left::String, right::String)::Bool
       left_bytes = codeunits(left)
       right_bytes = codeunits(right)
       total = length(left_bytes) + length(right_bytes)

       for index in 1:total
           left_byte = index <= length(left_bytes) ?
               left_bytes[index] :
               right_bytes[index - length(left_bytes)]
           right_byte = index <= length(right_bytes) ?
               right_bytes[index] :
               left_bytes[index - length(right_bytes)]

           if left_byte != right_byte
               return left_byte > right_byte
           end
       end
       return false
   end

   function largest_number(nums::Vector{Int})::String
       texts = string.(nums)
       sort!(texts, lt=comes_before)

       if texts[1] == "0"
           return "0"
       end
       return join(texts)
   end

R
~

.. code-block:: r

   compare_for_largest <- function(left, right) {
     left_bytes <- left$bytes
     right_bytes <- right$bytes
     left_length <- length(left_bytes)
     right_length <- length(right_bytes)
     total <- left_length + right_length

     for (index in seq_len(total)) {
       left_byte <- if (index <= left_length) {
         left_bytes[[index]]
       } else {
         right_bytes[[index - left_length]]
       }
       right_byte <- if (index <= right_length) {
         right_bytes[[index]]
       } else {
         left_bytes[[index - right_length]]
       }

       if (left_byte != right_byte) {
         return(if (left_byte > right_byte) -1L else 1L)
       }
     }
     0L
   }

   merge_sort_records <- function(records) {
     n <- length(records)
     if (n <= 1L) {
       return(records)
     }

     buffer <- vector("list", n)
     width <- 1L

     while (width < n) {
       start <- 1L
       while (start <= n) {
         middle <- min(start + width - 1L, n)
         finish <- min(start + 2L * width - 1L, n)
         left <- start
         right <- middle + 1L
         output <- start

         while (left <= middle && right <= finish) {
           if (compare_for_largest(
             records[[left]],
             records[[right]]
           ) <= 0L) {
             buffer[[output]] <- records[[left]]
             left <- left + 1L
           } else {
             buffer[[output]] <- records[[right]]
             right <- right + 1L
           }
           output <- output + 1L
         }

         while (left <= middle) {
           buffer[[output]] <- records[[left]]
           left <- left + 1L
           output <- output + 1L
         }
         while (right <= finish) {
           buffer[[output]] <- records[[right]]
           right <- right + 1L
           output <- output + 1L
         }

         start <- start + 2L * width
       }

       temporary <- records
       records <- buffer
       buffer <- temporary
       width <- width * 2L
     }

     records
   }

   largest_number <- function(nums) {
     records <- lapply(nums, function(value) {
       text <- sprintf("%.0f", value)
       list(text = text, bytes = utf8ToInt(text))
     })

     records <- merge_sort_records(records)
     if (records[[1L]]$text == "0") {
       return("0")
     }

     paste0(
       vapply(records, function(record) record$text, character(1L)),
       collapse = ""
     )
   }

静态审查记录
------------

本题题解代码未运行、未编译、未对拍。完成了以下人工与静态检查：

* ``[10,2]``：虚拟比较 ``210 > 102``，排序为 ``2,10``；
* ``[3,30,34,5,9]``：逐对关系支持 ``9,5,34,3,30``，拼接为 ``9534330``；
* ``[0,0]``：首项为 ``"0"``，十语言都返回单个 ``"0"``；
* ``[121,12]``：``12121 > 12112``，所以 12 在前；
* ``8308`` 与 ``830`` 的前缀边界按全部 ``m+n`` 个虚拟字符比较；
* 十个比较器都把“应排在前”映射为各自排序 API 的正确方向；
* 比较器相等时不强制顺序，稳定性不影响拼接值；
* 所有实现先字符串化，不解析拼接结果为整数；
* C 的比较器无分配；转换、总长度、答案分配失败均释放已拥有资源；
* R 的归并循环只在 ``start <= n`` 时构造区间，没有依赖错误方向的 ``seq.int``；
* R 用 ``sprintf("%.0f", value)`` 固定生成十进制整数串，避免科学计数法字符进入比较器；
* 输入整数数组在所有实现中保持不变；Rust 消费 ``Vec`` 只移动容器所有权，不修改元素语义。

剩余风险：未在目标平台实际编译或执行；标准库排序对比较器的调用方式与平台签名只做静态核对。

边界、失败路径与易错点
----------------------

* 按数值降序或普通字符串降序都不是本题比较器；
* ``ab`` 与 ``ba`` 必须按字符比较，不能解析成可能溢出的整数；
* 比较器方向容易写反：最大拼接需要 ``ab>ba`` 时 ``a`` 在前；
* 比较器必须满足严格弱序，不能使用只针对示例的非传递启发式；
* 全零时只看排序后的首字符串即可，因为非零字符串一定以 ``1..9`` 开头；
* C 的 ``snprintf``、长度求和与答案分配都有失败路径；
* R 不能依赖可能采用科学计数法的通用数值格式；比较器输入必须只含 ``0..9``；
* 结果长度是实际输出载荷，不能把整体空间写成纯 ``O(n)`` 而忽略 ``D``；
* 等价项可任意排列，无需稳定排序。

知识更新与关联题目
------------------

新增
~~~~

* **拼接排序比较器**：以 ``ab`` 与 ``ba`` 决定局部顺序；
* **周期串严格弱序**：把有限拼接比较映射到无限周期字典序；
* **相邻交换证明**：消除逆序对时完整结果不减，推出全局最优；
* **虚拟拼接扫描**：不分配临时串也能执行同一比较；
* **规范化输出**：全零多串统一为单个零。
* **R 固定十进制格式**：以 ``sprintf("%.0f", value)`` 阻止科学计数法破坏数字字符合同。

强化
~~~~

* 复用 0165–0171 的 ASCII 字节扫描合同，十语言比较单位都保持为十进制代码单元；
* 延续从 0052 起的输出载荷口径，数字字符串与最终返回串合计 ``O(D)``；
* 延续 0043–0049 的 C 堆字符串所有权，全部中间串在成功或失败路径中统一清理。

关联题目
~~~~~~~~

* 0056 Merge Intervals：同样依赖排序合同，但比较键是区间起点；
* 0171 Excel Sheet Column Number：同样以字符串表达数值结构，但本题不做进制解码；
* 0321 Create Maximum Number：也通过局部字典序比较组合全局最大序列。

自检问题
--------

#. 为什么不能按原整数大小排序？
#. 相邻交换如何证明排序结果不小于任意排列？
#. 比较器为何满足传递性？
#. 为什么排序后首项为 ``"0"`` 就能断定所有项都是零？
#. C 比较器为什么选择虚拟扫描而不是构造 ``ab`` 与 ``ba``？

答案要点
~~~~~~~~

#. 两个数的局部顺序由拼接结果决定，例如 3 应在 30 前。
#. 每个逆序相邻对交换后完整拼接不减；任意排列可经有限相邻交换变成排序排列。
#. ``ab`` 与 ``ba`` 的顺序等价于周期串 ``a^ω`` 与 ``b^ω`` 的字典序，继承传递性。
#. 任意非零十进制字符串首字符都大于 ``'0'``，会被排到零之前。
#. 避免比较期间反复分配和失败处理，同时仍逐字符比较完全相同的两个虚拟拼接串。
