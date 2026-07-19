0105. Construct Binary Tree from Preorder and Inorder Traversal
===============================================================

题目信息
--------

:题号: 0105
:难度: Medium
:主题: 二叉树、前序遍历、中序遍历、哈希表、分治
:原题: `LeetCode 0105
   <https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/>`_
:访问状态: Available
:教学重点: 遍历区间、全局前序游标、中序根定位、唯一重建、构造失败清理

题目重述
--------

给定同一棵二叉树的前序遍历 ``preorder`` 和中序遍历 ``inorder``，重建并返回这棵树的根节点。

前序遍历按照“根、左子树、右子树”访问节点；中序遍历按照“左子树、根、右子树”访问节点。平台保证：

* 两个数组长度相等，长度在 ``1`` 到 ``3000`` 之间；
* 节点值位于 ``[-3000, 3000]``；
* 每个节点值只出现一次；
* 两个数组包含相同的值，并且确实来自一棵合法二叉树。

值互异是唯一重建的关键前提。若同一个值能够在中序数组中出现多次，仅凭“根值在中序中的位置”无法唯一划分
左右子树。函数不修改两个输入数组；返回树中的节点全部是新创建的节点。

自建示例
--------

左右子树同时存在
~~~~~~~~~~~~~~~~

.. code-block:: text

   preorder = [3, 9, 20, 15, 7]
   inorder  = [9, 3, 15, 20, 7]

             3
           /   \
          9    20
              /  \
             15   7

前序首元素 ``3`` 是根。它在中序中的位置把数组分成 ``[9]`` 和 ``[15, 20, 7]``，分别对应左右子树。

只有右子树
~~~~~~~~~~

.. code-block:: text

   preorder = [1, 2, 3]
   inorder  = [1, 2, 3]

   输出树：1 -> 2 -> 3，所有节点都沿右孩子方向连接。

每一轮根都位于当前中序区间最左端，左区间为空。该输入能够检查区间端点和空子树处理。

只有左子树
~~~~~~~~~~

.. code-block:: text

   preorder = [3, 2, 1]
   inorder  = [1, 2, 3]

   输出树：3 -> 2 -> 1，所有节点都沿左孩子方向连接。

该结构的递归深度等于节点数，能够暴露把递归空间无条件写成 ``O(log n)`` 的错误。

问题抽象
--------

对任意非空子树：

* 前序遍历的第一个值一定是该子树根值；
* 根值在中序遍历中的位置左侧全部属于左子树；
* 根值在中序遍历中的位置右侧全部属于右子树。

因此只要知道当前子树对应的中序区间，就能确定左右子树的节点集合。再用一个全局前序游标按
“根、左、右”的顺序消费根值，就不必在每次递归中同时传递四个数组端点。

本题使用半开区间 ``[in_left, in_right)``：

.. code-block:: text

   build(in_left, in_right)

   当前子树节点集合 = inorder[in_left .. in_right)
   空子树条件       = in_left == in_right
   当前根值         = preorder[pre_index]

若当前根值在中序中的下标是 ``middle``，则：

.. code-block:: text

   左子树中序区间 = [in_left, middle)
   右子树中序区间 = [middle + 1, in_right)

前序游标在读取根值后，先递归构造左子树，再构造右子树。这一顺序不能交换，
因为前序数组中根之后紧接着的是
左子树的完整前序片段。

基础类型约定
------------

沿用 `0094. Binary Tree Inorder Traversal
<../0001-0100/0094-binary-tree-inorder-traversal.rst>`_ 建立的 ``TreeNode`` 引用模型：

* 平台提供整数 ``val``、左孩子 ``left`` 和右孩子 ``right``；
* C/C++ 返回新分配节点的指针；
* Python、Java、Go、TypeScript、C# 返回对象引用；
* Rust 使用 ``Option<Rc<RefCell<TreeNode>>>``；
* Julia 使用仓库统一的可变 ``TreeNode``；
* R 使用 ``new_tree_node`` 创建 ``environment`` 节点。

构造成功后，返回树拥有 ``n`` 个新节点。输入遍历数组仍保持原值和原顺序。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 中序下标表 + 前序游标
     - 期望 ``O(n)``
     - ``O(n + h)``
     - 主解法；每个根只定位一次
   * - 每层在线性扫描中序区间
     - 最坏 ``O(n^2)``
     - ``O(h)``
     - 退化树会重复扫描长区间
   * - 复制左右数组切片后递归
     - 最坏 ``O(n^2)``
     - 最坏 ``O(n^2)``
     - 切片和复制隐藏额外成本
   * - 显式栈迭代构造
     - ``O(n)``
     - ``O(n)``
     - 可避免递归深度，状态和证明更复杂

