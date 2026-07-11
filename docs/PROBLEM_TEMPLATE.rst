0000. Problem Title
===================

使用说明
--------

本模板定义单题 RST 的结构，不复制完整质量规则。写题时同时读取：

* ``docs/FORWARD_RULES_0051_0100.rst``；
* ``docs/AUTOMATION_QUALITY_GATE.rst``；
* ``docs/SOLUTION_AND_TYPES_POLICY.rst``；
* ``docs/RST_STYLE_GUIDE.rst``。

简单题删除空洞章节；复杂题增加必要的证明、反例、状态表或 Mermaid。

题目信息
--------

:题号: 0000
:难度: Easy / Medium / Hard
:主题: Array, Hash Table
:原题: `LeetCode 0000 <https://leetcode.com/problems/example/>`_
:访问状态: Available
:教学重点: 只列本题真正新增或需要强化的内容

题目重述
--------

使用原创语言概括问题，写出会影响实现的精确契约：

* 输入与输出；
* 长度和数值范围；
* 字符集合；
* 结果顺序；
* 是否允许修改输入；
* 平台类型和特殊输入域。

自建示例
--------

.. code-block:: text

   输入：
   ...

   输出：
   ...

至少包含一个正常示例。空输入、重复值、极值、无解、单元素或特殊数学输入容易出错时，增加能区分
正确与错误实现的边界示例。

问题抽象
--------

说明题目如何转化为算法问题。简单题保持简短，复杂题写清状态空间和目标。

基础类型约定
------------

只在链表、树、图或自定义节点题中保留：

* 平台提供的 ``ListNode``、``TreeNode``、``Node`` 不重复定义；
* 首次出现时说明字段、引用关系和可变性；
* Julia 与 R 使用仓库统一节点约定；
* 题目专属辅助类型在本题完整定义。

需要时使用 Mermaid：

.. mermaid::

   flowchart LR
       A["node"] --> B["next"]

解法选择
--------

只列真正存在教学差异的方法。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 空间复杂度
     - 定位
   * - 主解法
     - ``O(...)``
     - ``O(...)``
     - 完整讲解与十语言实现
   * - 对照解法
     - ``O(...)``
     - ``O(...)``
     - 只在存在实质差异时保留

主解法：名称
------------

思路
~~~~

解释为什么采用该方法，以及状态如何变化。不要逐行复述代码。

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

明确关键变量、容器、指针或递归参数的含义。简单题可以合并到“思路”，核心状态不能消失。

正确性依据
~~~~~~~~~~

根据算法实际证明：

* 状态或不变量持续成立；
* 指针移动、候选排除、剪枝或贪心选择安全；
* 搜索完整、无重复并终止；
* 最终条件等价于题目目标。

复杂度
~~~~~~

定义变量，并分别说明：

* 时间复杂度；
* 算法额外空间；
* 递归栈；
* 输入规范化或语言适配器成本；
* 返回结果空间和输出复制；
* 最坏、平均、期望或摊还语义。

状态图
~~~~~~

只在文字难以解释时使用 Mermaid，例如链表改向、图搜索、动态规划转移或回溯树。

核心语言实现
~~~~~~~~~~~~

语言顺序固定为：C、C++、Python、Java、Rust、Go、TypeScript、C#、Julia、R。

十语言实现同一问题语义。所有权、索引、字符表示或平台接口导致不同控制流时，在对应语言下说明，
并确保正文证明覆盖实际实现。

每个代码块检查：

* 必要导入和辅助函数；
* 平台函数签名；
* 输入修改和返回结构；
* 数值、索引、字符单位、所有权和内存；
* 结果快照是否独立；
* 版本或运行时前提。

C
^

.. code-block:: c

   int solve(const int *values, int values_size) {
       return -1;
   }

C++
^^^

.. code-block:: cpp

   class Solution {
   public:
       int solve(const std::vector<int>& values) {
           return -1;
       }
   };

Python
^^^^^^

.. code-block:: python

   class Solution:
       def solve(self, values: list[int]) -> int:
           return -1

Java
^^^^

.. code-block:: java

   class Solution {
       public int solve(int[] values) {
           return -1;
       }
   }

Rust
^^^^

.. code-block:: rust

   impl Solution {
       pub fn solve(values: Vec<i32>) -> i32 {
           -1
       }
   }

Go
^^

.. code-block:: go

   func solve(values []int) int {
       return -1
   }

TypeScript
^^^^^^^^^^

.. code-block:: typescript

   function solve(values: number[]): number {
       return -1;
   }

C#
^^

.. code-block:: csharp

   public class Solution {
       public int Solve(int[] values) {
           return -1;
       }
   }

Julia
^^^^^

.. code-block:: julia

   function solve(values::Vector{Int})::Int
       return -1
   end

零基算法坐标需要显式转换为一基位置。``a:b`` 在 ``a>b`` 时为空；递减遍历使用显式负步长。

R
^

.. code-block:: r

   solve <- function(values) {
     -1L
   }

局部变量使用 ``<-``；跨递归共享状态使用 ``environment`` 或明确外层绑定。可能为空的迭代使用
``seq_len``、``seq_along`` 或明确边界。

工程写法：标准库方法
--------------------

现成 API 能自然解决问题或体现实际开发写法时保留：

* 说明 API 语义、复杂度和前提；
* API 隐藏核心算法时，主解法仍展示教学过程；
* 工程写法通常不重复十语言。

对照解法：名称
--------------

只在复杂度、数据结构、状态表示或算法演进存在实质差异时保留。通常提供思路、差异、复杂度和少量代表代码。

验证计划与证据
--------------

写题时先确定风险：

* 正常用例；
* 边界用例；
* 独立基准对拍；
* 编译或严格类型检查；
* 缺少运行时时的静态验证。

最终报告准确区分“运行验证”“编译验证”“静态验证”和“基准对拍”。

关键边界
--------

只记录会改变正确性、接口、复杂度或语言语义的边界。

易错点
------

区分算法错误、语言语义错误和标准库误用，优先给出可构造反例或实际失败路径。

本题新增知识
------------

列出首次出现、需要完整解释的知识。

本题强化知识
------------

列出已经出现过、本题因新边界需要短提醒的知识。

关联题目
--------

保留 1 至 3 个最强关联，最多 5 个。使用标准 RST 相对链接。

最小自检
--------

#. 当前主解法维护的核心状态是什么？
#. 为什么该状态足以保证正确性？
#. 哪个边界最可能让十语言产生不同语义？
#. 复杂度是否计入输出复制、递归栈和标准库调用？
#. 哪些结论经过运行、编译、静态检查或基准对拍？

答案要点
~~~~~~~~

给出判断依据，不只写最终答案。
