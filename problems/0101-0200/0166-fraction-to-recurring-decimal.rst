0166. Fraction to Recurring Decimal
====================================

题目信息
--------

:题号: 0166
:难度: Medium
:主题: 数学、长除法、哈希状态、字符串构造
:原题: `LeetCode 0166 <https://leetcode.com/problems/fraction-to-recurring-decimal/>`_
:访问状态: Available
:教学重点: 余数状态循环、首次位置映射、宽整数符号处理、输出与资源成本

精确契约
--------

输入 ``numerator`` 与 ``denominator`` 都在有符号 32 位整数范围内，且 ``denominator != 0``。
返回该有理数的十进制字符串：

* 整数部分按普通十进制输出，不保留多余前导零；
* 有限小数直接在最后一位结束；
* 无限循环小数把最小循环状态对应的重复部分放入一对圆括号；
* 结果为负时只在最前面输出一个负号；
* 数值为零时返回 ``"0"``，不能产生 ``"-0"``；
* 题目保证最终答案长度小于 10000。

输入不修改。固定宽整数语言必须先把两个参数提升到 64 位，再进行取绝对值、除法和乘十。
原因是 ``-2^31`` 的绝对值 ``2^31`` 无法由有符号 32 位整数表示。

示例与反例
----------

有限小数
~~~~~~~~

``1 / 2 = 0.5``。余数 1 乘十后得到商数字 5，新余数为 0，因此小数结束。

整除
~~~~

``2 / 1 = 2``。整数部分计算后余数已经为 0，不应输出小数点。

纯循环
~~~~~~

``4 / 333 = 0.(012)``。长除法余数依次为 ``4 -> 40 -> 67 -> 4``；
余数 4 第二次出现时，后续数字状态已经回到起点，因此 ``012`` 循环。

非循环前缀加循环
~~~~~~~~~~~~~~~~

``1 / 6 = 0.1(6)``。第一位数字 1 之后余数变为 4；余数 4 随后反复产生数字 6。
括号起点由余数 4 第一次出现时的输出位置决定，不能把整个小数 ``16`` 都放入括号。

符号与最小整数
~~~~~~~~~~~~~~

``-2147483648 / -1 = 2147483648``。若先在 32 位整数中调用 ``abs``，会发生溢出。
正确顺序是先转成 64 位，再取正的数值幅度。

错误循环判据
~~~~~~~~~~~~

不能因为商数字重复就立即判定循环。例如 ``1 / 12 = 0.08(3)``，前两位可以出现与后续无关的重复模式；
真正决定未来数字序列的是当前余数。只有同一个余数再次出现，才说明长除法状态完全重复。

问题抽象与解法选择
------------------

浮点格式化不能作为主解法。双精度浮点数只能保存有限精度，无法可靠区分“有限但很长”与“无限循环”，
也不能准确恢复循环节起点。

长除法只需要维护当前余数。设正数幅度为 ``N``、``D``，整数部分和初始余数为：

.. math::

   N = qD + r_0,\qquad 0 \le r_0 < D

若 ``r_0=0``，答案就是整数部分。否则逐位执行：

.. math::

   10r_{i-1}=d_iD+r_i,\qquad 0\le d_i\le 9,\quad 0\le r_i<D

其中 ``d_i`` 是第 ``i`` 位小数数字，``r_i`` 是生成该数字后的新余数。

每轮在产生下一位数字之前，把当前非零余数映射到当前输出长度：

``remainder -> next_digit_position``

如果余数第一次出现，记录位置并继续长除法；如果余数已经出现，在其首次位置插入左括号，
在输出末尾追加右括号。余数而不是商数字构成确定状态，因此该位置正是循环入口。

解法取舍
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 正确性与成本
     - 取舍
   * - 余数位置哈希 + 长除法
     - 输出敏感；期望 ``O(L)`` 时间、``O(L)`` 空间
     - 主解法；直接得到循环入口
   * - 按分母大小建立位置数组
     - 可以 ``O(D)`` 空间
     - ``D`` 可达 ``2^31``，即使答案很短也无法分配
   * - 浮点格式化后寻找重复
     - 精度与截断使结果不可靠
     - 不能证明循环节与原分数一致
   * - 保存全部历史数字并枚举周期
     - 最坏需要反复比较后缀
     - 余数状态已经提供更直接的判据

状态、不变量与实现映射
----------------------

符号归一化
~~~~~~~~~~

