import path from 'path';
import hash from 'hash-sum';

export default function (output) {
  if (typeof this.cacheable === 'function') {
    this.cacheable();
  }

  const moduleId = `_vue_jsx_hot-${hash(this.resourcePath)}`;
  const fileName = path.basename(this.resourcePath);
  const hotId = JSON.stringify(`${moduleId}/${fileName}`);

  return `
    ${output}

    if (module.hot) {
      (function () {
        var api = require('vue-hot-reload-api')

        // make the API aware of the Vue that you are using.
        // also checks compatibility.
        api.install(require('vue'), false);

        // compatibility can be checked via api.compatible after installation
        if (!api.compatible) {
          throw new Error(
            'vue-hot-reload-api is not compatible with the version of Vue you are using.'
          );
        }

        module.hot.accept();

        // Retrieve the exported component. Handle ES and CJS modules.
        var component = module.exports.__esModule ? module.exports.default : module.eexports;

        if (!module.hot.data) {
          api.createRecord(${hotId}, component);
        } else {
          api.rerender(${hotId}, component);
        }
      })();
    }
  `;
}