这里 ``n`` 是节点数，``h`` 是树高。主解法的 ``O(n)`` 下标表删除了每层重复寻找根位置的工作。

主解法：中序下标表与前序游标
----------------------------

下标表为什么有效
~~~~~~~~~~~~~~~~

节点值互异，所以每个值在中序数组中恰好对应一个下标。预处理：

.. code-block:: text

   position[value] = value 在 inorder 中的唯一位置

之后每次根据根值查找 ``middle`` 的期望成本为 ``O(1)``。若不建立表，在高度为 ``n`` 的退化树中，
第 1 层扫描 ``n`` 个位置，第 2 层扫描 ``n-1`` 个位置，累计达到 ``Theta(n^2)``。

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

递归函数 ``build(in_left, in_right)`` 与共享变量 ``pre_index`` 保持以下含义：

* ``inorder[in_left:in_right]`` 恰好是当前待构造子树的节点集合；
* ``pre_index`` 指向该子树根值在 ``preorder`` 中的位置；
* 调用完成后，游标恰好前进 ``in_right - in_left`` 个位置；
* 返回树的中序遍历等于当前中序区间；
* 返回树的前序遍历等于本次调用消费的前序片段。

空区间不消费前序元素并返回空节点。非空区间消费一个根值，再依次交给左、右子调用消费各自节点数。

具体推演
~~~~~~~~

以普通示例为例：

.. list-table::
   :header-rows: 1

   * - 调用
     - 读取根
     - 中序划分
     - 下一步
   * - ``build(0, 5)``
     - ``3``
     - ``[9] | 3 | [15,20,7]``
     - 先构造 ``build(0, 1)``
   * - ``build(0, 1)``
     - ``9``
     - ``[] | 9 | []``
     - 返回叶节点 ``9``
   * - ``build(2, 5)``
     - ``20``
     - ``[15] | 20 | [7]``
     - 先构造 ``15``，再构造 ``7``

注意根 ``20`` 在前序中的位置并不是由中序下标直接得到。中序下标只决定左右节点集合；前序游标根据递归
消费顺序自然移动到下一个子树根。

正确性依据
~~~~~~~~~~

对当前中序区间长度做归纳。

**基础情况。** 区间为空时，该子树没有节点，返回空树；函数不消费前序元素，
状态与结果都正确。区间长度为
1 时，当前前序值是唯一节点，左右区间都为空，构造出的单节点树正确。

**根节点正确。** 对任意非空区间，前序定义保证当前未消费片段的第一个值就是当前子树根值。值互异使它在
中序数组中的位置唯一。

**左右划分正确。** 中序定义保证根位置左侧恰好是左子树全部节点，
右侧恰好是右子树全部节点。两个区间互不
重叠，合并根后覆盖当前区间全部节点。

**递归顺序正确。** 前序在根之后先完整列出左子树，再完整列出右子树。算法先调用左子树，使游标消费恰好
``middle - in_left`` 个值；此时游标自然指向右子树根，再调用右子树。

**归纳组合。** 按归纳假设，左右递归分别构造出唯一符合各自前序和中序片段的树。
把它们接到唯一根节点下，
所得树的前序和中序遍历都与输入当前片段一致，因此当前子树正确且唯一。

