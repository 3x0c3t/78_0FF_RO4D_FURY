// gameControls.js

export const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

export function initControls() {
    window.addEventListener('keydown', e => {
        switch (e.key.toLowerCase()) {
            case 'z':
                keys.forward = true;
                break;
            case 's':
                keys.backward = true;
                break;
            case 'q':
                keys.left = true;
                break;
            case 'd':
                keys.right = true;
                break;
        }
    });

    window.addEventListener('keyup', e => {
        switch (e.key.toLowerCase()) {
            case 'z':
                keys.forward = false;
                break;
            case 's':
                keys.backward = false;
                break;
            case 'q':
                keys.left = false;
                break;
            case 'd':
                keys.right = false;
                break;
        }
    });
}
