import * as $script from 'scriptjs';
export function loadScripts(src) {
    return new Promise(function (resolve) {
        $script(src, 'src');
        $script.ready('src', resolve);
    });
}
//# sourceMappingURL=loadScripts.js.map