零分子先返回 ``"0"``。对非零结果：

* ``negative`` 表示两个原参数符号是否不同；
* ``N=|numerator|``、``D=|denominator|`` 在提升后的宽类型中计算；
* 后续长除法只处理正数，负号只影响输出前缀。

这样可以同时避免 ``abs(INT_MIN)`` 和负零。

长除法不变量
~~~~~~~~~~~~

生成 ``k`` 位小数后，设这些数字为 ``d_1...d_k``，当前余数为 ``r_k``，始终有：

.. math::

   \frac{N}{D}
   =
   q+\sum_{i=1}^{k}\frac{d_i}{10^i}
   +\frac{r_k}{D\cdot 10^k}

并保持 ``0 <= r_k < D``。

初始化时 ``k=0``，公式就是 ``N=qD+r_0``。若本轮满足
``10r_k=d_{k+1}D+r_{k+1}``，则：

.. math::

   \frac{r_k}{D\cdot10^k}
   =
   \frac{d_{k+1}}{10^{k+1}}
   +\frac{r_{k+1}}{D\cdot10^{k+1}}

因此追加数字并更新余数后，不变量继续成立。

余数位置映射
~~~~~~~~~~~~

在生成下一位之前记录 ``positions[r_k]``，其值是下一位数字将在输出中出现的位置。映射保持：

* 每个键都是此前出现过的非零余数；
* 对应位置紧邻该余数首次负责生成的数字之前；
* 当前余数尚未重复时，输出中的小数数字正是此前长除法得到的前缀；
* 当前余数重复时，从首次位置开始的状态转移和数字输出将逐轮重复。

记录动作必须发生在 ``remainder *= 10`` 之前。乘十后的数值已经不是当前状态；
若此时才记录，循环入口会偏移一位。

正确性证明
----------

引理一：每一位数字和新余数符合十进制长除法
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对任意当前余数 ``0<=r<D``，``10r`` 除以正数 ``D`` 得到唯一的商和余数：

.. math::

   d=\left\lfloor\frac{10r}{D}\right\rfloor,\qquad
   r'=10r-dD

因为 ``0<=10r<10D``，所以 ``d`` 必在 ``0..9``，且 ``0<=r'<D``。
因此算法追加的字符正是下一位十进制数字，新余数也保持合法范围。

引理二：已生成前缀与原分数数值一致
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

长除法不变量初始化成立。引理一给出的等式把当前剩余项精确拆成下一位数字和新的剩余项，
所以每轮保持不变量。算法从未使用近似浮点运算；任意有限前缀都与原分数的精确十进制展开一致。

引理三：余数为零当且仅当十进制展开在当前位置终止
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若当前余数为零，不变量中的剩余项为零，已经生成的有限字符串精确等于原分数，后面无需数字。

反过来，长除法若在当前位置能够精确终止，则已经生成的整数和有限小数部分等于原分数，
不变量中的剩余项只能为零；因为 ``D`` 和 ``10^k`` 为正，所以当前余数必须是零。

引理四：非零余数重复必然且重复后数字完全循环
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

合法非零余数只有 ``1..D-1``。每个余数的下一位数字和下一余数都由
``divmod(10r,D)`` 唯一决定。

若过程一直不遇到零，有限个非零余数中最终必有某个余数重复。相同余数再次出现时，
之后每一步都应用相同的确定转移，所以产生相同数字和相同后继余数，整个后缀周期性重复。

引理五：首次记录位置给出规范的非循环前缀和循环部分
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

算法第一次遇到某余数时记录它，第一次发现任意重复时立即停止。此时从初始余数出发形成的状态路径可唯一
分解为不重复前缀和一个状态环。重复余数第一次出现的位置正是状态环入口；入口之前的余数从未再次出现，
因此对应数字属于非循环前缀。入口到当前末尾的状态依次构成完整一圈，括号包围的数字会无限重复。

定理：算法返回题目要求的十进制表示
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

符号归一化正确恢复原分数正负，零分子单独返回避免负零。整数部分来自精确整数除法。
若余数变为零，由引理二和引理三，当前有限字符串就是目标值。若余数重复，
引理四证明括号内数字无限循环，引理五证明括号起点和循环范围正确。
两种情况覆盖全部输入，因为非零余数序列要么到达零，要么在有限状态集合中重复，因此算法必然终止。

复杂度与语言成本
----------------

