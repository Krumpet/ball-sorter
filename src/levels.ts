import { GameDescription } from './types';

export const Levels: Record<string, GameDescription> = {
    "0": [['red'], ['darkgreen', 'darkgreen', 'darkgreen'], ['red', 'red', 'red', 'darkgreen']],
    "1": [['red', 'red', 'darkgreen'], ['darkgreen', 'red', 'red'], ['darkgreen', 'darkgreen'], []],
    "2": [['red', 'red', 'darkgreen'], ['darkgreen', 'red', 'red'], ['darkgreen', 'darkgreen', 'yellow', 'yellow'], ['yellow', 'yellow']],
    "107": [ // originally 107
        ['yellow', 'blue', 'orange', 'yellow'],
        ['gray', 'pink', 'yellow', 'yellowgreen'],
        ['mediumspringgreen', 'blue', 'pink', 'blue'],
        ['darkgreen', 'yellow', 'red', 'gray'],
        ['red', 'purple', 'gray', 'yellowgreen'],
        ['mediumspringgreen', 'saddlebrown', 'blue', 'orange'],
        ['purple', 'red', 'lightskyblue', 'darkgreen'],
        ['saddlebrown', 'pink', 'lightskyblue', 'mediumspringgreen'],
        ['saddlebrown', 'darkgreen', 'pink', 'yellowgreen'],
        ['darkgreen', 'lightskyblue', 'purple', 'saddlebrown'],
        ['yellowgreen', 'mediumspringgreen', 'orange', 'gray'],
        ['red', 'purple', 'orange', 'lightskyblue'],
        [],
        [],
    ],
    "247": [ // originally 247
        ['pink', 'orange', 'darkgreen', 'purple'],

        ['gray', 'purple', 'purple', 'blue'],

        ['darkgreen', 'lightskyblue', 'purple', 'pink'],

        ['mediumspringgreen', 'saddlebrown', 'blue', 'darkgreen'],

        ['yellowgreen', 'orange', 'orange', 'blue'],

        ['saddlebrown', 'mediumspringgreen', 'red', 'yellow'],

        ['pink', 'yellow', 'gray', 'gray'],

        ['red', 'yellowgreen', 'red', 'saddlebrown'],

        ['gray', 'pink', 'darkgreen', 'lightskyblue'],

        ['mediumspringgreen', 'saddlebrown', 'lightskyblue', 'mediumspringgreen'],

        ['yellow', 'lightskyblue', 'blue', 'yellowgreen'],

        ['red', 'yellow', 'yellowgreen', 'orange'],
        [],
        [],
    ],
    "843": [ // originally 843
        ['yellowgreen', 'lightskyblue', 'darkgreen', 'gray'],

        ['purple', 'darkgreen', 'pink', 'red'],

        ['blue', 'gray', 'saddlebrown', 'mediumspringgreen'],

        ['saddlebrown', 'lightskyblue', 'yellowgreen', 'lightskyblue'],

        ['orange', 'orange', 'orange', 'gray'],

        ['saddlebrown', 'saddlebrown', 'yellowgreen', 'red'],

        ['mediumspringgreen', 'red', 'yellow', 'blue'],

        ['gray', 'orange', 'yellow', 'red'],

        ['darkgreen', 'mediumspringgreen', 'yellow', 'purple'],

        ['blue', 'yellow', 'lightskyblue', 'purple'],

        ['pink', 'mediumspringgreen', 'blue', 'yellowgreen'],

        ['purple', 'darkgreen', 'pink', 'pink'],
        [],
        [],
    ],
    "1051": [ // originally 1051
        ['orange', 'gray', 'yellow', 'purple'],

        ['mediumspringgreen', 'gray', 'lightskyblue', 'saddlebrown'],

        ['gray', 'red', 'orange', 'lightskyblue'],

        ['saddlebrown', 'blue', 'purple', 'saddlebrown'],

        ['purple', 'yellow', 'lightskyblue', 'orange'],

        ['pink', 'mediumspringgreen', 'darkgreen', 'blue'],

        ['red', 'pink', 'darkgreen', 'lightskyblue'],

        /* 8 */ ['blue', 'yellow', 'orange', 'yellowgreen'],

        ['mediumspringgreen', 'gray', 'saddlebrown', 'yellowgreen'],

        ['yellowgreen', 'mediumspringgreen', 'yellow', 'darkgreen'],

        ['red', 'blue', 'pink', 'red'],

        ['pink', 'darkgreen', 'yellowgreen', 'purple'],
        [],
        [],
    ]
};
