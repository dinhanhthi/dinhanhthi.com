'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es.array.iterator');
require('core-js/modules/es.promise');
var PluginError = _interopDefault(require('plugin-error'));
var through = _interopDefault(require('through2'));
var Cache = _interopDefault(require('cache-swap'));
var File = _interopDefault(require('vinyl'));
var pick = _interopDefault(require('object.pick'));
var EventEmitter = _interopDefault(require('events'));
var crypto = _interopDefault(require('crypto'));

const version = "1.1.3";

const whitespaces = 2;
const eventListenersCount = 3;

function makeHash(key) {
  return crypto.createHash('md5').update(key).digest('hex');
}

class TaskProxy {
  constructor(task, inputOptions) {
    this.task = task;
    this.options = inputOptions;
    this._cacheQueue = new Map();
    this._removeListeners = [];

    if (task) {
      this.patchTask();
    }
  }

  patchTask() {
    const {
      task
    } = this;
    const {
      _transform
    } = task;

    task._transform = (chunk, encoding, next) => {
      Reflect.apply(_transform, task, [chunk, encoding, (...args) => {
        next(...args); // eslint-disable-line

        task.emit('gulp-cache:transformed');
      }]);
    };
  }

  processFile(inputFile, signals = new EventEmitter()) {
    process.nextTick(() => {
      this._processFileAsync(inputFile, signals);
    });
    return signals;
  }

  async _processFileAsync(inputFile, signals = new EventEmitter()) {
    const cached = await this._checkForCachedValue(inputFile); // If we found a cached value
    // The path of the cache key should also be identical to the original one when the file path changed inside the task

    const cachedValue = cached.value;
    const cachedValueIsEmpty = !Array.isArray(cachedValue) || !cachedValue.length;
    const cachedValuesWithNormalPaths = cachedValueIsEmpty ? [] : cachedValue.filter(file => (!file.gulpCache$filePathChangedInsideTask || file.gulpCache$originalPath === inputFile.path) && (!file.gulpCache$fileBaseChangedInsideTask || file.gulpCache$originalBase === inputFile.base));

    if (cachedValuesWithNormalPaths.length) {
      cachedValuesWithNormalPaths.forEach(cachedFile => {
        // Extend the cached value onto the file, but don't overwrite original path info
        const file = new File({ // custom properties
          ...cachedFile,
          // file info
          ...pick(inputFile, ['cwd', 'base', 'stat', 'history', 'path']),
          // file contents
          contents: cachedFile.contents
        }); // Restore the file path if it was set

        if (cachedFile.path && cachedFile.gulpCache$filePathChangedInsideTask) {
          file.path = cachedFile.path;
        } // Restore the file base if it was set


        if (cachedFile.base && cachedFile.gulpCache$fileBaseChangedInsideTask) {
          file.base = cachedFile.base;
        }

        Reflect.deleteProperty(file, 'gulpCache$filePathChangedInsideTask');
        Reflect.deleteProperty(file, 'gulpCache$fileBaseChangedInsideTask');
        Reflect.deleteProperty(file, 'gulpCache$originalPath');
        Reflect.deleteProperty(file, 'gulpCache$originalBase');
        signals.emit('file', file);
      });
      signals.emit('done');

      this._removeListeners.push(() => {
        // Remove all listeners from `signals`
        signals.removeAllListeners();
      });

      return;
    }

    this._runProxiedTaskAndQueueCache(inputFile, cached.key, signals);
  }

  async flush(next) {
    const {
      task
    } = this;

    try {
      if (typeof task._flush == 'function') {
        task._flush(async (...args) => {
          await this._flush();
          next(...args);
        });
      } else {
        await this._flush();
        next();
        return;
      }
    } catch (err) {
      next(err);
      return;
    }
  }

  async _flush() {
    this._removeListeners.forEach(remove => {
      remove();
    });

    this._removeListeners = [];
    await Promise.all(Array.from(this._cacheQueue).map(async ([cachedKey, files]) => this._storeCachedResult(cachedKey, files)));
    this._cacheQueue = new Map();
  }

  async removeCachedResult(file) {
    const cachedKey = await this._getFileKey(file);
    return this._removeCached(this.options.name, cachedKey);
  }

  async _getFileKey(file) {
    const {
      key: getKey
    } = this.options;
    const key = await getKey(file);
    return key ? makeHash(key) : key;
  }

  async _checkForCachedValue(file) {
    const key = await this._getFileKey(file); // If no key returned, bug out early

    if (!key) {
      return {
        value: null,
        key
      };
    }

    const {
      name: cacheName,
      restore
    } = this.options;
    const cached = await this._getCached(cacheName, key);

    if (!cached) {
      return {
        value: null,
        key
      };
    }

    let parsedContents = null;

    try {
      parsedContents = JSON.parse(cached.contents);
    } catch (err) {
      parsedContents = [{
        cached: cached.contents
      }];
    }

    if (restore) {
      parsedContents = parsedContents.map(parsedFile => {
        const restoredFile = restore(parsedFile); // Force restore service properties

        restoredFile.gulpCache$filePathChangedInsideTask = parsedFile.gulpCache$filePathChangedInsideTask;
        restoredFile.gulpCache$fileBaseChangedInsideTask = parsedFile.gulpCache$fileBaseChangedInsideTask;
        restoredFile.gulpCache$originalPath = parsedFile.gulpCache$originalPath;
        restoredFile.gulpCache$originalBase = parsedFile.gulpCache$originalBase;
        return restoredFile;
      });
    }

    return {
      value: parsedContents,
      key
    };
  }

  async _getValueFromResult(result) {
    const {
      value: getValue
    } = this.options;

    if (typeof getValue !== 'function') {
      if (typeof getValue === 'string') {
        return {
          [getValue]: result[getValue]
        };
      }

      return getValue;
    }

    return getValue(result);
  }

  async _storeCachedResult(key, result) {
    // If we didn't have a cachedKey, skip caching result
    if (!key) {
      return result;
    }

    const {
      options
    } = this;
    const files = (await Promise.all(result.map(async ({
      file,
      meta
    }) => {
      if (options.success !== true && !(await options.success(file))) {
        return null;
      }

      return Object.assign((await this._getValueFromResult(file)), meta);
    }))).filter(Boolean);
    return this._addCached(this.options.name, key, JSON.stringify(files, null, whitespaces));
  }

  async _queueCache(file, cachedKey, originalBase, originalPath) {
    const {
      _cacheQueue
    } = this;
    const item = {
      file: file.clone({
        contents: false
      }),
      meta: {
        // Check if the task changed the file path
        gulpCache$filePathChangedInsideTask: file.path !== originalPath,
        // Check if the task changed the base path
        gulpCache$fileBaseChangedInsideTask: file.base !== originalBase,
        // Keep track of the original path
        gulpCache$originalPath: originalPath,
        // Keep track of the original base
        gulpCache$originalBase: originalBase
      }
    };

    if (_cacheQueue.has(cachedKey)) {
      _cacheQueue.get(cachedKey).push(item);
    } else {
      _cacheQueue.set(cachedKey, [item]);
    }
  }

