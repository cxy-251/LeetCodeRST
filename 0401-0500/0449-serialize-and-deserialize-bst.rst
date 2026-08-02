0449. Serialize and Deserialize BST
===================================

题目信息
--------

:题号: 0449
:难度: Medium
:主题: 二叉搜索树、序列化、反序列化、结构恢复
:原题: `LeetCode 0449 <https://leetcode.com/problems/serialize-and-deserialize-bst/>`_
:重点: 编码格式可自行设计、空树必须可往返、反序列化后结构和值一致、两个方法必须互相兼容

题目重述
--------

设计 ``Codec`` 类，实现 ``serialize(root)`` 和 ``deserialize(data)``。``serialize`` 把一棵二叉搜索树转换为字符串；``deserialize`` 根据该字符串重建一棵与原树节点值和拓扑结构都相同的二叉搜索树。

题目不限制具体字符串格式，只要求编码与解码方法完全兼容，并且编码应尽量紧凑。空树也必须有可识别的表示，并能解码回 ``null``。树中节点数位于 ``[0, 10^4]``，节点值位于 ``[0, 10^4]``，输入保证满足二叉搜索树性质。

自建示例
--------

包含不同形态的左右子树：

.. code-block:: text

   输入树：根节点 8；左孩子 3，右孩子 10；节点 3 的右孩子为 6
   操作：data = serialize(root)，然后 deserialize(data)
   输出：重建树仍具有 8 / 3 / 10 / 6 的相同父子关系
   解释：往返过程不仅要保留节点值集合，还必须恢复原来的树结构。

空树往返：

.. code-block:: text

   输入：root = null
   输出：deserialize(serialize(null)) = null
   解释：空树必须由编码格式明确表示，不能在解码时产生节点。

利用 BST 性质压缩前序序列
------------------------

序列化采用前序遍历，只写节点值并用逗号分隔；空树用空字符串表示。普通二叉树需要写入空孩子标记才能恢复结构，但 BST 的前序序列已经包含足够信息：对当前子树设置取值上下界，序列中下一个值若落在界内就属于当前子树，否则留给祖先的后续子树。

反序列化时按顺序读取一个值作为根，再在 ``(lower, value)`` 和 ``(value, upper)`` 两个范围内递归构造左右子树。某个值越过当前范围时不消耗输入，返回上层后由正确的祖先节点接收它。

C++ 实现
--------

.. code-block:: cpp

   class Codec {
       void write(TreeNode* node, std::string& data) {
           if (node == nullptr) return;
           if (!data.empty()) data.push_back(',');
           data += std::to_string(node->val);
           write(node->left, data);
           write(node->right, data);
       }

       TreeNode* build(const std::vector<int>& values, int& index,
                       long long lower, long long upper) {
           if (index == static_cast<int>(values.size()) ||
               values[index] <= lower || values[index] >= upper) {
               return nullptr;
           }

           int value = values[index++];
           TreeNode* node = new TreeNode(value);
           node->left = build(values, index, lower, value);
           node->right = build(values, index, value, upper);
           return node;
       }

   public:
       std::string serialize(TreeNode* root) {
           std::string data;
           write(root, data);
           return data;
       }

       TreeNode* deserialize(std::string data) {
           if (data.empty()) return nullptr;

           std::stringstream stream(data);
           std::string token;
           std::vector<int> values;
           while (std::getline(stream, token, ',')) {
               values.push_back(std::stoi(token));
           }

           int index = 0;
           return build(values, index, LLONG_MIN, LLONG_MAX);
       }
   };

代码分析
--------

前序序列中的每个值只读取一次；上下界保证小于根的值只能进入左子树，大于根的值只能进入右子树，并且越界值会留给外层递归，因此拓扑结构能够被唯一恢复。序列化和反序列化的时间复杂度均为 ``O(n)``，递归栈和保存的值列表需要 ``O(n)`` 空间。
