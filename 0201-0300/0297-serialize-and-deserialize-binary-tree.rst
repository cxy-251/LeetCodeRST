0297. Serialize and Deserialize Binary Tree
===========================================

题目信息
--------

:题号: 0297
:难度: Hard
:主题: 二叉树、序列化、反序列化、对象设计
:原题: `LeetCode 0297 <https://leetcode.com/problems/serialize-and-deserialize-binary-tree/>`_
:重点: 编码必须保留节点值和完整左右结构、空节点需要可区分、两种方法使用同一格式

题目重述
--------

实现 ``Codec`` 类中的两个方法：``serialize(root)`` 把一棵二叉树转换为一个字符串，``deserialize(data)`` 根据该字符串重新构造二叉树。对任意合法输入树，执行 ``deserialize(serialize(root))`` 后得到的树必须与原树具有相同的节点值以及相同的左右子节点结构。

题目不限定字符串的具体编码格式，也不要求与 LeetCode 展示二叉树时使用的层序格式一致；只要求序列化与反序列化彼此兼容，并能区分不同树形。空树也必须能够编码并恢复为空树。

树中节点数位于 ``[0, 10^4]``，节点值位于 ``[-1000, 1000]``。反序列化应创建可独立使用的树结构，不能只返回原输入节点或依赖序列化期间保存在外部的隐藏对象状态。

自建示例
--------

结构中包含空孩子：

.. code-block:: text

   输入树：层序表示为 [1, 2, 3, null, 4]
   操作：data = serialize(root)，再执行 deserialize(data)
   输出树：层序表示为 [1, 2, 3, null, 4]
   解释：节点 2 没有左孩子但有右孩子 4，编码必须保留这个空位，否则无法唯一恢复原结构。

空树往返：

.. code-block:: text

   输入树：[]
   操作：data = serialize(null)，再执行 deserialize(data)
   输出树：[]
   解释：空树必须拥有一种可被反序列化方法识别的表示。

前序遍历加空节点标记
--------------------

采用前序顺序 ``根 -> 左 -> 右``，每个空指针输出 ``#``，非空节点输出十进制值；
令逗号作为 token 分隔符。空标记不可省略：例如节点只有右孩子时，左孩子的 ``#`` 决定了后续值属于右子树，
否则不同树形可能编码成同一序列。

反序列化按相同顺序读取 token：读到 ``#`` 返回空指针；读到整数就创建节点，随后递归读取它的左、右子树。
序列化和反序列化共享这一个格式，且每个非空 token 都新建节点，因此不会依赖外部树对象。

正确性说明
----------

序列化对每个节点输出一次值并对每个空孩子输出一次标记，前序顺序保留父子关系和左右位置。
反序列化读取一个非空节点后严格先构造左子树、再构造右子树，空标记提供递归终点；
按节点数归纳，读取的子树与编码来源完全一致，所以 ``deserialize(serialize(root))`` 保持值和结构。

C++ 实现
--------

.. code-block:: cpp

   class Codec {
       void encode(TreeNode* node, std::string& data) {
           if (node == nullptr) {
               data += "#,";
               return;
           }
           data += std::to_string(node->val);
           data += ',';
           encode(node->left, data);
           encode(node->right, data);
       }

       TreeNode* decode(const std::string& data, std::size_t& position) {
           const std::size_t comma = data.find(',', position);
           const std::string token = data.substr(position, comma - position);
           position = comma + 1;
           if (token == "#") return nullptr;

           TreeNode* node = new TreeNode(std::stoi(token));
           node->left = decode(data, position);
           node->right = decode(data, position);
           return node;
       }

   public:
       std::string serialize(TreeNode* root) {
           std::string data;
           encode(root, data);
           return data;
       }

       TreeNode* deserialize(const std::string& data) {
           std::size_t position = 0;
           return decode(data, position);
       }
   };

代码分析
--------

每个节点和空孩子标记只处理一次，序列化与反序列化时间复杂度为 ``O(n)``，字符串和递归栈分别占
``O(n)`` 与 ``O(h)`` 空间。代码假设输入来自本类的合法序列化结果，因此 ``find(',')`` 一定成功；
反序列化新建节点，调用者负责按平台约定管理返回树的生命周期。
