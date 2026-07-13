0106. Construct Binary Tree from Inorder and Postorder Traversal
================================================================

题目信息
--------

:题号: 0106
:难度: Medium
:主题: 二叉树、中序遍历、后序遍历、哈希表、分治
:原题: `LeetCode 0106
   <https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/>`_
:访问状态: Available
:教学重点: 后序尾根、反向游标、先右后左、中序区间、与 0105 的对偶关系

题目重述
--------

给定同一棵二叉树的中序遍历 ``inorder`` 和后序遍历 ``postorder``，重建并返回这棵树的根节点。

中序遍历按照“左子树、根、右子树”访问节点；后序遍历按照“左子树、右子树、根”访问节点。平台保证：

* 两个数组长度相等，长度在 ``1`` 到 ``3000`` 之间；
* 节点值位于 ``[-3000, 3000]``；
* 所有节点值互异；
* 两个数组包含相同的值，并且来自一棵合法二叉树。

函数不修改输入数组。返回树的所有节点均为新对象。互异值保证根在中序数组中只有一个位置，从而左右子树的
节点集合能够唯一确定。

自建示例
--------

普通树
~~~~~~

.. code-block:: text

   inorder   = [9, 3, 15, 20, 7]
   postorder = [9, 15, 7, 20, 3]

             3
           /   \
          9    20
              /  \
             15   7

后序末元素 ``3`` 是根。根在中序中的位置把节点分成左侧 ``[9]`` 与右侧 ``[15, 20, 7]``。

必须先构造右子树
~~~~~~~~~~~~~~~~

.. code-block:: text

   inorder   = [1, 2, 3]
   postorder = [1, 3, 2]

          2
        /   \
       1     3

从后序末尾向前读取：先读到根 ``2``，接下来读到 ``3``。``3`` 属于右子树；若先递归构造左子树，会把
``3`` 错接到左侧。

退化左链
~~~~~~~~

.. code-block:: text

   inorder   = [1, 2, 3]
   postorder = [1, 2, 3]

   输出树：3 -> 2 -> 1，全部沿左孩子方向连接。

每轮根都位于当前中序区间最右端，右区间为空，递归深度达到节点数。

问题抽象
--------

本题与 `0105. Construct Binary Tree from Preorder and Inorder Traversal
<0105-construct-binary-tree-from-preorder-and-inorder-traversal.rst>`_ 使用相同的中序划分：

.. code-block:: text

   根在 inorder 中的位置 = middle
   左子树节点集合 = inorder[in_left .. middle)
   右子树节点集合 = inorder[middle + 1 .. in_right)

区别在根值的消费方向：

.. code-block:: text

   前序：根 | 左子树 | 右子树     从左向右消费，先建左子树
   后序：左子树 | 右子树 | 根     从右向左消费，先建右子树

使用半开区间 ``[in_left, in_right)``，共享变量 ``post_index`` 表示尚未消费后序前缀的长度，也就是
“下一个根值右侧的一格”。非空调用先执行 ``post_index -= 1``，再读取 ``postorder[post_index]``。

基础类型约定
------------

继续沿用仓库统一 ``TreeNode`` 引用模型。平台提供 ``val``、``left`` 和 ``right``，
本题只创建新节点，不修改
两个遍历数组。

C/C++ 的节点由动态分配产生；Rust 使用 ``Rc<RefCell<TreeNode>>``；Julia 使用可变节点引用；R 通过
``new_tree_node`` 创建环境节点。成功返回后，调用者或目标运行时持有整棵树。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 中序下标表 + 反向后序游标
     - 期望 ``O(n)``
     - ``O(n + h)``
     - 主解法；与后序消费方向直接对应
   * - 每层线性搜索中序根位置
     - 最坏 ``O(n^2)``
     - ``O(h)``
     - 退化树重复扫描区间
   * - 同时传递中序与后序四个端点
     - 期望 ``O(n)``
     - ``O(n + h)``
     - 无共享游标，但端点计算更密集
   * - 复制左右切片
     - 最坏 ``O(n^2)``
     - 最坏 ``O(n^2)``
     - 复制成本掩盖主算法

``n`` 是节点数，``h`` 是树高。下标表让每个根值只定位一次；反向游标让后序片段边界由消费顺序隐式维护。

主解法：中序下标表与反向后序游标
--------------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

递归函数 ``build(in_left, in_right)`` 进入时保持：

