module.exports = {
	env: {
		node: true,
		commonjs: true,
		es2021: true,
	},
	root: true,
	extends: ["eslint:recommended", "prettier"],
	parserOptions: {
		ecmaVersion: "latest",
	},
	rules: {
		indent: ["error", 2],
		quotes: ["error", "single"],
		semi: ["error", "never"],
		eqeqeq: "error",
		"no-trailing-spaces": "error",
		"object-curly-spacing": ["error", "always"],
		"arrow-spacing": ["error", { before: true, after: true }],
		"no-console": 0,
		"linebreak-style": 0,
	},
}