  _runProxiedTaskAndQueueCache(file, cachedKey, signals = new EventEmitter()) {
    const originalBase = file.base;
    const originalPath = file.path;
    signals.on('cache', file => {
      this._queueCache(file, cachedKey, originalBase, originalPath);

      signals.emit('file', file);
    });
    return this._runProxiedTask(file, cachedKey, signals);
  }

  _runProxiedTask(file, cachedKey, signals = new EventEmitter()) {
    const {
      task
    } = this;
    const hasCacheListener = Boolean(signals.listenerCount('cache'));

    function onError(err) {
      signals.emit('error', err);
    }

    function onData(datum) {
      if (datum._cachedKey !== cachedKey) {
        return;
      }

      Reflect.deleteProperty(datum, '_cachedKey');

      if (hasCacheListener) {
        signals.emit('cache', datum);
      } else {
        signals.emit('file', datum);
      }
    }

    function onTransformed() {
      signals.emit('done');
    }

    this._removeListeners.push(() => {
      // Be good citizens and remove our listeners
      task.removeListener('error', onError);
      task.removeListener('gulp-cache:transformed', onTransformed);
      task.removeListener('data', onData); // Reduce the maxListeners back down

      task.setMaxListeners(task._maxListeners - eventListenersCount); // Remove all listeners from `signals`

      signals.removeAllListeners();
    }); // Bump up max listeners to prevent memory leak warnings


    const currMaxListeners = task._maxListeners || 0;
    task.setMaxListeners(currMaxListeners + eventListenersCount);
    task.on('data', onData);
    task.once('gulp-cache:transformed', onTransformed);
    task.once('error', onError);
    file._cachedKey = cachedKey; // Run through the other task and grab output (or error)

    task.write(file);
    return signals;
  }
  /**
   * Cache promise wrappers.
   */


