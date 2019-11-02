const presets = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current"
        }
      }
    ]
  ],
  plugins: ["@babel/plugin-proposal-class-properties"]
};

module.exports = presets;