**终止性。** 每个非空调用把当前区间分成两个严格更短的区间；有限节点最终全部到达空区间。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 建立中序下标表需要 ``O(n)`` 时间和 ``O(n)`` 空间；
* 每个节点只读取、查表、分配和连接一次，期望时间 ``O(n)``；
* 哈希表最坏复杂度取决于实现；标准库通常按平均或期望 ``O(1)`` 查找描述；
* 递归栈深度为 ``O(h)``，平衡树为 ``O(log n)``，退化树最坏 ``O(n)``；
* 返回树本身包含 ``n`` 个节点，返回载荷为 ``Theta(n)``；
* 排除返回树后，核心工作空间为下标表 ``O(n)`` 加调用栈 ``O(h)``；
* C 实现使用开放寻址表，容量保持大于两倍节点数；任一分配失败会释放部分树；
* R 的哈希环境把整数值转换为字符键，转换与表项存储都属于适配器成本；
* Rust 的 ``Rc`` 只管理新树节点引用，不复制输入数组中的整数载荷。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdint.h>
   #include <stdlib.h>

   typedef struct {
       int *keys;
       int *indices;
       unsigned char *used;
       size_t capacity;
   } IndexMap;

   static uint32_t mix_key(int key) {
       uint32_t value = (uint32_t)key;
       value ^= value >> 16;
       value *= UINT32_C(0x7feb352d);
       value ^= value >> 15;
       value *= UINT32_C(0x846ca68b);
       value ^= value >> 16;
       return value;
   }

   static bool map_init(IndexMap *map, int item_count) {
       size_t capacity = 1;
       const size_t needed = (size_t)item_count * 2 + 1;

       while (capacity < needed) {
           if (capacity > SIZE_MAX / 2) {
               return false;
           }
           capacity *= 2;
       }

       map->keys = malloc(capacity * sizeof(*map->keys));
       map->indices = malloc(capacity * sizeof(*map->indices));
       map->used = calloc(capacity, sizeof(*map->used));
       if (map->keys == NULL || map->indices == NULL || map->used == NULL) {
           free(map->keys);
           free(map->indices);
           free(map->used);
           return false;
       }

       map->capacity = capacity;
       return true;
   }

   static void map_destroy(IndexMap *map) {
       free(map->keys);
       free(map->indices);
       free(map->used);
   }

   static void map_put(IndexMap *map, int key, int index) {
       size_t slot = (size_t)mix_key(key) & (map->capacity - 1);

       while (map->used[slot] != 0) {
           slot = (slot + 1) & (map->capacity - 1);
       }

       map->used[slot] = 1;
       map->keys[slot] = key;
       map->indices[slot] = index;
   }

   static bool map_get(const IndexMap *map, int key, int *index) {
       size_t slot = (size_t)mix_key(key) & (map->capacity - 1);

       while (map->used[slot] != 0) {
           if (map->keys[slot] == key) {
               *index = map->indices[slot];
               return true;
           }
           slot = (slot + 1) & (map->capacity - 1);
       }

       return false;
   }

   static void free_tree(struct TreeNode *root) {
       if (root == NULL) {
           return;
       }
       free_tree(root->left);
       free_tree(root->right);
       free(root);
   }

   static struct TreeNode *build_preorder(
       const int *preorder,
       int *pre_index,
       int in_left,
       int in_right,
       const IndexMap *positions,
       bool *ok
   ) {
       if (!*ok || in_left >= in_right) {
           return NULL;
       }

       const int root_value = preorder[*pre_index];
       int middle = 0;
       if (!map_get(positions, root_value, &middle) ||
           middle < in_left || middle >= in_right) {
           *ok = false;
           return NULL;
       }
       ++*pre_index;

       struct TreeNode *root = malloc(sizeof(*root));
       if (root == NULL) {
           *ok = false;
           return NULL;
       }
       root->val = root_value;
       root->left = NULL;
       root->right = NULL;

       root->left = build_preorder(
           preorder,
           pre_index,
           in_left,
           middle,
           positions,
           ok
       );
       if (!*ok) {
           free(root);
           return NULL;
       }

       root->right = build_preorder(
           preorder,
           pre_index,
           middle + 1,
           in_right,
           positions,
           ok
       );
       if (!*ok) {
           free_tree(root->left);
           free(root);
           return NULL;
       }

       return root;
   }

   struct TreeNode *buildTree(
       int *preorder,
       int preorderSize,
       int *inorder,
       int inorderSize
   ) {
       if (preorderSize != inorderSize || preorderSize == 0) {
           return NULL;
       }

       IndexMap positions = {0};
       if (!map_init(&positions, inorderSize)) {
           return NULL;
       }

       for (int i = 0; i < inorderSize; ++i) {
           map_put(&positions, inorder[i], i);
       }

       bool ok = true;
       int pre_index = 0;
       struct TreeNode *root = build_preorder(
           preorder,
           &pre_index,
           0,
           inorderSize,
           &positions,
           &ok
       );

       if (!ok || pre_index != preorderSize) {
           free_tree(root);
           root = NULL;
       }

       map_destroy(&positions);
       return root;
   }

C 代码自建开放寻址表，使根定位保持期望 ``O(1)``。``build_preorder`` 的 ``ok`` 状态把“合法空子树”和
“分配或契约失败”分开；失败时释放所有已成功创建的节点。平台函数仍只能返回指针，所以顶层
``NULL`` 无法区分
空输入与资源失败，这是原接口的表达限制。

C++
~~~