  _addCached(...args) {
    return new Promise((resolve, reject) => {
      this.options.fileCache.addCached(...args, (err, res) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(res);
      });
    });
  }

  _getCached(...args) {
    return new Promise((resolve, reject) => {
      this.options.fileCache.getCached(...args, (err, res) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(res);
      });
    });
  }

  _removeCached(...args) {
    return new Promise((resolve, reject) => {
      this.options.fileCache.removeCached(...args, err => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

}

const fileCache = new Cache({
  cacheDirName: 'gulp-cache'
});

function defaultKey(file) {
  return `${version}${file.contents.toString('base64')}`;
}

function defaultRestore(restored) {
  if (restored.contents) {
    // Handle node 0.11 buffer to JSON as object with { type: 'buffer', data: [...] }
    if (restored && restored.contents && Array.isArray(restored.contents.data)) {
      restored.contents = Buffer.from(restored.contents.data);
    } else if (Array.isArray(restored.contents)) {
      restored.contents = Buffer.from(restored.contents);
    } else if (typeof restored.contents === 'string') {
      restored.contents = Buffer.from(restored.contents, 'base64');
    }
  }

  const restoredFile = new File(restored); // Restore any properties that the original task put on the file;
  // but omit the normal properties of the file

  Object.keys(restored).forEach(key => {
    if (File.isCustomProp(key)) {
      restoredFile[key] = restored[key];
    }
  });
  return restoredFile;
}

function defaultValue(file) {
  const vinylProps = ['cwd', 'base', 'contents', 'stat', 'history', 'path'];
  const customProps = Object.keys(file).filter(File.isCustomProp); // Convert from a File object (from vinyl) into a plain object

  return pick(file, [...vinylProps, ...customProps]);
}

const defaultOptions = {
  fileCache,
  name: 'default',
  success: true,
  key: defaultKey,
  restore: defaultRestore,
  value: defaultValue
};
plugin.Cache = Cache;
plugin.fileCache = fileCache;
plugin.defaultOptions = defaultOptions;
function plugin(task, inputOptions = {}) {
  // Check for required task option
  if (!task) {
    throw new PluginError('gulp-cache', 'Must pass a task to cache()');
  }

  const options = { ...plugin.defaultOptions,
    ...(task.cacheable || {}),
    ...inputOptions
  };
  const taskProxy = new TaskProxy(task, options);

  function each(file, enc, next) {
    if (file.isNull()) {
      next(null, file);
      return;
    }

    if (file.isStream()) {
      next(new PluginError('gulp-cache', 'Cannot operate on stream sources'));
      return;
    }

    const signals = taskProxy.processFile(file);
    signals.on('error', err => {
      next(new PluginError('gulp-cache', err));
    });
    signals.on('file', file => {
      this.push(file);
    });
    signals.on('done', () => {
      next(null);
    });
  }

  function flush(next) {
    taskProxy.flush(next);
  }

  return through.obj(each, flush);
}

plugin.clear = function clear(inputOptions) {
  const options = { ...plugin.defaultOptions,
    ...inputOptions
  };
  const taskProxy = new TaskProxy(null, options);

  async function each(file, enc, next) {
    if (file.isNull()) {
      next(null, file);
      return;
    }

    if (file.isStream()) {
      next(new PluginError('gulp-cache', 'Cannot operate on stream sources'));
      return;
    }

    try {
      await taskProxy.removeCachedResult(file);
      next(null, file);
      return;
    } catch (err) {
      next(new PluginError('gulp-cache', err));
      return;
    }
  }

  return through.obj(each);
};

plugin.clearAll = function clearAll() {
  return new Promise((resolve, reject) => {
    fileCache.clear(null, err => {
      if (err) {
        reject(new PluginError('gulp-cache', `Problem clearing the cache: ${err.message}`));
        return;
      }

      resolve();
    });
  });
};

module.exports = plugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL3NyYy90YXNrLXByb3h5LmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCBGaWxlIGZyb20gJ3ZpbnlsJztcbmltcG9ydCBwaWNrIGZyb20gJ29iamVjdC5waWNrJztcblxuY29uc3Qgd2hpdGVzcGFjZXMgPSAyO1xuY29uc3QgZXZlbnRMaXN0ZW5lcnNDb3VudCA9IDM7XG5cbmZ1bmN0aW9uIG1ha2VIYXNoKGtleSkge1xuXHRyZXR1cm4gY3J5cHRvLmNyZWF0ZUhhc2goJ21kNScpLnVwZGF0ZShrZXkpLmRpZ2VzdCgnaGV4Jyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhc2tQcm94eSB7XG5cblx0Y29uc3RydWN0b3IodGFzaywgaW5wdXRPcHRpb25zKSB7XG5cblx0XHR0aGlzLnRhc2sgPSB0YXNrO1xuXHRcdHRoaXMub3B0aW9ucyA9IGlucHV0T3B0aW9ucztcblx0XHR0aGlzLl9jYWNoZVF1ZXVlID0gbmV3IE1hcCgpO1xuXHRcdHRoaXMuX3JlbW92ZUxpc3RlbmVycyA9IFtdO1xuXG5cdFx0aWYgKHRhc2spIHtcblx0XHRcdHRoaXMucGF0Y2hUYXNrKCk7XG5cdFx0fVxuXHR9XG5cblx0cGF0Y2hUYXNrKCkge1xuXG5cdFx0Y29uc3QgeyB0YXNrIH0gPSB0aGlzO1xuXHRcdGNvbnN0IHsgX3RyYW5zZm9ybSB9ID0gdGFzaztcblxuXHRcdHRhc2suX3RyYW5zZm9ybSA9IChjaHVuaywgZW5jb2RpbmcsIG5leHQpID0+IHtcblxuXHRcdFx0UmVmbGVjdC5hcHBseShfdHJhbnNmb3JtLCB0YXNrLCBbY2h1bmssIGVuY29kaW5nLCAoLi4uYXJncykgPT4ge1xuXHRcdFx0XHRuZXh0KC4uLmFyZ3MpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cdFx0XHRcdHRhc2suZW1pdCgnZ3VscC1jYWNoZTp0cmFuc2Zvcm1lZCcpO1xuXHRcdFx0fV0pO1xuXHRcdH07XG5cdH1cblxuXHRwcm9jZXNzRmlsZShpbnB1dEZpbGUsIHNpZ25hbHMgPSBuZXcgRXZlbnRFbWl0dGVyKCkpIHtcblxuXHRcdHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuXHRcdFx0dGhpcy5fcHJvY2Vzc0ZpbGVBc3luYyhpbnB1dEZpbGUsIHNpZ25hbHMpO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHNpZ25hbHM7XG5cdH1cblxuXHRhc3luYyBfcHJvY2Vzc0ZpbGVBc3luYyhpbnB1dEZpbGUsIHNpZ25hbHMgPSBuZXcgRXZlbnRFbWl0dGVyKCkpIHtcblxuXHRcdGNvbnN0IGNhY2hlZCA9IGF3YWl0IHRoaXMuX2NoZWNrRm9yQ2FjaGVkVmFsdWUoaW5wdXRGaWxlKTtcblx0XHQvLyBJZiB3ZSBmb3VuZCBhIGNhY2hlZCB2YWx1ZVxuXHRcdC8vIFRoZSBwYXRoIG9mIHRoZSBjYWNoZSBrZXkgc2hvdWxkIGFsc28gYmUgaWRlbnRpY2FsIHRvIHRoZSBvcmlnaW5hbCBvbmUgd2hlbiB0aGUgZmlsZSBwYXRoIGNoYW5nZWQgaW5zaWRlIHRoZSB0YXNrXG5cdFx0Y29uc3QgY2FjaGVkVmFsdWUgPSBjYWNoZWQudmFsdWU7XG5cdFx0Y29uc3QgY2FjaGVkVmFsdWVJc0VtcHR5ID0gIUFycmF5LmlzQXJyYXkoY2FjaGVkVmFsdWUpIHx8ICFjYWNoZWRWYWx1ZS5sZW5ndGg7XG5cdFx0Y29uc3QgY2FjaGVkVmFsdWVzV2l0aE5vcm1hbFBhdGhzID0gY2FjaGVkVmFsdWVJc0VtcHR5ID8gW10gOiBjYWNoZWRWYWx1ZS5maWx0ZXIoXG5cdFx0XHRmaWxlID0+XG5cdFx0XHRcdCghZmlsZS5ndWxwQ2FjaGUkZmlsZVBhdGhDaGFuZ2VkSW5zaWRlVGFzayB8fCBmaWxlLmd1bHBDYWNoZSRvcmlnaW5hbFBhdGggPT09IGlucHV0RmlsZS5wYXRoKVxuXHRcdFx0XHQmJiAoIWZpbGUuZ3VscENhY2hlJGZpbGVCYXNlQ2hhbmdlZEluc2lkZVRhc2sgfHwgZmlsZS5ndWxwQ2FjaGUkb3JpZ2luYWxCYXNlID09PSBpbnB1dEZpbGUuYmFzZSlcblx0XHQpO1xuXG5cdFx0aWYgKGNhY2hlZFZhbHVlc1dpdGhOb3JtYWxQYXRocy5sZW5ndGgpIHtcblxuXHRcdFx0Y2FjaGVkVmFsdWVzV2l0aE5vcm1hbFBhdGhzLmZvckVhY2goKGNhY2hlZEZpbGUpID0+IHtcblx0XHRcdFx0Ly8gRXh0ZW5kIHRoZSBjYWNoZWQgdmFsdWUgb250byB0aGUgZmlsZSwgYnV0IGRvbid0IG92ZXJ3cml0ZSBvcmlnaW5hbCBwYXRoIGluZm9cblx0XHRcdFx0Y29uc3QgZmlsZSA9IG5ldyBGaWxlKHtcblx0XHRcdFx0XHQvLyBjdXN0b20gcHJvcGVydGllc1xuXHRcdFx0XHRcdC4uLmNhY2hlZEZpbGUsXG5cdFx0XHRcdFx0Ly8gZmlsZSBpbmZvXG5cdFx0XHRcdFx0Li4ucGljayhpbnB1dEZpbGUsIFsnY3dkJywgJ2Jhc2UnLCAnc3RhdCcsICdoaXN0b3J5JywgJ3BhdGgnXSksXG5cdFx0XHRcdFx0Ly8gZmlsZSBjb250ZW50c1xuXHRcdFx0XHRcdGNvbnRlbnRzOiBjYWNoZWRGaWxlLmNvbnRlbnRzXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vIFJlc3RvcmUgdGhlIGZpbGUgcGF0aCBpZiBpdCB3YXMgc2V0XG5cdFx0XHRcdGlmIChjYWNoZWRGaWxlLnBhdGggJiYgY2FjaGVkRmlsZS5ndWxwQ2FjaGUkZmlsZVBhdGhDaGFuZ2VkSW5zaWRlVGFzaykge1xuXHRcdFx0XHRcdGZpbGUucGF0aCA9IGNhY2hlZEZpbGUucGF0aDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFJlc3RvcmUgdGhlIGZpbGUgYmFzZSBpZiBpdCB3YXMgc2V0XG5cdFx0XHRcdGlmIChjYWNoZWRGaWxlLmJhc2UgJiYgY2FjaGVkRmlsZS5ndWxwQ2FjaGUkZmlsZUJhc2VDaGFuZ2VkSW5zaWRlVGFzaykge1xuXHRcdFx0XHRcdGZpbGUuYmFzZSA9IGNhY2hlZEZpbGUuYmFzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdFJlZmxlY3QuZGVsZXRlUHJvcGVydHkoZmlsZSwgJ2d1bHBDYWNoZSRmaWxlUGF0aENoYW5nZWRJbnNpZGVUYXNrJyk7XG5cdFx0XHRcdFJlZmxlY3QuZGVsZXRlUHJvcGVydHkoZmlsZSwgJ2d1bHBDYWNoZSRmaWxlQmFzZUNoYW5nZWRJbnNpZGVUYXNrJyk7XG5cdFx0XHRcdFJlZmxlY3QuZGVsZXRlUHJvcGVydHkoZmlsZSwgJ2d1bHBDYWNoZSRvcmlnaW5hbFBhdGgnKTtcblx0XHRcdFx0UmVmbGVjdC5kZWxldGVQcm9wZXJ0eShmaWxlLCAnZ3VscENhY2hlJG9yaWdpbmFsQmFzZScpO1xuXG5cdFx0XHRcdHNpZ25hbHMuZW1pdCgnZmlsZScsIGZpbGUpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHNpZ25hbHMuZW1pdCgnZG9uZScpO1xuXG5cdFx0XHR0aGlzLl9yZW1vdmVMaXN0ZW5lcnMucHVzaCgoKSA9PiB7XG5cdFx0XHRcdC8vIFJlbW92ZSBhbGwgbGlzdGVuZXJzIGZyb20gYHNpZ25hbHNgXG5cdFx0XHRcdHNpZ25hbHMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX3J1blByb3hpZWRUYXNrQW5kUXVldWVDYWNoZShpbnB1dEZpbGUsIGNhY2hlZC5rZXksIHNpZ25hbHMpO1xuXHR9XG5cblx0YXN5bmMgZmx1c2gobmV4dCkge1xuXG5cdFx0Y29uc3QgeyB0YXNrIH0gPSB0aGlzO1xuXG5cdFx0dHJ5IHtcblxuXHRcdFx0aWYgKHR5cGVvZiB0YXNrLl9mbHVzaCA9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHRhc2suX2ZsdXNoKGFzeW5jICguLi5hcmdzKSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5fZmx1c2goKTtcblx0XHRcdFx0XHRuZXh0KC4uLmFyZ3MpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGF3YWl0IHRoaXMuX2ZsdXNoKCk7XG5cdFx0XHRcdG5leHQoKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRuZXh0KGVycik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9XG5cblx0YXN5bmMgX2ZsdXNoKCkge1xuXG5cdFx0dGhpcy5fcmVtb3ZlTGlzdGVuZXJzLmZvckVhY2goKHJlbW92ZSkgPT4ge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLl9yZW1vdmVMaXN0ZW5lcnMgPSBbXTtcblxuXHRcdGF3YWl0IFByb21pc2UuYWxsKFxuXHRcdFx0QXJyYXkuZnJvbSh0aGlzLl9jYWNoZVF1ZXVlKS5tYXAoXG5cdFx0XHRcdGFzeW5jIChbY2FjaGVkS2V5LCBmaWxlc10pID0+XG5cdFx0XHRcdFx0dGhpcy5fc3RvcmVDYWNoZWRSZXN1bHQoY2FjaGVkS2V5LCBmaWxlcylcblx0XHRcdClcblx0XHQpO1xuXG5cdFx0dGhpcy5fY2FjaGVRdWV1ZSA9IG5ldyBNYXAoKTtcblx0fVxuXG5cdGFzeW5jIHJlbW92ZUNhY2hlZFJlc3VsdChmaWxlKSB7XG5cblx0XHRjb25zdCBjYWNoZWRLZXkgPSBhd2FpdCB0aGlzLl9nZXRGaWxlS2V5KGZpbGUpO1xuXG5cdFx0cmV0dXJuIHRoaXMuX3JlbW92ZUNhY2hlZChcblx0XHRcdHRoaXMub3B0aW9ucy5uYW1lLFxuXHRcdFx0Y2FjaGVkS2V5XG5cdFx0KTtcblx0fVxuXG5cdGFzeW5jIF9nZXRGaWxlS2V5KGZpbGUpIHtcblxuXHRcdGNvbnN0IHsga2V5OiBnZXRLZXkgfSA9IHRoaXMub3B0aW9ucztcblx0XHRjb25zdCBrZXkgPSBhd2FpdCBnZXRLZXkoZmlsZSk7XG5cblx0XHRyZXR1cm4ga2V5ID8gbWFrZUhhc2goa2V5KSA6IGtleTtcblx0fVxuXG5cdGFzeW5jIF9jaGVja0ZvckNhY2hlZFZhbHVlKGZpbGUpIHtcblxuXHRcdGNvbnN0IGtleSA9IGF3YWl0IHRoaXMuX2dldEZpbGVLZXkoZmlsZSk7XG5cblx0XHQvLyBJZiBubyBrZXkgcmV0dXJuZWQsIGJ1ZyBvdXQgZWFybHlcblx0XHRpZiAoIWtleSkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IG51bGwsXG5cdFx0XHRcdGtleVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRjb25zdCB7IG5hbWU6IGNhY2hlTmFtZSwgcmVzdG9yZSB9ID0gdGhpcy5vcHRpb25zO1xuXHRcdGNvbnN0IGNhY2hlZCA9IGF3YWl0IHRoaXMuX2dldENhY2hlZChjYWNoZU5hbWUsIGtleSk7XG5cblx0XHRpZiAoIWNhY2hlZCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dmFsdWU6IG51bGwsXG5cdFx0XHRcdGtleVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRsZXQgcGFyc2VkQ29udGVudHMgPSBudWxsO1xuXG5cdFx0dHJ5IHtcblx0XHRcdHBhcnNlZENvbnRlbnRzID0gSlNPTi5wYXJzZShjYWNoZWQuY29udGVudHMpO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0cGFyc2VkQ29udGVudHMgPSBbeyBjYWNoZWQ6IGNhY2hlZC5jb250ZW50cyB9XTtcblx0XHR9XG5cblx0XHRpZiAocmVzdG9yZSkge1xuXHRcdFx0cGFyc2VkQ29udGVudHMgPSBwYXJzZWRDb250ZW50cy5tYXAoXG5cdFx0XHRcdChwYXJzZWRGaWxlKSA9PiB7XG5cblx0XHRcdFx0XHRjb25zdCByZXN0b3JlZEZpbGUgPSByZXN0b3JlKHBhcnNlZEZpbGUpO1xuXG5cdFx0XHRcdFx0Ly8gRm9yY2UgcmVzdG9yZSBzZXJ2aWNlIHByb3BlcnRpZXNcblx0XHRcdFx0XHRyZXN0b3JlZEZpbGUuZ3VscENhY2hlJGZpbGVQYXRoQ2hhbmdlZEluc2lkZVRhc2sgPSBwYXJzZWRGaWxlLmd1bHBDYWNoZSRmaWxlUGF0aENoYW5nZWRJbnNpZGVUYXNrO1xuXHRcdFx0XHRcdHJlc3RvcmVkRmlsZS5ndWxwQ2FjaGUkZmlsZUJhc2VDaGFuZ2VkSW5zaWRlVGFzayA9IHBhcnNlZEZpbGUuZ3VscENhY2hlJGZpbGVCYXNlQ2hhbmdlZEluc2lkZVRhc2s7XG5cdFx0XHRcdFx0cmVzdG9yZWRGaWxlLmd1bHBDYWNoZSRvcmlnaW5hbFBhdGggPSBwYXJzZWRGaWxlLmd1bHBDYWNoZSRvcmlnaW5hbFBhdGg7XG5cdFx0XHRcdFx0cmVzdG9yZWRGaWxlLmd1bHBDYWNoZSRvcmlnaW5hbEJhc2UgPSBwYXJzZWRGaWxlLmd1bHBDYWNoZSRvcmlnaW5hbEJhc2U7XG5cblx0XHRcdFx0XHRyZXR1cm4gcmVzdG9yZWRGaWxlO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR2YWx1ZTogcGFyc2VkQ29udGVudHMsXG5cdFx0XHRrZXlcblx0XHR9O1xuXHR9XG5cblx0YXN5bmMgX2dldFZhbHVlRnJvbVJlc3VsdChyZXN1bHQpIHtcblxuXHRcdGNvbnN0IHsgdmFsdWU6IGdldFZhbHVlIH0gPSB0aGlzLm9wdGlvbnM7XG5cblx0XHRpZiAodHlwZW9mIGdldFZhbHVlICE9PSAnZnVuY3Rpb24nKSB7XG5cblx0XHRcdGlmICh0eXBlb2YgZ2V0VmFsdWUgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0W2dldFZhbHVlXTogcmVzdWx0W2dldFZhbHVlXVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZ2V0VmFsdWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGdldFZhbHVlKHJlc3VsdCk7XG5cdH1cblxuXHRhc3luYyBfc3RvcmVDYWNoZWRSZXN1bHQoa2V5LCByZXN1bHQpIHtcblxuXHRcdC8vIElmIHdlIGRpZG4ndCBoYXZlIGEgY2FjaGVkS2V5LCBza2lwIGNhY2hpbmcgcmVzdWx0XG5cdFx0aWYgKCFrZXkpIHtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgeyBvcHRpb25zIH0gPSB0aGlzO1xuXHRcdGNvbnN0IGZpbGVzID0gKGF3YWl0IFByb21pc2UuYWxsKHJlc3VsdC5tYXAoXG5cdFx0XHRhc3luYyAoeyBmaWxlLCBtZXRhIH0pID0+IHtcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5zdWNjZXNzICE9PSB0cnVlICYmICEoYXdhaXQgb3B0aW9ucy5zdWNjZXNzKGZpbGUpKSkge1xuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oXG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5fZ2V0VmFsdWVGcm9tUmVzdWx0KGZpbGUpLFxuXHRcdFx0XHRcdG1ldGFcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHQpKSkuZmlsdGVyKEJvb2xlYW4pO1xuXG5cdFx0cmV0dXJuIHRoaXMuX2FkZENhY2hlZChcblx0XHRcdHRoaXMub3B0aW9ucy5uYW1lLFxuXHRcdFx0a2V5LFxuXHRcdFx0SlNPTi5zdHJpbmdpZnkoZmlsZXMsIG51bGwsIHdoaXRlc3BhY2VzKVxuXHRcdCk7XG5cdH1cblxuXHRhc3luYyBfcXVldWVDYWNoZShmaWxlLCBjYWNoZWRLZXksIG9yaWdpbmFsQmFzZSwgb3JpZ2luYWxQYXRoKSB7XG5cblx0XHRjb25zdCB7IF9jYWNoZVF1ZXVlIH0gPSB0aGlzO1xuXHRcdGNvbnN0IGl0ZW0gPSB7XG5cdFx0XHRmaWxlOiBmaWxlLmNsb25lKHsgY29udGVudHM6IGZhbHNlIH0pLFxuXHRcdFx0bWV0YToge1xuXHRcdFx0XHQvLyBDaGVjayBpZiB0aGUgdGFzayBjaGFuZ2VkIHRoZSBmaWxlIHBhdGhcblx0XHRcdFx0Z3VscENhY2hlJGZpbGVQYXRoQ2hhbmdlZEluc2lkZVRhc2s6IGZpbGUucGF0aCAhPT0gb3JpZ2luYWxQYXRoLFxuXHRcdFx0XHQvLyBDaGVjayBpZiB0aGUgdGFzayBjaGFuZ2VkIHRoZSBiYXNlIHBhdGhcblx0XHRcdFx0Z3VscENhY2hlJGZpbGVCYXNlQ2hhbmdlZEluc2lkZVRhc2s6IGZpbGUuYmFzZSAhPT0gb3JpZ2luYWxCYXNlLFxuXHRcdFx0XHQvLyBLZWVwIHRyYWNrIG9mIHRoZSBvcmlnaW5hbCBwYXRoXG5cdFx0XHRcdGd1bHBDYWNoZSRvcmlnaW5hbFBhdGg6ICAgICAgICAgICAgICBvcmlnaW5hbFBhdGgsXG5cdFx0XHRcdC8vIEtlZXAgdHJhY2sgb2YgdGhlIG9yaWdpbmFsIGJhc2Vcblx0XHRcdFx0Z3VscENhY2hlJG9yaWdpbmFsQmFzZTogICAgICAgICAgICAgIG9yaWdpbmFsQmFzZVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRpZiAoX2NhY2hlUXVldWUuaGFzKGNhY2hlZEtleSkpIHtcblx0XHRcdF9jYWNoZVF1ZXVlLmdldChjYWNoZWRLZXkpLnB1c2goaXRlbSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdF9jYWNoZVF1ZXVlLnNldChjYWNoZWRLZXksIFtpdGVtXSk7XG5cdFx0fVxuXHR9XG5cblx0X3J1blByb3hpZWRUYXNrQW5kUXVldWVDYWNoZShmaWxlLCBjYWNoZWRLZXksIHNpZ25hbHMgPSBuZXcgRXZlbnRFbWl0dGVyKCkpIHtcblxuXHRcdGNvbnN0IG9yaWdpbmFsQmFzZSA9IGZpbGUuYmFzZTtcblx0XHRjb25zdCBvcmlnaW5hbFBhdGggPSBmaWxlLnBhdGg7XG5cblx0XHRzaWduYWxzLm9uKCdjYWNoZScsIChmaWxlKSA9PiB7XG5cdFx0XHR0aGlzLl9xdWV1ZUNhY2hlKGZpbGUsIGNhY2hlZEtleSwgb3JpZ2luYWxCYXNlLCBvcmlnaW5hbFBhdGgpO1xuXHRcdFx0c2lnbmFscy5lbWl0KCdmaWxlJywgZmlsZSk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gdGhpcy5fcnVuUHJveGllZFRhc2soZmlsZSwgY2FjaGVkS2V5LCBzaWduYWxzKTtcblx0fVxuXG5cdF9ydW5Qcm94aWVkVGFzayhmaWxlLCBjYWNoZWRLZXksIHNpZ25hbHMgPSBuZXcgRXZlbnRFbWl0dGVyKCkpIHtcblxuXHRcdGNvbnN0IHsgdGFzayB9ID0gdGhpcztcblx0XHRjb25zdCBoYXNDYWNoZUxpc3RlbmVyID0gQm9vbGVhbihzaWduYWxzLmxpc3RlbmVyQ291bnQoJ2NhY2hlJykpO1xuXG5cdFx0ZnVuY3Rpb24gb25FcnJvcihlcnIpIHtcblx0XHRcdHNpZ25hbHMuZW1pdCgnZXJyb3InLCBlcnIpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG9uRGF0YShkYXR1bSkge1xuXG5cdFx0XHRpZiAoZGF0dW0uX2NhY2hlZEtleSAhPT0gY2FjaGVkS2V5KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0UmVmbGVjdC5kZWxldGVQcm9wZXJ0eShkYXR1bSwgJ19jYWNoZWRLZXknKTtcblxuXHRcdFx0aWYgKGhhc0NhY2hlTGlzdGVuZXIpIHtcblx0XHRcdFx0c2lnbmFscy5lbWl0KCdjYWNoZScsIGRhdHVtKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNpZ25hbHMuZW1pdCgnZmlsZScsIGRhdHVtKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBvblRyYW5zZm9ybWVkKCkge1xuXHRcdFx0c2lnbmFscy5lbWl0KCdkb25lJyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fcmVtb3ZlTGlzdGVuZXJzLnB1c2goKCkgPT4ge1xuXHRcdFx0Ly8gQmUgZ29vZCBjaXRpemVucyBhbmQgcmVtb3ZlIG91ciBsaXN0ZW5lcnNcblx0XHRcdHRhc2sucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgb25FcnJvcik7XG5cdFx0XHR0YXNrLnJlbW92ZUxpc3RlbmVyKCdndWxwLWNhY2hlOnRyYW5zZm9ybWVkJywgb25UcmFuc2Zvcm1lZCk7XG5cdFx0XHR0YXNrLnJlbW92ZUxpc3RlbmVyKCdkYXRhJywgb25EYXRhKTtcblxuXHRcdFx0Ly8gUmVkdWNlIHRoZSBtYXhMaXN0ZW5lcnMgYmFjayBkb3duXG5cdFx0XHR0YXNrLnNldE1heExpc3RlbmVycyh0YXNrLl9tYXhMaXN0ZW5lcnMgLSBldmVudExpc3RlbmVyc0NvdW50KTtcblxuXHRcdFx0Ly8gUmVtb3ZlIGFsbCBsaXN0ZW5lcnMgZnJvbSBgc2lnbmFsc2Bcblx0XHRcdHNpZ25hbHMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG5cdFx0fSk7XG5cblx0XHQvLyBCdW1wIHVwIG1heCBsaXN0ZW5lcnMgdG8gcHJldmVudCBtZW1vcnkgbGVhayB3YXJuaW5nc1xuXHRcdGNvbnN0IGN1cnJNYXhMaXN0ZW5lcnMgPSB0YXNrLl9tYXhMaXN0ZW5lcnMgfHwgMDtcblxuXHRcdHRhc2suc2V0TWF4TGlzdGVuZXJzKGN1cnJNYXhMaXN0ZW5lcnMgKyBldmVudExpc3RlbmVyc0NvdW50KTtcblxuXHRcdHRhc2sub24oJ2RhdGEnLCBvbkRhdGEpO1xuXHRcdHRhc2sub25jZSgnZ3VscC1jYWNoZTp0cmFuc2Zvcm1lZCcsIG9uVHJhbnNmb3JtZWQpO1xuXHRcdHRhc2sub25jZSgnZXJyb3InLCBvbkVycm9yKTtcblxuXHRcdGZpbGUuX2NhY2hlZEtleSA9IGNhY2hlZEtleTtcblxuXHRcdC8vIFJ1biB0aHJvdWdoIHRoZSBvdGhlciB0YXNrIGFuZCBncmFiIG91dHB1dCAob3IgZXJyb3IpXG5cdFx0dGFzay53cml0ZShmaWxlKTtcblxuXHRcdHJldHVybiBzaWduYWxzO1xuXHR9XG5cblx0LyoqXG5cdCAqIENhY2hlIHByb21pc2Ugd3JhcHBlcnMuXG5cdCAqL1xuXG5cdF9hZGRDYWNoZWQoLi4uYXJncykge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHR0aGlzLm9wdGlvbnMuZmlsZUNhY2hlLmFkZENhY2hlZCguLi5hcmdzLCAoZXJyLCByZXMpID0+IHtcblxuXHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0cmVqZWN0KGVycik7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVzb2x2ZShyZXMpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRfZ2V0Q2FjaGVkKC4uLmFyZ3MpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0dGhpcy5vcHRpb25zLmZpbGVDYWNoZS5nZXRDYWNoZWQoLi4uYXJncywgKGVyciwgcmVzKSA9PiB7XG5cblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdHJlamVjdChlcnIpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlc29sdmUocmVzKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0X3JlbW92ZUNhY2hlZCguLi5hcmdzKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRoaXMub3B0aW9ucy5maWxlQ2FjaGUucmVtb3ZlQ2FjaGVkKC4uLmFyZ3MsIChlcnIpID0+IHtcblxuXHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0cmVqZWN0KGVycik7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cbn1cbiIsImltcG9ydCBQbHVnaW5FcnJvciBmcm9tICdwbHVnaW4tZXJyb3InO1xuaW1wb3J0IHRocm91Z2ggZnJvbSAndGhyb3VnaDInO1xuaW1wb3J0IENhY2hlIGZyb20gJ2NhY2hlLXN3YXAnO1xuaW1wb3J0IEZpbGUgZnJvbSAndmlueWwnO1xuaW1wb3J0IHBpY2sgZnJvbSAnb2JqZWN0LnBpY2snO1xuaW1wb3J0IHsgdmVyc2lvbiBhcyBWRVJTSU9OIH0gZnJvbSAnLi4vcGFja2FnZS5qc29uJztcbmltcG9ydCBUYXNrUHJveHkgZnJvbSAnLi90YXNrLXByb3h5JztcblxuY29uc3QgZmlsZUNhY2hlID0gbmV3IENhY2hlKHsgY2FjaGVEaXJOYW1lOiAnZ3VscC1jYWNoZScgfSk7XG5cbmZ1bmN0aW9uIGRlZmF1bHRLZXkoZmlsZSkge1xuXHRyZXR1cm4gYCR7VkVSU0lPTn0ke2ZpbGUuY29udGVudHMudG9TdHJpbmcoJ2Jhc2U2NCcpfWA7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRSZXN0b3JlKHJlc3RvcmVkKSB7XG5cblx0aWYgKHJlc3RvcmVkLmNvbnRlbnRzKSB7XG5cdFx0Ly8gSGFuZGxlIG5vZGUgMC4xMSBidWZmZXIgdG8gSlNPTiBhcyBvYmplY3Qgd2l0aCB7IHR5cGU6ICdidWZmZXInLCBkYXRhOiBbLi4uXSB9XG5cdFx0aWYgKHJlc3RvcmVkICYmIHJlc3RvcmVkLmNvbnRlbnRzICYmIEFycmF5LmlzQXJyYXkocmVzdG9yZWQuY29udGVudHMuZGF0YSkpIHtcblx0XHRcdHJlc3RvcmVkLmNvbnRlbnRzID0gQnVmZmVyLmZyb20ocmVzdG9yZWQuY29udGVudHMuZGF0YSk7XG5cdFx0fSBlbHNlXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkocmVzdG9yZWQuY29udGVudHMpKSB7XG5cdFx0XHRyZXN0b3JlZC5jb250ZW50cyA9IEJ1ZmZlci5mcm9tKHJlc3RvcmVkLmNvbnRlbnRzKTtcblx0XHR9IGVsc2Vcblx0XHRpZiAodHlwZW9mIHJlc3RvcmVkLmNvbnRlbnRzID09PSAnc3RyaW5nJykge1xuXHRcdFx0cmVzdG9yZWQuY29udGVudHMgPSBCdWZmZXIuZnJvbShyZXN0b3JlZC5jb250ZW50cywgJ2Jhc2U2NCcpO1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0IHJlc3RvcmVkRmlsZSA9IG5ldyBGaWxlKHJlc3RvcmVkKTtcblxuXHQvLyBSZXN0b3JlIGFueSBwcm9wZXJ0aWVzIHRoYXQgdGhlIG9yaWdpbmFsIHRhc2sgcHV0IG9uIHRoZSBmaWxlO1xuXHQvLyBidXQgb21pdCB0aGUgbm9ybWFsIHByb3BlcnRpZXMgb2YgdGhlIGZpbGVcblx0T2JqZWN0LmtleXMocmVzdG9yZWQpLmZvckVhY2goKGtleSkgPT4ge1xuXG5cdFx0aWYgKEZpbGUuaXNDdXN0b21Qcm9wKGtleSkpIHtcblx0XHRcdHJlc3RvcmVkRmlsZVtrZXldID0gcmVzdG9yZWRba2V5XTtcblx0XHR9XG5cdH0pO1xuXG5cdHJldHVybiByZXN0b3JlZEZpbGU7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRWYWx1ZShmaWxlKSB7XG5cblx0Y29uc3QgdmlueWxQcm9wcyA9IFsnY3dkJywgJ2Jhc2UnLCAnY29udGVudHMnLCAnc3RhdCcsICdoaXN0b3J5JywgJ3BhdGgnXTtcblx0Y29uc3QgY3VzdG9tUHJvcHMgPSBPYmplY3Qua2V5cyhmaWxlKS5maWx0ZXIoRmlsZS5pc0N1c3RvbVByb3ApO1xuXG5cdC8vIENvbnZlcnQgZnJvbSBhIEZpbGUgb2JqZWN0IChmcm9tIHZpbnlsKSBpbnRvIGEgcGxhaW4gb2JqZWN0XG5cdHJldHVybiBwaWNrKGZpbGUsIFtcblx0XHQuLi52aW55bFByb3BzLFxuXHRcdC4uLmN1c3RvbVByb3BzXG5cdF0pO1xufVxuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcblx0ZmlsZUNhY2hlLFxuXHRuYW1lOiAgICAnZGVmYXVsdCcsXG5cdHN1Y2Nlc3M6IHRydWUsXG5cdGtleTogICAgIGRlZmF1bHRLZXksXG5cdHJlc3RvcmU6IGRlZmF1bHRSZXN0b3JlLFxuXHR2YWx1ZTogICBkZWZhdWx0VmFsdWVcbn07XG5cbnBsdWdpbi5DYWNoZSA9IENhY2hlO1xucGx1Z2luLmZpbGVDYWNoZSA9IGZpbGVDYWNoZTtcbnBsdWdpbi5kZWZhdWx0T3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwbHVnaW4odGFzaywgaW5wdXRPcHRpb25zID0ge30pIHtcblx0Ly8gQ2hlY2sgZm9yIHJlcXVpcmVkIHRhc2sgb3B0aW9uXG5cdGlmICghdGFzaykge1xuXHRcdHRocm93IG5ldyBQbHVnaW5FcnJvcignZ3VscC1jYWNoZScsICdNdXN0IHBhc3MgYSB0YXNrIHRvIGNhY2hlKCknKTtcblx0fVxuXG5cdGNvbnN0IG9wdGlvbnMgPSB7XG5cdFx0Li4ucGx1Z2luLmRlZmF1bHRPcHRpb25zLFxuXHRcdC4uLih0YXNrLmNhY2hlYWJsZSB8fCB7fSksXG5cdFx0Li4uaW5wdXRPcHRpb25zXG5cdH07XG5cdGNvbnN0IHRhc2tQcm94eSA9IG5ldyBUYXNrUHJveHkodGFzaywgb3B0aW9ucyk7XG5cblx0ZnVuY3Rpb24gZWFjaChmaWxlLCBlbmMsIG5leHQpIHtcblxuXHRcdGlmIChmaWxlLmlzTnVsbCgpKSB7XG5cdFx0XHRuZXh0KG51bGwsIGZpbGUpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChmaWxlLmlzU3RyZWFtKCkpIHtcblx0XHRcdG5leHQobmV3IFBsdWdpbkVycm9yKCdndWxwLWNhY2hlJywgJ0Nhbm5vdCBvcGVyYXRlIG9uIHN0cmVhbSBzb3VyY2VzJykpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGNvbnN0IHNpZ25hbHMgPSB0YXNrUHJveHkucHJvY2Vzc0ZpbGUoZmlsZSk7XG5cblx0XHRzaWduYWxzLm9uKCdlcnJvcicsIChlcnIpID0+IHtcblx0XHRcdG5leHQobmV3IFBsdWdpbkVycm9yKCdndWxwLWNhY2hlJywgZXJyKSk7XG5cdFx0fSk7XG5cblx0XHRzaWduYWxzLm9uKCdmaWxlJywgKGZpbGUpID0+IHtcblx0XHRcdHRoaXMucHVzaChmaWxlKTtcblx0XHR9KTtcblxuXHRcdHNpZ25hbHMub24oJ2RvbmUnLCAoKSA9PiB7XG5cdFx0XHRuZXh0KG51bGwpO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gZmx1c2gobmV4dCkge1xuXHRcdHRhc2tQcm94eS5mbHVzaChuZXh0KTtcblx0fVxuXG5cdHJldHVybiB0aHJvdWdoLm9iaihlYWNoLCBmbHVzaCk7XG59XG5cbnBsdWdpbi5jbGVhciA9XG5mdW5jdGlvbiBjbGVhcihpbnB1dE9wdGlvbnMpIHtcblxuXHRjb25zdCBvcHRpb25zID0ge1xuXHRcdC4uLnBsdWdpbi5kZWZhdWx0T3B0aW9ucyxcblx0XHQuLi5pbnB1dE9wdGlvbnNcblx0fTtcblx0Y29uc3QgdGFza1Byb3h5ID0gbmV3IFRhc2tQcm94eShudWxsLCBvcHRpb25zKTtcblxuXHRhc3luYyBmdW5jdGlvbiBlYWNoKGZpbGUsIGVuYywgbmV4dCkge1xuXG5cdFx0aWYgKGZpbGUuaXNOdWxsKCkpIHtcblx0XHRcdG5leHQobnVsbCwgZmlsZSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKGZpbGUuaXNTdHJlYW0oKSkge1xuXHRcdFx0bmV4dChuZXcgUGx1Z2luRXJyb3IoJ2d1bHAtY2FjaGUnLCAnQ2Fubm90IG9wZXJhdGUgb24gc3RyZWFtIHNvdXJjZXMnKSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dHJ5IHtcblx0XHRcdGF3YWl0IHRhc2tQcm94eS5yZW1vdmVDYWNoZWRSZXN1bHQoZmlsZSk7XG5cdFx0XHRuZXh0KG51bGwsIGZpbGUpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0bmV4dChuZXcgUGx1Z2luRXJyb3IoJ2d1bHAtY2FjaGUnLCBlcnIpKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdGhyb3VnaC5vYmooZWFjaCk7XG59O1xuXG5wbHVnaW4uY2xlYXJBbGwgPVxuZnVuY3Rpb24gY2xlYXJBbGwoKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0ZmlsZUNhY2hlLmNsZWFyKG51bGwsIChlcnIpID0+IHtcblxuXHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRyZWplY3QobmV3IFBsdWdpbkVycm9yKFxuXHRcdFx0XHRcdCdndWxwLWNhY2hlJyxcblx0XHRcdFx0XHRgUHJvYmxlbSBjbGVhcmluZyB0aGUgY2FjaGU6ICR7ZXJyLm1lc3NhZ2V9YFxuXHRcdFx0XHQpKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXNvbHZlKCk7XG5cdFx0fSk7XG5cdH0pO1xufTtcbiJdLCJuYW1lcyI6WyJ3aGl0ZXNwYWNlcyIsImV2ZW50TGlzdGVuZXJzQ291bnQiLCJtYWtlSGFzaCIsImtleSIsImNyeXB0byIsImNyZWF0ZUhhc2giLCJ1cGRhdGUiLCJkaWdlc3QiLCJUYXNrUHJveHkiLCJjb25zdHJ1Y3RvciIsInRhc2siLCJpbnB1dE9wdGlvbnMiLCJvcHRpb25zIiwiX2NhY2hlUXVldWUiLCJNYXAiLCJfcmVtb3ZlTGlzdGVuZXJzIiwicGF0Y2hUYXNrIiwiX3RyYW5zZm9ybSIsImNodW5rIiwiZW5jb2RpbmciLCJuZXh0IiwiUmVmbGVjdCIsImFwcGx5IiwiYXJncyIsImVtaXQiLCJwcm9jZXNzRmlsZSIsImlucHV0RmlsZSIsInNpZ25hbHMiLCJFdmVudEVtaXR0ZXIiLCJwcm9jZXNzIiwibmV4dFRpY2siLCJfcHJvY2Vzc0ZpbGVBc3luYyIsImNhY2hlZCIsIl9jaGVja0ZvckNhY2hlZFZhbHVlIiwiY2FjaGVkVmFsdWUiLCJ2YWx1ZSIsImNhY2hlZFZhbHVlSXNFbXB0eSIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsImNhY2hlZFZhbHVlc1dpdGhOb3JtYWxQYXRocyIsImZpbHRlciIsImZpbGUiLCJndWxwQ2FjaGUkZmlsZVBhdGhDaGFuZ2VkSW5zaWRlVGFzayIsImd1bHBDYWNoZSRvcmlnaW5hbFBhdGgiLCJwYXRoIiwiZ3VscENhY2hlJGZpbGVCYXNlQ2hhbmdlZEluc2lkZVRhc2siLCJndWxwQ2FjaGUkb3JpZ2luYWxCYXNlIiwiYmFzZSIsImZvckVhY2giLCJjYWNoZWRGaWxlIiwiRmlsZSIsInBpY2siLCJjb250ZW50cyIsImRlbGV0ZVByb3BlcnR5IiwicHVzaCIsInJlbW92ZUFsbExpc3RlbmVycyIsIl9ydW5Qcm94aWVkVGFza0FuZFF1ZXVlQ2FjaGUiLCJmbHVzaCIsIl9mbHVzaCIsImVyciIsInJlbW92ZSIsIlByb21pc2UiLCJhbGwiLCJmcm9tIiwibWFwIiwiY2FjaGVkS2V5IiwiZmlsZXMiLCJfc3RvcmVDYWNoZWRSZXN1bHQiLCJyZW1vdmVDYWNoZWRSZXN1bHQiLCJfZ2V0RmlsZUtleSIsIl9yZW1vdmVDYWNoZWQiLCJuYW1lIiwiZ2V0S2V5IiwiY2FjaGVOYW1lIiwicmVzdG9yZSIsIl9nZXRDYWNoZWQiLCJwYXJzZWRDb250ZW50cyIsIkpTT04iLCJwYXJzZSIsInBhcnNlZEZpbGUiLCJyZXN0b3JlZEZpbGUiLCJfZ2V0VmFsdWVGcm9tUmVzdWx0IiwicmVzdWx0IiwiZ2V0VmFsdWUiLCJtZXRhIiwic3VjY2VzcyIsIk9iamVjdCIsImFzc2lnbiIsIkJvb2xlYW4iLCJfYWRkQ2FjaGVkIiwic3RyaW5naWZ5IiwiX3F1ZXVlQ2FjaGUiLCJvcmlnaW5hbEJhc2UiLCJvcmlnaW5hbFBhdGgiLCJpdGVtIiwiY2xvbmUiLCJoYXMiLCJnZXQiLCJzZXQiLCJvbiIsIl9ydW5Qcm94aWVkVGFzayIsImhhc0NhY2hlTGlzdGVuZXIiLCJsaXN0ZW5lckNvdW50Iiwib25FcnJvciIsIm9uRGF0YSIsImRhdHVtIiwiX2NhY2hlZEtleSIsIm9uVHJhbnNmb3JtZWQiLCJyZW1vdmVMaXN0ZW5lciIsInNldE1heExpc3RlbmVycyIsIl9tYXhMaXN0ZW5lcnMiLCJjdXJyTWF4TGlzdGVuZXJzIiwib25jZSIsIndyaXRlIiwicmVzb2x2ZSIsInJlamVjdCIsImZpbGVDYWNoZSIsImFkZENhY2hlZCIsInJlcyIsImdldENhY2hlZCIsInJlbW92ZUNhY2hlZCIsIkNhY2hlIiwiY2FjaGVEaXJOYW1lIiwiZGVmYXVsdEtleSIsIlZFUlNJT04iLCJ0b1N0cmluZyIsImRlZmF1bHRSZXN0b3JlIiwicmVzdG9yZWQiLCJkYXRhIiwiQnVmZmVyIiwia2V5cyIsImlzQ3VzdG9tUHJvcCIsImRlZmF1bHRWYWx1ZSIsInZpbnlsUHJvcHMiLCJjdXN0b21Qcm9wcyIsImRlZmF1bHRPcHRpb25zIiwicGx1Z2luIiwiUGx1Z2luRXJyb3IiLCJjYWNoZWFibGUiLCJ0YXNrUHJveHkiLCJlYWNoIiwiZW5jIiwiaXNOdWxsIiwiaXNTdHJlYW0iLCJ0aHJvdWdoIiwib2JqIiwiY2xlYXIiLCJjbGVhckFsbCIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLQSxNQUFNQSxXQUFXLEdBQUcsQ0FBcEI7QUFDQSxNQUFNQyxtQkFBbUIsR0FBRyxDQUE1Qjs7QUFFQSxTQUFTQyxRQUFULENBQWtCQyxHQUFsQixFQUF1QjtTQUNmQyxNQUFNLENBQUNDLFVBQVAsQ0FBa0IsS0FBbEIsRUFBeUJDLE1BQXpCLENB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
