# Sphinx configuration for LeetCodeRST

project = 'LeetCode 解题思维训练'
copyright = '2026, cxy251'
author = 'cxy251'

extensions = [
    'sphinx.ext.viewcode',
]

exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store', '.venv', 'README.rst']
language = 'zh_CN'

html_theme = 'furo'
html_title = 'LeetCode 解题思维训练'