* 当前待构造子树的节点集合恰好是 ``inorder[in_left:in_right]``；
* ``post_index`` 是该子树后序片段末尾的后一位置；
* ``postorder[post_index - 1]`` 是当前子树根值；
* 调用完成后，游标恰好向左移动 ``in_right - in_left`` 个位置；
* 返回树的中序遍历等于当前中序区间；
* 返回树的后序遍历等于本次调用反向消费的后序片段。

空区间不移动游标。非空区间先消费根，再构造右子树，最后构造左子树。

为什么必须先右后左
~~~~~~~~~~~~~~~~~~

后序片段的自然顺序是：

.. code-block:: text

   [左子树全部节点] [右子树全部节点] [根]

算法从右向左读取。消费根之后，游标位于右子树片段末尾，所以右子树是下一个完整子问题。
只有右子树消费完后，
游标才移动到左子树片段末尾。

这里的“先右后左”只描述递归构造顺序。最终连接仍然是 ``root.left = left``、``root.right = right``，
不会交换树的左右方向。

具体推演
~~~~~~~~

以普通示例为例：

.. list-table::
   :header-rows: 1

   * - 调用
     - 反向读取根
     - 中序划分
     - 下一调用
   * - ``build(0, 5)``
     - ``3``
     - ``[9] | 3 | [15,20,7]``
     - 先构造右区间 ``build(2, 5)``
   * - ``build(2, 5)``
     - ``20``
     - ``[15] | 20 | [7]``
     - 先构造节点 ``7``
   * - ``build(4, 5)``
     - ``7``
     - ``[] | 7 | []``
     - 返回叶节点
   * - ``build(2, 3)``
     - ``15``
     - ``[] | 15 | []``
     - 返回叶节点

右子树 ``20`` 完成后，游标才到达左子树根 ``9``。

正确性依据
~~~~~~~~~~

对当前中序区间长度做归纳。

**基础情况。** 空区间对应空子树，算法不消费后序值并返回空。长度为 1 时，
后序片段末值是唯一节点，左右区间
均为空，结果正确。

**根节点正确。** 后序定义保证每个非空子树片段的最后一个值是该子树根。``post_index - 1`` 正好指向当前
未消费片段末尾，所以读取的根值正确。

**左右集合正确。** 根值在中序中的唯一位置把当前节点集合分成互不重叠的左右子树集合，
并与根共同覆盖全部节点。

**消费顺序正确。** 从后序末尾向前看，根之前首先是右子树的末尾。算法先递归右区间，
按归纳假设恰好消费右子树
全部后序值；游标随后位于左子树末尾，再递归左区间。

**归纳组合。** 左右递归分别返回与各自中序、后序片段一致的唯一子树。
把它们接到唯一根的正确方向后，当前树的
中序为“左、根、右”，后序为“左、右、根”，与输入片段完全一致。

