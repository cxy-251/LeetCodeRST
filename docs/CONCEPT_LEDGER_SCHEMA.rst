知识账本结构
============

职责
----

``state/CONCEPT_LEDGER.toml`` 是活动知识账本总入口，``state/concepts/`` 中每个文件负责一个 50 题范围。
活动范围文件必须直接包含有效数据，正常生成、审查和修复流程不得读取 ``archive/`` 才能恢复知识状态。

范围与 schema
-------------

当前五个范围文件允许使用显式登记的兼容 schema：

* ``concept_state_v1``：平面 ``concepts`` 累计状态；
* ``problem_index_v3``：在 ``catalog.ids`` 中集中保存 concept ID，题号表用 ``i/r`` 索引记录 introduced/reinforced，直接覆盖完整 50 题范围；
* ``flat_concept_state_v1``：一个完整范围的平面 ``concepts``；
* ``problem_delta_v1``：按题号保存 ``introduced`` 与 ``reinforced`` ID，供开放范围原位追加。

权威关系
--------

#. 总索引的 ``records`` 顺序定义跨范围继承和覆盖顺序；
#. 范围文件内部按自身 schema 解析；
#. 后出现的同名知识状态覆盖更早状态；
#. ``archive/state/concepts/pre-consolidation`` 只保留迁移前原件，不参与活动解析；
#. 历史文件中的旧 ``inherits`` 字段与总索引冲突时，以总索引为准。

维护规则
--------

新题只修改所属 50 题范围文件。跨越 0250 后创建 ``0251-0300.toml``，同时更新总索引、进度和下一批合同。
禁止重新创建单题或小批次 concept 文件，也禁止把归档路径作为活动数据源。