.. code-block:: cpp

   #include <unordered_map>
   #include <vector>

   class Solution {
   private:
       std::unordered_map<int, int> position;
       int preIndex = 0;

       TreeNode* build(
           const std::vector<int>& preorder,
           int inLeft,
           int inRight
       ) {
           if (inLeft >= inRight) {
               return nullptr;
           }

           const int rootValue = preorder[preIndex++];
           const int middle = position.at(rootValue);
           TreeNode* root = new TreeNode(rootValue);

           root->left = build(preorder, inLeft, middle);
           root->right = build(preorder, middle + 1, inRight);
           return root;
       }

   public:
       TreeNode* buildTree(
           std::vector<int>& preorder,
           std::vector<int>& inorder
       ) {
           position.clear();
           position.reserve(inorder.size());
           for (int i = 0; i < static_cast<int>(inorder.size()); ++i) {
               position.emplace(inorder[i], i);
           }

           preIndex = 0;
           return build(
               preorder,
               0,
               static_cast<int>(inorder.size())
           );
       }
   };

``position`` 和 ``preIndex`` 是对象字段，公共入口每次都清空并重新初始化，避免同一个
``Solution`` 实例被
重复调用时继承旧状态。平台负责回收成功返回的节点。

Python
~~~~~~

.. code-block:: python

   from typing import Optional


   class Solution:
       def buildTree(
           self,
           preorder: list[int],
           inorder: list[int],
       ) -> Optional[TreeNode]:
           position = {
               value: index
               for index, value in enumerate(inorder)
           }
           pre_index = 0

           def build(in_left: int, in_right: int) -> Optional[TreeNode]:
               nonlocal pre_index
               if in_left >= in_right:
                   return None

               root_value = preorder[pre_index]
               pre_index += 1
               middle = position[root_value]
               root = TreeNode(root_value)

               root.left = build(in_left, middle)
               root.right = build(middle + 1, in_right)
               return root

           return build(0, len(inorder))

闭包通过 ``nonlocal pre_index`` 更新同一个前序游标。字典推导只保存值到下标，不复制树节点；递归深度在
退化树上可达到 ``n``，实际运行可能受 Python 递归限制约束。

Java
~~~~

.. code-block:: java

   import java.util.HashMap;
   import java.util.Map;

   class Solution {
       private final Map<Integer, Integer> position = new HashMap<>();
       private int preIndex;

       public TreeNode buildTree(int[] preorder, int[] inorder) {
           position.clear();
           for (int i = 0; i < inorder.length; ++i) {
               position.put(inorder[i], i);
           }

           preIndex = 0;
           return build(preorder, 0, inorder.length);
       }

       private TreeNode build(
           int[] preorder,
           int inLeft,
           int inRight
       ) {
           if (inLeft >= inRight) {
               return null;
           }

           int rootValue = preorder[preIndex++];
           int middle = position.get(rootValue);
           TreeNode root = new TreeNode(rootValue);

           root.left = build(preorder, inLeft, middle);
           root.right = build(preorder, middle + 1, inRight);
           return root;
       }
   }

``HashMap`` 查询和整数装箱按平均常数时间处理。字段 ``preIndex`` 在公共入口重置；
否则重复调用会从错误的
前序位置开始。返回树由垃圾回收器管理。

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::collections::HashMap;
   use std::rc::Rc;

   impl Solution {
       pub fn build_tree(
           preorder: Vec<i32>,
           inorder: Vec<i32>,
       ) -> Option<Rc<RefCell<TreeNode>>> {
           fn build(
               preorder: &[i32],
               pre_index: &mut usize,
               in_left: usize,
               in_right: usize,
               position: &HashMap<i32, usize>,
           ) -> Option<Rc<RefCell<TreeNode>>> {
               if in_left >= in_right {
                   return None;
               }

               let root_value = preorder[*pre_index];
               *pre_index += 1;
               let middle = position[&root_value];

               let left = build(
                   preorder,
                   pre_index,
                   in_left,
                   middle,
                   position,
               );
               let right = build(
                   preorder,
                   pre_index,
                   middle + 1,
                   in_right,
                   position,
               );

               let root = Rc::new(RefCell::new(TreeNode::new(root_value)));
               {
                   let mut node = root.borrow_mut();
                   node.left = left;
                   node.right = right;
               }
               Some(root)
           }

           let position: HashMap<i32, usize> = inorder
               .iter()
               .enumerate()
               .map(|(index, &value)| (value, index))
               .collect();

           let mut pre_index = 0;
           build(
               &preorder,
               &mut pre_index,
               0,
               inorder.len(),
               &position,
           )
       }
   }

