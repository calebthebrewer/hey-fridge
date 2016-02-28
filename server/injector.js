const dependencies = {}

module.exports = {
  add: function addDependency(name, dependency) {
    dependencies[name] = dependency
  },
  get: function getDependency(name) {
    return dependencies[name]
  }
}
