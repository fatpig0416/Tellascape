import React from 'react';
import { Shaders, Node, GLSL } from 'gl-react';

const shaders = Shaders.create({
    Normal: {
        frag: GLSL`
            precision highp float;
            varying vec2 uv;
    
            uniform sampler2D inputImageTexture;
    
            void main () {
    
                vec3 texel = texture2D(inputImageTexture, uv).rgb;
                gl_FragColor = vec4(texel, 1.0);
            }
        `,
    },
});

export const Normal = ({ children: inputImageTexture }) => (
    <Node
        shader={shaders.Normal}
        uniforms={{
            inputImageTexture,
        }}
    />
);
