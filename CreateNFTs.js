// Licence MIT
// Developer IBNZUK 2023

function main() {
  var continueConfirmation = confirm(
    "Gm, Ready to create NFT collection?"
  );

  if (!continueConfirmation) return;

  var supply = prompt("How many NFT art pieces you want to create?", "10");

  var name = prompt("What is the name of your collection?", "");

  var description = prompt("What is the description for your collection?", "");

  alert(
    " Generating " +
    supply +
      " NFTs, please wait...  " 
  );

  var groups = app.activeDocument.layerSets;

  resetLayers(groups);

  function getRWeights(_str) {
    var weight = Number(_str.split("#").pop());
    if(isNaN(weight)){
      weight = 1;
    }
    return weight;
  }

  function cleanName(_str) {
    return _str.split("#").shift();
  }

  for (var h = 1; h < parseInt(supply) + 1; h++) {
    var obj = {};
    obj.name = name + " #" + h;
    obj.description = description;
    obj.image = "To be replaced";
    obj.edition = h;
    obj.attributes = [];
    for (var i = 0; i < groups.length; i++) {
      var totalWeight = 0;
      var layerMap = [];

      for(var j = 0; j < groups[i].layers.length; j++){
        totalWeight += getRWeights(groups[i].layers[j].name);
        layerMap.push({
          index: j,
          name: cleanName(groups[i].layers[j].name),
          weight: getRWeights(groups[i].layers[j].name)
        });
      }

      var ran = Math.floor(Math.random() * totalWeight);

      (function() {
        for(var j = 0; j < groups[i].layers.length; j++){
          ran -= layerMap[j].weight;
          if(ran < 0) {
            groups[i].layers[j].visible = true;
            obj.attributes.push({
              trait_type: groups[i].name, 
              value: layerMap[j].name
            })
            return;
          }
        }
      })();
    }
    saveImage(obj.edition);
    saveMetadata(obj);
    resetLayers(groups);
  }
  alert("Congratulations!! Your NFTs are ready!");
}

function resetLayers(_groups) {
  for (var i = 0; i < _groups.length; i++) {
    _groups[i].visible = true;
    for (var j = 0; j < _groups[i].layers.length; j++) {
      _groups[i].layers[j].visible = false;
    }
  }
}

function saveImage(_edition) {
  var saveFile = new File(toFolder("collection/images") + "/" + _edition + ".png");
  exportOptions = new ExportOptionsSaveForWeb();
  exportOptions.format = SaveDocumentType.PNG;
  exportOptions.PNG24 = false;
  exportOptions.transparency = true;
  exportOptions.interlaced = false;
  app.activeDocument.exportDocument(
    saveFile,
    ExportType.SAVEFORWEB,
    exportOptions
  );
}

function saveMetadata(_data) {
  var file = new File(toFolder("collection/metadata") + "/" + _data.edition + ".json");
  file.open("w");
  file.write(JSON.stringify(_data));
  file.close();
}

function toFolder(_name) {
  var path = app.activeDocument.path;
  var folder = new Folder(path + "/" + _name);
  if (!folder.exists) {
    folder.create();
  }
  return folder;
}



//JSON Polyfill
if (typeof JSON !== 'object') {
  JSON = {};
}

(function () {
  'use strict';

  var rx_one = /^[\],:{}\s]*$/;
  var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
  var rx_three =
    /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
  var rx_escapable =
    /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  var rx_dangerous =
    /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

  function f(n) {
    return n < 10 ? '0' + n : n;
  }

  function this_value() {
    return this.valueOf();
  }

  if (typeof Date.prototype.toJSON !== 'function') {
    Date.prototype.toJSON = function () {
      return isFinite(this.valueOf())
        ? this.getUTCFullYear() +
            '-' +
            f(this.getUTCMonth() + 1) +
            '-' +
            f(this.getUTCDate()) +
            'T' +
            f(this.getUTCHours()) +
            ':' +
            f(this.getUTCMinutes()) +
            ':' +
            f(this.getUTCSeconds()) +
            'Z'
        : null;
    };

    Boolean.prototype.toJSON = this_value;
    Number.prototype.toJSON = this_value;
    String.prototype.toJSON = this_value;
  }

  var gap;
  var indent;
  var meta;
  var rep;

  function quote(string) {
    rx_escapable.lastIndex = 0;
    return rx_escapable.test(string)
      ? '"' +
          string.replace(rx_escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
              ? c
              : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          }) +
          '"'
      : '"' + string + '"';
  }

  function str(key, holder) {
    var i;
    var k;
    var v;
    var length;
    var mind = gap;
    var partial;
    var value = holder[key];
    if (
      value &&
      typeof value === 'object' &&
      typeof value.toJSON === 'function'
    ) {
      value = value.toJSON(key);
    }
    if (typeof rep === 'function') {
      value = rep.call(holder, key, value);
    }

    switch (typeof value) {
      case 'string':
        return quote(value);

      case 'number':
        return isFinite(value) ? String(value) : 'null';

      case 'boolean':
      case 'null':
        return String(value);

      case 'object':
        if (!value) {
          return 'null';
        }

        gap += indent;
        partial = [];

        if (Object.prototype.toString.apply(value) === '[object Array]') {
          length = value.length;
          for (i = 0; i < length; i += 1) {
            partial[i] = str(i, value) || 'null';
          }

          v =
            partial.length === 0
              ? '[]'
              : gap
              ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
              : '[' + partial.join(',') + ']';
          gap = mind;
          return v;
        }

        if (rep && typeof rep === 'object') {
          length = rep.length;
          for (i = 0; i < length; i += 1) {
            if (typeof rep[i] === 'string') {
              k = rep[i];
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + (gap ? ': ' : ':') + v);
              }
            }
          }
        } else {
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + (gap ? ': ' : ':') + v);
              }
            }
          }
        }

        v =
          partial.length === 0
            ? '{}'
            : gap
            ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
            : '{' + partial.join(',') + '}';
        gap = mind;
        return v;
    }
  }

  if (typeof JSON.stringify !== 'function') {
    meta = {
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '"': '\\"',
      '\\': '\\\\',
    };
    JSON.stringify = function (value, replacer, space) {
      var i;
      gap = '';
      indent = '';

      if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
          indent += ' ';
        }
      } else if (typeof space === 'string') {
        indent = space;
      }

      rep = replacer;
      if (
        replacer &&
        typeof replacer !== 'function' &&
        (typeof replacer !== 'object' || typeof replacer.length !== 'number')
      ) {
        throw new Error('JSON.stringify');
      }

      return str('', { '': value });
    };
  }

  if (typeof JSON.parse !== 'function') {
    JSON.parse = function (text, reviver) {
      var j;

      function walk(holder, key) {
        var k;
        var v;
        var value = holder[key];
        if (value && typeof value === 'object') {
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = walk(value, k);
              if (v !== undefined) {
                value[k] = v;
              } else {
                delete value[k];
              }
            }
          }
        }
        return reviver.call(holder, key, value);
      }

      text = String(text);
      rx_dangerous.lastIndex = 0;
      if (rx_dangerous.test(text)) {
        text = text.replace(rx_dangerous, function (a) {
          return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        });
      }

      if (
        rx_one.test(
          text.replace(rx_two, '@').replace(rx_three, ']').replace(rx_four, '')
        )
      ) {
        j = eval('(' + text + ')');

        return typeof reviver === 'function' ? walk({ '': j }, '') : j;
      }

      throw new SyntaxError('JSON.parse');
    };
  }
})();


main();