**无遗漏与终止。** 每个非空调用消费一个互异根值，两个子区间严格缩小且互不重叠。有限的
``n`` 个值各消费一次，
最终全部到达空区间。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* 建立中序下标表需要 ``O(n)`` 时间和 ``O(n)`` 空间；
* 每个节点只被反向游标读取一次、查表一次并创建一次，期望时间 ``O(n)``；
* 递归栈为 ``O(h)``，退化树最坏 ``O(n)``；
* 返回树包含 ``n`` 个新节点，返回载荷 ``Theta(n)``；
* 排除返回树后，工作空间为下标表 ``O(n)`` 加递归栈 ``O(h)``；
* C 的开放寻址表保持低装载率，并在失败时释放已完成的右子树或左、右子树；
* Rust 用 ``usize`` 保存“未消费长度”，先减一再读取，避免使用可能下溢的负下标；
* Julia 与 R 使用一基闭区间，根位置两侧分别是 ``middle - 1`` 和 ``middle + 1``；
* R 使用环境保存共享反向游标，避免普通局部赋值无法跨递归调用共享的问题。

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

   static struct TreeNode *build_postorder(
       const int *postorder,
       int *post_index,
       int in_left,
       int in_right,
       const IndexMap *positions,
       bool *ok
   ) {
       if (!*ok || in_left >= in_right) {
           return NULL;
       }

       --*post_index;
       const int root_value = postorder[*post_index];
       int middle = 0;
       if (!map_get(positions, root_value, &middle) ||
           middle < in_left || middle >= in_right) {
           *ok = false;
           return NULL;
       }

       struct TreeNode *root = malloc(sizeof(*root));
       if (root == NULL) {
           *ok = false;
           return NULL;
       }
       root->val = root_value;
       root->left = NULL;
       root->right = NULL;

       root->right = build_postorder(
           postorder,
           post_index,
           middle + 1,
           in_right,
           positions,
           ok
       );
       if (!*ok) {
           free(root);
           return NULL;
       }

       root->left = build_postorder(
           postorder,
           post_index,
           in_left,
           middle,
           positions,
           ok
       );
       if (!*ok) {
           free_tree(root->right);
           free(root);
           return NULL;
       }

       return root;
   }

   struct TreeNode *buildTree(
       int *inorder,
       int inorderSize,
       int *postorder,
       int postorderSize
   ) {
       if (inorderSize != postorderSize || inorderSize == 0) {
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
       int post_index = postorderSize;
       struct TreeNode *root = build_postorder(
           postorder,
           &post_index,
           0,
           inorderSize,
           &positions,
           &ok
       );

       if (!ok || post_index != 0) {
           free_tree(root);
           root = NULL;
       }

       map_destroy(&positions);
       return root;
   }

C 的 ``post_index`` 初始为数组长度，非空调用先减一再读取。
右子树失败时当前根尚无成功左子树，只需释放根；
左子树失败时还要释放已经完成的右子树。成功返回的节点由平台调用者持有。

C++
~~~

.. code-block:: cpp

   #include <unordered_map>
   #include <vector>

   class Solution {
   private:
       std::unordered_map<int, int> position;
       int postIndex = 0;

       TreeNode* build(
           const std::vector<int>& postorder,
           int inLeft,
           int inRight
       ) {
           if (inLeft >= inRight) {
               return nullptr;
           }

           const int rootValue = postorder[--postIndex];
           const int middle = position.at(rootValue);
           TreeNode* root = new TreeNode(rootValue);

           root->right = build(postorder, middle + 1, inRight);
           root->left = build(postorder, inLeft, middle);
           return root;
       }

   public:
       TreeNode* buildTree(
           std::vector<int>& inorder,
           std::vector<int>& postorder
       ) {
           position.clear();
           position.reserve(inorder.size());
           for (int i = 0; i < static_cast<int>(inorder.size()); ++i) {
               position.emplace(inorder[i], i);
           }

           postIndex = static_cast<int>(postorder.size());
           return build(
               postorder,
               0,
               static_cast<int>(inorder.size())
           );
       }
   };

公共入口清空下标表并把 ``postIndex`` 设为后序长度。``position.at`` 由合法输入契约支撑；
若扩展到不可信输入，
应显式处理查找失败和区间不一致。

Python
~~~~~~

.. code-block:: python

   from typing import Optional


   class Solution:
       def buildTree(
           self,
           inorder: list[int],
           postorder: list[int],
       ) -> Optional[TreeNode]:
           position = {
               value: index
               for index, value in enumerate(inorder)
           }
           post_index = len(postorder)

           def build(in_left: int, in_right: int) -> Optional[TreeNode]:
               nonlocal post_index
               if in_left >= in_right:
                   return None

               post_index -= 1
               root_value = postorder[post_index]
               middle = position[root_value]
               root = TreeNode(root_value)

               root.right = build(middle + 1, in_right)
               root.left = build(in_left, middle)
               return root

           return build(0, len(inorder))

``post_index`` 保存未消费前缀长度，避免从 ``-1`` 开始再判断。右子树必须写在左子树之前；
交换两行会让游标
读取错误片段。

Java
~~~~

.. code-block:: java

   import java.util.HashMap;
   import java.util.Map;

   class Solution {
       private final Map<Integer, Integer> position = new HashMap<>();
       private int postIndex;

       public TreeNode buildTree(int[] inorder, int[] postorder) {
           position.clear();
           for (int i = 0; i < inorder.length; ++i) {
               position.put(inorder[i], i);
           }

           postIndex = postorder.length;
           return build(postorder, 0, inorder.length);
       }

       private TreeNode build(
           int[] postorder,
           int inLeft,
           int inRight
       ) {
           if (inLeft >= inRight) {
               return null;
           }

           int rootValue = postorder[--postIndex];
           int middle = position.get(rootValue);
           TreeNode root = new TreeNode(rootValue);

           root.right = build(postorder, middle + 1, inRight);
           root.left = build(postorder, inLeft, middle);
           return root;
       }
   }

``postIndex`` 是对象字段，每次公共调用都重置。``HashMap`` 的键和值发生整数装箱，
渐进空间仍为 ``O(n)``。

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::collections::HashMap;
   use std::rc::Rc;

   impl Solution {
       pub fn build_tree(
           inorder: Vec<i32>,
           postorder: Vec<i32>,
       ) -> Option<Rc<RefCell<TreeNode>>> {
           fn build(
               postorder: &[i32],
               post_index: &mut usize,
               in_left: usize,
               in_right: usize,
               position: &HashMap<i32, usize>,
           ) -> Option<Rc<RefCell<TreeNode>>> {
               if in_left >= in_right {
                   return None;
               }

               *post_index -= 1;
               let root_value = postorder[*post_index];
               let middle = position[&root_value];

               let right = build(
                   postorder,
                   post_index,
                   middle + 1,
                   in_right,
                   position,
               );
               let left = build(
                   postorder,
                   post_index,
                   in_left,
                   middle,
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

           let mut post_index = postorder.len();
           build(
               &postorder,
               &mut post_index,
               0,
               inorder.len(),
               &position,
           )
       }
   }

``post_index`` 使用 ``usize``，合法非空调用中它必大于 0，因此 ``-= 1`` 不会下溢。
先在递归中构造右、左子树，
最后一次性借用根写入两个孩子，借用范围不会跨递归。

Go
~~

.. code-block:: go

   func buildTree(inorder []int, postorder []int) *TreeNode {
   	position := make(map[int]int, len(inorder))
   	for index, value := range inorder {
   		position[value] = index
   	}

   	postIndex := len(postorder)
   	var build func(int, int) *TreeNode
   	build = func(inLeft, inRight int) *TreeNode {
   		if inLeft >= inRight {
   			return nil
   		}

   		postIndex--
   		rootValue := postorder[postIndex]
   		middle := position[rootValue]
   		root := &TreeNode{Val: rootValue}

   		root.Right = build(middle+1, inRight)
   		root.Left = build(inLeft, middle)
   		return root
   	}

   	return build(0, len(inorder))
   }

闭包捕获 ``postIndex``。右子树调用完成后，共享游标已经越过整个右子树片段，再进入左区间。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function buildTree(
       inorder: number[],
       postorder: number[],
   ): TreeNode | null {
       const position = new Map<number, number>();
       for (let index = 0; index < inorder.length; index++) {
           position.set(inorder[index], index);
       }

       let postIndex = postorder.length;

       const build = (
           inLeft: number,
           inRight: number,
       ): TreeNode | null => {
           if (inLeft >= inRight) {
               return null;
           }

           const rootValue = postorder[--postIndex];
           const middle = position.get(rootValue)!;
           const root = new TreeNode(rootValue);

           root.right = build(middle + 1, inRight);
           root.left = build(inLeft, middle);
           return root;
       };

       return build(0, inorder.length);
   }

``Map.get`` 的非空断言由互异值和相同值集合契约保证。输入值与下标都处于安全整数范围内。

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       private readonly Dictionary<int, int> position =
           new Dictionary<int, int>();
       private int postIndex;

       public TreeNode BuildTree(int[] inorder, int[] postorder) {
           position.Clear();
           for (int i = 0; i < inorder.Length; ++i) {
               position[inorder[i]] = i;
           }

           postIndex = postorder.Length;
           return Build(postorder, 0, inorder.Length);
       }

       private TreeNode Build(
           int[] postorder,
           int inLeft,
           int inRight
       ) {
           if (inLeft >= inRight) {
               return null;
           }

           int rootValue = postorder[--postIndex];
           int middle = position[rootValue];
           var root = new TreeNode(rootValue);

           root.right = Build(postorder, middle + 1, inRight);
           root.left = Build(postorder, inLeft, middle);
           return root;
       }
   }

字段字典和游标在入口重置。托管节点由垃圾回收器管理，成功返回后根引用保持整棵树可达。

Julia
~~~~~

.. code-block:: julia

   function build_tree(
       inorder::Vector{Int},
       postorder::Vector{Int},
   )::Union{TreeNode, Nothing}
       position = Dict(
           value => index
           for (index, value) in pairs(inorder)
       )
       state = Ref(lastindex(postorder))

       function build(
           in_left::Int,
           in_right::Int,
       )::Union{TreeNode, Nothing}
           in_left > in_right && return nothing

           root_value = postorder[state[]]
           state[] -= 1
           middle = position[root_value]
           root = TreeNode(root_value)

           root.right = build(middle + 1, in_right)
           root.left = build(in_left, middle - 1)
           return root
       end

       return build(firstindex(inorder), lastindex(inorder))
   end

Julia 的 ``state`` 初始为 ``lastindex(postorder)``。只有非空闭区间才读取并递减，
所以不会在空树分支访问下标 0。
递归顺序明确写成右后左。

R
~

.. code-block:: r

   build_tree <- function(inorder, postorder) {
     position <- new.env(hash = TRUE, parent = emptyenv())
     for (index in seq_along(inorder)) {
       position[[as.character(inorder[[index]])]] <- index
     }

     state <- new.env(parent = emptyenv())
     state$post_index <- length(postorder)

     build <- function(in_left, in_right) {
       if (in_left > in_right) {
         return(NULL)
       }

       root_value <- postorder[[state$post_index]]
       state$post_index <- state$post_index - 1L
       middle <- position[[as.character(root_value)]]
       root <- new_tree_node(root_value)

       root$right <- build(middle + 1L, in_right)
       root$left <- build(in_left, middle - 1L)
       root
     }

     build(1L, length(inorder))
   }

``state`` 环境提供所有递归帧可见的共享游标。代码没有构造可能方向错误的 ``seq.int``
递减范围，而是只用整数端点
和空区间判断。

与 0105 的对偶关系
------------------

两题可以用一张规则表记忆：

.. list-table::
   :header-rows: 1

   * - 输入
     - 根的位置
     - 游标方向
     - 递归顺序
   * - 前序 + 中序
     - 前序片段首部
     - 从左向右
     - 左子树，再右子树
   * - 中序 + 后序
     - 后序片段尾部
     - 从右向左
     - 右子树，再左子树

中序始终负责划分节点集合；另一种遍历负责决定根以及子树消费顺序。
只背“根在首或尾”而忽略递归顺序，仍会写错。

验证计划与证据
--------------

* Python 通过语法解析，并用 3000 棵随机互异值二叉树执行“遍历生成、重建、完整结构比较”对拍；
* C、C++ 通过严格警告编译，并在 ASan、UBSan 下各运行 500 棵随机树；
* Java、Go、TypeScript 分别通过编译或严格类型检查，并各运行 500 棵随机树；
* 随机树覆盖左右子树同时存在的情况，能够检测错误的“先左后右”消费顺序；
* Rust、C#、Julia、R 完成反向游标、无符号下标、一基区间、引用和作用域静态检查；
* 当前环境没有对应四种运行时，因此没有声称它们完成运行验证。

关键边界
--------

* 单节点：游标减一后读取唯一根，两个中序区间为空；
* 纯右链：每轮先构造非空右区间，递归深度达到 ``n``；
* 纯左链：每轮右区间为空，再构造左区间；
* 值互异：中序下标表才能把根映射到唯一划分位置；
* 共享游标：对象字段或闭包状态必须在每次公共调用重新初始化；
* C 分配失败：已创建节点和哈希表必须全部释放。

易错点
------

* 把后序首元素当根；根位于当前后序片段末尾；
* 从后序尾部读取却先构造左子树；
* 先把 ``post_index`` 当作有效下标读取，再忘记减一；
* 混用闭区间与半开区间，使根重复进入某个子区间；
* 在线性扫描中序位置，退化树最坏 ``O(n^2)``；
* 只验证最终层序样例，没有重新检查中序与后序是否完全一致。

本题新增知识
------------

* 后序尾根与反向游标状态；
* 从后序尾部消费时“右子树先于左子树”的必要性；
* 用未消费前缀长度表达无符号安全的反向下标。

本题强化知识
------------

* `0105` 的中序唯一位置与区间划分；
* 哈希下标表的期望 ``O(1)`` 根定位；
* 树构造结果载荷、递归栈与下标表空间分层；
* R 环境共享递归状态和 C 事务式资源清理。

关联题目
--------

* `0105. Construct Binary Tree from Preorder and Inorder Traversal
  <0105-construct-binary-tree-from-preorder-and-inorder-traversal.rst>`_：前序游标的左后右消费；
* `0104. Maximum Depth of Binary Tree <0104-maximum-depth-of-binary-tree.rst>`_：树高和递归栈；
* `0095. Unique Binary Search Trees II
  <../0001-0100/0095-unique-binary-search-trees-ii.rst>`_：递归构造新节点与返回树独立性。

最小自检
--------

#. ``post_index`` 在进入非空调用时表示什么？
#. 为什么消费根后必须先递归右中序区间？
#. 中序下标表决定了左右子树的哪些信息？
#. Rust 为什么把游标初始设为长度，而不是 ``len - 1``？
#. 返回树、哈希表和递归栈分别占用什么空间？

答案要点
~~~~~~~~

后序片段末值是根，中序唯一位置划分左右集合。从后序末尾向前消费时，
根之后首先遇到右子树片段，所以必须先构造
右子树，再构造左子树。每个节点只读取和查表一次，期望时间 ``O(n)``；下标表 ``O(n)``、
调用栈 ``O(h)``，
返回树另占 ``Theta(n)``。