设实际生成的小数数字数为 ``L``，出现过的不同非零余数数为 ``r``，则 ``r<=L``。
题目保证最终答案长度小于 10000。

* 长除法每轮生成一位，哈希查询和插入在通常假设下为期望 ``O(1)``，核心期望时间 ``O(L)``；
* 哈希表在极端冲突下单次操作可能退化，通用最坏时间可达 ``O(L^2)``；
* 括号只插入一次，数组或字符串搬移需要 ``O(L)``，不改变期望线性总界；
* 余数表占 ``O(r)``，输出及构建缓冲占 ``O(L)``；
* ``remainder < D <= 2^31``，所以 ``remainder*10 < 2^31*10``，64 位整数安全；
* TypeScript 和 R 的最大整数中间量约为 ``2.15*10^10``，远低于双精度精确整数上界 ``2^53``。

语言适配成本：

* C 使用动态字符串和开放寻址哈希表；成功返回堆字符串，调用者负责释放；
* C++、Java、Rust、Go、C#、Julia 使用各自哈希容器与可增长字符串或字节缓冲；
* Python、TypeScript 在发现循环时对字符数组执行一次插入；
* R 使用固定上界字符槽和环境哈希，避免逐位 ``c`` 导致累计二次复制；
* Java、C# 的 ``StringBuilder.Insert``，Rust 的 ``String.insert``，Go/Julia 的字节搬移均有一次 ``O(L)`` 成本。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdint.h>
   #include <stddef.h>
   #include <stdlib.h>
   #include <string.h>

   struct StringBuilder {
       char *data;
       size_t length;
       size_t capacity;
   };

   struct RemainderEntry {
       uint64_t remainder;
       size_t position;
       unsigned char used;
   };

   struct RemainderMap {
       struct RemainderEntry *entries;
       size_t size;
       size_t capacity;
   };

   static int builder_init(struct StringBuilder *builder) {
       builder->capacity = 32;
       builder->length = 0;
       builder->data = malloc(builder->capacity);
       if (builder->data == NULL) {
           return 0;
       }
       builder->data[0] = '\0';
       return 1;
   }

   static int builder_reserve(
       struct StringBuilder *builder,
       size_t needed_length
   ) {
       if (needed_length > SIZE_MAX - 1) {
           return 0;
       }
       size_t required = needed_length + 1;
       if (required <= builder->capacity) {
           return 1;
       }

       size_t next_capacity = builder->capacity;
       while (next_capacity < required) {
           if (next_capacity > SIZE_MAX / 2) {
               next_capacity = required;
               break;
           }
           next_capacity *= 2;
       }

       char *next_data = realloc(builder->data, next_capacity);
       if (next_data == NULL) {
           return 0;
       }
       builder->data = next_data;
       builder->capacity = next_capacity;
       return 1;
   }

   static int builder_append_char(
       struct StringBuilder *builder,
       char character
   ) {
       if (!builder_reserve(builder, builder->length + 1)) {
           return 0;
       }
       builder->data[builder->length++] = character;
       builder->data[builder->length] = '\0';
       return 1;
   }

   static int builder_append_u64(
       struct StringBuilder *builder,
       uint64_t value
   ) {
       char reversed[32];
       size_t count = 0;

       do {
           reversed[count++] = (char)('0' + value % 10);
           value /= 10;
       } while (value != 0);

       while (count > 0) {
           if (!builder_append_char(builder, reversed[--count])) {
               return 0;
           }
       }
       return 1;
   }

   static int builder_insert_left_parenthesis(
       struct StringBuilder *builder,
       size_t position
   ) {
       if (position > builder->length) {
           return 0;
       }
       if (!builder_reserve(builder, builder->length + 1)) {
           return 0;
       }
       memmove(
           builder->data + position + 1,
           builder->data + position,
           builder->length - position + 1
       );
       builder->data[position] = '(';
       ++builder->length;
       return 1;
   }

   static uint64_t hash_remainder(uint64_t value) {
       value ^= value >> 30;
       value *= UINT64_C(0xbf58476d1ce4e5b9);
       value ^= value >> 27;
       value *= UINT64_C(0x94d049bb133111eb);
       return value ^ (value >> 31);
   }

   static int remainder_map_init(struct RemainderMap *map) {
       map->capacity = 16;
       map->size = 0;
       map->entries = calloc(map->capacity, sizeof(*map->entries));
       return map->entries != NULL;
   }

   static void remainder_map_destroy(struct RemainderMap *map) {
       free(map->entries);
   }

   static int remainder_map_find(
       const struct RemainderMap *map,
       uint64_t remainder,
       size_t *position
   ) {
       size_t index =
           (size_t)(hash_remainder(remainder) & (map->capacity - 1));

       while (map->entries[index].used) {
           if (map->entries[index].remainder == remainder) {
               *position = map->entries[index].position;
               return 1;
           }
           index = (index + 1) & (map->capacity - 1);
       }
       return 0;
   }

   static void remainder_map_insert_raw(
       struct RemainderEntry *entries,
       size_t capacity,
       uint64_t remainder,
       size_t position
   ) {
       size_t index =
           (size_t)(hash_remainder(remainder) & (capacity - 1));
       while (entries[index].used) {
           index = (index + 1) & (capacity - 1);
       }
       entries[index].used = 1;
       entries[index].remainder = remainder;
       entries[index].position = position;
   }

   static int remainder_map_rehash(struct RemainderMap *map) {
       if (map->capacity > SIZE_MAX / 2) {
           return 0;
       }
       size_t next_capacity = map->capacity * 2;
       if (next_capacity > SIZE_MAX / sizeof(*map->entries)) {
           return 0;
       }

       struct RemainderEntry *next_entries =
           calloc(next_capacity, sizeof(*next_entries));
       if (next_entries == NULL) {
           return 0;
       }

       for (size_t index = 0; index < map->capacity; ++index) {
           if (map->entries[index].used) {
               remainder_map_insert_raw(
                   next_entries,
                   next_capacity,
                   map->entries[index].remainder,
                   map->entries[index].position
               );
           }
       }

       free(map->entries);
       map->entries = next_entries;
       map->capacity = next_capacity;
       return 1;
   }

   static int remainder_map_put(
       struct RemainderMap *map,
       uint64_t remainder,
       size_t position
   ) {
       if (map->size + 1 > (map->capacity * 2) / 3) {
           if (!remainder_map_rehash(map)) {
               return 0;
           }
       }

       remainder_map_insert_raw(
           map->entries,
           map->capacity,
           remainder,
           position
       );
       ++map->size;
       return 1;
   }

   char *fractionToDecimal(int numerator, int denominator) {
       if (denominator == 0) {
           return NULL;
       }
       if (numerator == 0) {
           char *zero = malloc(2);
           if (zero != NULL) {
               zero[0] = '0';
               zero[1] = '\0';
           }
           return zero;
       }

       int64_t signed_numerator = (int64_t)numerator;
       int64_t signed_denominator = (int64_t)denominator;
       int negative =
           (signed_numerator < 0) != (signed_denominator < 0);

       uint64_t numerator_abs = signed_numerator < 0
           ? (uint64_t)(-signed_numerator)
           : (uint64_t)signed_numerator;
       uint64_t denominator_abs = signed_denominator < 0
           ? (uint64_t)(-signed_denominator)
           : (uint64_t)signed_denominator;

       struct StringBuilder builder;
       if (!builder_init(&builder)) {
           return NULL;
       }

       if (
           (negative && !builder_append_char(&builder, '-')) ||
           !builder_append_u64(
               &builder,
               numerator_abs / denominator_abs
           )
       ) {
           free(builder.data);
           return NULL;
       }

       uint64_t remainder = numerator_abs % denominator_abs;
       if (remainder == 0) {
           return builder.data;
       }
       if (!builder_append_char(&builder, '.')) {
           free(builder.data);
           return NULL;
       }

       struct RemainderMap positions;
       if (!remainder_map_init(&positions)) {
           free(builder.data);
           return NULL;
       }

       while (remainder != 0) {
           size_t cycle_start = 0;
           if (
               remainder_map_find(
                   &positions,
                   remainder,
                   &cycle_start
               )
           ) {
               if (
                   !builder_insert_left_parenthesis(
                       &builder,
                       cycle_start
                   ) ||
                   !builder_append_char(&builder, ')')
               ) {
                   remainder_map_destroy(&positions);
                   free(builder.data);
                   return NULL;
               }
               break;
           }

           if (
               !remainder_map_put(
                   &positions,
                   remainder,
                   builder.length
               )
           ) {
               remainder_map_destroy(&positions);
               free(builder.data);
               return NULL;
           }

           remainder *= 10;
           uint64_t digit = remainder / denominator_abs;
           if (
               !builder_append_char(
                   &builder,
                   (char)('0' + digit)
               )
           ) {
               remainder_map_destroy(&positions);
               free(builder.data);
               return NULL;
           }
           remainder %= denominator_abs;
       }

       remainder_map_destroy(&positions);
       return builder.data;
   }