左右子树先构造为局部 ``Option``，再在一次短暂的 ``borrow_mut`` 中写入根节点，
避免递归期间持有可变借用。
``Rc`` 克隆没有用于复制子树；每个输入值只创建一个新节点。

Go
~~

.. code-block:: go

   func buildTree(preorder []int, inorder []int) *TreeNode {
   	position := make(map[int]int, len(inorder))
   	for index, value := range inorder {
   		position[value] = index
   	}

   	preIndex := 0
   	var build func(int, int) *TreeNode
   	build = func(inLeft, inRight int) *TreeNode {
   		if inLeft >= inRight {
   			return nil
   		}

   		rootValue := preorder[preIndex]
   		preIndex++
   		middle := position[rootValue]
   		root := &TreeNode{Val: rootValue}

   		root.Left = build(inLeft, middle)
   		root.Right = build(middle+1, inRight)
   		return root
   	}

   	return build(0, len(inorder))
   }

闭包捕获 ``preIndex``，每次调用按前序顺序更新。``map`` 的查找是平均常数时间；
返回节点逃逸到堆上并由 Go
垃圾回收器管理。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function buildTree(
       preorder: number[],
       inorder: number[],
   ): TreeNode | null {
       const position = new Map<number, number>();
       for (let index = 0; index < inorder.length; index++) {
           position.set(inorder[index], index);
       }

       let preIndex = 0;

       const build = (
           inLeft: number,
           inRight: number,
       ): TreeNode | null => {
           if (inLeft >= inRight) {
               return null;
           }

           const rootValue = preorder[preIndex++];
           const middle = position.get(rootValue)!;
           const root = new TreeNode(rootValue);

           root.left = build(inLeft, middle);
           root.right = build(middle + 1, inRight);
           return root;
       };

       return build(0, inorder.length);
   }

非空断言 ``!`` 由平台“两个数组包含相同互异值且来自合法树”的契约支撑。数值范围远低于 JavaScript
``number`` 的安全整数上限，不涉及精度损失。

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       private readonly Dictionary<int, int> position =
           new Dictionary<int, int>();
       private int preIndex;

       public TreeNode BuildTree(int[] preorder, int[] inorder) {
           position.Clear();
           for (int i = 0; i < inorder.Length; ++i) {
               position[inorder[i]] = i;
           }

           preIndex = 0;
           return Build(preorder, 0, inorder.Length);
       }

       private TreeNode Build(
           int[] preorder,
           int inLeft,
           int inRight
       ) {
           if (inLeft >= inRight) {
               return null;
           }

           int rootValue = preorder[preIndex++];
           int middle = position[rootValue];
           var root = new TreeNode(rootValue);

           root.left = Build(preorder, inLeft, middle);
           root.right = Build(preorder, middle + 1, inRight);
           return root;
       }
   }

字典和游标字段都在公共入口初始化。托管对象保存左右引用，返回后由调用者持有根引用，失去可达性的节点由
垃圾回收器处理。

Julia
~~~~~

.. code-block:: julia

   function build_tree(
       preorder::Vector{Int},
       inorder::Vector{Int},
   )::Union{TreeNode, Nothing}
       position = Dict(
           value => index
           for (index, value) in pairs(inorder)
       )
       state = Ref(firstindex(preorder))

       function build(
           in_left::Int,
           in_right::Int,
       )::Union{TreeNode, Nothing}
           in_left > in_right && return nothing

           root_value = preorder[state[]]
           state[] += 1
           middle = position[root_value]
           root = TreeNode(root_value)

           root.left = build(in_left, middle - 1)
           root.right = build(middle + 1, in_right)
           return root
       end

       return build(firstindex(inorder), lastindex(inorder))
   end

Julia 使用一基闭区间 ``[in_left, in_right]``，空区间条件是 ``in_left > in_right``。
``Ref`` 提供递归调用
共享的可变游标；普通 ``state = state + 1`` 只会重绑定局部变量，不能替代这里的共享槽位。

R
~

.. code-block:: r

   build_tree <- function(preorder, inorder) {
     position <- new.env(hash = TRUE, parent = emptyenv())
     for (index in seq_along(inorder)) {
       position[[as.character(inorder[[index]])]] <- index
     }

     state <- new.env(parent = emptyenv())
     state$pre_index <- 1L

     build <- function(in_left, in_right) {
       if (in_left > in_right) {
         return(NULL)
       }

       root_value <- preorder[[state$pre_index]]
       state$pre_index <- state$pre_index + 1L
       middle <- position[[as.character(root_value)]]
       root <- new_tree_node(root_value)

       root$left <- build(in_left, middle - 1L)
       root$right <- build(middle + 1L, in_right)
       root
     }

     build(1L, length(inorder))
   }

