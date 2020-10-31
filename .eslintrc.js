module.exports = {
  'env': {
    'browser': true,
    'es2020': true,
  },
  'extends': [
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/warnings',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    project: './tsconfig.json',
  },
  'plugins': [
    'react',
    '@typescript-eslint',
  ],
  'rules': {
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars-experimental": "error",
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'react/prop-types': 0,
    'semi': 'warn',
    'comma-dangle': [
      'warn',
      'always-multiline',
    ],
    'no-console': 'error',
    'quotes': [
      'warn',
      'single',
      'avoid-escape',
    ],
    'jsx-quotes': [
      'warn',
      'prefer-double',
    ],
    'no-trailing-spaces': 'warn',
    'indent': [
      'warn',
      2,
    ],
    'no-multiple-empty-lines': [
      'warn',
      {
        'max': 1,
      },
    ],
    'eol-last': [
      'warn',
      'always',
    ],
    'padding-line-between-statements': [
      'warn',
      {
        'blankLine': 'always',
        'prev': [
          'const',
          'let',
          'var',
        ],
        'next': '*',
      },
      {
        'blankLine': 'always',
        'prev': '*',
        'next': [
          'if',
          'try',
          'class',
          'export',
        ],
      },
      {
        'blankLine': 'always',
        'prev': [
          'if',
          'try',
          'class',
          'export',
        ],
        'next': '*',
      },
      {
        'blankLine': 'any',
        'prev': [
          'const',
          'let',
          'var',
          'export',
        ],
        'next': [
          'const',
          'let',
          'var',
          'export',
        ],
      },
      {
        'blankLine': 'always',
        'prev': [
          'expression',
        ],
        'next': [
          'const',
          'let',
          'var',
        ],
      },
    ],
    'block-spacing': 'warn',
    'eqeqeq': [
      'warn',
      'always',
    ],
    'comma-spacing': [
      'warn',
      {
        'before': false,
        'after': true,
      },
    ],
    'func-call-spacing': [
      'warn',
      'never',
    ],
    'no-duplicate-imports': 'error',
    'newline-before-return': 'warn',
    'object-curly-spacing': [
      'warn',
      'always',
      {
        'arraysInObjects': true,
        'objectsInObjects': true,
      },
    ],
    'padded-blocks': [
      'warn',
      'never',
    ],
    'react/jsx-max-props-per-line': [
      'warn',
      {
        'when': 'always',
      },
    ],
    'react/jsx-first-prop-new-line': [
      'warn',
      'multiline',
    ],
    'react/jsx-closing-bracket-location': 'warn',
    '@typescript-eslint/type-annotation-spacing': 'warn',
    '@typescript-eslint/member-delimiter-style': [
      'warn',
      {
        'multiline': {
          'delimiter': 'semi',
          'requireLast': true,
        },
      },
    ],
    'space-infix-ops': 'warn',
    'object-property-newline': [
      'warn',
      {
        'allowAllPropertiesOnSameLine': true,
      },
    ],
    'arrow-spacing': 'warn',
    'key-spacing': [
      'warn',
      {
        'afterColon': true,
      },
    ],
    'linebreak-style': 0,
    'import/prefer-default-export': 0,
    'import/order': [
      'warn',
      {
        'groups': [
          'builtin',
          'external',
          'parent',
          'sibling',
          'index',
        ],
        'pathGroups': [
          {
            'pattern': '@/**',
            'group': 'parent',
            'position': 'before',
          },
          {
            'pattern': 'react',
            'group': 'external',
            'position': 'before',
          },
        ],
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': false,
        },
        'pathGroupsExcludedImportTypes': [
          'builtin',
          'react',
        ],
      },
    ],
  },
  'settings': {
    'react': {
      'version': 'detect',
    },
  },
  'overrides': [
    {
      'files': [
        '*.test.tsx',
      ],
      'rules': {
        'padding-line-between-statements': [
          'warn',
          {
            'blankLine': 'always',
            'prev': [
              'const',
              'let',
              'var',
            ],
            'next': '*',
          },
          {
            'blankLine': 'always',
            'prev': '*',
            'next': [
              'if',
              'try',
              'class',
              'export',
            ],
          },
          {
            'blankLine': 'always',
            'prev': [
              'if',
              'try',
              'class',
              'export',
            ],
            'next': '*',
          },
          {
            'blankLine': 'any',
            'prev': [
              'const',
              'let',
              'var',
              'export',
            ],
            'next': [
              'const',
              'let',
              'var',
              'export',
              'expression',
            ],
          },
          {
            'blankLine': 'always',
            'prev': [
              'expression',
            ],
            'next': [
              'const',
              'let',
              'var',
            ],
          },
        ],
      },
    },
  ],
};