C 使用成功或失败的事务式构造。任意字符串或哈希分配失败都会释放已拥有对象并返回 ``NULL``；
成功时返回独立堆字符串。题目平台通常没有单独的错误通道，调用者仍需按 C 接口释放结果。

C++
~~~

.. code-block:: cpp

   #include <string>
   #include <unordered_map>

   class Solution {
   public:
       std::string fractionToDecimal(int numerator, int denominator) {
           if (numerator == 0) {
               return "0";
           }

           long long n = numerator;
           long long d = denominator;
           bool negative = (n < 0) != (d < 0);
           if (n < 0) {
               n = -n;
           }
           if (d < 0) {
               d = -d;
           }

           std::string result;
           if (negative) {
               result.push_back('-');
           }
           result += std::to_string(n / d);

           long long remainder = n % d;
           if (remainder == 0) {
               return result;
           }
           result.push_back('.');

           std::unordered_map<long long, std::size_t> positions;
           while (remainder != 0) {
               auto found = positions.find(remainder);
               if (found != positions.end()) {
                   result.insert(found->second, 1, '(');
                   result.push_back(')');
                   break;
               }

               positions.emplace(remainder, result.size());
               remainder *= 10;
               result.push_back(
                   static_cast<char>('0' + remainder / d)
               );
               remainder %= d;
           }

           return result;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def fractionToDecimal(
           self,
           numerator: int,
           denominator: int,
       ) -> str:
           if numerator == 0:
               return "0"

           negative = (numerator < 0) != (denominator < 0)
           n = abs(numerator)
           d = abs(denominator)

           characters: list[str] = []
           if negative:
               characters.append("-")
           integer_part, remainder = divmod(n, d)
           characters.extend(str(integer_part))

           if remainder == 0:
               return "".join(characters)
           characters.append(".")

           positions: dict[int, int] = {}
           while remainder != 0:
               if remainder in positions:
                   cycle_start = positions[remainder]
                   characters.insert(cycle_start, "(")
                   characters.append(")")
                   break

               positions[remainder] = len(characters)
               digit, remainder = divmod(remainder * 10, d)
               characters.append(str(digit))

           return "".join(characters)

Java
~~~~

.. code-block:: java

   import java.util.HashMap;
   import java.util.Map;

   class Solution {
       public String fractionToDecimal(int numerator, int denominator) {
           if (numerator == 0) {
               return "0";
           }

           long n = numerator;
           long d = denominator;
           boolean negative = (n < 0) ^ (d < 0);
           if (n < 0) {
               n = -n;
           }
           if (d < 0) {
               d = -d;
           }

           StringBuilder result = new StringBuilder();
           if (negative) {
               result.append('-');
           }
           result.append(n / d);

           long remainder = n % d;
           if (remainder == 0) {
               return result.toString();
           }
           result.append('.');

           Map<Long, Integer> positions = new HashMap<>();
           while (remainder != 0) {
               Integer cycleStart = positions.get(remainder);
               if (cycleStart != null) {
                   result.insert(cycleStart, '(');
                   result.append(')');
                   break;
               }

               positions.put(remainder, result.length());
               remainder *= 10;
               result.append(remainder / d);
               remainder %= d;
           }

           return result.toString();
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::collections::HashMap;

   impl Solution {
       pub fn fraction_to_decimal(
           numerator: i32,
           denominator: i32,
       ) -> String {
           if numerator == 0 {
               return "0".to_string();
           }

           let mut n = i64::from(numerator);
           let mut d = i64::from(denominator);
           let negative = (n < 0) != (d < 0);
           if n < 0 {
               n = -n;
           }
           if d < 0 {
               d = -d;
           }

           let mut result = String::new();
           if negative {
               result.push('-');
           }
           result.push_str(&(n / d).to_string());

           let mut remainder = n % d;
           if remainder == 0 {
               return result;
           }
           result.push('.');

           let mut positions: HashMap<i64, usize> = HashMap::new();
           while remainder != 0 {
               if let Some(&cycle_start) = positions.get(&remainder) {
                   result.insert(cycle_start, '(');
                   result.push(')');
                   break;
               }

               positions.insert(remainder, result.len());
               remainder *= 10;
               let digit = (remainder / d) as u8;
               result.push(char::from(b'0' + digit));
               remainder %= d;
           }

           result
       }
   }

Rust 的位置是 UTF-8 字节位置；本题输出只含 ASCII，因此每个记录位置都是合法字符边界。

Go
~~

.. code-block:: go

   import "strconv"

   func fractionToDecimal(numerator int, denominator int) string {
       if numerator == 0 {
           return "0"
       }

       n := int64(numerator)
       d := int64(denominator)
       negative := (n < 0) != (d < 0)
       if n < 0 {
           n = -n
       }
       if d < 0 {
           d = -d
       }

       result := make([]byte, 0, 32)
       if negative {
           result = append(result, '-')
       }
       result = strconv.AppendInt(result, n/d, 10)

       remainder := n % d
       if remainder == 0 {
           return string(result)
       }
       result = append(result, '.')

       positions := make(map[int64]int)
       for remainder != 0 {
           if cycleStart, exists := positions[remainder]; exists {
               oldLength := len(result)
               result = append(result, 0)
               copy(
                   result[cycleStart+1:],
                   result[cycleStart:oldLength],
               )
               result[cycleStart] = '('
               result = append(result, ')')
               break
           }

           positions[remainder] = len(result)
           remainder *= 10
           result = append(result, byte('0'+remainder/d))
           remainder %= d
       }

       return string(result)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function fractionToDecimal(
       numerator: number,
       denominator: number,
   ): string {
       if (numerator === 0) {
           return "0";
       }

       const negative = (numerator < 0) !== (denominator < 0);
       const n = Math.abs(numerator);
       const d = Math.abs(denominator);

       const characters: string[] = [];
       if (negative) {
           characters.push("-");
       }
       characters.push(String(Math.trunc(n / d)));

       let remainder = n % d;
       if (remainder === 0) {
           return characters.join("");
       }
       characters.push(".");

       const positions = new Map<number, number>();
       while (remainder !== 0) {
           const cycleStart = positions.get(remainder);
           if (cycleStart !== undefined) {
               characters.splice(cycleStart, 0, "(");
               characters.push(")");
               break;
           }

           positions.set(remainder, characters.length);
           remainder *= 10;
           characters.push(String(Math.trunc(remainder / d)));
           remainder %= d;
       }

       return characters.join("");
   }

所有数值中间量都低于 ``2^53``，这里不需要 ``BigInt``。不能使用 32 位位运算代替整数除法。

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;
   using System.Text;

   public class Solution {
       public string FractionToDecimal(
           int numerator,
           int denominator
       ) {
           if (numerator == 0) {
               return "0";
           }

           long n = numerator;
           long d = denominator;
           bool negative = (n < 0) != (d < 0);
           if (n < 0) {
               n = -n;
           }
           if (d < 0) {
               d = -d;
           }

           StringBuilder result = new StringBuilder();
           if (negative) {
               result.Append('-');
           }
           result.Append(n / d);

           long remainder = n % d;
           if (remainder == 0) {
               return result.ToString();
           }
           result.Append('.');

           var positions = new Dictionary<long, int>();
           while (remainder != 0) {
               if (positions.TryGetValue(
                   remainder,
                   out int cycleStart
               )) {
                   result.Insert(cycleStart, '(');
                   result.Append(')');
                   break;
               }

               positions[remainder] = result.Length;
               remainder *= 10;
               result.Append(remainder / d);
               remainder %= d;
           }

           return result.ToString();
       }
   }

Julia
~~~~~

.. code-block:: julia

   function fraction_to_decimal(
       numerator::Int,
       denominator::Int,
   )::String
       numerator == 0 && return "0"

       n = Int64(numerator)
       d = Int64(denominator)
       negative = (n < 0) != (d < 0)
       n < 0 && (n = -n)
       d < 0 && (d = -d)

       bytes = UInt8[]
       negative && push!(bytes, UInt8('-'))
       append!(bytes, codeunits(string(n ÷ d)))

       remainder = n % d
       remainder == 0 && return String(bytes)
       push!(bytes, UInt8('.'))

       positions = Dict{Int64, Int}()
       while remainder != 0
           if haskey(positions, remainder)
               cycle_start = positions[remainder]
               insert!(bytes, cycle_start, UInt8('('))
               push!(bytes, UInt8(')'))
               break
           end

           positions[remainder] = length(bytes) + 1
           remainder *= 10
           digit = remainder ÷ d
           push!(bytes, UInt8(Int('0') + Int(digit)))
           remainder %= d
       end

       return String(bytes)
   end

Julia 数组是一基索引，因此记录“下一字节位置”为 ``length(bytes)+1``；发现重复时直接在该一基位置插入。

R
~

.. code-block:: r

   fraction_to_decimal <- function(numerator, denominator) {
     if (numerator == 0) {
       return("0")
     }

     n <- as.double(numerator)
     d <- as.double(denominator)
     negative <- xor(n < 0, d < 0)
     n <- abs(n)
     d <- abs(d)

     buffer <- new.env(parent = emptyenv())
     buffer$parts <- character(10002L)
     buffer$length <- 0L

     append_part <- function(value) {
       next_index <- buffer$length + 1L
       buffer$parts[next_index] <- value
       buffer$length <- next_index
     }

     if (negative) {
       append_part("-")
     }
     append_part(sprintf("%.0f", floor(n / d)))

     remainder <- n %% d
     if (remainder == 0) {
       return(paste0(
         buffer$parts[seq_len(buffer$length)],
         collapse = ""
       ))
     }
     append_part(".")

     positions <- new.env(hash = TRUE, parent = emptyenv())
     while (remainder != 0) {
       key <- sprintf("%.0f", remainder)
       if (exists(key, envir = positions, inherits = FALSE)) {
         cycle_start <- get(
           key,
           envir = positions,
           inherits = FALSE
         )

         old_length <- buffer$length
         for (
           index in seq.int(
             old_length,
             cycle_start,
             by = -1L
           )
         ) {
           buffer$parts[index + 1L] <- buffer$parts[index]
         }
         buffer$parts[cycle_start] <- "("
         buffer$length <- old_length + 1L
         append_part(")")
         break
       }

       assign(
         key,
         buffer$length + 1L,
         envir = positions
       )
       remainder <- remainder * 10
       digit <- floor(remainder / d)
       append_part(sprintf("%.0f", digit))
       remainder <- remainder %% d
     }

     paste0(
       buffer$parts[seq_len(buffer$length)],
       collapse = ""
     )
   }

R 用双精度数保存全部算术，但当前整数上界远低于 ``2^53``。固定 10002 个字符槽由答案长度合同支撑；
环境对象显式提供共享可变缓冲和哈希映射。发现循环时已证明 ``cycle_start<=old_length``，
所以降序 ``seq.int`` 的方向合法。

人工推演与静态审查
------------------

本题没有运行、编译或测试任何题解代码，也没有执行随机对拍、穷举、属性测试、sanitizer
或目标语言最小程序。以下结论来自长除法纸面推演、整数上界证明、资源路径检查和逐语言静态语义审查。

``1/2`` 与 ``2/1``
~~~~~~~~~~~~~~~~~~~

``1/2``：整数部分 0，初始余数 1。在 ``"0."`` 长度位置记录余数 1；
``10/2`` 产生数字 5 和余数 0，返回 ``"0.5"``。

``2/1``：整数部分 2，初始余数 0，在创建哈希表和小数点前直接返回 ``"2"``。

``4/333``
~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 当前余数
     - 首次输出位置
     - 乘十
     - 数字
     - 新余数
   * - 4
     - ``"0."`` 之后
     - 40
     - 0
     - 40
   * - 40
     - 数字 0 之后
     - 400
     - 1
     - 67
   * - 67
     - 数字 1 之后
     - 670
     - 2
     - 4

下一轮余数 4 已存在，首次位置位于数字 0 前，插入括号得到 ``"0.(012)"``。

符号与 32 位边界
~~~~~~~~~~~~~~~~

* ``0/-7`` 在符号判断前返回 ``"0"``；
* ``-1/6`` 的幅度过程生成 ``0.1(6)``，最后前缀为负号；
* ``-2147483648/-1`` 先提升为 64 位，幅度为 2147483648，整除后返回正字符串；
* ``1/-2147483648`` 的分母幅度为 2147483648，所有余数乘十小于约 ``2.15*10^10``。

逐语言静态语义审查
~~~~~~~~~~~~~~~~~~

* **C**：所有取负发生在 ``int64_t``；字符串容量包含终止符；``realloc`` 使用临时返回值；
  哈希容量保持二次幂并在约三分之二负载前扩容；失败路径释放字符串和哈希表，成功返回所有权清楚。
* **C++ / Java / C#**：先转 64 位；哈希位置是插入下一位前的字符串长度；
  构建器插入只发生一次，整数除法和余数均为非负。
* **Python**：整数任意精度；``divmod`` 同时给出数字和新余数；列表位置与最终 ASCII 字符位置一致。
* **Rust**：``i32`` 先转 ``i64``；记录的是 UTF-8 字节位置，但输出全为 ASCII，``String.insert`` 边界合法。
* **Go**：算术使用 ``int64``；扩展字节切片后再执行重叠 ``copy``，源范围使用插入前长度，不覆盖后缀。
* **TypeScript**：只用普通算术和 ``Math.trunc``；没有触发 32 位位运算转换，所有整数精确。
* **Julia**：``Int64`` 关闭最小整数边界；字节向量一基位置加一映射正确，``String(bytes)`` 接收合法 ASCII。
* **R**：数值保持双精度精确整数；余数键用无小数格式；共享状态放在 environment；
  固定槽数由输出上界支撑，括号搬移的降序范围已证明非空且方向正确。

剩余风险
~~~~~~~~

静态审查没有确认各判题机的具体语言版本、标准哈希实现、内存分配行为或平台包装函数接线。
C 的 ``NULL`` 同时可表示合同外零分母和资源失败，题目签名没有额外错误码。
托管语言在内存不足时可能抛异常或终止。哈希容器的理论最坏冲突时间没有被运行证据消除。

关键边界与失败方式
------------------

* 零分子必须在符号输出前返回，避免 ``"-0"``。
* 必须先提升再取绝对值；先对 32 位 ``INT_MIN`` 取负已经溢出。
* 循环依据是余数重复，不是商数字重复。
* 余数位置要在乘十和追加数字之前记录，否则括号起点偏移。
* 整除时不输出小数点；有限小数在余数首次变零后立即结束。
* 不能按分母值直接分配数组，``|denominator|`` 可能达到 ``2^31``。
* 不能用浮点格式化猜测循环节，舍入和截断无法恢复精确状态。
* 复杂度需要计入输出缓冲、哈希表和最终括号插入，不能只写常数空间。
* C 的动态字符串每次扩容都必须保留原指针，哈希重建失败时也必须保留旧表供统一清理。
* R 若逐位执行 ``parts <- c(parts,digit)``，累计复制可能退化为二次时间；固定槽避免该问题。

学习链与知识更新
----------------

本题把无限字符串问题转化为有限状态机：分母固定时，余数是完整状态，相同余数必产生相同未来。
哈希表保存的不是“见过某个数字”，而是状态第一次对应的输出边界。

新增或强化：

* 十进制长除法的状态转移和前缀不变量；
* 有限余数集合保证“终止或进入循环”二分；
* 首次重复状态给出函数图中的环入口；
* 先扩宽再取绝对值处理最小有符号整数；
* 输出敏感复杂度要同时核算状态表、字符串构造与插入；
* C 动态字符串和开放寻址表需要完整失败事务；
* 可联系 `0050. Pow(x, n) <../0001-0100/0050-powx-n.rst>`_：
  两题都必须在取负前扩宽 32 位最小整数；
* 可联系 `0141. Linked List Cycle <0141-linked-list-cycle.rst>`_：
  两题都识别有限状态重复，但本题还需要保存首次状态对应的输出位置。

带答案自检
----------

#. **为什么不能用重复数字判断循环？**

   数字只是状态转移的输出，不包含完整未来信息；不同余数可以产生同一数字。余数相同才会确定相同后续。

#. **为什么在乘十之前记录余数位置？**

   当前余数负责生成下一位，记录位置应指向这位数字之前；乘十后记录会把状态和输出边界错开。

#. **为什么非零余数过程一定会循环？**

   非零余数只有 ``D-1`` 种；若一直不到零，有限状态序列必然重复，确定转移随后进入周期。

#. **长除法前缀为什么始终精确？**

   每轮等式 ``10r=dD+r'`` 把旧剩余项精确拆成下一位数字与新剩余项，保持前缀不变量。

#. **哪一步关闭 ``INT_MIN`` 风险？**

   先把 32 位参数转换为 64 位，再判断负号并取相反数；``2^31`` 可由 64 位有符号整数表示。

#. **时间和空间为什么不能写成 ``O(1)``？**

   算法必须生成长度 ``L`` 的返回字符串，并保存最多 ``L`` 个不同余数位置，所以输出与辅助空间都随 ``L`` 增长。