R 使用两个环境：``position`` 保存哈希下标，``state`` 保存递归共享游标。
这避免依赖普通局部向量赋值跨递归
调用传播。``new_tree_node`` 是 `0094` 建立的统一构造器。

对照解法：显式传递两个遍历区间
--------------------------------

也可以令状态同时包含：

.. code-block:: text

   preorder[pre_left:pre_right)
   inorder[in_left:in_right)

根据 ``left_size = middle - in_left`` 切分两个区间。该写法不依赖共享游标，
适合纯函数风格，但参数更多且更容易
出现端点偏一。两种写法都要求根之后先构造左子树，时间和空间复杂度相同。

验证计划与证据
--------------

* Python 通过语法解析，并用 3000 棵随机互异值二叉树执行“遍历生成、重建、完整结构比较”对拍；
* C、C++ 通过严格警告编译，并在 ASan、UBSan 下各运行 500 棵随机树；
* Java、Go、TypeScript 分别通过编译或严格类型检查，并各运行 500 棵随机树；
* 随机测试同时检查重建结构、前序与中序一致性；输入数组未被修改；
* Rust、C#、Julia、R 完成接口、空区间、游标、索引、引用和作用域静态检查；
* 当前环境没有对应四种运行时，因此没有声称它们完成运行验证。

关键边界
--------

* 单节点：根位置同时是中序区间唯一位置，两个子区间都为空；
* 纯左链或纯右链：递归深度达到 ``n``；
* 值互异：下标表只保存一个位置，重复值会破坏唯一划分；
* 输入只读：算法不排序、不切片修改，也不把遍历数组复用为节点存储；
* C 资源失败：部分树与下标表必须全部释放；
* 多次调用：使用对象字段的语言必须重置游标和下标表。

易错点
------

* 把前序根之后的第一个值直接当作右子树根，忽略左子树可能非空；
* 构造右子树后再构造左子树，导致共享前序游标消费顺序错误；
* 混用闭区间和半开区间，出现 ``middle`` 被重复包含或遗漏；
* 每层在线性搜索中序位置，使退化树时间退化为 ``O(n^2)``；
* 在 Java、C# 或 C++ 对象字段中保留上一次调用的游标；
* 把输出树 ``Theta(n)`` 节点错误计入或完全忽略算法工作空间而不作区分。

本题新增知识
------------

* 前序首根与中序左右划分共同唯一确定二叉树；
* ``build(in_left, in_right)`` 与共享前序游标的区间不变量；
* 中序下标表删除递归中的重复线性查找；
* C 构造型接口的事务式失败清理。

本题强化知识
------------

* `0094` 建立的跨语言 ``TreeNode`` 引用模型；
* `0104` 中树递归的 ``O(h)`` 调用栈边界；
* 半开区间的空区间和端点一致性；
* 返回树载荷与算法工作空间分开报告。

关联题目
--------

* `0094. Binary Tree Inorder Traversal
  <../0001-0100/0094-binary-tree-inorder-traversal.rst>`_：中序顺序与树节点模型；
* `0104. Maximum Depth of Binary Tree <0104-maximum-depth-of-binary-tree.rst>`_：树高递归空间；
* `0106. Construct Binary Tree from Inorder and Postorder Traversal
  <0106-construct-binary-tree-from-inorder-and-postorder-traversal.rst>`_：从后序尾部反向消费根。

最小自检
--------

#. 为什么只传中序区间和一个前序游标就足以描述当前子问题？
#. 根值在中序中的位置分别决定了什么，不能决定什么？
#. 为什么共享前序游标要求先构造左子树？
#. 值互异前提删除了哪一种歧义？
#. ``O(n)`` 工作空间与返回树 ``Theta(n)`` 载荷应如何区分？

答案要点
~~~~~~~~

前序游标提供当前根，中序唯一位置提供左右节点集合。左子树在前序中紧跟根，
所以先递归左区间，游标消费完左子树
后自然指向右子树根。每个节点只查表和创建一次，期望时间 ``O(n)``；下标表 ``O(n)``、调用栈 ``O(h)``，
返回树另占 ``Theta(n)``。
