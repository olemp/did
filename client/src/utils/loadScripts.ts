import * as $script from 'scriptjs';

export function loadScripts(src: string[]) {
    return new Promise((resolve) => {
        $script(src, 'src');
        $script.ready('src', resolve);
    });
}